import express from 'express';
import Newsletter from '../models/Newsletter.js';

const router = express.Router();

// Get all newsletter subscriptions
router.get('/', async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create newsletter subscription
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if email already exists
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }

    const newsletter = new Newsletter({ email });
    await newsletter.save();
    res.status(201).json(newsletter);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete newsletter subscription
router.delete('/:id', async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Newsletter subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

