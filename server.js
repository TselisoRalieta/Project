const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

let hazards = [];

// ✅ Get all hazards
app.get('/hazards', (req, res) => {
  res.json(hazards);
});

// ✅ Report a new hazard
app.post('/report', (req, res) => {
  const { type, description, location, severity, photoUrl } = req.body;
  const newHazard = {
    id: uuidv4(),
    type,
    description,
    location: {
    district: location.district || '', // or provide default
    village: location.village || ''
  },
    severity,
    source: 'crowd',
    photoUrl,
    timestamp: new Date().toISOString()
  };
  hazards.push(newHazard);
  res.json(newHazard);
});

// ✅ Run server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚦 Hazard API running at http://localhost:${PORT}`);
});
