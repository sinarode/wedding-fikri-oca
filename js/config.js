/**
 * ============================================================
 *  CONFIG.JS — Isi Data Undangan
 * ============================================================
 *  Semua data yang paling sering diubah (nama, tanggal, lokasi,
 *  jam acara, rekening, dan tautan sosial media) dikumpulkan di
 *  sini supaya kamu tidak perlu buka-buka file HTML/JS lainnya.
 *
 *  Cara pakai:
 *  1. Ganti nilai di dalam tanda kutip " " sesuai kebutuhan.
 *  2. Jangan hapus tanda koma (,) di akhir baris.
 *  3. Simpan file, lalu buka index.html — perubahan langsung
 *     terlihat (tidak perlu install apa pun).
 *
 *  Lihat README.md untuk penjelasan lebih lengkap tiap bagian.
 * ============================================================
 */

const WEDDING_CONFIG = {

  // ------------------------------------------------------------
  // 1. PASANGAN PENGANTIN
  // ------------------------------------------------------------
  couple: {
    // Nama panggilan yang tampil besar di cover & judul
    nicknameShort: "Fikri & Oca",

    // Nama lengkap mempelai wanita & pria (dipakai efek mengetik)
    brideFullName: "Anisa Rohalianda",
    groomFullName: "M. Fikri Ramadhan",

    // Nama orang tua (teks lengkap, boleh pakai <br> jika perlu)
    brideParents: "Bapak Musriyadi & Ibu Mahlinda",
    groomParents: "Bapak Mulyadi & Ibu Jamilah",
  },

  // ------------------------------------------------------------
  // 2. TANGGAL & WAKTU ACARA
  // ------------------------------------------------------------
  event: {
    // Format WAJIB: "Bulan(Inggris) Tanggal, Tahun Jam:Menit:Detik"
    // Dipakai untuk hitung mundur (countdown). Contoh: "October 24, 2026 00:00:00"
    countdownTargetDate: "October 24, 2026 00:00:00",

    // Tanggal yang tampil di layar (boleh beda format per bahasa)
    displayDateID: "Sabtu, 24 Oktober 2026",
    displayDateEN: "Saturday, October 24th 2026",

    // Jam Akad & Resepsi. KOSONGKAN / biarkan "Waktu menyusul" dan
    // "Time TBA" jika belum ada informasi jam pasti.
    akadTimeID: "08.00 - 09.00 WITA",
    akadTimeEN: "08.00 - 09.00 WITA",
    receptionTimeID: "09.00 WITA - Selesai",
    receptionTimeEN: "09.00 WITA - End",

    // Alamat lokasi acara (teks yang tampil di kartu info & QR code)
    locationTextID: "Kediaman Mempelai Wanita, Lontar Timur RT.03/RW.02, Pulau Laut Barat, Kab. Kotabaru",
    locationTextEN: "Bride's Residence, Lontar Timur RT.03/RW.02, Pulau Laut Barat, Kotabaru Regency",
    locationShort: "Kotabaru, South Kalimantan", // dipakai di kartu QR

    // Link Google Maps:
    // - mapsEmbedUrl -> untuk peta yang tampil tertanam (iframe) di halaman
    // - mapsLinkUrl  -> untuk tombol "OPEN GOOGLE MAPS" yang membuka aplikasi Maps
    // BIARKAN kosong ("") jika belum ada linknya, nanti diisi sendiri.
    mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3980.200204013049!2d116.06473907497514!3d-3.9791779959945512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zM8KwNTgnNDUuMCJTIDExNsKwMDQnMDIuMyJF!5e0!3m2!1sid!2sid!4v1790002934467!5m2!1sid!2sid",
    mapsLinkUrl: "https://maps.app.goo.gl/dwHqyreHjunMKGVx9?g_st=ic",

    // Link "Tambah ke Google Calendar" (otomatis dibuat dari data di atas,
    // biasanya tidak perlu diubah manual)
    googleCalendarUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Fikri+%26+Oca&dates=20261024T000000/20261024T235900&details=Mohon+doa+restu+atas+pernikahan+kami.+Terima+kasih.&location=Lontar+Timur+RT.03%2FRW.02+Pulau+Laut+Barat+Kotabaru&trp=true",

    // Teks singkat tanggal + lokasi yang tampil di kartu QR Code tamu
    qrDateLocationID: "24 . 10 . 2026 | Kotabaru, Kalsel",
    qrDateLocationEN: "October 24th, 2026 | Kotabaru, South Kalimantan",
  },

  // ------------------------------------------------------------
  // 3. AMPLOP DIGITAL / REKENING
  // ------------------------------------------------------------
  // Bisa tambah rekening baru dengan meng-copy salah satu blok { ... },
  // lalu tempel lagi di bawahnya (jangan lupa tanda koma).
  bankAccounts: [
    {
      bankName: "Bank BRI",
      accountNumber: "452201018577536",
      accountHolder: "a.n Anisa Rohalianda",
    },
  ],

  // ------------------------------------------------------------
  // 4. HASHTAG & TAUTAN LAINNYA
  // ------------------------------------------------------------
  social: {
    hashtag: "#FikriAndOcaWedding",
    instagramFilterUrl: "https://www.instagram.com/",
    driveUploadUrl: "https://drive.google.com/drive/",
  },

  // ------------------------------------------------------------
  // 5. SINAR ODE WEDDING ORGANIZER (Tampil di Footer)
  // ------------------------------------------------------------
  // Isi 3 tautan di bawah dengan akun WhatsApp, Instagram, dan TikTok
  // Sinar Ode Organizer yang sebenarnya. Selama masih "#", tombolnya
  // akan tampil tapi belum mengarah ke mana pun.
  organizer: {
    name: "Sinar Ode Organizer",
    // Contoh format WhatsApp: "https://wa.me/62812xxxxxxx"
    whatsappUrl: "https://wa.me/6283159371090",
    // Contoh format Instagram: "https://instagram.com/username"
    instagramUrl: "https://instagram.com/sinarode_weddingorganizer",
    // Contoh format TikTok: "https://tiktok.com/@username"
    tiktokUrl: "https://tiktok.com/@sinarode_weddingo",
    copyrightYear: "2026",
  },

  // ------------------------------------------------------------
  // 6. INTEGRASI TEKNIS (biasanya tidak perlu diubah)
  // ------------------------------------------------------------
  // ⭐ File ini SEKARANG dipakai bersama oleh SEMUA halaman:
  //    index.html (undangan), dashboard.html, generator.html,
  //    bukutamu.html, wish-gallery.html, dan rekap-generator.html.
  //    Cukup edit link di satu tempat ini, semua halaman ikut update.
  integrations: {
    // URL Google Apps Script yang menyimpan & menampilkan ucapan/doa tamu
    // (dipakai di: index.html, rekap-generator.html)
    wishesApiUrl: "https://script.google.com/macros/s/AKfycbwt4B4h1QGZjXSHIjWIiOiwxo9i2BAg9f-HlYxqF_pZconY1J9kvYvrfFN_efpiAts/exec",

    // URL Google Apps Script untuk data tamu/kehadiran (buku tamu, scanner,
    // dashboard statistik, dan generator link undangan)
    // (dipakai di: dashboard.html, generator.html, bukutamu.html, wish-gallery.html)
    guestApiUrl: "https://script.google.com/macros/s/AKfycbwt4B4h1QGZjXSHIjWIiOiwxo9i2BAg9f-HlYxqF_pZconY1J9kvYvrfFN_efpiAts/exec",
  },

  // ------------------------------------------------------------
  // 7. PENGATURAN SITUS & TAMPILAN (dipakai di semua halaman)
  // ------------------------------------------------------------
  site: {
    // Alamat website undangan yang sudah online (dipakai generator.html
    // untuk membuat link undangan per tamu, contoh: baseUrl + "?to=Nama")
    baseUrl: "https://wedding-fikri-oca.vercel.app/",

    // Foto yang dipakai sebagai "background luar" di halaman-halaman admin
    // (dashboard, generator, buku tamu, wish gallery, rekap) supaya saat
    // dibuka di layar lebar/laptop tidak terlihat kosong/polos di sisi kiri
    // & kanan. Ganti nama filenya kalau mau pakai foto lain dari folder assets/.
    outerBackgroundImage: "assets/IMG_6099.JPG.jpeg",
  },
};

