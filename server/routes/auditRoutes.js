const express = require('express');
const router = express.Router();
const Audit = require('../models/Audit');
const { analyzeAudit } = require('../utils/auditEngine');
const { generateSummary } = require('../utils/aiService');

// ======================================================
// @route   POST /api/audit
// @desc    Analyze audit data + Gemini AI Summary
// ======================================================
router.post('/', async (req, res) => {
    console.log('🔍 [ANALYSIS] Incoming request...');
    
    try {
        const auditData = req.body;

        if (!auditData || !auditData.tools || !Array.isArray(auditData.tools)) {
            console.warn('⚠️ [ANALYSIS] Invalid payload format');
            return res.status(400).json({
                success: false,
                error: 'Invalid audit data format'
            });
        }

        // 1. Calculate savings via engine
        console.log('⚙️ [ANALYSIS] Running logic engine...');
        const results = analyzeAudit(auditData);
        
        // 2. Generate AI Summary (with safety fallback)
        let aiSummaryText = results.aiSummary || 'Analysis complete.';
        
        try {
            if (process.env.AI_ENABLED === 'true' || process.env.AI_API_KEY) {
                console.log('🤖 [ANALYSIS] Requesting Gemini AI summary...');
                const dynamicSummary = await generateSummary(results);
                if (dynamicSummary) aiSummaryText = dynamicSummary;
            }
        } catch (aiErr) {
            console.warn('⚠️ [ANALYSIS] AI generation failed, using fallback.');
        }
        
        console.log('✅ [ANALYSIS] Success');
        res.json({ 
            success: true,
            ...results, 
            aiSummary: aiSummaryText 
        });

    } catch (error) {
        console.error('🔥 [ANALYSIS] FATAL ERROR:', error.message);
        res.status(500).json({ 
            success: false,
            error: 'Server error during audit analysis', 
            details: error.message 
        });
    }
});

// ======================================================
// @route   POST /api/audit/save
// @desc    Save completed audit to MongoDB Atlas
// ======================================================
router.post('/save', async (req, res) => {
    console.log('📥 [SAVE] Incoming save request...');
    
    try {
        const payload = req.body;
        console.log('📦 [SAVE] Payload details:', JSON.stringify(payload, null, 2));

        if (!payload || (typeof payload !== 'object')) {
            return res.status(400).json({ success: false, error: 'Request body is missing or invalid' });
        }

        // Flexible mapping: handles different frontend field names
        const toolsData = payload.toolsData || payload.results || { breakdown: payload.breakdown || [] };
        const totalSavings = Number(payload.totalSavings || payload.totalMonthlySavings || 0);
        const yearlySavings = Number(payload.yearlySavings || payload.totalYearlySavings || 0);
        const aiSummary = payload.aiSummary || "Audit results generated.";

        // Validation
        if (!toolsData) {
            return res.status(400).json({ success: false, error: 'Missing core audit data (toolsData)' });
        }

        const newAudit = new Audit({
            toolsData,
            totalSavings,
            yearlySavings,
            aiSummary
        });

        console.log('📀 [SAVE] Attempting to save to MongoDB...');
        const savedAudit = await newAudit.save();
        
        console.log('✅ [SAVE] Audit saved successfully. ID:', savedAudit._id);
        res.status(201).json({ 
            success: true,
            message: 'Audit saved successfully', 
            id: savedAudit._id,
            audit: savedAudit 
        });

    } catch (error) {
        console.log('🔥 [SAVE] ERROR DETECTED');
        console.error('Stack:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false,
                error: 'Database validation failed', 
                details: Object.values(error.errors).map(e => e.message) 
            });
        }

        res.status(500).json({ 
            success: false,
            error: 'Server error while saving audit',
            message: error.message 
        });
    }
});

// ======================================================
// @route   GET /api/audit/:id
// @desc    Fetch a specific audit by ID
// ======================================================
router.get('/:id', async (req, res) => {
    try {
        const audit = await Audit.findById(req.params.id);
        if (!audit) {
            return res.status(404).json({ success: false, error: 'Audit not found' });
        }
        res.json({ success: true, audit });
    } catch (error) {
        console.error('🔥 [FETCH] ERROR:', error.message);
        res.status(500).json({ success: false, error: 'Server error while fetching audit' });
    }
});

module.exports = router;