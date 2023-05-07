const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const fs = require('fs');

const {customerProcessingFunction} = require('./customerProcessing');


const app = express();
dotenv.config()
app.use(express.json())
app.use(cors());
const dbName = 'customer_db';

const PORT = process.env.PORT || 4000

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName
  })

const start = performance.now();


// Read the file containing the customer data
fs.readFile('1M-customers.txt', 'utf8', async (err, data) => {
    if (err) {
        console.error(err);
        return;
    }


    

customerProcessingFunction(data,start);

});

app.get('/',(req,res,next)=>{
    res.send("The server is up and running");
})

app.listen(PORT, ()=>{
    console.log(`The server is running on PORT: ${PORT}`);
})