// models/Story.js
import { Schema, model } from 'mongoose';

const storySchema = Schema({
    _id: Schema.Types.ObjectId,
    story: String,
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    step: { type: Schema.Types.ObjectId, ref: 'Step'},
});

export default model('Story', storySchema);
