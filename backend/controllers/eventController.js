const Event = require('../models/Event');
const User = require('../models/User'); // to get organiser _id from firebaseUid

exports.createEvent = async (req, res) => {
    try {
        const { name, date, time, volunteersRequired, location, organiserUid } = req.body;

        // Find organiser user by firebaseUid
        const organiser = await User.findOne({ firebaseUid: organiserUid });
        if (!organiser) return res.status(404).json({ message: 'Organiser not found' });

        const newEvent = new Event({
            name,
            date,
            time,
            volunteersRequired,
            location,
            createdBy: organiser._id, // attach organiser reference
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
