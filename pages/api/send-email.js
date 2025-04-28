import emailjs from '@emailjs/browser';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formData, formType } = req.body;

    // Validate required fields based on form type
    if (!formData) {
      return res.status(400).json({ error: 'Form data is required' });
    }

    // Configure EmailJS parameters
    const serviceId = 'service_4mvgv76'; // The service ID provided
    const recipientEmail = 'necibnexus@gmail.com'; // The destination email
    
    // Choose template based on form type
    let templateId;
    let templateParams;

    if (formType === 'contact') {
      templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'default_contact_template';
      templateParams = {
        to_email: recipientEmail,
        from_name: formData.name || 'Unknown',
        from_email: formData.email || 'No email provided',
        subject: formData.subject || 'Contact Form Submission',
        message: formData.message || 'No message provided',
      };
    } else if (formType === 'join-club') {
      templateId = process.env.NEXT_PUBLIC_EMAILJS_CLUB_TEMPLATE_ID || 'default_club_template';
      templateParams = {
        to_email: recipientEmail,
        from_name: formData.name || 'Unknown',
        company_email: formData.email || 'No email provided',
        business_goals: formData.message || 'No goals provided',
      };
    } else {
      return res.status(400).json({ error: 'Invalid form type' });
    }

    // Send email via EmailJS
    await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_USER_ID
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
} 