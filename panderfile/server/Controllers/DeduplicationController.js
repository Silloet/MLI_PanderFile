 const deduplicateFiles = (req, res) => {
  const { clientId, panderFile, dataFile } = req.body;
  
    try {
      const cleanedData = deduplicateData(panderFile, dataFile);
  
      // Return the cleaned data to the frontend
      res.json(cleanedData);
    } catch (error) {
      console.error('Error deduplicating files:', error);
      res.status(500).json({ error: 'Error deduplicating files' });
    }
  };
  
const deduplicateData = (panderFile, dataFile) => {
  const panderData = JSON.parse(Buffer.from(panderFile).toString('utf-8'));
  const data = JSON.parse(Buffer.from(dataFile).toString('utf-8'));

  // unique records based on address, city, state, and zipcode
  const uniqueRecordsMap = new Map();

  //  generate a unique key from address, city, state, and zipcode
  const generateKey = (record) =>
    `${record.address}-${record.city}-${record.state}-${record.zipcode}`;

  // Add records from the pander file to the uniqueRecordsMap
  panderData.forEach((record) => {
    const key = generateKey(record);
    uniqueRecordsMap.set(key, record);
  });

  // Add records from the data file to the uniqueRecordsMap, overwriting duplicates
  data.forEach((record) => {
    const key = generateKey(record);
    uniqueRecordsMap.set(key, record);
  });

  // Convert the map values back to an array of cleaned records
  const cleanedData = Array.from(uniqueRecordsMap.values());

  return cleanedData;
};
  
module.exports = { deduplicateFiles };

  
  