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

export default router;