// =====================================================
// KONFIGURASI
// =====================================================

// Kosongkan jika script dibuat lewat Extensions > Apps Script di dalam Spreadsheet.
// Isi dengan ID Spreadsheet jika script berdiri sendiri (standalone).
var SPREADSHEET_ID = "";

// Definisi semua sheet: nama, header, dan format kolom waktu
var SHEET_CONFIG = {
  ucapan: {
    name: "wish",
    headers: ["Nama", "Pesan", "Waktu"],
    formats: { 3: "dd MMM yyyy, HH:mm" }
  },
  absen: {
    name: "rekap tamu",
    headers: ["Nama", "Waktu", "Status"],
    formats: { 2: "dd/MM/yyyy HH:mm:ss" }
  },
  list: {
    name: "list undangan",
    headers: ["Nama", "No WA", "Status", "Waktu"],
    formats: { 4: "dd/MM/yy HH:mm" }
  },
  tamu: {
    name: "daftar tamu",
    headers: ["Nama", "Status"],
    formats: {}
  }
};

// =====================================================
// SETUP OTOMATIS
// =====================================================

function getSpreadsheet_() {
  if (SPREADSHEET_ID) return SpreadsheetApp.openById(SPREADSHEET_ID);
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Ambil sheet berdasarkan config. Jika belum ada, dibuat otomatis
 * lengkap dengan header. Jika sudah ada tapi kosong, header diisi.
 */
function getOrCreateSheet_(ss, cfg) {
  var sheet = ss.getSheetByName(cfg.name);

  if (!sheet) {
    // Lock supaya tidak terjadi pembuatan ganda saat ada request bersamaan
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet = ss.getSheetByName(cfg.name) || ss.insertSheet(cfg.name);
    } finally {
      lock.releaseLock();
    }
  }

  // Isi header jika sheet masih kosong
  if (sheet.getLastRow() === 0) {
    var headerRange = sheet.getRange(1, 1, 1, cfg.headers.length);
    headerRange.setValues([cfg.headers]);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#f3f3f3");
    sheet.setFrozenRows(1);

    // Format kolom waktu (mulai baris 2 sampai bawah)
    for (var col in cfg.formats) {
      sheet.getRange(2, Number(col), sheet.getMaxRows() - 1, 1)
           .setNumberFormat(cfg.formats[col]);
    }

    sheet.autoResizeColumns(1, cfg.headers.length);
  }

  return sheet;
}

/**
 * Jalankan manual dari editor (pilih fungsi setupSheets > Run)
 * untuk membuat semua sheet sekaligus. Doget juga memanggil ini
 * secara otomatis, jadi menjalankan manual bersifat opsional.
 */
function setupSheets() {
  var ss = getSpreadsheet_();
  var hasil = {};
  for (var key in SHEET_CONFIG) {
    hasil[key] = getOrCreateSheet_(ss, SHEET_CONFIG[key]);
  }
  Logger.log("Semua sheet siap: " + Object.keys(SHEET_CONFIG).map(function (k) {
    return SHEET_CONFIG[k].name;
  }).join(", "));
  return hasil;
}

// =====================================================
// ENDPOINT
// =====================================================

