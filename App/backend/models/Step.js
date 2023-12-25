// models/Step.js
import { Schema, model } from 'mongoose';

const stepSchema = new Schema({
    intent: String,
    examples: [String],
    action: String
});

export default model('Step', stepSchema);
