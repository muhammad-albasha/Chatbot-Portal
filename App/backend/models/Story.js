// models/Story.js
import { Schema, model } from 'mongoose';

const stepSchema = new Schema({
    _id : Schema.Types.ObjectId,
    intent: String,
    examples: [String],
    action: String,
    response_id: { type: Schema.Types.ObjectId, ref: 'Response' },
});

const storySchema = new Schema({
    _id : Schema.Types.ObjectId,
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    steps: [stepSchema]
});

export default model('Story', storySchema);
