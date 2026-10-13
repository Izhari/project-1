import assert from 'node:assert/strict';
import test from 'node:test';
import { createAlertQueue } from '../src/sound.js';

function deferred() {
  let resolve;
  const promise = new Promise((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

function createControlledPlayer() {
  const played = [];
  const pending = [];
  const queue = createAlertQueue({
    play(eventType) {
      played.push(eventType);
      const playback = deferred();
      pending.push(playback);
      return playback.promise;
    }
  });
  return { played, pending, queue };
}

async function flushPlayback() {
  await new Promise((resolve) => setImmediate(resolve));
}

test('plays one alert at a time and prioritizes gifts and comments', async () => {
  const { played, pending, queue } = createControlledPlayer();

  queue.enqueue('member');
  await flushPlayback();
  queue.enqueue('chat');
  queue.enqueue('gift');
  queue.enqueue('chat');
  queue.enqueue('like');

  assert.deepEqual(played, ['member']);
  pending[0].resolve();
  await flushPlayback();
  assert.deepEqual(played, ['member', 'gift']);

  pending[1].resolve();
  await flushPlayback();
  assert.deepEqual(played, ['member', 'gift', 'chat']);

  pending[2].resolve();
  await flushPlayback();
  assert.deepEqual(played, ['member', 'gift', 'chat', 'chat']);

  pending[3].resolve();
  await flushPlayback();
  assert.deepEqual(played, ['member', 'gift', 'chat', 'chat', 'like']);
  pending[4].resolve();
  queue.stop();
});

test('coalesces viewer joins within a five-second window', async () => {
  let timestamp = 0;
  const played = [];
  const queue = createAlertQueue({
    now: () => timestamp,
    play: async (eventType) => played.push(eventType)
  });

  queue.enqueue('member');
  await flushPlayback();
  timestamp = 4999;
  queue.enqueue('member');
  await flushPlayback();
  assert.deepEqual(played, ['member']);

  timestamp = 5000;
  queue.enqueue('member');
  await flushPlayback();
  assert.deepEqual(played, ['member', 'member']);
  queue.stop();
});

test('reports dropped alerts when the bounded queue overflows', async () => {
  const errors = [];
  const played = [];
  const pending = [];
  const controlled = createAlertQueue({
    maxQueue: 1,
    onError: (message) => errors.push(message),
    play(eventType) {
      played.push(eventType);
      const playback = deferred();
      pending.push(playback);
      return playback.promise;
    }
  });

  controlled.enqueue('member');
  await flushPlayback();
  controlled.enqueue('chat');
  controlled.enqueue('chat');
  assert.equal(errors.length, 1);
  assert.match(errors[0], /chat alert was dropped/);

  pending[0].resolve();
  await flushPlayback();
  assert.deepEqual(played, ['member', 'chat']);
  pending[1].resolve();
  await flushPlayback();
  assert.equal(errors.length, 1);
  assert.match(errors[0], /chat alert was dropped/);
  controlled.stop();
});

test('evicts a queued low-priority alert for a gift', async () => {
  const errors = [];
  const played = [];
  const pending = [];
  const controlled = createAlertQueue({
    maxQueue: 1,
    onError: (message) => errors.push(message),
    play(eventType) {
      played.push(eventType);
      const playback = deferred();
      pending.push(playback);
      return playback.promise;
    }
  });

  controlled.enqueue('member');
  await flushPlayback();
  controlled.enqueue('like');
  controlled.enqueue('gift');
  pending[0].resolve();
  await flushPlayback();

  assert.deepEqual(played, ['member', 'gift']);
  assert.ok(errors.some((message) => message.includes('like alert was dropped')));
  pending[1].resolve();
  await flushPlayback();
  controlled.stop();
});

test('stopping clears queued alerts and prevents subsequent playback', async () => {
  const { played, pending, queue } = createControlledPlayer();
  queue.enqueue('member');
  await flushPlayback();
  queue.enqueue('gift');

  assert.equal(queue.stop(), 1);
  pending[0].resolve();
  await flushPlayback();
  assert.deepEqual(played, ['member']);
});
