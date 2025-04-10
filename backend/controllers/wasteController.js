let dataList = []; // holds all generated data entries

const generateWasteData = (req, res) => {
  const wasteKg = Math.floor(Math.random() * 100) + 1;
  const electricityKWh = Math.floor(wasteKg * 0.6);
  const data = {
    date: new Date().toISOString(),
    wasteKg,
    electricityKWh,
  };

  dataList.push(data); // store in history
  res.json(data);
};

const getLatestData = (req, res) => {
  if (dataList.length === 0) return res.json({});
  res.json(dataList[dataList.length - 1]); // latest entry
};

const getAllData = (req, res) => {
  res.json(dataList); // return full history
};

module.exports = {
  generateWasteData,
  getLatestData,
  getAllData,
};
