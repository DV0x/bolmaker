'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, X, Sparkles } from 'lucide-react';
import { ProcessingStep } from '@/types/bol';

interface ProcessingStatusProps {
  steps: ProcessingStep[];
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ steps }) => {
  const completedSteps = steps.filter(step => step.status === 'complete').length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        
        <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
          Processing Your Documents
        </h2>
        <p className="text-blue-200/80 text-lg max-w-md mx-auto">
          Our AI is analyzing your documents and generating your Bill of Lading
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-blue-200/60">Progress</span>
          <span className="text-sm text-blue-200/80 font-medium">{completedSteps}/{totalSteps} steps</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-50 animate-pulse"></div>
          </motion.div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="relative"
          >
            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-16 w-0.5 h-8 bg-white/20"></div>
            )}
            
            <div className="flex items-start space-x-6">
              {/* Status Icon */}
              <div className="flex-shrink-0 relative">
                {step.status === 'complete' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/25"
                  >
                    <Check className="w-6 h-6 text-white" />
                  </motion.div>
                )}
                
                {step.status === 'processing' && (
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25 relative">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-ping opacity-25"></div>
                  </div>
                )}
                
                {step.status === 'error' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/25"
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.div>
                )}
                
                {step.status === 'pending' && (
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"></div>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 pt-2">
                <motion.div
                  className={`rounded-2xl p-6 backdrop-blur-sm border transition-all duration-500 ${
                    step.status === 'complete' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/10' :
                    step.status === 'processing' 
                      ? 'bg-blue-500/20 border-blue-500/40 shadow-lg shadow-blue-500/20' :
                    step.status === 'error' 
                      ? 'bg-red-500/10 border-red-500/30 shadow-lg shadow-red-500/10' :
                      'bg-white/5 border-white/10'
                  }`}
                  initial={{ opacity: 0.7 }}
                  animate={{ 
                    opacity: step.status === 'processing' ? [0.7, 1, 0.7] : 1,
                  }}
                  transition={{ 
                    duration: step.status === 'processing' ? 2 : 0,
                    repeat: step.status === 'processing' ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <h3 className={`font-semibold text-lg mb-1 ${
                    step.status === 'complete' ? 'text-emerald-100' :
                    step.status === 'processing' ? 'text-blue-100' :
                    step.status === 'error' ? 'text-red-100' :
                    'text-white/60'
                  }`}>
                    {step.label}
                  </h3>
                  
                  {step.status === 'processing' && (
                    <p className="text-blue-200/70 text-sm">
                      This may take a few moments...
                    </p>
                  )}
                  
                  {step.status === 'complete' && (
                    <p className="text-emerald-200/70 text-sm">
                      Completed successfully
                    </p>
                  )}
                  
                  {step.status === 'error' && (
                    <p className="text-red-200/70 text-sm">
                      An error occurred during this step
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completion Message */}
      {completedSteps === totalSteps && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mb-6 shadow-2xl shadow-emerald-500/30">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-100 mb-2">
            Processing Complete!
          </h3>
          <p className="text-emerald-200/70">
            Your Bill of Lading has been generated and will download shortly.
          </p>
        </motion.div>
      )}
    </div>
  );
};