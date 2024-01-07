import { Router, response } from 'express';
const router = Router();
import Story from '../models/Story.js';
import Step from '../models/Step.js';
import Response from '../models/Response.js';
import authMiddleware from '../routes/authMiddleware.js';


router.get('/', authMiddleware, async (req, res) => {
    try {
        const { userId, role, iat, exp } = req.user;
        let query = {};
        if (role !== 'admin') {
            query.user_id = userId;
            console.log("userId:", userId);
        }
            const stories = await Story.find(query).populate('step');
            console.log("🚀 ~ stories:", stories);
            res.json(stories);
        } catch (error) {
            console.error('Error: ', error);
            res.status(500).send(error);
        }
});


router.post('/check-intent', authMiddleware, async (req, res) => {
    const { intent } = req.body;

    try {
        const intents = await Response.find({
            intent
        });
        console.log("🚀 ~ intents:", intents);
        return res.status(200).json(
            {
                isValid: intents.length === 0
            }
        );
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Steps:', error);
        res.status(500).json(error);
    }
});


export default router;