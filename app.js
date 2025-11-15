import express from 'express';
import userRoutes from './routes/users.js';
import eventRoutes from './routes/events.js';
import { initDatabase, closeDatabase } from './database/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initDatabase();

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/events', eventRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'REST API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDatabase();
  process.exit(0);
});

