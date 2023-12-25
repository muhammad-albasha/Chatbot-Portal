// models/Response.js
import { Schema, model } from 'mongoose';

const responseSchema = new Schema({
    intent: { type: String, required: true },
    text: { type: String, required: true },
    images: [String],
    attachments: [String]
});

export default model('Response', responseSchema);
