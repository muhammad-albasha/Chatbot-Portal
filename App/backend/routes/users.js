import e, { Router } from 'express';
const router = Router();
import User from '../models/User.js';
import Story from '../models/Story.js';
import authMiddleware from '../routes/authMiddleware.js';
import bcrypt from 'bcryptjs';


router.get('/', authMiddleware, async (req, res) => {
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

router.put('/user/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { password, ...userData } = req.body;

    try {
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            userData.pwd = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


router.post('/user', authMiddleware, async (req, res) => {
    const { _id, ...userData } = req.body;
    try {
        if (userData.password) {
            userData.pwd = await bcrypt.hash(userData.password, 10);
        }
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        res.json(savedUser);
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

export default router;