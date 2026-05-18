
const https = require('https');

const SUPABASE_URL = 'wtiojbaorcwodddesgyj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0aW9qYmFvcmN3b2RkZGVzZ3lqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE0MTQ1OCwiZXhwIjoyMDg3NzE3NDU4fQ.Ll1vRMzo-QEIMhDfqBX6ePR8V_H1vQA9ps0nOkJ9Ad8';

const options = {
    hostname: SUPABASE_URL,
    port: 443,
    path: '/rest/v1/event_dispatch_queue?order=created_at.desc&limit=50',
    method: 'GET',
    headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        if (res.statusCode !== 200) {
            console.error('Failed to fetch queue:', res.statusCode, data);
            return;
        }
        const rows = JSON.parse(data);
        console.log(`--- RECENT DISPATCH QUEUE (${rows.length} records) ---`);
        const channels = new Set();
        rows.forEach(r => {
            channels.add(r.channel);
            console.log(`[${r.created_at}] Channel: ${r.channel} | Event: ${r.event_name} | Result: ${r.result} | Reason: ${r.fail_reason}`);
        });
        console.log('\nChannels found:', Array.from(channels).join(', '));
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.end();
