const http = require('http');
const https = require('https');
const fs = require('fs');

const downloadFile = (fileLink, filePath) => {

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    let protocol = http;
    if(fileLink.startsWith("https://")) {
      protocol = https;
    }
    let fileInfo = null;
    let lastPrinted = 0;
    let totalDownloaded = 0;
    const headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36", "range": "bytes=0-", "sec-fetch-site": "cross-site", "sec-fetch-mode": "no-cors", "sec-fetch-dest": "video", "referer": fileLink, "accept-encoding": "identity;q=1, *;q=0"};
    const request = protocol.get(fileLink, {headers: headers}, response => {

      if (response.statusCode !== 200 && response.statusCode !== 206) {
        reject(new Error(`Failed to get '${fileLink}' (${response.statusCode})`));
        return;
      }


      fileInfo = {
        mime: response.headers['content-type'],
        size: parseInt(response.headers['content-length'], 10),
      };

      response.on("data", (chunk) => {
        totalDownloaded += chunk.length;
        //if(new Date().getTime() - lastPrinted >= 10 * 1000) {
          // process.stdout.write(".");
          process.stdout.write("Total: "+ __formatBytes(fileInfo.size) +", downloaded: "+ __formatBytes(totalDownloaded) +"\033[0G");
          lastPrinted = new Date().getTime();
        //}
      });

      response.pipe(file);
    });

    // The destination stream is ended by the time it's called
    file.on('finish', () => resolve(fileInfo));

    request.on('error', err => {
      fs.unlink(filePath, () => reject(err));
    });

    file.on('error', err => {
      fs.unlink(filePath, () => reject(err));
    });

    request.end();
  });
}
function __formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports = {
  downloadFile
}
