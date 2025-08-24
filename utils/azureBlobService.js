// backend/utils/azureBlobService.js
const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1 } = require('uuid');
require('dotenv').config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
if (!connectionString) {
    throw new Error("Azure Storage Connection string not found");
}
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerName = 'verification-documents'; // This container will be created if it doesn't exist

const uploadFileToBlob = async (file) => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists({ access: 'blob' }); // Public access for viewing

    const blobName = `${uuidv1()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(file.buffer, file.size);

    return blockBlobClient.url;
};

module.exports = { uploadFileToBlob };