function doGet(e) {
  var ss = getSpreadsheet_();

  // Sheet dibuat otomatis jika belum ada
  var sheetUcapan = getOrCreateSheet_(ss, SHEET_CONFIG.ucapan);
  var sheetAbsen  = getOrCreateSheet_(ss, SHEET_CONFIG.absen);
  var sheetList   = getOrCreateSheet_(ss, SHEET_CONFIG.list);
  var sheetTamu   = getOrCreateSheet_(ss, SHEET_CONFIG.tamu);

  var type = (e && e.parameter && e.parameter.type) || "";

  // LOGIKA 1: AMBIL DATA REKAP KEHADIRAN (SCANNER)
  if (type == "get_absen") {
    var data = sheetAbsen.getDataRange().getValues();
    if (data.length > 1) {
      data.shift();
      var result = data.map(function (row) {
        var jamBersih = "";
        if (row[1] instanceof Date) {
          jamBersih = Utilities.formatDate(row[1], "GMT+8", "HH:mm");
        } else {
          jamBersih = (row[1] || "").toString().substring(0, 5);
        }
        return {
          nama: row[0],
          waktu: jamBersih,
          status: row[2] ? row[2].toString() : "Reguler"
        };
      });
      return buatResponse(result.reverse()); // Data terbaru di atas
    }
    return buatResponse([]);
  }

  // LOGIKA 2: SIMPAN DATA ABSEN (Hasil Scan)
  if (type == "absen") {
    var nama = e.parameter.nama || "Tanpa Nama";
    var statusAbsen = e.parameter.status || "Reguler";
    sheetAbsen.appendRow([nama.trim(), new Date(), statusAbsen.trim()]);
    return buatResponse({ "result": "success", "nama": nama });
  }

  // LOGIKA 3: AMBIL DATA UCAPAN
  if (type == "get_wishes") {
    var dataUcapan = sheetUcapan.getDataRange().getValues();
    if (dataUcapan.length > 1) {
      dataUcapan.shift();
      var wishes = dataUcapan.map(function (row) {
        var waktuRapi = "";
        if (row[2] instanceof Date) {
          waktuRapi = Utilities.formatDate(row[2], "GMT+8", "dd MMM yyyy, HH:mm") + " WITA";
        } else {
          waktuRapi = (row[2] || "").toString() + " WITA";
        }
        return { nama: row[0], pesan: row[1], waktu: waktuRapi };
      });
      return buatResponse(wishes.reverse());
    }
    return buatResponse([]);
  }

  // LOGIKA 4: SIMPAN UCAPAN
  if (type == "add_wish") {
    var namaUcapan = e.parameter.nama || "Anonim";
    var pesanUcapan = e.parameter.pesan || "";
    if (pesanUcapan.trim() !== "") {
      sheetUcapan.appendRow([namaUcapan.trim(), pesanUcapan.trim(), new Date()]);
      return buatResponse({ "result": "success" });
    }
    return buatResponse({ "result": "error", "message": "Pesan kosong" });
  }

  // LOGIKA 5: CATAT PENGIRIMAN UNDANGAN (DENGAN SINKRONISASI DAFTAR TAMU)
  if (type == "add_list") {
    var namaTamu = e.parameter.nama || "Tanpa Nama";
    var nomorWa  = e.parameter.wa || "";
    var statusTamu = e.parameter.status || "Reguler";

    if (nomorWa !== "") {
      // Simpan ke Rekap Generator (list undangan)
      sheetList.appendRow([namaTamu.trim(), "'" + nomorWa.trim(), statusTamu, new Date()]);

      // Sinkronisasi ke Daftar Tamu (untuk Guest Book Manual)
      var existing = sheetTamu.getDataRange().getValues();
      var sudahAda = existing.some(function (row) {
        return row[0].toString().toLowerCase() === namaTamu.trim().toLowerCase();
      });
      if (!sudahAda) {
        sheetTamu.appendRow([namaTamu.trim(), statusTamu]);
      }
      return buatResponse({ "result": "success" });
    }
    return buatResponse({ "result": "error", "message": "Nomor WA kosong" });
  }

  // LOGIKA 6: AMBIL DATA LIST UNDANGAN (REVERSED)
  if (type == "get_list" || type == "get_rekap_generator") {
    var dataList = sheetList.getDataRange().getValues();
    if (dataList.length > 1) {
      dataList.shift();
      var hasilList = dataList.map(function (row) {
        return {
          nama: row[0],
          wa: row[1],
          status: row[2] || "Reguler",
          waktu: row[3] instanceof Date
            ? Utilities.formatDate(row[3], "GMT+8", "dd/MM/yy HH:mm")
            : ""
        };
      });
      return buatResponse(hasilList.reverse());
    }
    return buatResponse([]);
  }

  // LOGIKA 7: AMBIL DAFTAR TAMU UNTUK BUKU TAMU MANUAL
  if (type == "get_tamu_manual") {
    var dataTamu = sheetTamu.getDataRange().getValues();
    if (dataTamu.length > 1) {
      dataTamu.shift();
      var hasilTamu = dataTamu.map(function (row) {
        return {
          nama: row[0] || "",
          status: row[1] || "Reguler"
        };
      });
      return buatResponse(hasilTamu);
    }
    return buatResponse([]);
  }

  return buatResponse({ "result": "error", "message": "Type tidak dikenal" });
}

function buatResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}