import express from 'express';
import { createEvent, editEvent, deleteEventById } from '../controllers/eventsController.js';

const router = express.Router();

// POST /events - Create a new event
router.post('/', createEvent);

// PUT /events/:id - Edit an event by ID
router.put('/:id', editEvent);

// DELETE /events/:id - Delete an event by ID
router.delete('/:id', deleteEventById);

export default router;

