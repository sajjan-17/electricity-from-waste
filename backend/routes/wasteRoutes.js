// backend/routes/wasteRoutes.js
const express = require('express');
const router = express.Router();

let data = []; // store in memory

router.post('/generate', (req, res) => {
  const newEntry = {
    date: new Date().toISOString(),
    wasteKg: Math.floor(Math.random() * 100),
    electricityKWh: Math.floor(Math.random() * 50),
  };
  data.push(newEntry);
  res.json(newEntry);
});

router.get('/all', (req, res) => {
  res.json(data);
});

module.exports = router;
