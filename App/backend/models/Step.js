// models/Step.js
import { Schema, model } from 'mongoose';

const stepSchema = Schema({
    _id: Schema.Types.ObjectId,
    intent: { type: String, required: true },
    examples: [String],
    action: String,
    text: { type: String, required: true },
    images: [String],
    attachments: [String],
});

export default model('Step', stepSchema);
