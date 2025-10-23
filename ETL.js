const fs = require('fs');
const { trimSpaces, replaceInvalid, convertToNumber } = require('./transformUtilities')
const results = [];

// Converts CSV files into JSON / Objects : https://www.npmjs.com/package/csv-parser
    // It takes a readable stream of data
const csv = require('csv-parser') 

// We can use fs's createReadStream method
fs.createReadStream('data/employees.csv')
    .pipe(csv())
    .on('data', data => {

        const newData = {};
        
        for(let key in data) {
            let value = data[key];

            value = trimSpaces(value);
            value = replaceInvalid(value);  
            value = convertToNumber(value);
            
            newData[key] = value;
        }

        console.log('Transformed data:', newData)

    })
    .on('error', (error) => console.log(error))