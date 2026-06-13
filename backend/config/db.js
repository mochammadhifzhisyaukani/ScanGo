const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://xbbraeijgltzzbfrugmg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiYnJhZWlqZ2x0enpiZnJ1Z21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDM0MTQsImV4cCI6MjA5NjkxOTQxNH0.hquWjZi9oueaLyuzaoQITdBmwu-1gRrKp5lIZ8yQsqY";

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
