import express from 'express';
import mongoose from 'mongoose';
import Response from '../models/Response.js';
import authMiddleware from '../routes/authMiddleware.js';

const router = express.Router();

router.get('/:responseId', authMiddleware, async (req, res) => {
    try {
        const responseId = req.params.responseId;
        if (!mongoose.Types.ObjectId.isValid(responseId)) {
            return res.status(400).send('Ungültige Response ID');
        }

        const response = await Response.findById(responseId);
        if (!response) {
            return res.status(404).send('Response nicht gefunden');
        }

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Serverfehler');
    }
});

// POST eine neue Response
router.post('/responses', authMiddleware, async (req, res) => {
    try {
        const newResponse = new Response({ ...req.body });
        await newResponse.save();
        res.status(201).json(newResponse);
    } catch (error) {
        console.error('Error creating response', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT eine bestehende Response aktualisieren
router.put('/responses/:responseId', authMiddleware, async (req, res) => {
    try {
        const responseId = req.params.responseId;
        const response = await Response.findByIdAndUpdate(responseId, req.body, { new: true });
        if (!response) {
            return res.status(404).json({ message: 'Response not found' });
        }
        res.json(response);
    } catch (error) {
        console.error('Error updating response', error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;