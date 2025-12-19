import express from 'express';
import Client from '../models/Client.js';
import { upload } from '../middleware/upload.js';
import { cropAndResizeImage } from '../utils/imageProcessor.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single client
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create client
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const { name, designation, description } = req.body;

    if (!name || !designation || !description) {
      return res.status(400).json({ error: 'Name, designation, and description are required' });
    }

    // Process image
    const originalPath = req.file.path;
    const processedFileName = `processed-${req.file.filename}`;
    const processedPath = path.join(__dirname, '../uploads/', processedFileName);

    await cropAndResizeImage(originalPath, processedPath);

    const imageUrl = `/uploads/${processedFileName}`;

    const client = new Client({
      name,
      designation,
      description,
      image: imageUrl
    });

    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update client
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, designation, description } = req.body;
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    if (name) client.name = name;
    if (designation) client.designation = designation;
    if (description) client.description = description;

    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, '..', client.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      // Process new image
      const originalPath = req.file.path;
      const processedFileName = `processed-${req.file.filename}`;
      const processedPath = path.join(__dirname, '../uploads/', processedFileName);

      await cropAndResizeImage(originalPath, processedPath);
      client.image = `/uploads/${processedFileName}`;
    }

    await client.save();
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '..', client.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

