const emailConfig = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    templates: {
        daily: {
            subject: 'Daily Habit Reminder',
            template: (habitName) => `Time to complete your habit: ${habitName}`
        }
        // ... more templates
    }
};

module.exports = emailConfig;