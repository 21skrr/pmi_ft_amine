const { Event, EventParticipant, User } = require("../models");
const { validationResult } = require("express-validator");

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["startDate", "ASC"]],
    });

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "participants",
          attributes: ["id", "name", "email", "role", "department"],
          through: { attributes: ["attended"] },
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      startDate,
      endDate,
      location,
      type,
      participants,
    } = req.body;

    // Create event
    const event = await Event.create({
      title,
      description,
      startDate,
      endDate,
      location,
      type,
      createdBy: req.user.id,
    });

    // Add participants
    if (participants && participants.length) {
      const participantRecords = participants.map((userId) => ({
        eventId: event.id,
        userId,
        attended: null,
      }));

      await EventParticipant.bulkCreate(participantRecords);
    }

    // Get created event with participants
    const createdEvent = await Event.findByPk(event.id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "participants",
          attributes: ["id", "name", "email", "role", "department"],
          through: { attributes: ["attended"] },
        },
      ],
    });

    res.status(201).json(createdEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      type,
      participants,
    } = req.body;

    // Find event
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is authorized to update this event
    const user = await User.findByPk(req.user.id);

    if (event.createdBy !== req.user.id && user.role !== "hr") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this event" });
    }

    // Update event
    await event.update({
      title: title || event.title,
      description: description !== undefined ? description : event.description,
      startDate: startDate || event.startDate,
      endDate: endDate || event.endDate,
      location: location !== undefined ? location : event.location,
      type: type || event.type,
    });

    // Update participants
    if (participants && participants.length) {
      // Remove existing participants
      await EventParticipant.destroy({
        where: { eventId: id },
      });

      // Add new participants
      const participantRecords = participants.map((userId) => ({
        eventId: id,
        userId,
        attended: null,
      }));

      await EventParticipant.bulkCreate(participantRecords);
    }

    // Get updated event with participants
    const updatedEvent = await Event.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "participants",
          attributes: ["id", "name", "email", "role", "department"],
          through: { attributes: ["attended"] },
        },
      ],
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find event
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is authorized to delete this event
    const user = await User.findByPk(req.user.id);

    if (event.createdBy !== req.user.id && user.role !== "hr") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this event" });
    }

    // Delete event
    await event.destroy();

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user events
exports.getUserEvents = async (req, res) => {
  try {
    const { id } = req.user; // From auth middleware

    const events = await Event.findAll({
      include: [
        {
          model: User,
          as: "participants",
          where: { id },
          attributes: [],
        },
      ],
      order: [["startDate", "ASC"]],
    });

    res.json(events);
  } catch (error) {
    console.error("Error fetching user events:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update event attendance
exports.updateAttendance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventId, userId } = req.params;
    const { attended } = req.body;

    // Find event participant
    const eventParticipant = await EventParticipant.findOne({
      where: {
        eventId,
        userId,
      },
    });

    if (!eventParticipant) {
      return res.status(404).json({ message: "Event participant not found" });
    }

    // Check if user is authorized to update attendance
    const user = await User.findByPk(req.user.id);

    if (user.role !== "hr" && user.role !== "supervisor") {
      return res
        .status(403)
        .json({ message: "Not authorized to update attendance" });
    }

    // Update attendance
    await eventParticipant.update({ attended });

    res.json(eventParticipant);
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};
