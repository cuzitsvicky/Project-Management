import express from 'express';
import Project from '../models/Project.js';
import { upload } from '../middleware/upload.js';
import { cropAndResizeImage } from '../utils/imageProcessor.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    // Process image
    const originalPath = req.file.path;
    const processedFileName = `processed-${req.file.filename}`;
    const processedPath = path.join(__dirname, '../uploads/', processedFileName);

    await cropAndResizeImage(originalPath, processedPath);

    const imageUrl = `/uploads/${processedFileName}`;

    const project = new Project({
      name,
      description,
      image: imageUrl
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (name) project.name = name;
    if (description) project.description = description;

    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, '..', project.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      // Process new image
      const originalPath = req.file.path;
      const processedFileName = `processed-${req.file.filename}`;
      const processedPath = path.join(__dirname, '../uploads/', processedFileName);

      await cropAndResizeImage(originalPath, processedPath);
      project.image = `/uploads/${processedFileName}`;
    }

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '..', project.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

