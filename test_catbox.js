const https = require('https');
const FormData = require('form-data');
const fs = require('fs');

const form = new FormData();
form.append('reqtype', 'fileupload');
form.append('fileToUpload', Buffer.from('test image data'), { filename: 'test.txt', contentType: 'text/plain' });

const req = https.request('https://catbox.moe/user/api.php', {
    method: 'POST',
    headers: form.getHeaders()
}, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => console.log(res.statusCode, body));
});

form.pipe(req);
