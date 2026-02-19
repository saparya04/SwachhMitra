// const express = require('express');
// const router = express.Router();
// const eventController = require('../controllers/eventController');

// const Event = require('../models/Event');

// router.post('/create', eventController.createEvent);
// router.get('/all', eventController.getAllEvents);
// // router.post('/join', eventController.joinEvent);


// // queue logic starts here
// // 1. JOIN EVENT WITH QUEUE LOGIC
// router.post('/join', async (req, res) => {
//   const { eventId, firebaseUid, name } = req.body;
//   const event = await Event.findById(eventId);

//   if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }
//   if (!event.participants) {
//       event.participants = [];
//     }

//     // Check if user is already registered
//     const alreadyJoined = event.participants.find(p => p.firebaseUid === firebaseUid);
//     if (alreadyJoined) {
//       return res.status(400).json({ message: "Already joined this event" });
//     }

//   const registeredCount = event.participants.filter(p => p.status === 'registered').length;
//   const isFull = registeredCount >= (event.volunteersRequired || 0);
  
//   const newStatus = isFull ? 'waiting' : 'registered';
  
//   event.participants.push({ firebaseUid, name, status: newStatus, joinedAt: new Date() });
//   await event.save();
  
//   res.json({ status: newStatus, message: isFull ? "Added to Waiting List" : "Registered Successfully" });

//   } catch (error) {
//     console.error("Join Error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
  
// });


// // 2. LEAVE EVENT WITH AUTOMATIC PROMOTION
// router.post('/leave', async (req, res) => {
//   const { eventId, firebaseUid } = req.body;
//   const event = await Event.findById(eventId);

//   // Remove the user
//   event.participants = event.participants.filter(p => p.firebaseUid !== firebaseUid);

//   // Check if there's now space for someone in the queue
//   const currentRegistered = event.participants.filter(p => p.status === 'registered').length;
  
//   if (currentRegistered < event.volunteersRequired) {
//     // Find the first person in the waiting list (sorted by joinedAt)
//     const nextInLine = event.participants
//       .filter(p => p.status === 'waiting')
//       .sort((a, b) => a.joinedAt - b.joinedAt)[0];

//     if (nextInLine) {
//       nextInLine.status = 'registered'; // Promote them
//     }
//   }

//   await event.save();
//   res.json({ message: "Unregistered successfully" });
// });
// // queue logic ends here


// router.get('/organiser-stats/:organiserUid', eventController.getOrganiserDashboard);

// module.exports = router;




const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const Event = require('../models/Event');

router.post('/create', eventController.createEvent);
router.get('/all', eventController.getAllEvents);


// 1. JOIN EVENT (Simple String Push)
router.post('/join', async (req, res) => {
  try {
    const { eventId, firebaseUid } = req.body;
    const event = await Event.findById(eventId);

    if (!event.participants.includes(firebaseUid)) {
      event.participants.push(firebaseUid);
      // event.markModified('participants');
      await event.save();
    }

    // Check position in the array to determine response
    const userIndex = event.participants.indexOf(firebaseUid);
    const isFull = userIndex >= event.volunteersRequired;

    res.json({ 
      status: isFull ? 'waiting' : 'registered', 
      message: isFull ? "Added to Waiting List" : "Registered Successfully" 
    });
  } catch (error) {
    console.error("Join Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. LEAVE EVENT (Simple String Filter)
router.post('/leave', async (req, res) => {
  try {
    const { eventId, firebaseUid } = req.body;
    const event = await Event.findById(eventId);

    // Removing the ID automatically "shifts" everyone else up
    event.participants = event.participants.filter(id => id !== firebaseUid);
    
    await event.save();
    res.json({ message: "Unregistered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/organiser-stats/:organiserUid', eventController.getOrganiserDashboard);

module.exports = router;