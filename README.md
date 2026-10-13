# TikTok LIVE Event Listener

Listener CLI minimal untuk membaca event dari TikTok LIVE. Versi awal ini hanya
menampilkan event di terminal dan membunyikan nada singkat saat event diterima.
Dashboard dan TTS belum termasuk.

## Persyaratan

- Node.js 20 atau lebih baru
- Nama pengguna live publik yang sedang aktif

## Menjalankan

```bash
npm install
npm start -- "@username"
```

Di PowerShell, argumen username yang diawali `@` wajib diberi tanda kutip,
contoh: `npm start -- "@sugar.kevin"`.

Listener menampilkan event penonton masuk, gift, komentar, dan like. Tekan
`Ctrl+C` untuk memutuskan koneksi.

Di Windows, event penonton masuk memutar file lokal `assets/sounds/view.mp3`.
Letakkan file MP3 Anda di lokasi tersebut; file ini sengaja diabaikan Git dan
tidak akan masuk ke GitHub. Gift, komentar, dan like tetap menggunakan nada
singkat. Alert diputar satu per satu agar tidak tumpang tindih. Bunyi join
dibatasi satu kali per lima detik; setiap komentar mendapat satu alert antrean,
sementara gift dan komentar diprioritaskan atas join dan like. Antrean dibatasi
agar tidak tumbuh tanpa batas, dan event yang tidak tertampung dilaporkan.
Audio diputar melalui perangkat default Windows; agar terdengar oleh penonton,
pastikan audio desktop ikut masuk ke TikTok LIVE Studio atau OBS. Suara penonton
ini berupa klip audio, bukan TTS.

Daftar akun publik untuk pengujian disimpan lokal di
`.local/live-test-usernames.txt`. Jika akun uji yang diminta sedang offline,
gunakan akun lain dari daftar tersebut. File ini diabaikan Git dan dapat
ditambah sesuai kebutuhan.

## Batasan

Koneksi menggunakan pustaka tidak resmi
[`tiktok-live-connector`](https://github.com/zerodytrash/TikTok-Live-Connector),
yang membaca event Webcast TikTok. Protokol TikTok dapat berubah, dan listener
mungkin berhenti bekerja jika TikTok mengubahnya. Event like juga tidak selalu
dikirim oleh TikTok. TikTok LIVE tidak menyediakan API publik resmi untuk
membaca event siaran.

Di luar Windows, listener hanya mengirim terminal bell jika terminal mendukung
suara bell. Jalur audio tersebut tidak dijamin terdengar atau ikut masuk ke
siaran.

Pustaka tersebut berlisensi AGPL-3.0-only. Tinjau kewajiban lisensinya sebelum
mendistribusikan aplikasi yang memakai pustaka ini.
