const fs = require('fs');
const path = require('path');
const os = require('os');

const searchPaths = [
    path.join(os.homedir(), 'Desktop'),
    path.join(os.homedir(), 'Downloads'),
    path.join(os.homedir(), 'Pictures')
];

let recentFiles = [];
const now = Date.now();

searchPaths.forEach(searchPath => {
    if (fs.existsSync(searchPath)) {
        const files = fs.readdirSync(searchPath);
        files.forEach(file => {
            const filePath = path.join(searchPath, file);
            try {
                const stats = fs.statSync(filePath);
                if (stats.isFile() && (now - stats.mtimeMs < 600000)) { // 10 mins
                    if (['.png', '.jpg', '.jpeg', '.webp'].includes(path.extname(file).toLowerCase())) {
                        recentFiles.push({ time: stats.mtimeMs, path: filePath });
                    }
                }
            } catch (e) {}
        });
    }
});

recentFiles.sort((a, b) => b.time - a.time);
recentFiles.slice(0, 5).forEach(f => {
    console.log(`${new Date(f.time).toLocaleTimeString()}: ${f.path}`);
});
