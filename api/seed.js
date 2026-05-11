const { seedCampaigns } = require('../server/seed-data');

module.exports = (req, res) => {
  res.status(200).json({ campaigns: seedCampaigns });
};
