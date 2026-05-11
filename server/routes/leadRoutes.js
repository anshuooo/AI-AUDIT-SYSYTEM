const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Lead = require('../models/Lead');
const { sendConfirmationEmail } = require('../utils/emailService');

// Security: Rate limiting prevents brute-force bot attacks and spam
const leadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per window
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

// @route   POST /api/lead
// @desc    Save a new lead and send confirmation email
router.post('/', leadLimiter, async (req, res) => {
    console.log('📬 New Lead Submission Received');

    try {
        const { email, companyName, role, teamSize, website } = req.body;

        // Security: Honeypot field check
        if (website) {
            console.warn('🛡️ Honeypot triggered! Bot detected from IP:', req.ip);
            return res.status(400).json({ error: 'Spam protection triggered' });
        }

        if (!email || !email.includes('@')) {
            console.warn('⚠️ Invalid email submission:', email);
            return res.status(400).json({ error: 'A valid email address is required' });
        }

        const newLead = new Lead({
            email,
            companyName: companyName || 'Not Provided',
            role: role || 'Not Provided',
            teamSize: Number(teamSize) || 0
        });

        await newLead.save();
        console.log('✅ Lead saved successfully:', email);

        const emailPayload = {
            email,
            companyName,
            auditSummary: req.body.auditSummary,
            monthlySavings: req.body.monthlySavings,
            yearlySavings: req.body.yearlySavings,
            shareUrl: req.body.shareUrl
        };

        sendConfirmationEmail(emailPayload)
            .then(sent => {
                if (!sent) {
                    console.warn('⚠️ Confirmation email could not be delivered for lead:', email);
                } else {
                    console.log('📧 Confirmation email successfully queued for', email);
                }
            })
            .catch(err => {
                console.error('📧 Email background task failed:', err.message);
            });

        res.status(201).json({
            success: true,
            message: 'Lead captured successfully',
            lead: { email: newLead.email }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'This email is already registered in our system' });
        }
        console.error('🔥 SERVER ERROR (Lead):', error.message);
        res.status(500).json({
            error: 'Server error while processing lead',
            details: error.message
        });
    }
});

module.exports = router;
