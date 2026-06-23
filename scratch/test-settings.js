const dotenv = require('dotenv');
dotenv.config();

const { getSettings, saveSettings } = require('../lib/settings-store');

async function test() {
    try {
        console.log("Fetching settings from Supabase...");
        const settings = await getSettings();
        console.log("Current Settings loaded successfully:", JSON.stringify(settings, null, 2));

        console.log("\nAttempting to save test settings...");
        const updated = await saveSettings({
            ...settings,
            test_field: "value_" + Date.now()
        });
        console.log("Save Settings returned:", updated);
        console.log("SUCCESS!");
    } catch (err) {
        console.error("CRITICAL EXCEPTION CAUGHT:", err);
    }
}

test();
