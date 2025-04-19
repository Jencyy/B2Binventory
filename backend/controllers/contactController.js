const Contact = require('../models/Contact');

exports.submitContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: "Message received" });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit message" });
  }
};
    