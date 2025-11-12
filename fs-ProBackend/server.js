// server/server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI; // set in Render/Env

if (!MONGO_URI) {
  console.error('MONGODB_URI not set. Exiting.');
  process.exit(1);
}

// Simple logger middleware
app.use((req, res, next) => {
  const now = new Date().toISOString();
  // log body for non-GET to help debugging (avoid logging secrets)
  console.log(`[${now}] ${req.method} ${req.originalUrl} - Body: ${JSON.stringify(req.body || {})}`);
  next();
});

// CORS (simple)
app.use((req, res, next) => {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*'; // set ALLOWED_ORIGIN to your gh-pages URL in production
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

// Static images middleware with existence check
app.get('/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagesDir = path.join(__dirname, 'public', 'images');
  const fullPath = path.join(imagesDir, filename);

  fs.access(fullPath, fs.constants.R_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.sendFile(fullPath);
  });
});

let dbClient;
let db;
const DB_NAME = process.env.DB_NAME || 'lessonsdb';

async function start() {
  dbClient = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await dbClient.connect();
  db = dbClient.db(DB_NAME);
  console.log('Connected to MongoDB Atlas database:', DB_NAME);

  // Routes
  app.get('/api/lessons', async (req, res) => {
    try {
      const lessons = await db.collection('lessons').find({}).toArray();
      res.json(lessons);
    } catch (err) {
      console.error('GET /api/lessons error', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Search route (server-side search)
  app.get('/api/search', async (req, res) => {
    try {
      const q = (req.query.q || '').trim();
      if (!q) {
        // return all if no query
        const all = await db.collection('lessons').find({}).toArray();
        return res.json(all);
      }
      // naive text search across topic and location and price/spaces
      const regex = new RegExp(q, 'i');
      const query = {
        $or: [
          { topic: regex },
          { location: regex },
          { category: regex },
          { price: { $regex: regex } },   // price and spaces are numbers; you may cast or match string forms
          { spaces: { $regex: regex } }
        ]
      };
      // For numeric fields convert to string search fallback by using aggregation or cast; simple approach: search topic/location/category primarily
      const results = await db.collection('lessons').find({
        $or: [
          { topic: regex },
          { location: regex },
          { category: regex }
        ]
      }).toArray();
      res.json(results);
    } catch (err) {
      console.error('GET /api/search error', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Create order
  app.post('/api/orders', async (req, res) => {
    try {
      const order = req.body;
      // Validate minimal fields: name, phone, lessonIDs (array), items or quantities
      if (!order.name || !order.phone || !Array.isArray(order.lessonIDs) || order.lessonIDs.length === 0) {
        return res.status(400).json({ error: 'Invalid order payload' });
      }
      const now = new Date();
      const doc = { ...order, createdAt: now };
      const result = await db.collection('orders').insertOne(doc);
      res.json({ insertedId: result.insertedId });
    } catch (err) {
      console.error('POST /api/orders error', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Update lesson (PUT), body contains fields to set (e.g., { spaces: 3 })
  app.put('/api/lessons/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const update = req.body;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
      const result = await db.collection('lessons').updateOne({ _id: new ObjectId(id) }, { $set: update });
      if (result.modifiedCount === 0) return res.status(404).json({ error: 'Lesson not found or no change' });
      res.json({ modifiedCount: result.modifiedCount });
    } catch (err) {
      console.error('PUT /api/lessons/:id error', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});