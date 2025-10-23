const fs = require('fs');
const results = [];

// Converts CSV files into JSON / Objects : https://www.npmjs.com/package/csv-parser
    // It takes a readable stream of data
const csv = require('csv-parser') 

// We can use fs's createReadStream method
fs.createReadStream('data/employees.csv')
    .pipe(csv())
    .on('data', data => results.push(data))
    .on('end', () => console.log(results))