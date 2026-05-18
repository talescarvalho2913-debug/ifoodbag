const https = require('https');

https.get('https://foodpremios.vercel.app/api/site/config', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            console.log(JSON.stringify(JSON.parse(data), null, 2));
        } catch(e) {
            console.log('Unparseable data:', data);
        }
    });
}).on('error', err => console.log('Error:', err.message));
