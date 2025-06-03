// backend/routes/stationRoutes.js
const express = require('express');
const router = express.Router();
const Station = require('../models/Station');
const { findShortestPath } = require('../utils/shortestPath');

// Helper to build graph from station data
function buildGraph(stations) {
  const graph = {};
  for (const station of stations) {
    graph[station.name] = {};
    for (const neighbor of station.connections) {
      graph[station.name][neighbor.name] = neighbor.distance;
    }
  }
  return graph;
}

// Get all stations
router.get('/', async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stations/shortest-path?source=A&destination=B
router.get('/shortest-path', async (req, res) => {
  const { source, destination } = req.query;

  if (!source || !destination) {
    return res.status(400).json({ error: 'Missing source or destination' });
  }

  try {
    const stations = await Station.find();
    const graph = buildGraph(stations);
    const result = findShortestPath(source, destination, graph);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
