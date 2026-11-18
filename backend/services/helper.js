const rentangHariWIB = (customDateStr) => {
  const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
  if (customDateStr) {
    const parts = String(customDateStr).split("-").map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      const [year, month, day] = parts;
      const startWib = new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - WIB_OFFSET_MS);
      const endWib = new Date(startWib.getTime() + 24 * 60 * 60 * 1000 - 1);
      return { startWib: startWib.toISOString(), endWib: endWib.toISOString() };
    }
  }
  const startWib = new Date(Date.now() + WIB_OFFSET_MS);
  startWib.setUTCHours(0, 0, 0, 0);
  const endWib = new Date(startWib.getTime() + 24 * 60 * 60 * 1000 - 1);
  return { startWib: startWib.toISOString(), endWib: endWib.toISOString() };
};

// Konstanta jam absensi (dalam menit dari 00:00 WIB)
const MASUK_START_MIN = 4 * 60 + 30; // 04:30
const MASUK_ON_TIME_END_MIN = 7 * 60; // 07:00
const MASUK_LATE_END_MIN = 10 * 60; // 10:00
const PULANG_MIN = 14 * 60 + 50; // 14:50

const getWibNow = () => new Date(Date.now() + 7 * 60 * 60 * 1000);

const getWibMinutesNow = () => {
  const d = getWibNow();
  return d.getUTCHours() * 60 + d.getUTCMinutes();
};

// Mengembalikan status masuk berdasarkan jam WIB saat ini.
// null jika di luar window masuk (ditolak).
const masukStatus = (minutes = getWibMinutesNow()) => {
  if (minutes < MASUK_START_MIN || minutes > MASUK_LATE_END_MIN) return null;
  if (minutes <= MASUK_ON_TIME_END_MIN) return "Hadir";
  return "terlambat";
};

module.exports = {
  rentangHariWIB,
  MASUK_START_MIN,
  MASUK_ON_TIME_END_MIN,
  MASUK_LATE_END_MIN,
  PULANG_MIN,
  getWibNow,
  getWibMinutesNow,
  masukStatus,
};
