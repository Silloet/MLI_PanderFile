const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
routes=require('../server/Routes/ClientRoutes');

const app = express();
app.use(cors());
app.use(express.json());

 
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});



app.use('../Routes/ClientRoutes', clientRoutes);
app.use('./api/Deduplicate', DeduplicationRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
