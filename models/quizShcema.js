import mongoose from 'mongoose'

const optionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true, default: false }
});

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [optionSchema],
    explanation: { type: String } // Optional explanation for the answer
});

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String }, // e.g., 'Math', 'Science', etc.
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    questions: [questionSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update timestamps
quizSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Quiz = mongoose.model('Quiz', quizSchema);

export { Quiz }
