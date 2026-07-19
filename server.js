const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint untuk menangani request ekstraksi HTML
app.post('/api/extract', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL target harus diisi' });
    }

    try {
        const response = await fetch('https://urltoany.com/api/function/to-html', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36',
                'Referer': `https://urltoany.com/url-to-html?url=${encodeURIComponent(url)}`
            },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            throw new Error(`Target API responded with status: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error('Proxy Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Hanya jalankan server listen jika berada di environment lokal (bukan production Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`[SERVER] Lokal aktif di http://localhost:${PORT}`);
    });
}

module.exports = app;
