import {
  ControlEvent,
  TikTokLiveConnection,
  WebcastEvent
} from 'tiktok-live-connector';
import { playAlert, stopAlert } from './sound.js';

const username = process.argv[2]?.replace(/^@/, '').trim();

if (!username) {
  console.error('Cara pakai: npm start -- @username');
  process.exit(1);
}

const connection = new TikTokLiveConnection(username, { processInitialData: false });

function logEvent(label, details = '') {
  const timestamp = new Date().toLocaleTimeString('id-ID');
  console.log(`[${timestamp}] ${label}${details ? ` — ${details}` : ''}`);
}

function userName(user) {
  return user?.nickname || (user?.uniqueId ? `@${user.uniqueId}` : 'Penonton');
}

logEvent('Menghubungkan', `@${username}`);

connection.on(ControlEvent.CONNECTED, () => {
  logEvent('Terhubung', `live @${username}`);
});

connection.on(ControlEvent.DISCONNECTED, () => {
  logEvent('Koneksi terputus');
});

connection.on(ControlEvent.ERROR, ({ info, exception } = {}) => {
  console.error('[ERROR]', info || exception?.message || 'Kesalahan koneksi');
});

connection.on(WebcastEvent.MEMBER, (data) => {
  logEvent('PENONTON MASUK', userName(data.user));
  playAlert('member');
});

connection.on(WebcastEvent.GIFT, (data) => {
  const gift = data.giftDetails?.giftName || `Gift ID ${data.giftId}`;
  const repeatCount = Math.max(1, data.repeatCount || 1);
  const streak = data.giftType === 1
    ? `, streak ${data.repeatEnd ? 'selesai' : 'berlangsung'}`
    : '';
  logEvent('GIFT', `${userName(data.user)} mengirim ${gift} x${repeatCount}${streak}`);
  playAlert('gift');
});

connection.on(WebcastEvent.CHAT, (data) => {
  const comment = data.content || data.comment;
  if (comment) {
    logEvent('KOMENTAR', `${userName(data.user)}: ${comment}`);
    playAlert('chat');
  }
});

connection.on(WebcastEvent.LIKE, (data) => {
  logEvent('LIKE', `${userName(data.user)}: +${data.likeCount || 1}`);
  playAlert('like');
});

connection.on(WebcastEvent.STREAM_END, () => {
  logEvent('Live berakhir');
});

try {
  await connection.connect();
} catch (error) {
  console.error(`[ERROR] Gagal terhubung ke live @${username}:`, error.message);
  process.exitCode = 1;
}

process.once('SIGINT', async () => {
  logEvent('Menutup listener');
  stopAlert();
  try {
    await connection.disconnect();
  } catch (error) {
    console.error('[ERROR] Gagal menutup koneksi:', error.message);
    process.exitCode = 1;
  }
});
