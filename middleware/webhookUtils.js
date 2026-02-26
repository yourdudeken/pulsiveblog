/**
 * Utility to trigger user-defined webhooks
 * Used for automated rebuilds on platforms like Vercel or Netlify
 */
const User = require('../models/User');

const triggerWebhook = async (user, eventData) => {
    if (!user || !user.webhookUrl) return;

    try {
        console.log(`Triggering webhook for ${user.username} at ${user.webhookUrl}`);

        const payload = {
            source: 'pulsiveblog',
            timestamp: new Date().toISOString(),
            ...eventData
        };

        const response = await fetch(user.webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Pulsive-Event': eventData.action,
                'User-Agent': 'PulsiveBlog-Webhook-Bot/1.0'
            },
            body: JSON.stringify(payload)
        });

        const logEntry = {
            event: eventData.action,
            status: response.status,
            payload: payload,
            response: response.ok ? 'Success' : (await response.text()).substring(0, 100),
            timestamp: new Date()
        };

        // Update user with log, keeping only last 5 logs
        await User.findByIdAndUpdate(user._id, {
            $push: {
                webhookLogs: {
                    $each: [logEntry],
                    $position: 0,
                    $slice: 5
                }
            }
        });

        if (response.ok) {
            console.log(`Webhook successfully delivered to ${user.username}`);
        } else {
            console.warn(`Webhook at ${user.webhookUrl} returned status ${response.status}`);
        }
    } catch (err) {
        console.error(`Error triggering webhook for ${user.username}:`, err.message);
    }
};

module.exports = { triggerWebhook };
