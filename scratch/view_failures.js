const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
        const match = line.match(/^\s*([\w.\-_]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            const key = match[1];
            let value = match[2] || '';
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            process.env[key] = value;
        }
    });
}

const fetchFn = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function viewUtmfyJobs() {
    const url = new URL(`${SUPABASE_URL}/rest/v1/event_dispatch_queue`);
    url.searchParams.set('select', 'id,channel,event_name,status,attempts,last_error,created_at,payload');
    url.searchParams.set('channel', 'eq.utmfy');
    url.searchParams.set('order', 'created_at.desc');
    url.searchParams.set('limit', '10');

    const response = await fetchFn(url.toString(), {
        headers: {
            apikey: SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`
        }
    });
    
    if (!response.ok) {
        console.error('Supabase error:', await response.text());
        return;
    }
    
    const rows = await response.json();
    console.log(`--- UTMify Jobs (Total: ${rows.length}) ---`);
    rows.forEach((row, i) => {
        console.log(`\nJob #${i+1}`);
        console.log(`ID: ${row.id}`);
        console.log(`Event Name: ${row.event_name}`);
        console.log(`Status: ${row.status}`);
        console.log(`Attempts: ${row.attempts}`);
        console.log(`Last Error: ${row.last_error}`);
        console.log(`Created At: ${row.created_at}`);
        console.log(`Payload (truncated):`, JSON.stringify(row.payload).slice(0, 300));
    });
}

viewUtmfyJobs().catch(console.error);
