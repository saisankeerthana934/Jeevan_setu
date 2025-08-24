const fs = require('fs');
const mongoose = require('mongoose');
const csv = require('csv-parser');
require('dotenv').config();

// Make sure this path points to the new model we just created
const DonorRecord = require('./models/DonorRecord');

const importData = async () => {
  try {
    // Connect to your MongoDB Atlas database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Clear any old data from this collection to avoid duplicates
    await DonorRecord.deleteMany();
    console.log('Old donor records cleared.');

    const records = [];
    // Make sure your CSV file is in a 'data' folder and named correctly
    fs.createReadStream('./data/Hackathon Data.csv')
      .pipe(csv())
      .on('data', (row) => {
        // This part is crucial: it maps your CSV columns to your Mongoose schema fields.
        // We only import records that have valid latitude and longitude.
        if (row.latitude && row.longitude) {
          records.push({
            userId: row.user_id,
            role: row.role,
            bloodGroup: row.blood_group,
            location: {
              type: 'Point',
              // IMPORTANT: MongoDB needs coordinates in [longitude, latitude] order.
              coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)]
            },
            lastDonationDate: row.last_donation_date ? new Date(row.last_donation_date) : null,
            nextEligibleDate: row.next_eligible_date ? new Date(row.next_eligible_date) : null,
            eligibilityStatus: row.eligibility_status,
            donationsTillDate: parseInt(row.donations_till_date) || 0,
            totalCalls: parseInt(row.total_calls) || 0,
            callsToDonationsRatio: parseFloat(row.calls_to_donations_ratio) || 0,
          });
        }
      })
      .on('end', async () => {
        // Insert all the prepared records into the database at once
        await DonorRecord.insertMany(records);
        console.log('✅ Hackathon Data Successfully Imported!');
        process.exit(); // Exit the script after a successful import
      });
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1); // Exit with an error code
  }
};

// Run the import function
importData();
