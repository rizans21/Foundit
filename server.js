require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Item = require('./models/Item'); // Import Item model

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

// Connect to MongoDB (Atlas)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Submit Lost Item Route
app.post('/api/submissions', async (req, res) => {
  const { itemName, location, description, image } = req.body;

  try {
    const newItem = new Item({
      itemName,
      location,
      description,
      image, // Image URL
    });

    await newItem.save(); // Save the item to the database
    res.status(201).json({ message: 'Item successfully submitted', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting item', error });
  }
});

// Search Lost Items Route (for the frontend search with pagination)
app.get('/search', async (req, res) => {
  const { q, page = 1 } = req.query; // Get query and page, default page to 1
  const pageSize = 12; // Results per page
// Log the search query and page number
  console.log('Search Query:', q);
  console.log('Page:', page);
  try {
    const results = await Item.find({
      itemName: { $regex: q, $options: 'i' }, // Search by item name, case-insensitive
    })
    .skip((page - 1) * pageSize) // Skip results based on the page number
    .limit(pageSize); // Limit to the page size

    // Count total number of matching items
    const totalResults = await Item.countDocuments({
      itemName: { $regex: q, $options: 'i' },
    });

    res.json({
      items: results,
      totalPages: Math.ceil(totalResults / pageSize), // Calculate total pages
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error });
  }
});

// Default Route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
