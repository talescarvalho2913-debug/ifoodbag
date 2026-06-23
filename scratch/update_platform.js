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

const { getSettings, saveSettings } = require('../lib/settings-store');

async function run() {
    console.log('--- Loading Settings ---');
    const settings = await getSettings();
    console.log('Current UTMify Platform:', settings.utmfy?.platform);

    if (settings.utmfy) {
        settings.utmfy.platform = 'yampi';
        console.log('Updating platform to "yampi"...');
        const res = await saveSettings(settings);
        console.log('Save Result:', res);
        
        const updated = await getSettings();
        console.log('Updated UTMify Platform:', updated.utmfy?.platform);
    } else {
        console.log('No UTMify config found in settings.');
    }
}

run().catch(console.error);
