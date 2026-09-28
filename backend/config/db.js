const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseKey) {
//   console.error(
//     "[db.js] SUPABASE_URL atau SUPABASE_ANON_KEY belum diatur. " +
//       "Pastikan variabel lingkungan sudah diisi (file .env lokal / dashboard Vercel).",
//   );
// }

const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder",
);

async function testConnection() {
  try {
    const { error } = await supabase.from('test_table').select('*').limit(1);

    if (error && error.code === 'PGRST205') {
        console.log('SUCCESS: HTTP API Supabase resmi terhubung! (database terbaca)');
        return;
    }

    if (error) {
        throw error;
    }

    console.log("HTTP API Supabase berhasil terhubung!");
  } catch (err) {
    console.error("Gagal koneksi ke Supabase via HTTP!");
    console.log('Detail error: ', err);
  }
}

module.exports = supabase;
