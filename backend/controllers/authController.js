const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// register
const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Semua data (username, email, password) wajib diisi!' });
    }

    try {
        const [existingUser] = await pool.query(
            'SELECT * FROM users where email = ? OR username = ?',
            [email, username]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username atau Email sudah digunakan!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, "user")',
            [username, email, hashedPassword]
        );

        return res.status(201).json({ message: 'Registrasi berhasil! Silahkan login' });
    } catch (error) {
        console.error('Error saat registrasi: ', error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
};

// login
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password wajib diisi!' });
    }

    try {
        const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (results.length === 0) {
            return res.status(401).json({ message: "Email atau password salah!" });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Email atau password salah!" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24*60*60*1000
        })

        return res.status(200).json({
            message: 'Login berhasil!',
            token: token,
            user: {
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Error saat login: ", error);
        return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

module.exports = { register, login };