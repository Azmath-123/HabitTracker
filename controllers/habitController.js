const Habit = require('../models/habit');
const errorHandler = require('../utils/errorHandler');  // Import error handler

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
