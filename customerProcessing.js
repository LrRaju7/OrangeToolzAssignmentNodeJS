const fs = require('fs');
const path = require('path');
const validator = require('email-validator');
const {insertValidCustomer, insertInvalidCustomer} = require('./controllers/customerControllers');

const validCustomers = [];
const invalidCustomers = [];

const exportValidCustomers = (customerData) => {
    const batchSize = 100000;
    const numBatches = Math.ceil(customerData.length / batchSize);

    const exportsDir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir);
    }

    for (let i = 0; i < numBatches; i++) {
        const start = i * batchSize;
        const end = Math.min(start + batchSize, customerData.length);
        const batchData = customerData.slice(start, end);
        const fileName = path.join(exportsDir,`valid_customer_batch_${i + 1}.txt`);
        const fileData = batchData.map(customer => JSON.stringify(customer)).join('\n');

        fs.writeFile(fileName, fileData, { flag: 'w' }, err => {
            if (err) {
              console.error(`Error writing file ${fileName}: ${err}`);
            } else {
              console.log(`Exported ${batchData.length} customers to ${fileName}`);
            }
        });
    }
}
const exportInvalidCustomers = (customerData) => {

    const exportsDir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir);
    }

    const fileName = path.join(exportsDir,`invalid_customer.txt`);
    const fileData = customerData.map(customer => JSON.stringify(customer)).join('\n');

    fs.writeFile(fileName, fileData, { flag: 'w' }, err => {
        if (err) {
          console.error(`Error writing file ${fileName}: ${err}`);
        } else {
          console.log(`Exported ${customerData.length} customers to ${fileName}`);
        }
    });
}

const processCustomerBatch = async (customerBatch) => {
    let currentValidCustomers = [];
    let currentInvalidCustomers = [];
    for (let i = 0; i < customerBatch.length; i++) {
      const customer = customerBatch[i];
      // Your filtering criteria here
      // Example: Check if the customer has a valid email and phone number
      const phoneRegex = /^1?\s*([2-9][0-8][0-9])\s*([2-9][0-9]{2})\s*([0-9]{4})$/;
        let existingCustomer = validCustomers.find(
            (validCustomer) => validCustomer.email === customer.email || validCustomer.phone === customer.phone
        );
        let currentPhoneIsValid = phoneRegex.test(customer.phone)
        let currentEmailIsValid = validator.validate(customer.email)
      if (currentPhoneIsValid && currentEmailIsValid && !existingCustomer) {
          validCustomers.push(customer);
          currentValidCustomers.push(customer);
        }else{
            invalidCustomers.push(customer);
            currentInvalidCustomers.push(customer);
      }
    }
    // await insertValidCustomer(currentValidCustomers)
    // await insertInvalidCustomer(currentInvalidCustomers)
}

exports.customerProcessingFunction = async (data,start) => {
    // Split the data into smaller batches
    const batchSize = 10000; // Choose a batch size that works for your data
    const customers = data.split('\n').map(line => {
    const [firstName, lastName, city, state, zip, phone, email, ipAddress] = line.split(',');
    return { firstName,
        lastName,
        email,
        phone, };
    });
    const customerBatches = customers.reduce((acc, customer) => {
        if (!acc[acc.length - 1]) acc.push([]);
        if (acc[acc.length - 1].length < batchSize) {
            acc[acc.length - 1].push(customer);
        } else {
            acc.push([customer]);
        }
        return acc;
    }, []);
    for (let i = 0; i < customerBatches.length; i++) {
        await processCustomerBatch(customerBatches[i]);
        console.log(i);
    }
    console.log(customerBatches.length);
    console.log(validCustomers.length);
    console.log(invalidCustomers.length);
    const total_customer = validCustomers.length + invalidCustomers.length;
    console.log(`Total Customers: ${total_customer}`);
    // console.log(`Inserting The Data into MOngoDB Database............`);
    
    // insertValidCustomer(validCustomers)
    // insertInvalidCustomer(invalidCustomers)
    
    console.log(`Exporting Customer Data............`);
    exportValidCustomers(validCustomers);
    exportInvalidCustomers(invalidCustomers);

    //Calculating the total runtime
    const end = performance.now();
    const ms = end-start;
    const secound = ms/1000;
    const minute = secound/60;
    console.log(`Total execution time: ${ms} ms`);
    console.log(`Total execution time: ${secound} Seconds`);
    console.log(`Total execution time: ${minute} Minutes`);
} 