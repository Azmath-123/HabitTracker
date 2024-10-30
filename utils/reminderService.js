const schedule = require('node-schedule');
const nodemailer = require('nodemailer');

// Add support for multiple notification types
const NOTIFICATION_TYPES = {
    EMAIL: 'email',
    PUSH: 'push',
    SMS: 'sms'
};

// Add support for reminder frequencies
const REMINDER_FREQUENCIES = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    CUSTOM: 'custom'
};

// Store active reminders in memory
const activeReminders = new Map();

// Enhanced email configuration with templates
const emailTemplates = {
    daily: (habitName) => ({
        subject: 'Daily Habit Reminder',
        text: `Time to complete your daily habit: ${habitName}!`
    }),
    weekly: (habitName) => ({
        subject: 'Weekly Habit Reminder',
        text: `Don't forget your weekly habit: ${habitName}!`
    })
};

// Enhanced scheduling function
const createScheduleRule = (reminderTime, frequency, days = []) => {
    const [hours, minutes] = reminderTime.split(':');
    const rule = new schedule.RecurrenceRule();
    
    rule.hours = parseInt(hours);
    rule.minutes = parseInt(minutes);
    
    if (frequency === REMINDER_FREQUENCIES.WEEKLY && days.length) {
        rule.dayOfWeek = days;
    }
    
    return rule;
};

// Store reminder job
const storeReminderJob = (habitId, job) => {
    if (activeReminders.has(habitId)) {
        // Cancel existing job before storing new one
        const existingJob = activeReminders.get(habitId);
        existingJob.cancel();
    }
    activeReminders.set(habitId, job);
};

// Get active reminder
const getActiveReminder = (habitId) => {
    return activeReminders.get(habitId);
};

// Cancel reminder
const cancelReminder = (habitId) => {
    if (activeReminders.has(habitId)) {
        const job = activeReminders.get(habitId);
        job.cancel();
        activeReminders.delete(habitId);
        return true;
    }
    return false;
};

module.exports = { NOTIFICATION_TYPES, REMINDER_FREQUENCIES, emailTemplates, createScheduleRule, storeReminderJob, getActiveReminder, cancelReminder };