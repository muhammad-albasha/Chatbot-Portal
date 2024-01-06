// models/Response.js
import { Schema, model } from 'mongoose';

const responseSchema = new Schema({
    _id : Schema.Types.ObjectId,
    intent: { type: String, required: true },
    text: { type: String, required: true },
    images: [String],
    attachments: [String],
    step_id: { type: Schema.Types.ObjectId, ref: 'Step' },
});

export default model('Response', responseSchema);
