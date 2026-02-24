/**
 * Utility to trigger user-defined webhooks
 * Used for automated rebuilds on platforms like Vercel or Netlify
 */
const triggerWebhook = async (user, eventData) => {
    if (!user || !user.webhookUrl) return;

    try {
        console.log(`Triggering webhook for ${user.username} at ${user.webhookUrl}`);

        const response = await fetch(user.webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Pulsive-Event': eventData.action, // e.g., 'post_created'
                'User-Agent': 'PulsiveBlog-Webhook-Bot/1.0'
            },
            body: JSON.stringify({
                source: 'pulsiveblog',
                timestamp: new Date().toISOString(),
                ...eventData
            })
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
