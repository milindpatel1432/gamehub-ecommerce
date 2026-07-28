import Enquiry from '../models/Enquiry.js';
import { sendFormSubmissionEmail } from '../services/emailService.js';

/**
 * @desc    Submit a form (Contact, Career, Newsletter, Enquiry, Feedback)
 * @route   POST /api/v1/enquiry
 * @access  Public
 */
export const submitEnquiry = async (req, res) => {
  try {
    const {
      formName = 'Contact Form',
      name,
      email,
      phone = '',
      subject = '',
      message,
      pageUrl = '',
    } = req.body;

    // Basic Input Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required.',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.',
      });
    }

    if (formName !== 'Newsletter Subscription' && (!message || !message.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required.',
      });
    }

    // Capture User Info
    const userIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    // 1. Save Enquiry to Database
    const newEnquiry = await Enquiry.create({
      formName: formName.trim(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject ? subject.trim() : '',
      message: message ? message.trim() : (formName === 'Newsletter Subscription' ? 'Subscribed to newsletter list.' : ''),
      pageUrl,
      userIp,
      userAgent,
    });

    // 2. Trigger Email Notification to Admin (milindpatel1432@gmail.com)
    const emailResult = await sendFormSubmissionEmail({
      formName: newEnquiry.formName,
      name: newEnquiry.name,
      email: newEnquiry.email,
      phone: newEnquiry.phone,
      subject: newEnquiry.subject,
      message: newEnquiry.message,
      pageUrl: newEnquiry.pageUrl,
      userIp: newEnquiry.userIp,
      userAgent: newEnquiry.userAgent,
      createdAt: newEnquiry.createdAt ? newEnquiry.createdAt.toLocaleString() : new Date().toLocaleString(),
    });

    // Update DB record with email result
    if (emailResult.success) {
      newEnquiry.emailSent = true;
      newEnquiry.emailMessageId = emailResult.messageId;
      await newEnquiry.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully.',
      data: {
        id: newEnquiry._id,
        formName: newEnquiry.formName,
        createdAt: newEnquiry.createdAt,
      },
    });
  } catch (error) {
    console.error('[EnquiryController] Error handling enquiry submission:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error submitting enquiry form.',
    });
  }
};

/**
 * @desc    Get all enquiries (Admin Dashboard)
 * @route   GET /api/v1/enquiry
 * @access  Private/Admin
 */
export const getAllEnquiries = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Enquiry.countDocuments();
    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: enquiries,
    });
  } catch (error) {
    console.error('[EnquiryController] Error fetching enquiries:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries.',
    });
  }
};
