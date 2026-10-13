import { spawn } from 'node:child_process';

const eventFrequencies = {
  member: 660,
  gift: 880,
  chat: 520,
  like: 740
};

const minimumIntervalMs = 1200;
let lastPlayedAt = 0;
let activePlayer;

function stopActivePlayer() {
  if (!activePlayer) return;

  const player = activePlayer;
  activePlayer = undefined;
  player.kill();
}

export function playAlert(eventType) {
  const frequency = eventFrequencies[eventType];
  if (!frequency) return;

  const now = Date.now();
  if (activePlayer || now - lastPlayedAt < minimumIntervalMs) return;
  lastPlayedAt = now;

  if (process.platform === 'win32') {
    const player = spawn(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-Command', `[Console]::Beep(${frequency}, 180)`],
      { windowsHide: true, stdio: 'ignore' }
    );
    activePlayer = player;

    player.on('error', (error) => {
      if (activePlayer === player) activePlayer = undefined;
      console.error('[ERROR] Gagal memutar suara alert:', error.message);
    });
    player.on('close', (code) => {
      if (activePlayer === player) activePlayer = undefined;
      if (code !== 0) {
        console.error(`[ERROR] Pemutar suara alert berhenti dengan kode ${code}.`);
      }
    });
    return;
  }

  if (process.stdout.isTTY) {
    process.stdout.write('\u0007');
    return;
  }

  console.error('[PERINGATAN] Alert suara membutuhkan Windows; terminal ini bukan TTY.');
}

process.once('exit', stopActivePlayer);

export function stopAlert() {
  stopActivePlayer();
}
