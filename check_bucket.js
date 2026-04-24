const https = require('https');

function checkBucket(bucket) {
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o`;
    https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`Bucket ${bucket}: Status ${res.statusCode}, Response: ${data}`);
        });
    }).on('error', err => {
        console.error(`Bucket ${bucket} error:`, err.message);
    });
}

checkBucket('sale-trc.appspot.com');
checkBucket('sale-trc.firebasestorage.app');
