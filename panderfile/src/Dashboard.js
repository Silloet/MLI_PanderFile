import React, { useState, useEffect } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import * as XLSX from 'xlsx';
import './dashboard.css'

const Dashboard = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [clients, setClients] = useState(['Client A', 'Client B', 'Client C']);
  const [selectedClient, setSelectedClient] = useState('');
  const [newClient, setNewClient] = useState('');
  const [updatedFileURL, setUpdatedFileURL] = useState(null);

  useEffect(() => {
    fetchExistingClients();
  }, []);

  
  const fetchExistingClients = async () => {
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      setClients(data.clients);
    } catch (error) {
      console.error('Error reciveing existing clients:', error);
    }
  };

  const handleFile1Upload = (event) => {
    const file = event.target.files[0];
    setFile1(file);
  };

  const handleFile2Upload = (event) => {
    const file = event.target.files[0];
    setFile2(file);
  };

  const handleClientChange = (event) => {
    const client = event.target.value;
    setSelectedClient(client);
  };

  const handleNewClientChange = (event) => {
    const client = event.target.value;
    setNewClient(client);
  };

  const createNewClient = async () => {
    if (!newClient.trim()) {
      return;
    }

    try {

      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client: newClient }),
      });
      const data = await response.json();
      setClients([...clients, data.client]);
      setSelectedClient(data.client);
      setNewClient('');
    } catch (error) {
      console.error('Error creating new client:', error);
    }
  };

  const scrubFiles = async () => {
    if (!selectedClient || !file1 || !file2) {
      return;
    }

    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader1.onload = () => {
      const file1Data = reader1.result;
      reader2.readAsBinaryString(file2);

      reader2.onload = () => {
        const file2Data = reader2.result;
        const updatedData = removeDuplicateRows(file1Data, file2Data);
        const updatedFile = new Blob([updatedData], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        uploadFileToAzureBlobStorage(updatedFile);
      };
    };

    reader1.readAsBinaryString(file1);
  };

  const removeDuplicateRows = (file1Data, file2Data) => {
    const workbook1 = XLSX.read(file1Data, { type: 'binary' });
    const workbook2 = XLSX.read(file2Data, { type: 'binary' });

    // Implement the scrubbing logic here
    // Iterate over the sheets, compare rows, and remove duplicates

    const updatedWorkbookData = XLSX.write(workbook2, { bookType: 'xlsx', type: 'binary' });
    return updatedWorkbookData;
  };

  const uploadFileToAzureBlobStorage = async (file) => {
    const connectionString = 'DefaultEndpointsProtocol=https;AccountName=panderfileupload;AccountKey=gCh4T7bhuCKj9+yJyskUTmmc0F3HSCy+/yURT6+N6/DVxs4Q/hUIMVatGztk5aK9W/dQ2BUXRFYa+AStYhE6hw==;EndpointSuffix=core.windows.net';
    const containerName = 'panderfileupload';

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = `updated_${file2.name.replace('.xlsx', '.xls')}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
      await blockBlobClient.uploadData(file, {
        blobHTTPHeaders: { blobContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      });
      const updatedFileURL = blockBlobClient.url;
      setUpdatedFileURL(updatedFileURL);
    } catch (error) {
      console.error('Error uploading file to Azure Blob Storage:', error);
    }
  };

  return (
    <div>
        <p><a href="/">LogOut</a></p>
    <div>
      <h2>Select or Create Client</h2>
      <select value={selectedClient} onChange={handleClientChange}>
        <option value="">Choose an existing client</option>
        {clients.map((client) => (
          <option key={client} value={client}>
            {client}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Enter a new client name"
        value={newClient}
        onChange={handleNewClientChange}
      />
      <button onClick={createNewClient}>Create New Client</button>

      <h2>File 1</h2>
      <input type="file" accept=".xlsx" onChange={handleFile1Upload} />

      <h2>File 2</h2>
      <input type="file" accept=".xlsx" onChange={handleFile2Upload} />

      <button onClick={scrubFiles}>Scrub Files</button>

      <h2>Updated File</h2>
      {updatedFileURL ? (
        <a href={updatedFileURL} target="_blank" rel="noopener noreferrer">
          Download Updated File
        </a>
      ) : (
        <p>No files uploaded</p>
      )}
    </div>
    </div>
  );
};

export default Dashboard;
