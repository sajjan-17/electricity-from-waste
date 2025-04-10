let history = [];

function generateData() {
  const entry = {
    date: new Date().toISOString(),
    wasteKg: Math.floor(Math.random() * 100),
    electricityKWh: Math.floor(Math.random() * 50),
  };

  history.push(entry);
  if (history.length > 10) {
    history.shift(); // Keep only last 10 entries
  }

  return entry;
}

function getLatestData() {
  if (history.length === 0) {
    return generateData(); // If no data yet, generate one
  }
  return history[history.length - 1];
}

function getHistory() {
  return history;
}

module.exports = {
  generateData,
  getLatestData,
  getHistory,
};
