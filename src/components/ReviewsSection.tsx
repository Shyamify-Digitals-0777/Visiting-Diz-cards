import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageCircle, Copy, Send, User, ExternalLink, CheckCircle, Mail, Gift, QrCode, Share2 } from 'lucide-react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Review {
  id: number;
  name: string;
  rating: number;
  title: string;
  message: string;
  createdAt: string;
}

interface ReviewsSectionProps {
  animationConfig: any;
  isDarkMode?: boolean;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ animationConfig, isDarkMode = false }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    title: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedReviewId, setCopiedReviewId] = useState<number | null>(null);
  const [showGMBIncentive, setShowGMBIncentive] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [submittedReview, setSubmittedReview] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');

  // Mock reviews data (replace with API call in production)
  const mockReviews: Review[] = [
    {
      id: 1,
      name: "Rajesh Kumar",
      rating: 5,
      title: "Excellent Service & Genuine Products",
      message: "Bought Samsung Galaxy S24 from Harvinder Telecom. Best price in the market and completely genuine product. Highly recommended!",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Priya Sharma", 
      rating: 5,
      title: "Quick Service & Great Support",
      message: "Amazing experience! Got my iPhone 15 with best EMI options. The staff is very helpful and knowledgeable. Will definitely visit again.",
      createdAt: "2024-01-12"
    },
    {
      id: 3,
      name: "Amit Singh",
      rating: 4,
      title: "Good Quality Accessories",
      message: "Purchased phone case and screen protector. Good quality products at reasonable prices. Shop is well maintained and staff is friendly.",
      createdAt: "2024-01-10"
    }
  ];

  useEffect(() => {
    fetchReviews();
  }, []);

  // Load reviews from localStorage and merge with mock data
  const fetchReviews = async () => {
    try {
      // Get stored reviews from localStorage
      const storedReviews = localStorage.getItem('harvinder-telecom-reviews');
      let userReviews: Review[] = [];
      
      if (storedReviews) {
        try {
          userReviews = JSON.parse(storedReviews);
        } catch (error) {
          console.error('Error parsing stored reviews:', error);
          userReviews = [];
        }
      }
      
      // Merge user reviews with mock reviews (user reviews first)
      const allReviews = [...userReviews, ...mockReviews];
      setReviews(allReviews);
      
      // In production, you would also fetch from API:
      // const response = await axios.get('/api/reviews');
      // const apiReviews = response.data;
      // setReviews([...userReviews, ...apiReviews]);
      
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Fallback to mock data only
      setReviews(mockReviews);
    }
  };

  // Save review to localStorage
  const saveReviewToStorage = (review: Review) => {
    try {
      const storedReviews = localStorage.getItem('harvinder-telecom-reviews');
      let userReviews: Review[] = [];
      
      if (storedReviews) {
        userReviews = JSON.parse(storedReviews);
      }
      
      // Add new review to the beginning of the array
      userReviews.unshift(review);
      
      // Keep only the last 50 user reviews to prevent localStorage bloat
      if (userReviews.length > 50) {
        userReviews = userReviews.slice(0, 50);
      }
      
      localStorage.setItem('harvinder-telecom-reviews', JSON.stringify(userReviews));
    } catch (error) {
      console.error('Error saving review to localStorage:', error);
    }
  };
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {

      const newReview: Review = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };

      // Save to localStorage first
      saveReviewToStorage(newReview);
      
      // Update state to show immediately
      setReviews(prev => [newReview, ...prev]);
      setSubmittedReview(newReview);
      setReviewText(`${newReview.title}\n\n${newReview.message}`);
      setFormData({ name: '', rating: 5, title: '', message: '' });
      setShowForm(false);
      setShowConfirmationModal(true);
      
      // In production, also save to API:
      // try {
      //   const response = await axios.post('/api/reviews', newReview);
      //   console.log('Review saved to API:', response.data);
      // } catch (apiError) {
      //   console.error('Error saving to API:', apiError);
      //   // Review is still saved locally, so user experience isn't affected
      // }
      
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyReview = async (review: Review) => {
    const reviewText = `${review.title}\n\n${review.message}\n\nRating: ${review.rating}/5 stars`;
    
    try {
      await navigator.clipboard.writeText(reviewText);
      setCopiedReviewId(review.id);
      setTimeout(() => setCopiedReviewId(null), 2000);
    } catch (error) {
      console.error('Error copying review:', error);
    }
  };

  const handlePostToGoogle = () => {
    const googlePlaceId = import.meta.env.VITE_GOOGLE_PLACE_ID || 'ChIJN1t_tDeuEmsRUsoyG83frY4';
    console.log('GMB Place ID:', googlePlaceId); // Debug log
    const googleReviewUrl = `https://search.google.com/local/writereview?placeid=${googlePlaceId}`;
    console.log('GMB Review URL:', googleReviewUrl); // Debug log
    window.open(googleReviewUrl, '_blank');
  };

  const handleSendGMBReminder = async () => {
    if (!customerEmail) {
      alert('Please enter your email address');
      return;
    }

    try {
      // In production, this would send an email with GMB review link
      const emailData = {
        to: customerEmail,
        subject: 'Thank you for your review! Help others discover us on Google',
        template: 'gmb-review-reminder',
        data: {
          customerName: formData.name,
          businessName: 'Harvinder Telecom',
          gmbReviewLink: `https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4`,
          incentive: '10% discount on next purchase'
        }
      };

      // Simulate API call
      console.log('Sending GMB reminder email:', emailData);
      alert('Thank you! We\'ve sent you a reminder email with your Google review link and discount code.');
      setShowGMBIncentive(false);
      setCustomerEmail('');
      
    } catch (error) {
      console.error('Error sending reminder:', error);
      alert('Error sending reminder. Please try again.');
    }
  };

  const generateGMBQRCode = () => {
    const placeId = import.meta.env.VITE_GOOGLE_PLACE_ID || 'ChIJN1t_tDeuEmsRUsoyG83frY4';
    const gmbUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(gmbUrl)}`;
    return qrCodeUrl;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(reviewText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const openGoogleReview = () => {
    const placeId = import.meta.env.VITE_GOOGLE_PLACE_ID || 'ChIJN1t_tDeuEmsRUsoyG83frY4';
    console.log('Place ID:', placeId); // Debug log
    const googleReviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
    console.log('Google Review URL:', googleReviewUrl); // Debug log
    window.open(googleReviewUrl, '_blank');
  };

  const shareReview = async () => {
    const shareData = {
      title: 'Check out my review for Harvinder Telecom',
      text: reviewText,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 cursor-pointer transition-colors duration-200 ${
          index < rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300 hover:text-yellow-300'
        }`}
        onClick={() => interactive && onRatingChange && onRatingChange(index + 1)}
      />
    ));
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: animationConfig.motionDuration,
            ease: animationConfig.motionEasing
          }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-blue-900 dark:text-blue-400 mb-4">Customer Reviews</h2>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex">{renderStars(Math.floor(parseFloat(averageRating)))}</div>
            <span className="text-2xl font-bold text-blue-900 dark:text-blue-400">{averageRating}</span>
            <span className="text-gray-600 dark:text-gray-400">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            See what our satisfied customers have to say about their experience with us.
          </p>
          {reviews.length > 3 && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
              ✨ Including {reviews.filter(r => r.id > 1000).length} recent customer reviews
            </p>
          )}
        </motion.div>

        {/* Reviews Grid */}
        <div className="mb-12">
          {/* Desktop Grid */}
          <div className="hidden md:block">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {reviews
                  .slice(0, showAllReviews ? undefined : 6)
                  .map((review, index) => (
                    <ReviewCard 
                      key={review.id} 
                      review={review} 
                      index={index} 
                      animationConfig={animationConfig}
                      renderStars={renderStars}
                      handleCopyReview={handleCopyReview}
                      copiedReviewId={copiedReviewId}
                      isDarkMode={isDarkMode}
                    />
                  ))}
              </AnimatePresence>
            </div>
            
            {/* View More Button for Desktop */}
            {reviews.length > 6 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-8"
              >
                <motion.button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {showAllReviews ? 'View Less' : `View More Reviews (${reviews.length - 6} more)`}
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Mobile Slider - Keep existing mobile slider */}
          <div className="md:hidden">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1.1}
              centeredSlides={false}
              navigation={true}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                480: {
                  slidesPerView: 1.3,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 1.8,
                  spaceBetween: 20,
                },
              }}
              className="reviews-swiper"
            >
              {reviews.map((review, index) => (
                <SwiperSlide key={review.id}>
                  <ReviewCard 
                    review={review} 
                    index={index} 
                    animationConfig={animationConfig}
                    renderStars={renderStars}
                    handleCopyReview={handleCopyReview}
                    copiedReviewId={copiedReviewId}
                    isDarkMode={isDarkMode}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <motion.button
            onClick={() => setShowForm(!showForm)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 btn-large"
          >
            <MessageCircle className="w-5 h-5" />
            Write a Review
          </motion.button>

          <motion.button
            onClick={handlePostToGoogle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-300 btn-large"
          >
            <ExternalLink className="w-5 h-5" />
            Review on Google
          </motion.button>
        </motion.div>

        {/* GMB Incentive Modal */}
        <AnimatePresence>
          {showGMBIncentive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowGMBIncentive(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              >
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-green-600" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">
                    Thank You for Your Review!
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    Help others discover us on Google Maps and get <strong>10% off</strong> your next purchase!
                  </p>

                  <div className="space-y-4">
                    <motion.button
                      onClick={handlePostToGoogle}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Review on Google Now
                    </motion.button>

                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">Or get a reminder email:</p>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        />
                        <motion.button
                          onClick={handleSendGMBReminder}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1"
                        >
                          <Mail className="w-4 h-4" />
                          Send
                        </motion.button>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowGMBIncentive(false)}
                      className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
                    >
                      Maybe later
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Review Confirmation Modal */}
        <AnimatePresence>
          {showConfirmationModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowConfirmationModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Star className="w-8 h-8 text-green-600 fill-current" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
                  <p className="text-gray-600">Your review has been submitted successfully.</p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review:
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="mt-2 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={openGoogleReview}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-4 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2 font-bold text-lg shadow-lg"
                  >
                    <ExternalLink className="w-5 h-5" />
                    🚀 Post This Review on Google Now
                  </button>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800 text-center">
                      💡 <strong>Quick Tip:</strong> Copy your review text above, then click the Google button. 
                      Paste it directly into Google's review form!
                    </p>
                  </div>
                  
                  <button
                    onClick={shareReview}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Share2 className="w-5 h-5" />
                    Share Review
                  </button>

                  <button
                    onClick={() => {
                      setShowConfirmationModal(false);
                      setShowGMBIncentive(true);
                    }}
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Gift className="w-5 h-5" />
                    Get 10% Discount + Email Reminder
                  </button>
                </div>

                <div className="mt-4 bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-700 text-center">
                    <strong>How it works:</strong><br/>
                    1️⃣ Copy your review text above<br/>
                    2️⃣ Click "Post on Google Now"<br/>
                    3️⃣ Sign in to Google & paste your review<br/>
                    4️⃣ Submit to help others find us! 🌟
                  </p>
                </div>

                <p className="text-xs text-gray-500 text-center mt-2">
                  ⚡ This opens Google's official review page - we cannot post automatically for security reasons
                </p>

                <button
                  onClick={() => setShowConfirmationModal(false)}
                  className="w-full mt-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Review Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className={`bg-gradient-to-br ${isDarkMode ? 'from-gray-800 to-gray-700 border-gray-600' : 'from-blue-50 to-white border-blue-200'} rounded-3xl shadow-xl p-8 border`}
            >
              <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-900'} mb-6 text-center`}>Share Your Experience</h3>
              
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-900'} mb-2`}>Your Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-400' : 'border-blue-200 focus:border-blue-500'} focus:outline-none transition-colors duration-200`}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-900'} mb-2`}>Rating *</label>
                    <div className="flex items-center gap-1">
                      {renderStars(formData.rating, true, (rating) => 
                        setFormData(prev => ({ ...prev, rating }))
                      )}
                      <span className={`ml-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-900'} font-medium`}>({formData.rating}/5)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-900'} mb-2`}>Review Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-400' : 'border-blue-200 focus:border-blue-500'} focus:outline-none transition-colors duration-200`}
                    placeholder="Summarize your experience"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-900'} mb-2`}>Your Review *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    required
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-400' : 'border-blue-200 focus:border-blue-500'} focus:outline-none resize-none transition-colors duration-200`}
                    placeholder="Share your detailed experience with us..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <Send className="w-5 h-5" />
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => setShowForm(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-8 py-3 rounded-xl border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} font-semibold transition-all duration-300`}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google Reviews CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-2 gap-8 mt-12"
        >
          {/* Google Reviews CTA */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">🌟 Love Our Service?</h3>
            <p className="text-lg mb-6 text-white/90">
              Help others discover us by leaving a review on Google Maps! Your review makes a real difference.
            </p>
            
            <div className="bg-white/20 rounded-xl p-4 mb-6">
              <h4 className="font-bold mb-2">Why Your Google Review Matters:</h4>
              <div className="text-sm space-y-1">
                <p>✅ Helps local customers find genuine products</p>
                <p>✅ Supports our small business growth</p>
                <p>✅ Takes less than 2 minutes</p>
                <p>✅ Makes a real difference in our community</p>
              </div>
            </div>
            
            <motion.button
              onClick={handlePostToGoogle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              <ExternalLink className="w-5 h-5" />
              🚀 Review on Google Maps
            </motion.button>
          </div>

          {/* QR Code for Easy Access */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Quick Access</h3>
            <p className="text-lg mb-6 text-white/90">
              Scan this QR code to leave a Google review instantly!
            </p>
            <div className="bg-white rounded-xl p-4 inline-block mb-4">
              <img 
                src={generateGMBQRCode()} 
                alt="Google Review QR Code"
                className="w-32 h-32 mx-auto"
              />
            </div>
            <div className="flex items-center justify-center gap-2 text-white/90">
              <QrCode className="w-5 h-5" />
              <span className="text-sm">Scan with your phone camera</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Review Card Component
const ReviewCard: React.FC<{
  review: Review;
  index: number;
  animationConfig: any;
  renderStars: (rating: number) => JSX.Element[];
  handleCopyReview: (review: Review) => void;
  copiedReviewId: number | null;
  isDarkMode?: boolean;
}> = ({ review, index, animationConfig, renderStars, handleCopyReview, copiedReviewId, isDarkMode = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{
        duration: animationConfig.motionDuration,
        delay: index * animationConfig.motionStagger,
        ease: animationConfig.motionEasing
      }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className={`bg-gradient-to-br ${isDarkMode ? 'from-gray-800 to-gray-700 border-gray-600' : 'from-blue-50 to-white border-blue-100'} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 border h-full`}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className={`${isDarkMode ? 'bg-gray-600' : 'bg-blue-100'} rounded-full p-3 flex-shrink-0`}>
          <User className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-900'} truncate`}>{review.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">{renderStars(review.rating)}</div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{review.createdAt}</span>
          </div>
        </div>
      </div>

      <h5 className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} mb-2`}>{review.title}</h5>
      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm leading-relaxed mb-4 flex-grow`}>{review.message}</p>

      <div className="flex items-center gap-2 mt-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleCopyReview(review)}
          className={`flex items-center gap-2 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} text-sm font-medium transition-colors duration-200`}
        >
          {copiedReviewId === review.id ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ReviewsSection;