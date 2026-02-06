const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

const analyzeRoutes = require('./routes/analyze');

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use(analyzeRoutes); 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));