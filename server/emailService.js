import nodemailer from 'nodemailer';

// Email service for sending GMB review reminders
export default class EmailService {
  constructor() {
    // Configure your email service (Gmail, SendGrid, etc.)
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // or your preferred email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendGMBReviewReminder(customerData) {
    const { to, customerName, gmbReviewLink, incentive } = customerData;
    
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank you for your review!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a, #10b981); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #ef4444, #f97316); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
          .discount-code { background: #10b981; color: white; padding: 15px; border-radius: 10px; text-align: center; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🙏 Thank You, ${customerName}!</h1>
            <p>We appreciate your review on our website</p>
          </div>
          
          <div class="content">
            <h2>Help Others Discover Us on Google!</h2>
            <p>Your positive experience means the world to us. Would you mind sharing it on Google Maps to help other customers find our store?</p>
            
            <div style="text-align: center;">
              <a href="${gmbReviewLink}" class="cta-button">
                ⭐ Leave Google Review
              </a>
            </div>
            
            <div class="discount-code">
              <h3>🎁 Special Thank You Gift</h3>
              <p>As a token of appreciation, here's your exclusive discount:</p>
              <h2>REVIEW10</h2>
              <p><strong>${incentive}</strong> on your next purchase</p>
            </div>
            
            <h3>Why Your Google Review Matters:</h3>
            <ul>
              <li>✅ Helps local customers find genuine products</li>
              <li>✅ Supports our small business growth</li>
              <li>✅ Takes less than 2 minutes</li>
              <li>✅ Makes a real difference in our community</li>
            </ul>
            
            <p><strong>Quick Steps:</strong></p>
            <ol>
              <li>Click the button above</li>
              <li>Sign in to your Google account</li>
              <li>Rate us and share your experience</li>
              <li>Use code REVIEW10 on your next visit!</li>
            </ol>
          </div>
          
          <div class="footer">
            <p>📍 Harvinder Telecom<br>
            Shop No. 15, Main Market, Sector 22, Chandigarh<br>
            📞 +91 98765 43210 | 💬 WhatsApp Available</p>
            
            <p><small>This email was sent because you recently left a review on our website. 
            If you don't want to receive these reminders, please let us know.</small></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Harvinder Telecom" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: '🌟 Thank you for your review! Help others discover us on Google',
      html: htmlTemplate
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('GMB reminder email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending GMB reminder email:', error);
      throw error;
    }
  }

  async sendFollowUpSequence(customerData) {
    // Send a follow-up email after 3 days if no Google review detected
    const followUpDelay = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
    
    setTimeout(async () => {
      try {
        await this.sendGMBReviewReminder({
          ...customerData,
          isFollowUp: true
        });
      } catch (error) {
        console.error('Error sending follow-up email:', error);
      }
    }, followUpDelay);
  }
}

module.exports = EmailService;