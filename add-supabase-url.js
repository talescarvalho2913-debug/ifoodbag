const { exec } = require('child_process');

function run(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) resolve({ error: err, stderr });
            else resolve({ stdout });
        });
    });
}

async function installEnv() {
    console.log('Removing old or broken SUPABASE_URL...');
    await run('npx vercel env rm SUPABASE_URL production --yes');

    console.log('Adding clean SUPABASE_URL...');
    const cmd = `node -e "process.stdout.write('https://wtiojbaorcwodddesgyj.supabase.co')" | npx vercel env add SUPABASE_URL production`;
    
    console.log(`Executing: ${cmd}`);
    const result = await run(cmd);
    console.log(result.stdout || result.stderr || result.error);
    
    console.log('Done!');
}

installEnv();
