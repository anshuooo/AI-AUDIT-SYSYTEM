import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import ResultsPage from './ResultsPage';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PublicResults = () => {
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAudit = async () => {
      console.log('🔍 [PUBLIC RESULTS] Fetching audit with ID:', id);
      try {
        const response = await axios.get(`http://localhost:5000/api/audit/${id}`);
        console.log('📥 [PUBLIC RESULTS] Response received:', response.data);

        if (response.data.success && response.data.audit) {
          const audit = response.data.audit;
          console.log('✅ [PUBLIC RESULTS] Audit data:', audit);

          // Map the data correctly
          const mappedResults = {
            ...audit.toolsData, // Spread the full toolsData (includes breakdown, etc.)
            aiSummary: audit.aiSummary,
            totalMonthlySavings: audit.totalSavings, // Map back to expected field
            totalYearlySavings: audit.yearlySavings, // Map back to expected field
            shareId: id,
            isPublic: true
          };

          console.log('🔄 [PUBLIC RESULTS] Mapped results:', mappedResults);
          setResults(mappedResults);
        } else {
          console.error('❌ [PUBLIC RESULTS] Invalid response structure');
          setError('Invalid response from server');
        }
      } catch (err) {
        console.error('🔥 [PUBLIC RESULTS] Fetch error:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load audit report');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAudit();
    } else {
      console.error('❌ [PUBLIC RESULTS] No ID provided in URL');
      setError('Invalid audit ID');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-blue-500"
        >
          <Loader2 size={48} />
        </motion.div>
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-black text-white">Decrypting Analysis...</h2>
          <p className="text-slate-500 font-medium tracking-tight">Fetching secure audit results from server.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 p-4">
        <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-red-500/10 border border-red-500/20">
          <AlertCircle size={48} />
        </div>
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-4xl font-black text-white">Report Not Found</h2>
          <p className="text-slate-400 text-lg leading-relaxed">{error}</p>
        </div>
        <Link to="/" className="btn-primary py-4 px-10">
          Create New Audit
        </Link>
      </div>
    );
  }

  if (!results) {
    console.error('❌ [PUBLIC RESULTS] Results not set despite no error');
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 p-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-4xl font-black text-white">Unexpected Error</h2>
          <p className="text-slate-400 text-lg leading-relaxed">Unable to load audit data. Please try again.</p>
        </div>
        <Link to="/" className="btn-primary py-4 px-10">
          Create New Audit
        </Link>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/results/${id}`;
  const pageTitle = results?.aiSummary
    ? `AuditAI Report • $${results?.totalMonthlySavings || 0}/mo Savings`
    : 'AuditAI Public Audit Report';
  const pageDescription = results?.aiSummary
    ? results.aiSummary.slice(0, 155)
    : `Explore a public AI audit report with estimated annual savings of $${results?.totalYearlySavings || 0}.`; 
  const previewDescription = pageDescription || 'AI cost optimization insights and public audit findings.';

  return (
    <div className="pt-8 relative">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={previewDescription} />
        <meta name="robots" content="index,follow" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AuditAI" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={previewDescription} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:image" content={`${window.location.origin}/og-preview.png`} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={previewDescription} />
        <meta name="twitter:url" content={shareUrl} />
      </Helmet>

      {/* Floating Home Link */}
      <div className="sticky top-24 left-0 z-40 mb-12 flex justify-start pointer-events-none">
        <Link 
          to="/" 
          className="pointer-events-auto flex items-center gap-2 px-6 py-3 glass rounded-2xl text-slate-400 hover:text-white border border-slate-800/50 transition-all hover:translate-x-2"
        >
          <ArrowLeft size={18} />
          <span className="font-bold text-sm">Back to Home</span>
        </Link>
      </div>
      
      <ResultsPage results={results} onReset={() => window.location.href = '/'} isPublic={true} />
    </div>
  );
};

export default PublicResults;