/**
 * ============================================================
 *  BACKGROUND LUAR OTOMATIS (untuk halaman admin)
 * ============================================================
 *  Bagian di bawah ini otomatis menambahkan "background luar" berupa
 *  foto (dari site.outerBackgroundImage di atas) ke halaman-halaman
 *  admin (dashboard, generator, buku tamu, wish gallery, rekap) supaya
 *  saat dibuka di layar laptop/monitor lebar, bagian kiri-kanan halaman
 *  tidak polos putih/kosong — melainkan ada foto & efek "kartu melayang"
 *  seperti di index.html.
 *
 *  Halaman index.html TIDAK terkena efek ini karena sudah punya desain
 *  "background luar" sendiri di css/style.css. Halaman lain otomatis
 *  mendapat efek ini selama memuat file js/config.js ini.
 *
 *  Kamu TIDAK perlu mengedit bagian ini — cukup ubah
 *  `site.outerBackgroundImage` di atas kalau mau ganti foto.
 * ============================================================c
 */
(function applyOuterBackground() {
  // index.html menandai dirinya dengan <html data-page="invitation">
  // supaya efek ini tidak dipasang dobel di halaman undangan utama.
  var currentPage = document.documentElement.getAttribute("data-page");
  if (currentPage === "invitation") return;

  var bgImage = (WEDDING_CONFIG.site && WEDDING_CONFIG.site.outerBackgroundImage) || "";
  if (!bgImage) return;

  var style = document.createElement("style");
  style.setAttribute("data-source", "config.js outer background");
  style.textContent =
    "html.wedding-outer-frame{" +
    "background:linear-gradient(rgba(28,25,23,.55),rgba(28,25,23,.55)),url('" + bgImage + "') no-repeat center center fixed;" +
    "background-size:cover;" +
    "}" +
    "@media (min-width:1121px){" +
    "html.wedding-outer-frame body{" +
    "max-width:1100px;" +
    "margin-left:auto;" +
    "margin-right:auto;" +
    "min-height:100vh;" +
    "box-shadow:0 25px 70px rgba(0,0,0,.45);" +
    "}" +
    "}";
  document.head.appendChild(style);
  document.documentElement.classList.add("wedding-outer-frame");
})();
