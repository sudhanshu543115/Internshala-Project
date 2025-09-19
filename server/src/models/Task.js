import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String, default: '' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batchId: { type: String, index: true },
    status: { type: String, enum: ['pending', 'in_progress', 'done'], default: 'pending' }
  },
  { timestamps: true }
);

export const Task = mongoose.model('Task', taskSchema);
