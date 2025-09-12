import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import EmailService from './emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Initialize email service
const emailService = new EmailService();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory (one level up from server directory)
app.use(express.static(path.join(__dirname, '..', 'dist')));

// API Routes
app.post('/api/send-review-reminder', async (req, res) => {
  try {
    const { email, customerName, businessName, reviewLink } = req.body;
    
    await emailService.sendReviewReminder(email, customerName, businessName, reviewLink);
    
    res.json({ success: true, message: 'Review reminder sent successfully' });
  } catch (error) {
    console.error('Error sending review reminder:', error);
    res.status(500).json({ success: false, message: 'Failed to send review reminder' });
  }
});

app.post('/api/send-review-incentive', async (req, res) => {
  try {
    const { email, customerName, discountCode, reviewLink } = req.body;
    
    await emailService.sendReviewIncentive(email, customerName, discountCode, reviewLink);
    
    res.json({ success: true, message: 'Review incentive sent successfully' });
  } catch (error) {
    console.error('Error sending review incentive:', error);
    res.status(500).json({ success: false, message: 'Failed to send review incentive' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve React app for all other routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});