import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Star, ExternalLink, Mail } from 'lucide-react';

interface ReviewAnalyticsProps {
  animationConfig: any;
}

const ReviewAnalytics: React.FC<ReviewAnalyticsProps> = ({ animationConfig }) => {
  const [analytics, setAnalytics] = useState({
    websiteReviews: 45,
    googleReviews: 28,
    conversionRate: 62,
    averageRating: 4.8,
    emailsSent: 35,
    emailOpenRate: 78
  });

  const metrics = [
    {
      icon: Users,
      label: 'Website Reviews',
      value: analytics.websiteReviews,
      color: 'bg-blue-500',
      trend: '+12%'
    },
    {
      icon: ExternalLink,
      label: 'Google Reviews',
      value: analytics.googleReviews,
      color: 'bg-red-500',
      trend: '+8%'
    },
    {
      icon: TrendingUp,
      label: 'Conversion Rate',
      value: `${analytics.conversionRate}%`,
      color: 'bg-green-500',
      trend: '+5%'
    },
    {
      icon: Star,
      label: 'Average Rating',
      value: analytics.averageRating,
      color: 'bg-yellow-500',
      trend: '+0.2'
    },
    {
      icon: Mail,
      label: 'Emails Sent',
      value: analytics.emailsSent,
      color: 'bg-purple-500',
      trend: '+15%'
    },
    {
      icon: BarChart3,
      label: 'Email Open Rate',
      value: `${analytics.emailOpenRate}%`,
      color: 'bg-indigo-500',
      trend: '+3%'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: animationConfig.motionDuration,
            ease: animationConfig.motionEasing
          }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Review Analytics Dashboard</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track the performance of your review collection and Google My Business integration.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: animationConfig.motionDuration,
                  delay: index * animationConfig.motionStagger,
                  ease: animationConfig.motionEasing
                }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${metric.color} rounded-full p-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-600 text-sm font-semibold bg-green-100 px-2 py-1 rounded-full">
                    {metric.trend}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-1">{metric.value}</h3>
                <p className="text-gray-600 font-medium">{metric.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Review Funnel Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">Review Collection Funnel</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <span className="font-semibold text-blue-900">Website Visitors</span>
              <span className="text-2xl font-bold text-blue-600">1,250</span>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-blue-300"></div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <span className="font-semibold text-green-900">Website Reviews</span>
              <span className="text-2xl font-bold text-green-600">{analytics.websiteReviews}</span>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-green-300"></div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
              <span className="font-semibold text-purple-900">Email Reminders Sent</span>
              <span className="text-2xl font-bold text-purple-600">{analytics.emailsSent}</span>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-purple-300"></div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
              <span className="font-semibold text-red-900">Google Reviews</span>
              <span className="text-2xl font-bold text-red-600">{analytics.googleReviews}</span>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-blue-900">
              Conversion Rate: {analytics.conversionRate}% (Website → Google)
            </p>
            <p className="text-gray-600 mt-2">
              {analytics.googleReviews} out of {analytics.websiteReviews} website reviewers also left Google reviews
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewAnalytics;