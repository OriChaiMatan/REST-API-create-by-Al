import { insertEvent, findEventById, updateEvent, deleteEvent } from '../models/event.js';

/**
 * Handle creating a new event
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function createEvent(req, res) {
  try {
    const { title, description, date, location } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }

    if (!date || !date.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    // Create and insert new event into database
    const newEvent = insertEvent(title, description, date, location || '');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
}

/**
 * Handle updating an event
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function editEvent(req, res) {
  try {
    const { id } = req.params;
    const { title, description, date, location } = req.body;

    // Check if event exists
    const existingEvent = findEventById(parseInt(id));
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Build update object with only provided fields
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (date !== undefined) updates.date = date;
    if (location !== undefined) updates.location = location;

    // Update event
    const updatedEvent = updateEvent(parseInt(id), updates);

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
}

/**
 * Handle deleting an event
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function deleteEventById(req, res) {
  try {
    const { id } = req.params;

    // Check if event exists
    const existingEvent = findEventById(parseInt(id));
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Delete event
    const deleted = deleteEvent(parseInt(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
}

