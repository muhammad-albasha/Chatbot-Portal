import { Router } from 'express';
const router = Router();
import User from '../models/User.js';
import authMiddleware from '../routes/authMiddleware.js';


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
            console.log("userId:", userId);
        }

        const users = await User.find(query);
        res.json(users);
        console.log("Users:", users);

    } catch (error) {
        console.error(`Error fetching users:`, error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/user/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { stories, ...userData } = req.body;

    try {
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
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});



export default router;