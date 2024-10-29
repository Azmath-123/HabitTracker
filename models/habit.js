const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    goals: [{
        goalId: { type: mongoose.Schema.Types.ObjectId },
        goalType: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
        target: { type: Number, required: true },
        currentProgress: { type: Number, default: 0 },
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Habit', HabitSchema);
