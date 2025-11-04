const ContactMessage = require('../models/ContactMessage');

// @desc    Handle contact form submission and save to DB
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
  // Add this line to check if the function is even being called.
  console.log('Contact form submission received!'); 
  
  try {
    const { name, email, message } = req.body;

    // Create a new contact message document in the database
    const newContactMessage = await ContactMessage.create({
      name,
      email,
      message,
    });

    // Respond with a success message
    res.status(201).json({
      success: true,
      data: newContactMessage,
      message: 'Your message has been received successfully!'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

module.exports = { submitContactForm };
