const fs = require('fs');
const { trimSpaces, replaceInvalid, convertToNumber } = require('./util/transformUtilities')

// Paths for incoming and output data
const inputPath = 'data/employees.csv'
const outputPath = 'output/transformed.csv'

// Converts CSV files into JSON / Objects: https://www.npmjs.com/package/csv-parser
// It takes a readable stream of data
const csv = require('csv-parser');

// Converts a POJO to CSV format: https://www.npmjs.com/package/csv-writer
// We need to define the schema that includes the path to where the file is going to be exported as well as
    // the headers that define the column names of the exported CSV file.
const { createObjectCsvWriter } = require('csv-writer');

const exportCSV = createObjectCsvWriter({
    path: outputPath,
    header: [
    {id: 'name', title: 'Name'},
    {id: 'age', title: 'Age'},
    {id: 'city', title: 'City'},
    {id: 'salary', title: 'Salary'}
    ]
})

// ETL operations

// Extracts data and transforms it based on specific rules defined in /util/transformUtilities helper function.
function extractAndTransform () {
    return new Promise((resolve, reject) => {

        const results = []; // We are going to stored transformed data in here and resolve the promise with it
        
        // 1. Extract - Data is extracted and converted to a manageable format
        fs.createReadStream(inputPath) // This method reads the file in streams of data asynchronously
            .pipe(csv()) // Each row stream of our CSV is piped to csv-parser and converted to a POJO
            .on('data', data => {
                
                // 2. Transform - Data streams are transformed and immediately stored in memory
                const newData = {}; // Temporary object that holds each processed row
        
                for(let key in data) {
                    let value = data[key];
        
                    value = trimSpaces(value);
                    value = replaceInvalid(value);  
                    value = convertToNumber(value);
                    
                    newData[key] = value;
                }
                
                results.push(newData)
        
            })
            .on('end', () => resolve(results)) // Resolve with the processed data when theres no more streams to process
            .on('error', (err) => reject(err)) // Reject the promise in case of errors during streams
    })
}

// The final step of ETL, loading and exporting the data
async function runETL() {
    try {
        const processedData = await extractAndTransform();
        // console.log(processedData) // Confirm that data is extracted and transformed as intended

        // 3. Load the data into a new output file
        await exportCSV.writeRecords(processedData);
        console.log('Loading successful')
    } catch(err) {
        console.log('Error loading data: ', err)
    }
}

runETL();