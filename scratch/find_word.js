const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/script.js');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('--- Search Results for utmfyEndpoint ---');
lines.forEach((line, index) => {
    if (line.includes('utmfyEndpoint')) {
        console.log(`Line ${index + 1}: ${line.trim()}`);
    }
});
