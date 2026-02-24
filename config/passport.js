const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
const crypto = require('crypto');

if (process.env.CLIENT_ID && process.env.CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL || "http://localhost:8080/api/v1/auth/github/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({ githubId: profile.id });

                if (!user) {
                    // Create new user if doesn't exist
                    user = new User({
                        username: profile.username || profile.displayName,
                        githubId: profile.id,
                        avatar: profile._json.avatar_url,
                        apiKey: `pb_${crypto.randomBytes(24).toString('hex')}`
                    });
                    await user.save();
                } else if (!user.apiKey) {
                    // Back-fill API key for existing users if missing
                    user.apiKey = `pb_${crypto.randomBytes(24).toString('hex')}`;
                    await user.save();
                }
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }));
} else {
    console.warn('GitHub OAuth credentials missing. Auth routes will not work.');
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
