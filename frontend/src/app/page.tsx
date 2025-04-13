'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

type WasteData = {
  date: string;
  wasteKg: number;
  electricityKWh: number;
};

export default function Home() {
  const [allData, setAllData] = useState<WasteData[]>([]);
  const [filteredData, setFilteredData] = useState<WasteData[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  const fetchAllData = async () => {
    const res = await fetch('http://localhost:3001/waste/all');
    const json = await res.json();
    setAllData(json);
    setFilteredData(json); // by default show all
  };

  const generateWasteData = async () => {
    await fetch('http://localhost:3001/waste/generate', { method: 'POST' });
    fetchAllData(); // reload data
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const applyFilter = () => {
    if (!startDate || !endDate) return;
    const filtered = allData.filter((d) => {
      const date = new Date(d.date);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });
    setFilteredData(filtered);
  };

  const resetFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredData(allData);
  };

  const totalWaste = filteredData.reduce((sum, d) => sum + d.wasteKg, 0);
  const totalElectricity = filteredData.reduce((sum, d) => sum + d.electricityKWh, 0);

  const pieData = [
    { name: 'Total Waste', value: totalWaste },
    { name: 'Total Electricity', value: totalElectricity },
  ];

  const COLORS = ['#4ade80', '#60a5fa'];

  return (
    <main className="min-h-screen bg-gray-100 p-6 flex gap-4">
      {/* LEFT */}
      <div className="w-1/4 space-y-4">
        <h1 className="text-2xl font-bold text-green-1500">Electricity Usage</h1>

        <button
          onClick={generateWasteData}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm w-full"
        >
          Generate New Data
        </button>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow border p-4 space-y-3">
          <h2 className="text-base font-semibold text-gray-1000">Filter by Date</h2>
          <div className="flex flex-col gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <button
              onClick={applyFilter}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
            >
              Apply Filter
            </button>
            <button
              onClick={resetFilter}
              className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400 transition"
            >
              Reset Filter
            </button>
          </div>
        </div>

        {/* Latest Table */}
        <div className="bg-white rounded-lg shadow border p-4">
          <h2 className="text-base font-semibold text-gray-1000 mb-3">Latest Data</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Waste (kg)</th>
                <th className="p-2 text-left">Electricity (kWh)</th>
              </tr>
            </thead>
            <tbody>
              {[...filteredData].reverse().map((d, i) => (
                <tr key={i} className="hover:bg-gray-50 text-gray-700">
                  <td className="p-2">{new Date(d.date).toLocaleDateString()}</td>
                  <td className="p-2">{d.wasteKg}</td>
                  <td className="p-2">{d.electricityKWh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-3/4 grid grid-cols-2 gap-4">
        {/* Totals Display */}
        <div className="col-span-2 bg-white rounded-lg shadow border p-4 text-center">
          <p className="text-gray-800 font-medium">
            Total Waste: <span className="font-bold text-green-700">{totalWaste} kg</span> | Total Electricity: <span className="font-bold text-blue-700">{totalElectricity} kWh</span>
          </p>
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-lg shadow border p-4">
          <h2 className="text-sm font-semibold text-gray-1000 mb-2">Line Chart</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={filteredData}>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="wasteKg" stroke="#4ade80" />
              <Line type="monotone" dataKey="electricityKWh" stroke="#60a5fa" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow border p-4">
          <h2 className="text-sm font-semibold text-gray-1000 mb-2">Bar Chart</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={filteredData}>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="wasteKg" fill="#4ade80" />
              <Bar dataKey="electricityKWh" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow border p-4 col-span-2">
          <h2 className="text-sm font-semibold text-gray-1000 mb-2">Pie Chart</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}
