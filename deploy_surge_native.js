const fs = require('fs');
const https = require('https');
const path = require('path');

const domain = "diii-birthday-surprise-2026.surge.sh";
const token = "846b2deae4eae322cd2e1793a6e6f165";
const tarPath = path.join(__dirname, "fresh_bundle.tgz");

const stats = fs.statSync(tarPath);
const fileSize = stats.size;

console.log(`Publishing ${tarPath} (${fileSize} bytes) to ${domain}...`);

const options = {
    hostname: 'router.surge.sh',
    port: 443,
    path: '/' + domain,
    method: 'PUT',
    headers: {
        'Host': domain,
        'Authorization': 'Basic ' + Buffer.from('token:' + token).toString('base64'),
        'version': '0.23.0',
        'file-count': '9',
        'project-size': fileSize.toString(),
        'timestamp': new Date().toISOString(),
        'Content-Length': fileSize
    }
};

const req = https.request(options, (res) => {
    console.log(`HTTP Response Status: ${res.statusCode}`);
    let fullBody = '';
    res.on('data', (chunk) => {
        fullBody += chunk.toString();
    });
    res.on('end', () => {
        console.log("Surge Raw Response:\n" + fullBody);
        console.log("\nDeployment stream finished!");
    });
});

req.on('error', (e) => {
    console.error(`Upload error: ${e.message}`);
});

fs.createReadStream(tarPath).pipe(req);
