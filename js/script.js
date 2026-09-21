
        // 0. Terapkan data dari config.js ke elemen-elemen di halaman.
        //    Fungsi ini membaca WEDDING_CONFIG (lihat js/config.js) dan
        //    mengisi nama pasangan, rekening, tautan maps/kalender/sosial,
        //    hashtag, dan branding Sinar Ode di footer.
        function applyConfigToDOM() {
            const c = WEDDING_CONFIG;

            // Nama pasangan (cover & kartu QR)
            document.querySelectorAll('#cover-couple-name, #qr-couple-name, #thankyou-couple-name')
                .forEach(el => { if (el) el.textContent = c.couple.nicknameShort; });

            // Nama orang tua
            const brideParents = document.getElementById('bride-parents-names');
            if (brideParents) brideParents.textContent = c.couple.brideParents;
            const groomParents = document.getElementById('groom-parents-names');
            if (groomParents) groomParents.textContent = c.couple.groomParents;

            // Peta & kalender
            const mapsEmbed = document.getElementById('maps-embed');
            if (mapsEmbed && c.event.mapsEmbedUrl) mapsEmbed.src = c.event.mapsEmbedUrl;
            const mapsBtn = document.getElementById('lang-btn-map');
            if (mapsBtn && c.event.mapsLinkUrl) mapsBtn.href = c.event.mapsLinkUrl;
            const gcalBtn = document.getElementById('gcal-link');
            if (gcalBtn && c.event.googleCalendarUrl) gcalBtn.href = c.event.googleCalendarUrl;

            // Rekening / amplop digital (dibuat otomatis dari array bankAccounts)
            const bankContainer = document.getElementById('bank-accounts-container');
            if (bankContainer && Array.isArray(c.bankAccounts)) {
                bankContainer.innerHTML = c.bankAccounts.map(acc => `
                    <div class="account-box">
                        <p class="text-[10px] uppercase tracking-widest opacity-80 mb-2 text-white">${acc.bankName}</p>
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-bold text-xs tracking-wider opacity-80 text-white">${acc.accountNumber}</span>
                            <button onclick="copyNumber('${acc.accountNumber}', this)" class="btn-copy uppercase">Copy</button>
                        </div>
                        <p class="text-[11px] font-medium opacity-80 text-white">${acc.accountHolder}</p>
                    </div>
                `).join('');
            }

            // Filter Instagram & folder Google Drive
            const igFilter = document.getElementById('instagram-filter-link');
            if (igFilter && c.social.instagramFilterUrl) igFilter.href = c.social.instagramFilterUrl;
            const driveLink = document.getElementById('drive-upload-link');
            if (driveLink && c.social.driveUploadUrl) driveLink.href = c.social.driveUploadUrl;

            // Hashtag (muncul di section Memories & di footer)
            const memoriesHashtag = document.getElementById('memories-hashtag');
            if (memoriesHashtag) memoriesHashtag.textContent = `Dont' Forget To Tag Us and Use This ${c.social.hashtag}`;
            const footerHashtag = document.getElementById('footer-hashtag');
            if (footerHashtag) footerHashtag.textContent = c.social.hashtag;
            const footerLove = document.getElementById('footer-love-line');
            if (footerLove) footerLove.textContent = `With love ${c.couple.nicknameShort} © ${c.organizer.copyrightYear}`;

            // Branding Sinar Ode Organizer di footer
            const orgName = document.getElementById('organizer-name');
            if (orgName) orgName.textContent = c.organizer.name;
            const waBtn = document.getElementById('organizer-wa');
            if (waBtn) waBtn.href = c.organizer.whatsappUrl;
            const igBtn = document.getElementById('organizer-ig');
            if (igBtn) igBtn.href = c.organizer.instagramUrl;
            const ttBtn = document.getElementById('organizer-tiktok');
            if (ttBtn) ttBtn.href = c.organizer.tiktokUrl;
            const orgCopyright = document.getElementById('organizer-copyright');
            if (orgCopyright) orgCopyright.textContent = `© ${c.organizer.copyrightYear} ${c.organizer.name}. All Rights Reserved.`;
        }
        document.addEventListener('DOMContentLoaded', applyConfigToDOM);

        // 1. Logika Nama Tamu Dinamis
        const urlParams = new URLSearchParams(window.location.search);
        const guestName = urlParams.get('to');
        if (guestName) {
            document.getElementById('guest-name').innerText = decodeURIComponent(guestName);
        }

        // 2. Logika Buka Undangan & Putar Musik
        const audio = document.getElementById("weddingMusic");
        const musicIcon = document.getElementById("musicIcon");
        let isPlaying = false;

        function openInvitation()
         {
            // Paksa play musik
            if (audio) {
                audio.play().then(() => {
                    isPlaying = true;
                    musicIcon.classList.remove('paused');
                }).catch(error => {
                    console.log("Playback failed:", error);
                    // Jika gagal, kita coba play lagi di interaksi berikutnya
                });
            }

            const cover = document.getElementById("wedding-cover");
            if (cover) {
                cover.classList.add('cover-opened');
                setTimeout(() => {
                    cover.style.display = 'none';
                    // Pastikan AOS dan pengetikan nama direset posisinya
                    AOS.refresh();
                    if (typeof startTypewriter === "function") startTypewriter();
                }, 1000);
            }
        }

        function toggleMusic() {
            if (audio) {
                if (isPlaying) {
                    audio.pause();
                    musicIcon.classList.add('paused');
                } else {
                    audio.play().catch(e => console.log(e));
                    musicIcon.classList.remove('paused');
                }
                isPlaying = !isPlaying;
            }
        }

        // Tambahan pemicu agar audio jalan saat ada sentuhan pertama di layar
        const playAudioOnInteraction = () => {
            if (audio && !isPlaying) {
                audio.play().then(() => {
                    isPlaying = true;
                    musicIcon.classList.remove('paused');
                }).catch(e => console.log(e));
            }
            // Hapus listener setelah interaksi pertama berhasil
            window.removeEventListener('click', playAudioOnInteraction);
            window.removeEventListener('touchstart', playAudioOnInteraction);
        };


        window.addEventListener('click', playAudioOnInteraction);
        window.addEventListener('touchstart', playAudioOnInteraction);

     // 1. Pindahkan "translations" ke luar agar bisa dibaca semua fungsi
        const translations = {
            id: {
                "lang-qr-entry": "E-Invitation Entry Pass",
                "lang-qr-brightness": "*Mohon naikkan kecerahan layar HP untuk scan",
                "lang-qr-instruction": "Silakan tunjukkan QR Code ini kepada petugas.",
                "lang-qr-save": "Simpan QR Ke Galeri",
                "lang-qr-close": "Tutup",
                "lang-qr-info": WEDDING_CONFIG.event.qrDateLocationID,
                "lang-wish-line1": "Kirim",
                "lang-wish-line2": "Doa Restu",
                "placeholder-name": "Nama",
                "placeholder-wish": "Tulis ucapan atau doa Anda...",
                "lang-btn-send": "Kirim",
                "lang-gift-title": "Kado Pernikahan",
                "lang-gift-desc": "\"Doa restu Anda adalah kado terbaik, namun jika Anda ingin mengirimkan tanda kasih, kami menyediakan amplop digital untuk memudahkan Anda berbagi berkat dan cinta saat kami memulai perjalanan baru bersama.\"",
                "lang-copy-1": "Salin",
                "lang-copy-2": "Salin",
                "lang-filter-title": "Filter Pernikahan",
                "lang-filter-desc": "\"Abadikan cinta dan bagikan kebahagiaan melalui lensa kami. Kami telah membuat filter khusus untuk hari istimewa kami.\"",
                "lang-btn-filter": "Gunakan Filter Pernikahan",
                "lang-share-title": "Berbagi Momen",
                "lang-share-desc": "\"Bantu kami mengabadikan momen indah ini. Silakan bagikan foto dan video yang Anda ambil selama perayaan kami.\"",
                "lang-btn-share": "Unggah Momen Anda",
                "lang-dresscode-title": "Tema Busana",
                "lang-dresscode-desc": "Kehadiran Anda adalah hadiah terindah bagi kami, namun jika Anda ingin menyesuaikan dengan tema kami, berikut adalah palet warnanya:",
                "lang-btn-qr": "QR Undangan Anda",
                "lang-palette-romantic": "Palet Romantis",
                "lang-palette-earthy": "Palet Warna Bumi",
                "lang-palette-neutral": "Palet Netral",
                "lang-color-silver": "Perak",
                "lang-color-cream": "Krem",
                "lang-color-white": "Putih",
                "lang-dresscode-note": "*Ini hanya referensi, bukan suatu kewajiban.",
                "lang-save-date": "Simpan Tanggalnya",
                "lang-main-date": WEDDING_CONFIG.event.displayDateID,
                "lang-days": "Hari",
                "lang-hours": "Jam",
                "lang-mins": "Menit",
                "lang-secs": "Detik",
                "lang-add-cal": "Tambah ke Kalender",
                "lang-akad-title": "Akad Nikah",
                "lang-reception-title": "Resepsi",
                "lang-reception-time": WEDDING_CONFIG.event.receptionTimeID,
                "lang-akad-time": WEDDING_CONFIG.event.akadTimeID,
                "lang-location-label": `Lokasi Acara:<br>${WEDDING_CONFIG.event.locationTextID}`,
                "lang-btn-map": "BUKA PETUNJUK LOKASI",
                "lang-parents-label-bride": "Putri Kedua dari",
                "lang-parents-label-groom": "Putra Kedua dari",
                "lang-invitation-label": "Undangan Pernikahan",
                "lang-to": "Kepada Bapak/Ibu/Saudara/i:",
                "btn-open": "Buka Undangan",
                "lang-tap-to-enter": "Ketuk untuk masuk",
                "typing-content": "Kami akan mengikat janji suci dan Anda ada dalam |Daftar Tamu!",
                "lang-bride-groom": "Mempelai Wanita & Mempelai Pria",
                "lang-dresscode-title": "Tema Busana",
                "lang-dresscode-note": "*Ini hanya referensi, bukan suatu kewajiban.",
                "lang-gift-title": "Kado Pernikahan",
                "lang-gallery-title": "Galeri Kami",
                "lang-thankyou-title": "Terima Kasih",
                "lang-thankyou-msg": "Atas segala doa, restu, dan kehadiran Bapak/Ibu/Saudara/i, kami mengucapkan terima kasih yang sebesar-besarnya. Semoga kebaikan ini kembali berlipat ganda untuk kita semua."
            },
            en: {
                "lang-qr-entry": "E-Invitation Entry Pass",
                "lang-qr-brightness": "*Please increase your screen brightness for scanning",
                "lang-qr-instruction": "Please show this QR Code to the officer.",
                "lang-qr-save": "Save QR to Gallery",
                "lang-qr-close": "Close",
                "lang-qr-info": WEDDING_CONFIG.event.qrDateLocationEN,
                "lang-wish-line1": "Send",
                "lang-wish-line2": "Your Wish",
                "placeholder-name": "Name",
                "placeholder-wish": "Give your wish...",
                "lang-btn-send": "Send",
                "lang-gift-title": "Wedding Gift",
                "lang-gift-desc": "\"Your present is truly the best gift, but if you'd like to send a little something, we provide a digital envelope to make it easier for you to share your blessings and love with us as we start our new journey together.\"",
                "lang-copy-1": "Copy",
                "lang-copy-2": "Copy",
                "lang-filter-title": "Wedding Filter",
                "lang-filter-desc": "\"Capture the love and share the joy through our lens. We've created a special filter for our special day.\"",
                "lang-btn-filter": "Use Wedding Filter",
                "lang-share-title": "Sharing Memories",
                "lang-share-desc": "\"Help us preserve these beautiful moments. Please share the photos and videos you captured during our celebration.\"",
                "lang-btn-share": "Upload Your Memories",
                "lang-dresscode-title": "Dresscode",
                "lang-dresscode-desc": "Your presence is our greatest gift, but if you'd like to match our theme, here is our color palette:",
                "lang-palette-romantic": "Romantic Palette",
                "lang-palette-earthy": "Earthy Palette",
                "lang-palette-neutral": "Neutral Palette",
                "lang-color-silver": "Silver",
                "lang-color-cream": "Cream",
                "lang-color-white": "White",
                "lang-dresscode-note": "*This is only a recommendation, not an obligation.",
                "lang-gallery-title": "Portrait of Us",
                "lang-save-date": "Save the Date",
                "lang-main-date": WEDDING_CONFIG.event.displayDateEN,
                "lang-days": "Days",
                "lang-hours": "Hours",
                "lang-mins": "Mins",
                "lang-secs": "Secs",
                "lang-add-cal": "Add To Calendar",
                "lang-akad-title": "Wedding Covenant",
                "lang-reception-title": "Wedding Reception",
                "lang-reception-time": WEDDING_CONFIG.event.receptionTimeEN,
                "lang-akad-time": WEDDING_CONFIG.event.akadTimeEN,
                "lang-location-label": `Event Location: ${WEDDING_CONFIG.event.locationTextEN}`,
                "lang-btn-map": "OPEN GOOGLE MAPS",
                "lang-parents-label-bride": "Second Daughter of",
                "lang-parents-label-groom": "Second Son of",
                "lang-invitation-label": "Wedding Invitation",
                "lang-to": "To our dear guests:",
                "btn-open": "Open Invitation",
                "lang-tap-to-enter": "Tap to enter",
                "typing-content": "We're tying the knot and you're on |The Guest List!",
                "lang-btn-qr": "Your Invitation QR",
                "lang-bride-groom": "Bride & Groom",
                "lang-dresscode-title": "Dresscode",
                "lang-dresscode-note": "*This is only a recommendation, not an obligation.",
                "lang-gift-title": "Wedding Gift",
                "lang-thankyou-title": "Thank You",
                "lang-thankyou-msg": "For every prayer, blessing, and your presence with us, we offer our deepest thanks. May all this kindness return to each of you many times over."
            }
        };

    

        // Inisialisasi bahasa dari memori atau default ke ID
        // Ganti baris ini:
        let currentLang = 'en';
        // ✅ Sudah benar — pastikan default-nya 'en', bukan 'id'
        
        // Inisialisasi label tombol sesuai bahasa awal
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('langText').innerText = 'EN';
        });

       function toggleLanguage() {
            const langBtnText = document.getElementById('langText');
            
            if (currentLang === 'id') {
                currentLang = 'en';
                langBtnText.innerText = 'EN'; // ✅ tampilkan bahasa aktif saat ini
            } else {
                currentLang = 'id';
                langBtnText.innerText = 'ID'; // ✅ tampilkan bahasa aktif saat ini
            }
            
            applyLanguageUpdate(currentLang);
        }

        function applyLanguageUpdate(lang) {
            // Jalankan loop terjemahan untuk semua ID yang ada di objek translations
            for (let id in translations[lang]) {
                const el = document.getElementById(id);
                if (el && id !== "typing-content") {
                    el.style.opacity = 0;
                    setTimeout(() => {
                        el.innerHTML = translations[lang][id];
                        el.style.opacity = 1;
                    }, 200);
                }
            }

            // Update Placeholder Form
            const nameInput = document.getElementById('name');
            const wishInput = document.getElementById('wish');
            if (nameInput && wishInput) {
                nameInput.placeholder = translations[lang]["placeholder-name"];
                wishInput.placeholder = translations[lang]["placeholder-wish"];
            }

            // Reset dan jalankan ulang efek mesin tik di Halaman 2
            const typewriterEl = document.getElementById("typing-effect");
            if (typewriterEl) {
                charIndex = 0;
                currentOutput = "";
                typewriterEl.innerHTML = "";
                startTypewriter();
            }

            localStorage.setItem('userLang', lang);
        }

        // Tutup menu jika klik di luar area
        window.addEventListener('click', function(e) {
            const container = document.getElementById('langContainer');
            const menu = document.getElementById('langMenu');
            if (container && !container.contains(e.target)) {
                menu.classList.add('hidden');
                menu.classList.remove('flex');
            }
        });

        // 3. QR code
            // 1. Fungsi untuk Menampilkan QR Code
            function showQR() {
            const modal = document.getElementById('qrModal');
            const nameDisplay = document.getElementById('qr-guest-name'); 
            const guestName = document.getElementById('guest-name').innerText; 
            const qrTarget = document.getElementById('qrcode');
            
            const urlParams = new URLSearchParams(window.location.search);
            const guestStatus = urlParams.get('s') || 'Reguler'; 
            const guestID = guestName.replace(/\s/g, '').substring(0,5) + Math.floor(Math.random() * 1000);

            // --- TAMBAHKAN LOGIKA INI ---
            let displayName = guestName;
            if (guestStatus.toUpperCase() === 'VIP') {
                displayName = guestName + " (VIP Guest)";
            }
            // ----------------------------

            // Update nama di dalam modal menggunakan displayName yang sudah dimodifikasi
            if (nameDisplay) nameDisplay.innerText = displayName;

            qrTarget.innerHTML = "";
            const qrContent = `${guestName} | ${guestStatus} | ${guestID}`;

            new QRCode(qrTarget, {
                text: qrContent, 
                width: 200,
                height: 200,
                colorDark : "#000000",
                colorLight : "#FFFFFF",
                correctLevel : QRCode.CorrectLevel.H 
            });

            modal.style.display = 'flex';
        }



            function downloadQR() {
            const area = document.getElementById('capture-area');
            const nama = document.getElementById('qr-guest-name').innerText;
            
            // 1. Sembunyikan elemen yang tidak ingin ikut terunduh
            // Kita cari tombol simpan dan tombol tutup di dalam area capture
            const buttonsToHide = area.querySelectorAll('button');
            buttonsToHide.forEach(btn => btn.style.display = 'none');

            // 2. Proses Capture menggunakan html2canvas
            html2canvas(area, { 
                scale: 3, // Kualitas tinggi
                backgroundColor: "#fdfbf7", // Warna cream kartu
                useCORS: true,
                logging: false,
                letterRendering: 1,
                allowTaint: false
            }).then(canvas => {
                // 3. Kembalikan tampilan tombol setelah capture selesai
                buttonsToHide.forEach(btn => btn.style.display = 'block');

            try {
                const imageData = canvas.toDataURL("image/png");
                const link = document.createElement('a');
                link.href = imageData;
                link.download = `QR_EntryPass_${nama.replace(/\s+/g, '_')}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error("Gagal mendownload:", error);
                alert("Gagal mendownload otomatis. Silakan screenshot layar atau tekan lama pada gambar QR.");
            }
        });
    }
                

        // 2. Fungsi untuk Menutup QR Code (Ini yang membuat tombol tutup berfungsi)
        function closeQR() {
            const modal = document.getElementById('qrModal');
            modal.style.display = 'none';
        }

        // 3. Logika Tambahan: Klik di luar kotak putih untuk menutup modal
        window.onclick = function(event) {
            const modal = document.getElementById('qrModal');
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }


        // 4. Inisialisasi AOS
        AOS.init({ duration: 800, once: true, disable: false });

        // 5. Typewriter Knot
        let charIndex = 0;
        let currentOutput = "";

        function startTypewriter() {
            const target = document.getElementById("typing-effect");
            
            // PERUBAHAN DI SINI: Mengambil teks berdasarkan bahasa yang sedang aktif (currentLang)
            const textToType = translations[currentLang]["typing-content"]; 

            if (!target || charIndex >= textToType.length) return;

            let char = textToType.charAt(charIndex);
            
            if (char === '|') {
                currentOutput += '<span class="block text-right mt-2">';
            } else {
                currentOutput += char;
            }

            target.innerHTML = currentOutput + (char === '|' ? "" : "</span>");
            charIndex++;

            // Kecepatan mengetik
            setTimeout(startTypewriter, 50); 
        }

        // UPDATE FUNGSI BUKA UNDANGANMU
        function openInvitation() {
            const audio = document.getElementById("weddingMusic");
            audio.play();
            
            const cover = document.getElementById("wedding-cover");
            cover.classList.add('cover-opened');
            
            // LANGSUNG JALANKAN TYPEWRITER BEGITU DIBUKA
            setTimeout(() => {
                cover.style.display = 'none';
                startTypewriter(); // Panggil fungsi di sini
                AOS.refresh();
            }, 1000);
        }
        // 6. Typewriter Halaman 4
        const nameAisyah = WEDDING_CONFIG.couple.brideFullName;
        const nameFadil = WEDDING_CONFIG.couple.groomFullName;
        let aisyahIndex = 0;
        let fadilIndex = 0;
        let page4Started = false;

        // Fungsi mengetik nama Aisyah
            function typeAisyah() {
                const el = document.getElementById("name-aisyah");
                if (el && aisyahIndex < nameAisyah.length) {
                    el.innerHTML += nameAisyah.charAt(aisyahIndex);
                    aisyahIndex++;
                    setTimeout(typeAisyah, 50);
                } else if (el) {
                    // Tampilkan Nama Orang Tua dengan fade in
                    setTimeout(() => {
                        document.getElementById("parents-aisyah-text").classList.replace('opacity-0', 'opacity-100');
                    }, 300);
                }
            }

            // Fungsi mengetik nama Fadil
            function typeFadil() {
                const el = document.getElementById("name-fadil");
                if (el && fadilIndex < nameFadil.length) {
                    el.innerHTML += nameFadil.charAt(fadilIndex);
                    fadilIndex++;
                    setTimeout(typeFadil, 45);
                } else if (el) {
                    // Tampilkan Nama Orang Tua dengan fade in
                    setTimeout(() => {
                        document.getElementById("parents-fadil-text").classList.replace('opacity-0', 'opacity-100');
                    }, 300);
                }
            }

        // Pemicu Otomatis yang lebih akurat
        const observerPage4 = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Jika Halaman 4 terlihat 30% di layar, mulai mengetik
                if (entry.isIntersecting && !page4Started) {
                    page4Started = true;
                    // Beri sedikit delay agar transisi scroll selesai dulu baru ngetik
                    setTimeout(() => {
                        typeAisyah();
                        typeFadil();
                    }, 300);
                }
            });
        }, { threshold: 0.3 }); 

        // Jalankan Observer
        document.addEventListener("DOMContentLoaded", function() {
            const section4 = document.getElementById('halaman-4');
            if (section4) {
                observerPage4.observe(section4);
            }
        });

        // 8. Swiper Initialization
        document.addEventListener('DOMContentLoaded', function() {
            var swiperThumbs = new Swiper(".swiper-thumbs", {
                spaceBetween: 10,
                slidesPerView: 4,
                freeMode: true,
                watchSlidesProgress: true,
            });

            var mainEl = document.querySelector('.swiper-main');

            function markOrientation(img) {
                var slide = img.closest('.swiper-slide');
                if (!slide) return;
                if (img.naturalWidth && img.naturalHeight) {
                    slide.dataset.orientation = (img.naturalWidth >= img.naturalHeight) ? 'landscape' : 'portrait';
                }
            }

            // Pre-mark orientation for every main-swiper image (loaded or not yet loaded)
            mainEl.querySelectorAll('.swiper-slide img').forEach(function (img) {
                if (img.complete && img.naturalWidth) {
                    markOrientation(img);
                } else {
                    img.addEventListener('load', function () { markOrientation(img); });
                }
            });

            function applyOrientation(swiper) {
                var activeSlide = swiper.slides[swiper.activeIndex];
                if (!activeSlide) return;
                var orientation = activeSlide.dataset.orientation;
                if (!orientation) {
                    // Image not loaded/measured yet — try immediately, default to portrait framing meanwhile
                    var img = activeSlide.querySelector('img');
                    if (img && img.naturalWidth) {
                        markOrientation(img);
                        orientation = activeSlide.dataset.orientation;
                    }
                }
                mainEl.classList.remove('is-landscape', 'is-portrait');
                mainEl.classList.add(orientation === 'landscape' ? 'is-landscape' : 'is-portrait');
            }

            var swiperMain = new Swiper(".swiper-main", {
                spaceBetween: 10,
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
                thumbs: {
                    swiper: swiperThumbs,
                },
                loop: true,
                on: {
                    init: function () { applyOrientation(this); },
                    slideChange: function () { applyOrientation(this); },
                    slideChangeTransitionEnd: function () { applyOrientation(this); },
                },
            });
        });

       // 9. Utility Functions
        const scriptURL = WEDDING_CONFIG.integrations.wishesApiUrl;
        function copyNumber(text, btn) {
            navigator.clipboard.writeText(text).then(() => {
                const originalText = btn.innerText;
                btn.innerText = (currentLang === 'id') ? "TERSALIN!" : "COPIED!";
                btn.style.backgroundColor = "#8e735b";
                btn.style.color = "white";
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = "white";
                    btn.style.color = "#8e735b";
                }, 2000);
            });
        }

        // Fungsi Mengambil Doa dari Google Sheets
        let isFetchingWishes = false;

        function loadWishes() {
            if (isFetchingWishes) return; 
            isFetchingWishes = true;

            // PERBAIKAN: Menambahkan parameter type=get_wishes agar data diambil dari database
            fetch(`${scriptURL}?type=get_wishes&v=${new Date().getTime()}`)
            .then(res => res.json())
            .then(data => {
                const wishBox = document.getElementById('wishBox');
                
                if (!data || data.length === 0) return;

                const newWishesHTML = data.map(item => {
                    let waktuTampil = "";
                    if (item.waktu) {
                        try {
                            if (item.waktu.includes('T')) {
                                const d = new Date(item.waktu);
                                if (!isNaN(d)) {
                                    const tgl = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
                                    const jam = String(d.getHours()).padStart(2, '0');
                                    const menit = String(d.getMinutes()).padStart(2, '0');
                                    waktuTampil = `${tgl}, ${jam}:${menit} WITA`;
                                } else { waktuTampil = item.waktu; }
                            } else {
                                waktuTampil = item.waktu.includes("WITA") ? item.waktu : item.waktu + " WITA";
                            }
                        } catch (e) { waktuTampil = item.waktu; }
                    }

                    return `
                        <div class="text-left p-4 bg-stone-50 rounded-xl mb-3 border border-stone-100 shadow-sm">
                            <div class="flex justify-between items-center mb-1">
                                <p class="font-bold text-[10px] text-stone-600">${item.nama}</p>
                                <span class="text-[8px] text-stone-400 font-medium">${waktuTampil}</span>
                            </div>
                            <p class="text-gray-500 italic text-[11px]">"${item.pesan || item.ucapan}"</p>
                        </div>
                    `;
                }).join('');

                // Tampilkan data permanen dari database
                wishBox.innerHTML = newWishesHTML;
            })
            .catch(err => console.error("Gagal memuat doa:", err))
            .finally(() => {
                isFetchingWishes = false;
            });
        }

        // Fungsi Menambah Doa
        function addWish() {
            const n = document.getElementById('name').value;
            const w = document.getElementById('wish').value;
            const wishBox = document.getElementById('wishBox');
            
            if(!n || !w) {
                const msg = (currentLang === 'id') ? "Isi nama dan ucapan." : "Please fill in your name and wish.";
                return alert(msg);
            }

            const btn = document.getElementById('lang-btn-send');
            const originalText = btn.innerText;
            
            btn.innerText = (currentLang === 'id') ? "MENGIRIM..." : "SENDING...";
            btn.disabled = true;

            // 1. Optimistic UI (Muncul sementara)
            const sekarang = new Date();
            const waktuLokal = `${sekarang.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}, ${String(sekarang.getHours()).padStart(2, '0')}:${String(sekarang.getMinutes()).padStart(2, '0')} WITA`;

            const ucapanBaruHTML = `
                <div id="temp-wish" class="text-left p-4 bg-stone-100 rounded-xl mb-3 border border-stone-200 shadow-sm opacity-70 animate-pulse">
                    <div class="flex justify-between items-center mb-1">
                        <p class="font-bold text-[10px] text-stone-600">${n}</p>
                        <span class="text-[8px] text-stone-400 font-medium">${waktuLokal}</span>
                    </div>
                    <p class="text-gray-500 italic text-[11px]">"${w}"</p>
                </div>
            `;
            wishBox.insertAdjacentHTML('afterbegin', ucapanBaruHTML);

            // 2. Reset Form
            document.getElementById('name').value = '';
            document.getElementById('wish').value = '';

            // 3. KIRIM KE GOOGLE SHEETS (PERBAIKAN: Gunakan parameter type=add_wish)
            const finalURL = `${scriptURL}?type=add_wish&nama=${encodeURIComponent(n)}&pesan=${encodeURIComponent(w)}`;

            fetch(finalURL)
            .then(res => res.json())
            .then(result => {
                if(result.result === 'success') {
                    const temp = document.getElementById('temp-wish');
                    if(temp) {
                        temp.classList.remove('opacity-70', 'animate-pulse', 'bg-stone-100');
                        temp.classList.add('bg-stone-50');
                        temp.removeAttribute('id');
                    }
                    // Panggil loadWishes untuk sinkronisasi ulang data
                    loadWishes();
                } else {
                    throw new Error(result.message);
                }
            })
            .catch(err => {
                console.error("Error:", err);
                const temp = document.getElementById('temp-wish');
                if(temp) temp.remove();
                alert("Gagal mengirim ucapan: " + err.message);
            })
            .finally(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            });
        }

        // Jalankan loadWishes saat halaman dibuka
        document.addEventListener('DOMContentLoaded', loadWishes);

        // Refresh otomatis setiap 5 detik agar pesan tetap ada dan terupdate
        setInterval(loadWishes, 5000);

        // 10. Countdown Timer
        const targetDate = new Date(WEDDING_CONFIG.event.countdownTargetDate).getTime();
        setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            if (distance > 0) {
                document.getElementById("days").innerText = Math.floor(distance / 86400000);
                document.getElementById("hours").innerText = Math.floor((distance % 86400000) / 3600000);
                document.getElementById("minutes").innerText = Math.floor((distance % 3600000) / 60000);
                document.getElementById("seconds").innerText = Math.floor((distance % 60000) / 1000);
            }
        }, 1000);

        // Event Listeners
        window.addEventListener('scroll', () => {
            checkScroll();
            checkScrollPage4();
            checkScrollPage5();
        }, { passive: true });

        window.addEventListener('load', () => {
            loadWishes();
            checkScroll();
            checkScrollPage4();
            checkScrollPage5();
        });

        // Tambahkan class lock scroll saat baru dibuka
        document.body.classList.add('loading-active');

        window.addEventListener('load', function() {
            const loader = document.getElementById('loader-wrapper');
            
            // Memberikan sedikit delay 500ms agar transisi tidak terlalu kaget
            setTimeout(() => {
                loader.classList.add('loader-hidden'); // Hilangkan loading
                document.body.classList.remove('loading-active'); // Aktifkan scroll kembali
                
                // Refresh AOS agar animasi muncul tepat waktu setelah loading hilang
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }, 800); 
        });
    