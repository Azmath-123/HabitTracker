const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    // Reference to the habit this reminder belongs to
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        required: true
    },

    // User who owns this reminder
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Time for the reminder (in HH:mm format)
    time: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Validate time format (HH:mm)
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: props => `${props.value} is not a valid time format! Use HH:mm`
        }
    },

    // Frequency of the reminder
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'custom'],
        default: 'daily'
    },

    // Days of the week for weekly reminders (0 = Sunday, 6 = Saturday)
    days: [{
        type: Number,
        min: 0,
        max: 6,
        validate: {
            validator: function(v) {
                // Only required if frequency is weekly
                if (this.frequency === 'weekly') {
                    return v >= 0 && v <= 6;
                }
                return true;
            },
            message: 'Days must be between 0 (Sunday) and 6 (Saturday)'
        }
    }],

    // Types of notifications to send
    notificationTypes: [{
        type: String,
        enum: ['email', 'push', 'sms'],
        default: ['email']
    }],

    // User's timezone
    timezone: {
        type: String,
        default: 'UTC'
    },

    // Whether the reminder is currently active
    active: {
        type: Boolean,
        default: true
    },

    // When the reminder was last triggered
    lastTriggered: {
        type: Date
    },

    // When the reminder will next trigger
    nextTrigger: {
        type: Date
    },

    // Custom message for the reminder (optional)
    message: {
        type: String,
        maxLength: 200
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Index for faster queries
reminderSchema.index({ habitId: 1, userId: 1 });
reminderSchema.index({ nextTrigger: 1 }, { sparse: true });

// Pre-save middleware to set nextTrigger
reminderSchema.pre('save', function(next) {
    if (this.active && !this.nextTrigger) {
        const [hours, minutes] = this.time.split(':');
        const next = new Date();
        next.setHours(parseInt(hours, 10));
        next.setMinutes(parseInt(minutes, 10));
        next.setSeconds(0);
        next.setMilliseconds(0);

        // If time has passed for today, set for tomorrow
        if (next < new Date()) {
            next.setDate(next.getDate() + 1);
        }

        this.nextTrigger = next;
    }
    next();
});

// Instance method to check if reminder should trigger
reminderSchema.methods.shouldTrigger = function() {
    if (!this.active) return false;
    
    const now = new Date();
    if (this.frequency === 'weekly') {
        return this.days.includes(now.getDay());
    }
    return true;
};

// Static method to find due reminders
reminderSchema.statics.findDueReminders = function() {
    const now = new Date();
    return this.find({
        active: true,
        nextTrigger: { $lte: now }
    }).populate('habitId userId');
};

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;