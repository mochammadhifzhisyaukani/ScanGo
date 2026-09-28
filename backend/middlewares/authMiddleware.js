const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let token = req.cookies.token;

    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }

    if (!token) {
        return res.status(403).json({ message: 'Akses ditolak! Token tidak ditemukan.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        req.user = verified;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token tidak valid atau sudah kadaluarsa' });
    }
}

module.exports = verifyToken;