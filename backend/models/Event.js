
// const mongoose = require('mongoose');

// const EventSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     date: { type: Date, required: true },
//     time: { type: String, required: true },
//     volunteersRequired: { type: Number, required: true, min: 1 },

//     //queue logic starts here
//     participants: [{
//     firebaseUid: { type: String, required: true },
//     name: String,
//     status: { type: String, enum: ['registered', 'waiting'], default: 'registered' },
//     joinedAt: { type: Date, default: Date.now }
//   }],
  
// //queue logic ends here


//     location: { type: String, required: true },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     // NEW: Array of user references
//     participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
//     createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Event', EventSchema);


const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    volunteersRequired: { type: Number, required: true, min: 1 },
    location: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // ONE definition: Array of strings to store Firebase UIDs
    // This allows the .includes() and .indexOf() logic to work perfectly
    participants: [{ type: String }], 
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);