import { Router } from 'express';
const router = Router();
import Story from '../models/Story';
import authMiddleware from '../path/to/authMiddleware';

router.get('/', authMiddleware, async (req, res) => {
    try {
        const { userId, role } = req.query;
        let query = {};
        if (role !== 'admin') {
            query.user_id = userId;
        }

        const stories = await Story.find(query);
        res.json(stories);
        console.log("Stories:", stories);
    } catch (error) {
        console.error(`Error fetching stories:`, error);
        res.status(500).send('Internal Server Error');
    }
});