const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/authRoutes');

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/admin', authRoutes);

app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server STANDBY di: http://localhost:${PORT}`);
});

// async function testInsertUser() {
//   const { data, error } = await supabase
//     .from("users")
//     .insert([{ email: "dimas@test.com", password: "123" }])
//     .select();

//   if (error) {
//     console.error("ERROR: Gagal menginput data => ", error.message);
//   } else {
//     console.log("Data berhasil masuk!: ", data);
//   }
// }

// testInsertUser();
