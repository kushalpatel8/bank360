import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFollowUp extends Document {
  customerId: mongoose.Types.ObjectId;
  clientNum: number;
  assignedTo: string;
  assignedBy: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  title: string;
  notes?: string;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const FollowUpSchema = new Schema<IFollowUp>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    clientNum: { type: Number, required: true, index: true },
    assignedTo: { type: String, required: true },
    assignedBy: { type: String, required: true },
    dueDate: { type: Date, required: true },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    title: { type: String, required: true },
    notes: { type: String },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
    collection: 'followups',
  }
);

const FollowUp: Model<IFollowUp> =
  mongoose.models.FollowUp || mongoose.model<IFollowUp>('FollowUp', FollowUpSchema);

export default FollowUp;
