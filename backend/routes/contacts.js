import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

// Get all contact form submissions
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create contact form submission
router.post('/', async (req, res) => {
  try {
    const { fullName, email, mobile, city, message } = req.body;

    if (!fullName || !email || !mobile || !city) {
      return res.status(400).json({ error: 'Full name, email, mobile, and city are required' });
    }

    const contact = new Contact({
      fullName,
      email,
      mobile,
      city,
      message: message || ''
    });

    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete contact submission
router.delete('/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

