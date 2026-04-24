const https = require('https');

function testUpload(bucket) {
    const data = "test";
    const options = {
        hostname: 'firebasestorage.googleapis.com',
        path: `/v0/b/${bucket}/o?name=test.txt`,
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            console.log(`Upload to ${bucket}: ${res.statusCode} ${body}`);
        });
    });

    req.on('error', e => console.error(e));
    req.write(data);
    req.end();
}

testUpload('sale-trc.appspot.com');
testUpload('sale-trc.firebasestorage.app');
