import e, { Router } from 'express';
const router = Router();
import User from '../models/User.js';
import Story from '../models/Story.js';
import authMiddleware from '../routes/authMiddleware.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';


router.get('/', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Zugriff verweigert' });
      }
    try {
        const { name, userId, username, email, role, has2FA, secret, active} = req.user;
        let query = {};
        if (role !== 'admin') {
            query.user_id = userId;
            query.name = name;
            query.username = username;
            query.email = email;
            query.has2FA = has2FA;
            query.secret = secret;
            query.active = active;
            // console.log("userId:", userId);
        }

        const users = await User.find(query);
        res.json(users);
        // console.log("Users:", users);

    } catch (error) {
        console.error(`Error fetching users:`, error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/story', authMiddleware, async (req, res) => {
    try {
        const { story } = req.body;

        const newStory = new Story({
            _id: new mongoose.Types.ObjectId(),
            story,
            steps: [],
        });

        await newStory.save();

        res.status(201).json(newStory);
    } catch (error) {
        console.error('Error adding new story:', error);
        res.status(500).send(error);
    }
});

router.put('/user/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { password, ...userData } = req.body;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Zugriff verweigert' });
    }

    try {
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            userData.pwd = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.post('/user', authMiddleware, async (req, res) => {
    const { ...userData } = req.body;
    try {
        if (userData.password) {
            userData.pwd = await bcrypt.hash(userData.password, 10);
        }
        const newUser = new User(userData);
        await newUser.save();
        res.json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


router.get('/:userId/stories', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Assuming 'stories' field in User model contains an array of Story IDs
        const stories = await Story.find({ '_id': { $in: user.stories } });
        console.log("user_stories:", stories);

        res.json(stories);
    } catch (error) {
        console.error('Error fetching user stories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/:userId/stories', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.userId;
        const updateData = req.body;

        // Validierung der updateData kann hier hinzugefügt werden

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;