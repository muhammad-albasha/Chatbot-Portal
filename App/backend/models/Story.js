// models/Story.js
import { Schema, model } from 'mongoose';

const stepSchema = new Schema({
    intent: String,
    examples: [String],
    action: String
});

const storySchema = new Schema({
    user_id: Schema.Types.ObjectId,
    name: String,
    steps: [stepSchema]
});

export default model('Story', storySchema);
