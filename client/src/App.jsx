import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { auditAPI } from './services/api'
import Layout from './components/Layout'
import AuditForm from './components/AuditForm'
import ResultsPage from './components/ResultsPage'
import PublicResults from './components/PublicResults'
import LandingPage from './components/LandingPage'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [auditResults, setAuditResults] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleAuditSuccess = async (results) => {
    console.log('🎯 [FRONTEND] Audit Success! Analysis Results:', results);
    setAuditResults(results);
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Automatically save the audit to get a shareable ID
    try {
      console.log('📤 [FRONTEND] Auto-saving audit to backend...');
      
      const payload = {
        toolsData: results,
        totalSavings: results.totalMonthlySavings,
        yearlySavings: results.totalYearlySavings,
        aiSummary: results.aiSummary
      };

      const response = await auditAPI.save(payload);
      
      if (response.data.success) {
        const savedId = response.data.id;
        console.log('✅ [FRONTEND] Audit saved! DB ID:', savedId);
        
        // Update results with the new ID for sharing features
        setAuditResults(prev => ({ ...prev, shareId: savedId }));
      }
      
    } catch (err) {
      console.error('❌ [FRONTEND] Failed to auto-save audit:', err.response?.data || err.message);
    }
  };

  const handleReset = () => {
    setAuditResults(null);
    setShowForm(false);
    navigate('/');
  };

  const handleStartAudit = () => {
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('audit-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={
          <div className="space-y-20 pb-20">
            {!auditResults && !showForm ? (
              <LandingPage onStartAudit={handleStartAudit} />
            ) : (
              <div id="audit-form-section" className="pt-32 px-4 max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                  {!auditResults ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-12"
                    >
                      <div className="text-center space-y-4 max-w-2xl mx-auto">
                        <div className="inline-block px-4 py-1.5 mb-4 text-xs font-black tracking-widest text-blue-600 uppercase bg-blue-100 rounded-full border border-blue-500/20">
                          AI Audit Suite
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                          Configure Your <span className="text-blue-500">Audit</span>
                        </h1>
                        <p className="text-slate-400 text-lg">
                          Fill in the details below to generate your personalized AI cost optimization report.
                        </p>
                      </div>
                      <AuditForm onResults={handleAuditSuccess} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <ResultsPage results={auditResults} onReset={handleReset} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        } />
        <Route path="/results/:id" element={<PublicResults />} />
      </Routes>
    </Layout>
  )
}

export default App
