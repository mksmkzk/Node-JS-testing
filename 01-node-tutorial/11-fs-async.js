// FS Module

// Asynchronous
const {readFile, writeFile} = require('fs');

console.log('Start');
readFile('./content/first.txt' , 'utf8', (err, result) => {
    if (err) {
        console.log(err);
        return;
    }
    const first = result;
    readFile('./content/second.txt', 'utf8', (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        const second = result;
        console.log(first);
        console.log(second);
        writeFile('./content/result-async.txt', 'Here is the result : ' + first + ', '+ second, {flag: 'a'}, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('File created');
        } );
    });
} );
console.log('End');


