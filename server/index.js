const express = require('express');
const cors = require('cors');
const { seedCampaigns } = require('./seed-data');

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.get('/api/seed', (req, res) => {
  res.json({ campaigns: seedCampaigns });
});

app.listen(PORT, () => {
  console.log(`Agency PM server running on http://localhost:${PORT}`);
});
