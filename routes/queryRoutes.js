// queryRoutes.js

const express = require('express');
const router = express.Router();

const QueryModel = require('../model/Query');

// Define your query routes
router.get('/', async (req, res) => {
  try {
    const queries = await QueryModel.find();
    res.json(queries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const newQuery = new QueryModel({ title, content });
    const savedQuery = await newQuery.save();

    res.status(201).json(savedQuery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add more routes as needed

module.exports = router;
