const express = require('express');
const cors = require('cors'); // ✅ Import CORS

const app = express();
const wasteRoutes = require('./routes/wasteRoutes');

app.use(cors()); // ✅ Enable CORS here
app.use(express.json()); 
app.use('/waste', wasteRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
