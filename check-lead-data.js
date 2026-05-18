
const https = require('https');

const SUPABASE_URL = 'wtiojbaorcwodddesgyj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0aW9qYmFvcmN3b2RkZGVzZ3lqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE0MTQ1OCwiZXhwIjoyMDg3NzE3NDU4fQ.Ll1vRMzo-QEIMhDfqBX6ePR8V_H1vQA9ps0nOkJ9Ad8';

const options = {
    hostname: SUPABASE_URL,
    port: 443,
    path: '/rest/v1/leads?select=session_id,name,fbclid,ttclid,pix_txid,last_event,updated_at&order=updated_at.desc&limit=5',
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
            console.error('Failed to fetch leads:', res.statusCode, data);
            return;
        }
        const leads = JSON.parse(data);
        console.log('--- RECENT LEADS ---');
        leads.forEach(l => {
            console.log(`Session: ${l.session_id} | Name: ${l.name} | FBCLID: ${l.fbclid} | TTCLID: ${l.ttclid} | TXID: ${l.pix_txid} | Event: ${l.last_event} | Date: ${l.updated_at}`);
        });
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.end();
