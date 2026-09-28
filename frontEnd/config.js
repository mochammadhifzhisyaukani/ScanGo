// Konfigurasi base URL API ScanGo
// - Saat diakses dari localhost (Live Server) -> pakai backend lokal :3000
// - Saat diakses dari domain produksi (Vercel) -> relatif (same-origin, tanpa CORS)
(function () {
  const host = window.location.hostname;
  const isLocal =
    host === "localhost" || host === "127.0.0.1" || host === "::1";
  window.API_BASE = isLocal ? "http://localhost:3000" : "";
})();
