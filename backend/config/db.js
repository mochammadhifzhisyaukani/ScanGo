const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

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

testConnection();

module.exports = supabase;
