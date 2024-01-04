import { Router, response } from 'express';
const router = Router();
import Story from '../models/Story.js';
import Step from '../models/Step.js';
import Response from '../models/Response.js';
import authMiddleware from '../routes/authMiddleware.js';
import mongoose from 'mongoose';


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

router.put('/:storyId/:stepId', authMiddleware, async (req, res) => {
    const { storyId, stepId } = req.params;
    const { userId } = req.user;
    const stepUpdates = req.body;
    const newStep = req.body;
    const newResponse = req.body.response;
    try {
        const storyData = await Story.findById(storyId);
        const stepData = storyData.steps.id(stepId);
        const updatedResponse = await Response.findOneAndUpdate({ intent: newResponse.intent }, newResponse);
        storyData.steps = storyData.steps.map((step) => {
            return step._id == stepId ? newStep : step;
        });
        const updatedStory = await Story.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(storyId) }, storyData);

        if(updatedStory){
            res.status(200).json({ message: 'Step erfolgreich aktualisiert', step: updatedStory });
        } else {
            res.status(404).json({ message: 'Step nicht gefunden' });
        }
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Steps:', error);
        res.status(500).json({ message: 'Serverfehler' });
    }
});

router.put('/steps/:stepId', authMiddleware, async (req, res) => {
    const { stepId } = req.params;
    console.log("🚀 ~ stepId:", stepId);
    const { userId } = req.user;
    const stepUpdates = req.body;
    const { response } = req.body;

    try {
        const stepData = await Step.findById(stepId);
        console.log("🚀 ~ story:", stepData);
        const updateResponse = await Response.findOneAndUpdate({ intent: response.intent }, response
            // , { upsert: true, new: true }
        );
        console.log("🚀 ~ updateResponse:", updateResponse);
        if (!stepData) {
            return res.status(404).json({ message: 'Story nicht gefunden oder Zugriff verweigert' });
        }

        const step = stepData.steps.id(stepId);
        if (!stepData) {
            return res.status(404).json({ message: 'Step nicht gefunden' });
        }

        if (stepData) {
            Object.assign(stepData, stepUpdates);
            await stepData.save();
            console.log("Step:", stepData);
            res.status(200).json({ message: 'Step erfolgreich aktualisiert', step: stepData });
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
        const response = await Response.find({
            intent
        });
        console.log("🚀 ~ response:", response);
        console.log("🚀 ~ intent:", intent);
        if (res.status(200)) {

            res.json(response.length > 0 ? response[0] : {});
            console.log("response:", response);
        }

    } catch (error) {
        console.error('Fehler beim Aktualisieren des Steps:', error);
        res.status(500).json(error);
    }
});




export default router;