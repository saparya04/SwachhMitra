// const Event = require('../models/Event');
// const User = require('../models/User'); // to get organiser _id from firebaseUid

// exports.createEvent = async (req, res) => {
//     try {
//         const { name, date, time, volunteersRequired, location, organiserUid } = req.body;

//         // Find organiser user by firebaseUid
//         const organiser = await User.findOne({ firebaseUid: organiserUid });
//         if (!organiser) return res.status(404).json({ message: 'Organiser not found' });

//         const newEvent = new Event({
//             name,
//             date,
//             time,
//             volunteersRequired,
//             location,
//             createdBy: organiser._id, // attach organiser reference
//         });

//         await newEvent.save();
//         res.status(201).json({ message: 'Event created successfully', event: newEvent });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

const Event = require('../models/Event');
const User = require('../models/User');

// Create Event
exports.createEvent = async (req, res) => {
    try {
        const { name, date, time, volunteersRequired, location, organiserUid } = req.body;
        const organiser = await User.findOne({ firebaseUid: organiserUid });
        if (!organiser) return res.status(404).json({ message: 'Organiser not found' });

        const newEvent = new Event({
            name, date, time, volunteersRequired, location,
            createdBy: organiser._id,
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// NEW: Get All Events for Volunteers
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('createdBy', 'name');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// NEW: Volunteer joins an event
exports.joinEvent = async (req, res) => {
    try {
        const { eventId, firebaseUid } = req.body;
        const user = await User.findOne({ firebaseUid });
        const event = await Event.findById(eventId);

        if (!event.participants.includes(user._id)) {
            event.participants.push(user._id);
            await event.save();
        }
        res.status(200).json({ message: 'Joined successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// NEW: Organiser views their specific events + participants
exports.getOrganiserDashboard = async (req, res) => {
    try {
        const { organiserUid } = req.params;
        const organiser = await User.findOne({ firebaseUid: organiserUid });
        // Find events created by this user and populate the names of people who joined
        const events = await Event.find({ createdBy: organiser._id }).populate('participants', 'name email');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};