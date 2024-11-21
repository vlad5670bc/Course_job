// TestScheme.js
import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
    cadetName: { type: String, required: true },
    results: { type: Number, default: 0 },
}, {
    versionKey: false
});

export default mongoose.model('result', testSchema); // Make sure the first argument is the model name and not a string object
