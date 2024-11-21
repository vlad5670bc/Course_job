import mongoose from 'mongoose'


const postSchema = new mongoose.Schema({
    responsible_person: { type: String, required: true },
    rank: { type: String, required: true },  // Overall morale score (e.g., from 1 to 10)
        stressLevel: { type: Number, required: true }, // Stress level (e.g., from 1 to 10)
        serviceSatisfaction: { type: Number, required: true }, // Job satisfaction (e.g., from 1 to 10)
        workLifeBalance: { type: Number, required: true } // Work-life balance score (e.g., from 1 to 10)
}, {
    versionKey: false
});
export default postSchema