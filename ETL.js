const fs = require('fs');
const { trimSpaces, replaceInvalid, convertToNumber } = require('./util/transformUtilities')

// Converts CSV files into JSON / Objects: https://www.npmjs.com/package/csv-parser
// It takes a readable stream of data
const csv = require('csv-parser');

// Converts a POJO to CSV format: 
// We need to define the schema before using it.

function extractAndTransform () {
    return new Promise((resolve, reject) => {

        const results = [];
        
        fs.createReadStream('data/employees.csv') // This method reads the file in streams of data
        
            // 1. Extract - Data is extracted and converted to a manageable format
            .pipe(csv()) // Each row stream of our CSV is piped to csv-parser and converted to a POJO
            .on('data', data => {
                
                const newData = {}; // Temporary object that serves as a row
        
                // 2. Transform - Data streams are transformed and immediately stored 
                for(let key in data) {
                    let value = data[key];
        
                    value = trimSpaces(value);
                    value = replaceInvalid(value);  
                    value = convertToNumber(value);
                    
                    newData[key] = value;
                }
                results.push(newData)
        
            })
            .on('end', () => resolve(results)) // Resolve with the processed data
            .on('error', (err) => reject(err)) // Reject the promise in case of errors
    })
}

async function loadData() {
    try {
        const processedData = await extractAndTransform();
        // console.log(processedData) // Confirm that data is extracted and transformed as intended
    } catch(err) {
        console.log('Error loading data: ', err)
    }
}


loadData();