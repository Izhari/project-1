import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const eventFrequencies = {
  gift: 880,
  chat: 520,
  like: 740
};

const moduleDirectory = dirname(fileURLToPath(import.meta.url));
const viewAudioPath = resolve(moduleDirectory, '../assets/sounds/view.mp3');
const windowsPlayerScript = resolve(moduleDirectory, 'play-audio.ps1');
const maxQueuedAlerts = 100;
const viewerJoinIntervalMs = 5000;
const likeIntervalMs = 1200;
const priorities = {
  member: 0,
  like: 1,
  chat: 2,
  gift: 3
};
let activePlayer;

export function createAlertQueue({
  play,
  now = Date.now,
  maxQueue = maxQueuedAlerts,
  onError = (message) => console.error(message)
}) {
  if (typeof play !== 'function') {
    throw new TypeError('createAlertQueue requires a play function');
  }
  if (!Number.isInteger(maxQueue) || maxQueue < 1) {
    throw new RangeError('maxQueue must be a positive integer');
  }

  let queue = [];
  let playing = false;
  let stopped = false;
  let lastViewerJoinAt = -Infinity;
  let lastLikeAt = -Infinity;
  let overflowCount = 0;

  function reportOverflow(eventType) {
    overflowCount++;
    if (overflowCount === 1) {
      onError(`Audio queue is full; the ${eventType} alert was dropped.`);
    }
  }

  function reportAdditionalOverflows() {
    if (overflowCount > 1) {
      onError(`Audio queue overflowed ${overflowCount} times in total.`);
    }
    overflowCount = 0;
  }

  function pump() {
    if (stopped || playing || queue.length === 0) {
      if (!playing && queue.length === 0) reportAdditionalOverflows();
      return;
    }

    const [entry] = queue.splice(0, 1);
    playing = true;
    Promise.resolve()
      .then(() => play(entry.eventType))
      .catch((error) => {
        if (!stopped) {
          onError(`Failed to play ${entry.eventType} alert: ${error.message}`);
        }
      })
      .finally(() => {
        playing = false;
        if (stopped) {
          reportAdditionalOverflows();
          return;
        }
        pump();
      });
  }

  function enqueue(eventType) {
    if (stopped || !Object.hasOwn(priorities, eventType)) return;

    const timestamp = now();
    if (eventType === 'member') {
      if (timestamp - lastViewerJoinAt < viewerJoinIntervalMs) return;
      lastViewerJoinAt = timestamp;
    } else if (eventType === 'like') {
      if (timestamp - lastLikeAt < likeIntervalMs) return;
      lastLikeAt = timestamp;
    }

    if (queue.length >= maxQueue) {
      const lowestQueuedPriority = Math.min(...queue.map((entry) => priorities[entry.eventType]));
      const lowestQueuedIndex = queue.findIndex(
        (entry) => priorities[entry.eventType] === lowestQueuedPriority
      );
      if (priorities[eventType] > lowestQueuedPriority) {
        const [evicted] = queue.splice(lowestQueuedIndex, 1);
        reportOverflow(evicted.eventType);
      } else {
        reportOverflow(eventType);
        return;
      }
    }

    queue.push({ eventType, sequence: timestamp });
    queue.sort((left, right) =>
      priorities[right.eventType] - priorities[left.eventType] || left.sequence - right.sequence
    );
    pump();
  }

  function stop() {
    stopped = true;
    const discardedCount = queue.length;
    queue = [];
    reportAdditionalOverflows();
    return discardedCount;
  }

  return { enqueue, stop };
}

function playWindowsAlert(eventType) {
  let command;
  let args;
  let label;

  if (eventType === 'member') {
    if (!existsSync(viewAudioPath)) {
      return Promise.reject(new Error(`Viewer alert audio not found: ${viewAudioPath}`));
    }
    command = 'powershell.exe';
    args = ['-NoProfile', '-NonInteractive', '-STA', '-File', windowsPlayerScript, viewAudioPath];
    label = 'viewer alert audio';
  } else {
    const frequency = eventFrequencies[eventType];
    command = 'powershell.exe';
    args = ['-NoProfile', '-NonInteractive', '-Command', `[Console]::Beep(${frequency}, 180)`];
    label = `${eventType} alert tone`;
  }

  return new Promise((resolvePlayer, rejectPlayer) => {
    const player = spawn(command, args, { windowsHide: true, stdio: 'ignore' });
    activePlayer = player;
    let settled = false;

    player.once('error', (error) => {
      if (activePlayer === player) activePlayer = undefined;
      settled = true;
      rejectPlayer(new Error(`Could not start ${label}: ${error.message}`));
    });
    player.once('close', (code, signal) => {
      if (activePlayer === player) activePlayer = undefined;
      if (settled) return;
      settled = true;
      if (code === 0) {
        resolvePlayer();
      } else {
        rejectPlayer(new Error(`${label} exited with code ${code ?? signal}`));
      }
    });
  });
}

function playAlertNow(eventType) {
  if (process.platform === 'win32') {
    return playWindowsAlert(eventType);
  }
  if (process.stdout.isTTY) {
    process.stdout.write('\u0007');
    return Promise.resolve();
  }
  return Promise.reject(new Error('Audio alerts require Windows or a TTY terminal bell.'));
}

const alertQueue = createAlertQueue({
  play: playAlertNow,
  onError: (message) => console.error(`[ERROR] ${message}`)
});

function stopActivePlayer() {
  const player = activePlayer;
  activePlayer = undefined;
  player?.kill();
}

process.once('exit', () => {
  alertQueue.stop();
  stopActivePlayer();
});

process.once('SIGTERM', () => {
  alertQueue.stop();
  stopActivePlayer();
});

export function stopAlert() {
  const discardedCount = alertQueue.stop();
  stopActivePlayer();
  if (discardedCount > 0) {
    console.error(`[INFO] Stopped playback; discarded ${discardedCount} queued alert(s).`);
  }
}

export function playAlert(eventType) {
  alertQueue.enqueue(eventType);
}
