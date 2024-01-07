import { Router, response } from 'express';
const router = Router();
import Story from '../models/Story.js';
import Step from '../models/Step.js';
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
            const stories = await Story.find(query).populate('steps');
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

// Route to add a new step
router.post('/steps', async (req, res) => {
    try {
        const { storyId, intent, examples, action, text, images, attachments } = req.body;

        // Create a new step
        const newStep = new Step({
            _id: new mongoose.Types.ObjectId(),
            intent,
            examples,
            action,
            text,
            images,
            attachments
        });

        // Save the new step
        await newStep.save();

        // Find the story and update it by pushing the new step's ID into its steps array
        await Story.findByIdAndUpdate(storyId, { $push: { steps: newStep._id } });

        res.status(201).json(newStep);
    } catch (error) {
        console.error('Error adding new step:', error);
        res.status(500).send(error);
    }
});

// // POST eine neue Story
// router.post('/', authMiddleware, async (req, res) => {
//     try {
//         const newStory = new Story({ ...req.body });
//         await newStory.save();
//         res.status(201).json(newStory);
//     } catch (error) {
//         console.error('Error creating story', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // PUT eine bestehende Story aktualisieren
// router.put('/:storyId', authMiddleware, async (req, res) => {
//     try {
//         const storyId = req.params.storyId;
//         const story = await Story.findByIdAndUpdate(storyId, req.body, { new: true });
//         if (!story) {
//             return res.status(404).json({ message: 'Story not found' });
//         }
//         res.json(story);
//     } catch (error) {
//         console.error('Error updating story', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// POST einen neuen Step
// router.post('/:storyId/steps', authMiddleware, async (req, res) => {
//     try {
//         const { storyId } = req.params;
//         if (!storyId) {
//             return res.status(400).json({ message: 'Story ID is missing' });
//         }

//         const newStep = new Step({
//             ...req.body,
//             story: storyId
//         });
//         await newStep.save();

//         await Story.findByIdAndUpdate(storyId, { $push: { steps: newStep._id } });

//         res.status(201).json(newStep);
//     } catch (error) {
//         console.error('Error creating step', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });


// // PUT einen bestehenden Step aktualisieren
// router.put('/:storyId/steps/:stepId', authMiddleware, async (req, res) => {
//     try {
//         const stepId = req.params.stepId;
//         const step = await Step.findByIdAndUpdate(stepId, req.body, { new: true });
//         if (!step) {
//             return res.status(404).json({ message: 'Step not found' });
//         }
//         res.json(step);
//     } catch (error) {
//         console.error('Error updating step', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

export default router;