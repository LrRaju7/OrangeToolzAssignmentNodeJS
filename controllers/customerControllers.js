//IMPORTING FILES
const ValidCustomer = require('../models/validCustomerModel');
const InvalidCustomer = require('../models/invalidCustomerModel');


//INSERT NEW VALID CUSTOMER INFORMATION
exports.insertValidCustomer = async (customerData) => {
  const batchSize = 10000;
  const numBatches = Math.ceil(customerData.length / batchSize);
  const operations = [];
  for (let i = 0; i < numBatches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, customerData.length);
    const batchData = customerData.slice(start, end);
  
    const insertOps = batchData.map(data => ({
      insertOne: { document: data }
    }));
    operations.push(...insertOps);
  }

  await ValidCustomer.bulkWrite(operations, { ordered: false });
  
};

//INSERT NEW INVALID CUSTOMER INFORMATION
exports.insertInvalidCustomer = async (customerData) => {
  const batchSize = 10000;
  const numBatches = Math.ceil(customerData.length / batchSize);
  const operations = [];
  for (let i = 0; i < numBatches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, customerData.length);
    const batchData = customerData.slice(start, end);
  
    const insertOps = batchData.map(data => ({
      insertOne: { document: data }
    }));
    operations.push(...insertOps);
  }

  await InvalidCustomer.bulkWrite(operations, { ordered: false });
};
