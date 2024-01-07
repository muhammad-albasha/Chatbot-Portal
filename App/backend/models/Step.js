// models/Step.js
import { Schema, model } from 'mongoose';

const stepSchema = Schema({
    _id: Schema.Types.ObjectId,
    intent: String,
    examples: [String],
    action: String,
    response_id: { type: Schema.Types.ObjectId, ref: 'Response'},
    story_id: { type: Schema.Types.ObjectId, ref: 'Story'}
});

export default model('Step', stepSchema);
