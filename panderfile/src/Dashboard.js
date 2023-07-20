import React, { useState } from 'react';
import axios from 'axios';



const Dashboard = () => {
  // Example data: replace this with your real data or fetch from an API
  const existingClients = [
    { id: 1, name: 'Client A' },
    { id: 2, name: 'Client B' },
    { id: 3, name: 'Client C' },
  ];

  const [selectedClient, setSelectedClient] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [clients, setClients] = useState(existingClients);
 
  

  const handleSelectChange = (event) => {
    setSelectedClient(event.target.value);
  };

  const handleNewClientChange = (event) => {
    setNewClientName(event.target.value);
  };

  const handleAddNewClient = () => {
    if (newClientName.trim() === '') return;

    const newClient = {
      id: Date.now(),
      name: newClientName,
    };

    setClients([...clients, newClient]);
    setSelectedClient(newClient.id);
    setNewClientName('');
  };

 


  return (
    <div>
      <h2>Select or Add Client</h2>
      <select value={selectedClient} onChange={handleSelectChange}>
        <option value="">Select an existing client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
      <br />
      <input
        type="text"
        placeholder="Enter new client name"
        value={newClientName}
        onChange={handleNewClientChange}
      />
      <button onClick={handleAddNewClient}>Add New Client</button>
        
    </div>
  );
};

export default Dashboard;
