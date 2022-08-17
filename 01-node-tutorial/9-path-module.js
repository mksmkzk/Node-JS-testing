// Path module
const path = require('path');

console.log(path.sep);

const filePath = path.join('/Content', 'sub', 'test.txt');

console.log(filePath);

const base = path.basename(filePath);
console.log(base);

const absolute = path.resolve(__dirname, 'content', 'sub', 'test.txt');
console.log(absolute);