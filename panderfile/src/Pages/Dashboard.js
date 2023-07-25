import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [PanderFileUpload, setPanderFileUpload] = useState(null);
  const [dataFileUpload, setDataFileUpload] = useState(null);
  const [cleanSheet, setCleanSheet] = useState(null);
  const [authenticated, setauthenticated] = useState(null);

 

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('./server/Routes/ClientRoutes'); 
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleClientChange = (event) => {
    setSelectedClient(event.target.value);
  };

  const handleNewClientChange = (event) => {
    setNewClientName(event.target.value);
  };

  const handleCreateClient = async () => {
    try {
      const response = await axios.post('./Models/Clients.js', { name: newClientName }); 
      setClients([...clients, response.data]);
      setSelectedClient(response.data._id);
      setNewClientName('');
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

    const handlePanderFileUpload = (event) => {
      const file = event.target.files[0];
  
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        setPanderFileUpload(data);
      };
      reader.readAsArrayBuffer(file);
    };

  const handleDataFileUpload = (event) => {
    const file = event.target.files[0];
  
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        setDataFileUpload(data);
      };
      reader.readAsArrayBuffer(file);
  };

  const handleDeduplicate = async () => {
    try {
      const response = await axios.post('./Routes/DededuplicationRoutes', {
        clientId: selectedClient,
        PanderFileUpload,
        dataFileUpload,
      }); 
      setCleanSheet(response.data);
    } catch (error) {
      console.error('Error deduplicating files:', error);
    }
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem("authenticated");
    if (loggedInUser) {
      setauthenticated(loggedInUser);
    }
  }, []);

  if (!authenticated) {
 
  } else {

  return (
    <div>
      <h1>Client Dashboard</h1>
      <div>
        <h2>Choose or Create Client</h2>
        <select value={selectedClient} onChange={handleClientChange}>
          <option value="">Select an existing client</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Enter new client name"
          value={newClientName}
          onChange={handleNewClientChange}
        />
        <button onClick={handleCreateClient}>Create New Client</button>
      </div>
      <div>
        <h2>Upload Pander File and Data File</h2>
        <div>
        </div>
        <button onClick={handleDeduplicate}>Deduplicate Files</button>
      </div>
      {cleanSheet && (
        <div>
          <h2>Clean Sheet</h2>
          <pre>{JSON.stringify(cleanSheet, null, 2)}</pre>
        </div>
      )}
      <div>
      <input type="file" accept=".xlsx" onChange={handlePanderFileUpload} />
    </div>
    <div>
      <input type="file" accept=".xlsx" onChange={handleDataFileUpload} />
    </div>
    </div>
  );
};
};
export default Dashboard;
