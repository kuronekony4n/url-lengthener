const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const port = 3000;

let urlData = {};
try {
    const jsonData = fs.readFileSync('urls.json', 'utf8');
    urlData = JSON.parse(jsonData);
} catch (err) {
    console.error('Failed to read JSON file:', err);
}

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/lengthen', (req, res) => {
    const { url } = req.body;
    const longUrl = `${generateRandomString(10000)}`;

    urlData[longUrl] = url;
    saveUrlData();

    res.json({ url: url, shortUrl: longUrl });
});

app.get('*', (req, res) => {
    const randomString = req.originalUrl.substring(1);
    const originalUrl = urlData[randomString];

    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.status(404).send('Not Found');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

function generateRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}

function saveUrlData() {
    fs.writeFileSync('urls.json', JSON.stringify(urlData), 'utf8');
}
