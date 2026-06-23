const fs = require('fs');
const path = require('path');

// Manually load .env variables
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

const { getSettings } = require('../lib/settings-store');
const { processDispatchQueue } = require('../lib/dispatch-queue');

async function test() {
    console.log('--- Loading Settings ---');
    const settings = await getSettings();
    console.log('UTMify Config:', JSON.stringify(settings.utmfy || {}, null, 2));
    
    console.log('\n--- Processing Dispatch Queue ---');
    const result = await processDispatchQueue(50);
    console.log('Queue Process Result:', JSON.stringify(result, null, 2));
}

test().catch(console.error);
