const fs = require('fs');
const mongoose = require('mongoose');
const csv = require('csv-parser');
require('dotenv').config();

const TransfusionData = require('./models/TransfusionData');

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    await TransfusionData.deleteMany();
    console.log('Old transfusion data cleared.');

    const records = [];
    fs.createReadStream('./data/transfusion_updated.csv')
      .pipe(csv())
      .on('data', (row) => {
        // This part maps your CSV column names to your Mongoose schema fields
        records.push({
          recency: parseInt(row['Recency (months)']),
          frequency: parseInt(row['Frequency (times)']),
          monetary: parseInt(row['Monetary (c.c. blood)']),
          donatedInMarch2007: row['whether he/she donated blood in March 2007'] === '1',
          donorId: row['Donor ID'],
          donorPhoneNumber: row['Phone Number'],
          donorBloodGroup: row['Blood Group'],
          donorLocation: row['Location/City'],
          patientId: row['Patient ID'],
          patientBloodGroup: row['Patient Blood Group'],
          patientLocation: row['Patient Location'],
          doctorId: row['Doctor ID'],
        });
      })
      .on('end', async () => {
        await TransfusionData.insertMany(records);
        console.log('✅ Transfusion Data Successfully Imported!');
        process.exit();
      });
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

importData();
