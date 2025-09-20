import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Calculator, FileText, CheckCircle, ExternalLink, Info, DollarSign, Clock, Users } from 'lucide-react';

interface FinancePartner {
  id: string;
  name: string;
  logo: string;
  color: string;
  description: string;
  emiPlans: EMIPlan[];
  eligibility: string[];
  documents: string[];
  process: ProcessStep[];
  terms: string[];
  applyUrl: string;
  learnMoreUrl: string;
}

interface EMIPlan {
  tenure: string;
  interestRate: string;
  processingFee: string;
  minAmount: string;
  maxAmount: string;
  features: string[];
}

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface FinancePartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: FinancePartner | null;
  isDarkMode?: boolean;
}

const FinancePartnerModal: React.FC<FinancePartnerModalProps> = ({ 
  isOpen, 
  onClose, 
  partner,
  isDarkMode = false 
}) => {
  const [activeTab, setActiveTab] = useState('plans');
  const [loanAmount, setLoanAmount] = useState(50000);
  const [tenure, setTenure] = useState(12);
  const [calculatedEMI, setCalculatedEMI] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle escape key press and focus management
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
      
      // Focus management - focus close button when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Calculate EMI
  useEffect(() => {
    if (partner && loanAmount && tenure) {
      // Simple EMI calculation: P * r * (1 + r)^n / ((1 + r)^n - 1)
      const principal = loanAmount;
      const rate = 0.12 / 12; // Assuming 12% annual rate
      const months = tenure;
      
      const emi = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
      setCalculatedEMI(Math.round(emi));
    }
  }, [loanAmount, tenure, partner]);

  // Handle outside click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Keyboard navigation within modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  const tabs = [
    { id: 'plans', label: 'EMI Plans', icon: CreditCard },
    { id: 'eligibility', label: 'Eligibility', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'process', label: 'Process', icon: CheckCircle },
    { id: 'calculator', label: 'EMI Calculator', icon: Calculator }
  ];

  if (!isOpen || !partner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="finance-modal-title"
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className={`${partner.color} text-white p-6 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 rounded-full p-3">
                  <CreditCard className="w-8 h-8" />
                </div>
                <div>
                  <h2 id="finance-modal-title" className="text-2xl font-bold mb-1">
                    {partner.name}
                  </h2>
                  <p className="text-white/90">{partner.description}</p>
                </div>
              </div>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                aria-label="Close finance partner details"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? `${partner.color.replace('bg-', 'text-')} border-b-2 border-current`
                        : isDarkMode
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            {/* EMI Plans Tab */}
            {activeTab === 'plans' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Available EMI Plans
                </h3>
                <div className="grid gap-4">
                  {partner.emiPlans.map((plan, index) => (
                    <div
                      key={index}
                      className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-xl p-4 border`}
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                            {plan.tenure} Plan
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Interest Rate:</span>
                              <span className={`font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                {plan.interestRate}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Processing Fee:</span>
                              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                {plan.processingFee}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loan Range:</span>
                              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                {plan.minAmount} - {plan.maxAmount}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                            Key Features:
                          </h5>
                          <ul className="space-y-1">
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Eligibility Tab */}
            {activeTab === 'eligibility' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Eligibility Criteria
                </h3>
                <div className="grid gap-3">
                  {partner.eligibility.map((criteria, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {criteria}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Required Documents
                </h3>
                <div className="grid gap-3">
                  {partner.documents.map((document, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {document}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Process Tab */}
            {activeTab === 'process' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Application Process
                </h3>
                <div className="space-y-4">
                  {partner.process.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex gap-4">
                        <div className={`${partner.color} text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                            {step.title}
                          </h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EMI Calculator Tab */}
            {activeTab === 'calculator' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  EMI Calculator
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Loan Amount (₹)
                      </label>
                      <input
                        type="range"
                        min="10000"
                        max="500000"
                        step="5000"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>₹10,000</span>
                        <span className={`font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          ₹{loanAmount.toLocaleString()}
                        </span>
                        <span>₹5,00,000</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                        Tenure (Months)
                      </label>
                      <input
                        type="range"
                        min="6"
                        max="60"
                        step="6"
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>6 months</span>
                        <span className={`font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {tenure} months
                        </span>
                        <span>60 months</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-6`}>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                      EMI Breakdown
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Monthly EMI:</span>
                        <span className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          ₹{calculatedEMI.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Amount:</span>
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          ₹{(calculatedEMI * tenure).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Interest:</span>
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          ₹{((calculatedEMI * tenure) - loanAmount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} p-6`}>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-center sm:text-left">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Terms and conditions apply. Interest rates may vary.
                </p>
              </div>
              <div className="flex gap-3">
                <motion.a
                  href={partner.learnMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} px-6 py-3 rounded-xl font-semibold transition-all duration-300`}
                >
                  <Info className="w-5 h-5" />
                  Learn More
                </motion.a>
                <motion.a
                  href={partner.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 ${partner.color} text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  <ExternalLink className="w-5 h-5" />
                  Apply Now
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FinancePartnerModal;