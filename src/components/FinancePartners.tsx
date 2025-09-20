import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Percent, Clock, CheckCircle, FileText, Users } from 'lucide-react';
import FinancePartnerModal from './FinancePartnerModal';

interface FinancePartnersProps {
  animationConfig: any;
}

const FinancePartners: React.FC<FinancePartnersProps> = ({ animationConfig }) => {
  const [selectedPartner, setSelectedPartner] = React.useState<any>(null);
  const [showModal, setShowModal] = React.useState(false);

  const financePartners = [
    { 
      id: 'bajaj-finserv',
      name: 'Bajaj Finserv', 
      offer: '0% EMI up to 24 months', 
      color: 'bg-blue-600',
      logo: '/api/placeholder/100/50',
      description: 'Leading financial services company offering flexible EMI solutions',
      emiPlans: [
        {
          tenure: '6-12 Months',
          interestRate: '0% - 12%',
          processingFee: '₹199 - ₹999',
          minAmount: '₹5,000',
          maxAmount: '₹4,00,000',
          features: ['Instant approval', 'No hidden charges', 'Flexible repayment']
        },
        {
          tenure: '13-24 Months',
          interestRate: '12% - 18%',
          processingFee: '₹499 - ₹1,999',
          minAmount: '₹10,000',
          maxAmount: '₹5,00,000',
          features: ['Extended tenure', 'Competitive rates', 'Easy documentation']
        }
      ],
      eligibility: [
        'Age: 21-65 years',
        'Minimum monthly income: ₹15,000',
        'Employment: Salaried or Self-employed',
        'Credit score: 650 and above',
        'Valid bank account and PAN card'
      ],
      documents: [
        'PAN Card',
        'Aadhaar Card',
        'Salary slips (last 3 months)',
        'Bank statements (last 6 months)',
        'Employment certificate',
        'Passport size photographs'
      ],
      process: [
        {
          step: 1,
          title: 'Apply Online',
          description: 'Fill the online application form with basic details',
          icon: FileText
        },
        {
          step: 2,
          title: 'Document Verification',
          description: 'Upload required documents for verification',
          icon: CheckCircle
        },
        {
          step: 3,
          title: 'Approval',
          description: 'Get instant approval based on eligibility',
          icon: Users
        },
        {
          step: 4,
          title: 'Purchase',
          description: 'Complete your purchase with EMI facility',
          icon: CreditCard
        }
      ],
      terms: [
        'Interest rates are subject to change',
        'Processing fees are non-refundable',
        'Late payment charges may apply',
        'Terms and conditions apply'
      ],
      applyUrl: 'https://www.bajajfinserv.in/apply-personal-loan-online',
      learnMoreUrl: 'https://www.bajajfinserv.in/personal-loan'
    },
    { 
      id: 'hdfc-bank',
      name: 'HDFC Bank', 
      offer: '12 months no cost EMI', 
      color: 'bg-red-600',
      logo: '/api/placeholder/100/50',
      description: 'India\'s leading private sector bank with attractive EMI options',
      emiPlans: [
        {
          tenure: '3-12 Months',
          interestRate: '0% - 14%',
          processingFee: '₹299 - ₹1,499',
          minAmount: '₹3,000',
          maxAmount: '₹3,00,000',
          features: ['No cost EMI available', 'Quick processing', 'Reward points']
        }
      ],
      eligibility: [
        'Age: 21-60 years',
        'Minimum monthly income: ₹20,000',
        'HDFC Bank account holder (preferred)',
        'Good credit history',
        'Valid identity and address proof'
      ],
      documents: [
        'PAN Card',
        'Aadhaar Card',
        'Income proof',
        'Bank statements',
        'Address proof'
      ],
      process: [
        {
          step: 1,
          title: 'Check Eligibility',
          description: 'Verify your eligibility for EMI facility',
          icon: Users
        },
        {
          step: 2,
          title: 'Submit Application',
          description: 'Complete the application with required documents',
          icon: FileText
        },
        {
          step: 3,
          title: 'Instant Approval',
          description: 'Get approval within minutes',
          icon: CheckCircle
        },
        {
          step: 4,
          title: 'Shop & Pay',
          description: 'Use your EMI facility for purchases',
          icon: CreditCard
        }
      ],
      terms: [
        'Subject to bank\'s terms and conditions',
        'Interest rates as per bank policy',
        'Charges applicable as per schedule'
      ],
      applyUrl: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards/instant-emi',
      learnMoreUrl: 'https://www.hdfcbank.com/personal/pay/cards/credit-cards'
    }
  ];

  const emiFeatures = [
    { icon: Percent, title: '0% Interest', description: 'No additional charges on select EMIs' },
    { icon: Clock, title: 'Quick Approval', description: 'Instant approval in minutes' },
    { icon: CheckCircle, title: 'Easy Process', description: 'Simple documentation required' },
    { icon: CreditCard, title: 'Multiple Options', description: 'Various EMI tenure options' }
  ];

  const handlePartnerClick = (partner: any) => {
    setSelectedPartner(partner);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPartner(null);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
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
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Finance Partners</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Make your dream purchase affordable with our flexible EMI options from trusted financial partners.
          </p>
        </motion.div>

        {/* Finance Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {financePartners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: animationConfig.motionDuration,
                delay: index * 0.1,
                ease: animationConfig.motionEasing
              }}
              whileHover={{
                scale: animationConfig.hoverScale,
                transition: { duration: 0.3 }
              }}
              className={`${partner.color} rounded-xl md:rounded-2xl p-4 md:p-6 text-white relative overflow-hidden group cursor-pointer hover-lift min-h-[120px] md:min-h-[140px] flex flex-col justify-center`}
              onClick={() => handlePartnerClick(partner)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="relative z-10 text-center">
                <div className="bg-white/20 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2">{partner.name}</h3>
                <p className="text-xs md:text-sm text-white/90 font-medium leading-tight">{partner.offer}</p>
              </div>
              
              {/* Animated background effect */}
              <motion.div
                className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* EMI Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: animationConfig.motionDuration,
            delay: 0.6,
            ease: animationConfig.motionEasing
          }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
        >
          <h3 className="text-3xl font-bold text-blue-900 text-center mb-8">EMI Benefits</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emiFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: animationConfig.motionEasing
                  }}
                  className="text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="bg-gradient-to-br from-blue-500 to-green-500 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow duration-300"
                  >
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </motion.div>
                  <h4 className="text-base md:text-lg font-bold text-blue-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: animationConfig.motionDuration,
              delay: 0.8,
              ease: animationConfig.motionEasing
            }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 text-white">
              <h4 className="text-2xl font-bold mb-4">Ready to Purchase?</h4>
              <p className="text-lg mb-6">Get instant EMI approval and take home your favorite device today!</p>
              <motion.a
                href="https://wa.me/919876543210?text=Hi! I'm interested in EMI options for mobile purchase"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300"
              >
                Check EMI Options
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        {/* Finance Partner Modal */}
        <FinancePartnerModal
          isOpen={showModal}
          onClose={handleCloseModal}
          partner={selectedPartner}
        />
      </div>
    </section>
  );
};

export default FinancePartners;