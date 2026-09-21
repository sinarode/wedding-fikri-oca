# Undangan Pernikahan Fikri & Oca — Panduan Edit

Sekarang **semua halaman** (undangan utama + halaman admin) berbagi **satu**
file konfigurasi yang sama: `js/config.js`. Kamu cukup edit di satu tempat,
semua halaman otomatis ikut update.

## 1. Struktur Folder

```
project/
├── index.html              → Halaman undangan utama (untuk tamu)
├── dashboard.html           → Menu utama admin (statistik, navigasi ke tools lain)
├── generator.html           → Generator link undangan per tamu
├── bukutamu.html             → Buku tamu / check-in tamu di lokasi acara
├── wish-gallery.html         → Galeri ucapan & doa dari tamu
├── rekap-generator.html      → Rekap tamu yang sudah dikirimi undangan
├── css/
│   └── style.css             → Tampilan/desain index.html
├── js/
│   ├── config.js              → ⭐ SATU-SATUNYA FILE DATA — dipakai SEMUA halaman
│   └── script.js              → Logika/fungsi index.html (jangan diubah kalau tidak paham JS)
├── assets/
│   ├── IMG_xxxx.JPG.jpeg      → Semua foto yang dipakai di undangan & admin
│   ├── logo.png               → Logo monogram F&O
│   ├── logo-lengkap.png       → Logo lengkap (cadangan)
│   └── logo-sinar-ode.png     → Logo Sinar Ode Organizer
└── README.md                  → File ini
```

> ⚠️ **Struktur folder harus tetap seperti ini.** Semua halaman admin
> memanggil file lewat path relatif seperti `js/config.js` dan
> `assets/logo.png`, jadi jangan pindahkan file `.html` ke folder lain.

## 2. Kenapa Cuma `config.js` yang Dipisah?

Sebelumnya tiap halaman admin (`dashboard.html`, `generator.html`,
`bukutamu.html`, `wish-gallery.html`, `rekap-generator.html`) berdiri
sendiri-sendiri dengan data (link Google Apps Script, dsb) yang
ditulis berulang-ulang dan tercecer di banyak file berbeda.

Sekarang:
- **CSS & JavaScript logika tiap halaman admin TETAP menyatu** di dalam
  masing-masing file `.html` (tidak dipisah ke file terpisah), supaya kamu
  yang cuma mau edit undangan utama tidak perlu bongkar banyak file baru.
- **Hanya `js/config.js` yang dipisah dan dibagi bersama.** Setiap halaman
  admin memanggilnya lewat `<script src="js/config.js"></script>` di
  bagian `<head>`. Data seperti nama pasangan, hashtag, dan terutama
  **link Google Apps Script** kini hanya perlu diedit **satu kali** di
  `js/config.js` — otomatis berlaku di semua halaman yang memakainya.

## 3. Yang Bisa Kamu Edit di `js/config.js`

Buka `js/config.js` pakai text editor (Notepad, VS Code, dll). Semua bagian
diberi komentar Bahasa Indonesia. Bagian yang sudah ada sebelumnya (nama
pasangan, tanggal acara, rekening, sosial media, organizer) **tidak berubah**
cara editnya — lihat bagian di bawah untuk 2 bagian BARU yang ditambahkan:

### a. `integrations` — Link Google Apps Script (⭐ PENTING)
```js
integrations: {
  wishesApiUrl: "...",   // dipakai index.html (ucapan/doa) & rekap-generator.html
  guestApiUrl: "...",    // dipakai dashboard, generator, bukutamu, wish-gallery
},
```
Sebelumnya link ini tertulis berulang di 5 file berbeda dan gampang beda
sendiri kalau lupa update salah satu. Sekarang cukup ganti di sini.

> Catatan: di file aslimu, `wish-gallery.html` ternyata memanggil link yang
> sama dengan `guestApiUrl` (bukan `wishesApiUrl`), jadi itu yang saya
> pertahankan supaya perilakunya tidak berubah. Kalau nanti ucapan yang
> tampil di Wishes Gallery tidak sinkron dengan yang di halaman utama,
> coba ganti baris itu di `wish-gallery.html` supaya memakai
> `WEDDING_CONFIG.integrations.wishesApiUrl`.

