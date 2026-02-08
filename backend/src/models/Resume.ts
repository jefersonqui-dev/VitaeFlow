import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  personalDetails: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>;
  skills: Array<{
    name: string;
    level: number;
  }>;
}

const ResumeSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Resume' },
  personalDetails: {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    summary: { type: String, default: '' },
    profilePicture: { type: String, default: '' }, // New Field
  },
  experience: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    startDate: String,
    endDate: String
  }],
  skills: [{
    name: String,
    level: Number
  }]
}, { timestamps: true });

export default mongoose.model<IResume>('Resume', ResumeSchema);
