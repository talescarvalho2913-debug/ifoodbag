const { exec } = require('child_process');

function run(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) resolve({ error: err, stderr });
            else resolve({ stdout });
        });
    });
}

async function fixEnvs() {
    console.log('Removing dirty variables...');
    await run('npx vercel env rm SUNIZE_API_KEY production --yes');
    await run('npx vercel env rm SUNIZE_API_SECRET production --yes');
    await run('npx vercel env rm PAYMENTS_ACTIVE_GATEWAY production --yes');
    await run('npx vercel env rm SUNIZE_ENABLED production --yes');
    await run('npx vercel env rm SUPABASE_SERVICE_ROLE_KEY production --yes');
    await run('npx vercel env rm SUPABASE_URL production --yes');

    console.log('Adding clean variables...');
    const commands = [
        `node -e "process.stdout.write('ck_3319cc28b624a80e4fed60cb43b1b38a')" | npx vercel env add SUNIZE_API_KEY production`,
        `node -e "process.stdout.write('cs_3d85ce83529a8d68655f700b8e208770')" | npx vercel env add SUNIZE_API_SECRET production`,
        `node -e "process.stdout.write('sunize')" | npx vercel env add PAYMENTS_ACTIVE_GATEWAY production`,
        `node -e "process.stdout.write('true')" | npx vercel env add SUNIZE_ENABLED production`,
        `node -e "process.stdout.write('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0aW9qYmFvcmN3b2RkZGVzZ3lqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE0MTQ1OCwiZXhwIjoyMDg3NzE3NDU4fQ.Ll1vRMzo-QEIMhDfqBX6ePR8V_H1vQA9ps0nOkJ9Ad8')" | npx vercel env add SUPABASE_SERVICE_ROLE_KEY production`,
        `node -e "process.stdout.write('https://wtiojbaorcwodddesgyj.supabase.co')" | npx vercel env add SUPABASE_URL production`
    ];

    for (const cmd of commands) {
        console.log(`Executing: ${cmd}`);
        const result = await run(cmd);
        console.log(result.stdout || result.stderr || result.error);
    }
    console.log('Done!');
}

fixEnvs();