### b. `site` — Alamat Situs & Background Luar (⭐ BARU)
```js
site: {
  baseUrl: "https://wedding-fikri-oca.vercel.app/", // dipakai generator.html
  outerBackgroundImage: "assets/IMG_6099.JPG.jpeg",  // background luar halaman admin
},
```
`outerBackgroundImage` inilah yang mengatur foto yang muncul di sisi
kiri-kanan halaman **dashboard, generator, buku tamu, wish gallery, dan
rekap** saat dibuka di layar lebar seperti laptop/monitor — supaya tidak
polos putih kosong seperti sebelumnya. Ganti ke nama file foto lain dari
folder `assets/` kalau mau ganti fotonya.

## 4. Tentang "Background Luar" di Halaman Admin

Sebelumnya, hanya `index.html` yang punya efek "kartu melayang di atas
foto" saat dibuka di layar lebar (laptop). Halaman-halaman admin lain
tampil polos putih penuh tanpa background di sisi kiri-kanan.

Sekarang, `js/config.js` otomatis menambahkan efek serupa ke SEMUA
halaman admin begitu file itu dimuat — kamu tidak perlu menambahkan apa
pun secara manual di HTML/CSS. Efek ini:
- Hanya muncul di layar sangat lebar (≥ 1121px, laptop/monitor besar) supaya
  tidak mengganggu tampilan tabel/kartu yang memang didesain melebar di
  tablet & layar sedang (seperti tabel di Rekap).
- Tidak muncul sama sekali di `index.html`, karena halaman itu sudah
  punya desainnya sendiri di `css/style.css` (ditandai lewat atribut
  `<html data-page="invitation">`).

## 5. Perbaikan Kecil yang Ikut Dilakukan

- **Path logo di `dashboard.html`** diperbaiki dari `logo.png` menjadi
  `assets/logo.png` supaya sesuai struktur folder (sebelumnya logo tidak
  akan muncul karena salah folder).
- **Nama file `rekap generator.html`** (mengandung spasi) diganti jadi
  `rekap-generator.html` (tanpa spasi) supaya lebih aman untuk link/URL,
  dan link di `generator.html` sudah disesuaikan mengikuti nama baru ini.
- **Pesan undangan otomatis** di `generator.html` sebelumnya salah tulis
  nama pasangan ("THE WEDDING OF FADIL & AISYAH" dan "Oca & Fikri" secara
  hardcode). Sekarang nama & hashtag diambil otomatis dari
  `WEDDING_CONFIG.couple.nicknameShort` dan `WEDDING_CONFIG.social.hashtag`
  di `config.js`, jadi kalau nama pasangan pernah perlu diganti, pesan
  undangan ikut otomatis benar.

## 6. Hal Lain yang Perlu Diperhatikan

- **File musik**: kode masih memanggil `assets/musik.mp3` di `index.html`,
  tapi file musiknya tidak ada di dalam zip aslimu. Tambahkan file musik
  kamu sendiri ke folder `assets/` dengan nama `musik.mp3`.
- Beberapa tombol di `dashboard.html` dan `bukutamu.html` mengarah ke file
  yang belum ada di zip ini (`scanner.html`, `rekap.html`,
  `dashboard-kehadiran-tamu.html`). Kalau file-file itu sudah ada di
  sistem kamu yang lain, cukup taruh di folder yang sama dengan file admin
  lainnya.

## 7. Cara Melihat Hasilnya

Karena situs ini pakai file lokal (foto, CSS, JS terpisah), sebaiknya buka
lewat "Live Server" (ekstensi VS Code) atau upload ke hosting (Vercel,
Netlify, dll) — jangan cuma buka file `.html` dengan dobel klik, karena
sebagian browser akan memblokir pemanggilan file lokal (CSS/JS/gambar)
demi keamanan.
