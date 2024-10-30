const webpush = require('web-push');

const sendPushNotification = async (subscription, payload) => {
    try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
    } catch (error) {
        console.error('Push notification failed:', error);
    }
};

module.exports = { sendPushNotification };  