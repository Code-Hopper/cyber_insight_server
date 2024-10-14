import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    instructor: {
        type: String, // The instructor name or ID
        required: true
    },
    thumbnail: {
        type: String, // The filename or path to the thumbnail image
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const courseModel = mongoose.model('Course', courseSchema);

export { courseModel };