const Habit = require('../models/habit');
const Reminder = require('../models/remainderModel');
const errorHandler = require('../utils/errorHandler'); 
const { sendEmail } = require('../services/notifications/emailService');
const { convertToUserTimezone } = require('../utils/timeZoneHelper');
const logger = require('../utils/reminderLogger');
const reminderService = require('../utils/reminderService');
// Add to your existing controller


exports.createHabit = async (req, res) => {
    const { title, description, frequency, goals } = req.body;
    try {
        const habit = new Habit({ userId: req.user.id, title, description, frequency, goals });
        await habit.save();
        res.status(201).json(habit);
    } catch (error) {
        errorHandler(error, res);
    }
};

exports.updateHabit = async (req, res) => {
    const { habitId } = req.params;
    const updates = req.body;
    try {
        const habit = await Habit.findByIdAndUpdate(habitId, updates, { new: true });
        if (!habit) return res.status(404).json({ message: 'Habit not found' });
        res.status(200).json(habit);
    } catch (error) {
        errorHandler(error, res);
    }
};

exports.deleteHabit = async (req, res) => {
    const { habitId } = req.params;
    try {
        await Habit.findByIdAndDelete(habitId);
        res.status(200).json({ message: 'Habit deleted successfully' });
    } catch (error) {
        errorHandler(error, res);
    }
};
exports.getHabits = async (req, res) => {
    try {
        const habits = await Habit.find(); // Assuming Habit is your Mongoose model
        res.status(200).json(habits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.setHabitReminder = async (req, res) => {
    try {
        const { habitId } = req.params;
        const { reminderTime, userTimezone } = req.body;

        const habit = await Habit.findById(habitId);
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        const reminderTimeUTC = convertToUserTimezone(reminderTime, userTimezone);
        habit.reminderTime = reminderTimeUTC;
        await habit.save();

        await scheduleReminder(habit._id, reminderTimeUTC);
        await sendEmail({
            to: req.user.email,
            subject: 'Habit Reminder Set',
            text: `Reminder set for habit: ${habit.title}`
        });

        res.status(200).json({ message: 'Reminder set successfully' });
    } catch (error) {
        logger.error('Reminder setting failed:', error);
        res.status(500).json({ message: 'Error setting reminder' });
    }
}; // Import error handler