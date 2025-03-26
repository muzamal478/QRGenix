const express = require('express');
const qrcode = require('qrcode');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/generate-qr', async (req, res) => {
  try {
    const { url } = req.body;
    const qrCode = await qrcode.toDataURL(url);
    res.json({ qrCode });
  } catch (error) {
    res.status(500).json({ error: 'Error generating QR code' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});