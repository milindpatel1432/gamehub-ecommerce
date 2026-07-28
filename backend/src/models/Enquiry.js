import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    formName: {
      type: String,
      required: true,
      default: 'Contact Form',
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Sender email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    subject: {
      type: String,
      default: '',
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
    },
    pageUrl: {
      type: String,
      default: '',
    },
    userIp: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailMessageId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);

export default Enquiry;
