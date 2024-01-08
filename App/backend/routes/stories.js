import { Router, response } from 'express';
const router = Router();
import Story from '../models/Story.js';
import Step from '../models/Step.js';
import User from '../models/User.js';
import authMiddleware from '../routes/authMiddleware.js';
import mongoose from 'mongoose';


router.get('/', authMiddleware, async (req, res) => {
    try {
        const { userId, role } = req.user;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Benutzer nicht gefunden' });
        }

        let stories;
        if (role === 'admin') {
            stories = await Story.find().populate('steps');
        } else {
            stories = await Story.find({ '_id': { $in: user.stories } }).populate('steps');
        }

        console.log("🚀 ~ stories:", stories);
        res.json(stories);
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).send(error);
    }
});

// Route zum checken, ob ein Intent bereits verwendet wird
router.post('/check-intent', authMiddleware, async (req, res) => {
    const { intent } = req.body;

    try {
        const intents = await Step.find({
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

// Route zum Erstellen einer neuen step
router.post('/steps', authMiddleware, async (req, res) => {
    try {
        const { storyId, intent, examples, action, text, images, attachments } = req.body;

        // erstelle ein neues Step-Objekt
        const newStep = new Step({
            _id: new mongoose.Types.ObjectId(),
            intent,
            examples,
            action,
            text,
            images,
            attachments
        });

        // Speichere das neue Step-Objekt in der Datenbank
        await newStep.save();

        // Finde die Story mit der ID storyId und füge die ID des neuen Steps in das Array steps ein
        await Story.findByIdAndUpdate(storyId, { $push: { steps: newStep._id } });

        res.status(201).json(newStep);
    } catch (error) {
        console.error('Error adding new step:', error);
        res.status(500).send(error);
    }
});

// Route zum Aktualisieren eines Steps
router.put('/steps/:stepId', authMiddleware, async (req, res) => {
    try {
        const { stepId } = req.params;
        const updateData = req.body;

        // Update die Step-Daten
        const updatedStep = await Step.findByIdAndUpdate(stepId, updateData, { new: true });

        if (!updatedStep) {
            return res.status(404).send('Step not found');
        }

        res.status(200).json(updatedStep);
    } catch (error) {
        console.error('Error updating step:', error);
        res.status(500).send(error);
    }
});
export default router;