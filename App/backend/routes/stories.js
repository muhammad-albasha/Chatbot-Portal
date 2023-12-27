import { Router } from 'express';
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

        const stories = await Story.find(query);
        res.json(stories);
        console.log("Stories:", stories);
    } catch (error) {
        console.error(`Error fetching stories:`, error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/steps/:stepId', authMiddleware, async (req, res) => {
    const { stepId } = req.params;
    const { userId } = req.user;
    const stepUpdates = req.body;

    try {
        // Finden der Story, die den zu aktualisierenden Step enthält
        const story = await Story.findOne({ 'steps._id': stepId, user_id: userId });

        if (!story) {
            return res.status(404).json({ message: 'Story nicht gefunden oder Zugriff verweigert' });
        }

        // Aktualisieren des Steps innerhalb der Story
        const step = story.steps.id(stepId);
        if (!step) {
            return res.status(404).json({ message: 'Step nicht gefunden' });
        }

        if (step) {

            Object.assign(step, stepUpdates);
            await story.save();
            console.log("Step:", step);
            res.status(200).json({ message: 'Step erfolgreich aktualisiert', step });
        }
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Steps:', error);
        res.status(500).json({ message: 'Serverfehler' });
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


router.get('/response/:intent', authMiddleware, async (req, res) => {
    const { intent } = req.params;
    try {
        const response = await Response.findOne({ intent });
        if (!response) {
            return res.status(404).json({ message: 'Response nicht gefunden' });
        }
        res.json(response);
    } catch (error) {
        console.error('Fehler beim Abrufen der Response:', error);
        res.status(500).json({ message: 'Serverfehler' });
    }
});

export default router;