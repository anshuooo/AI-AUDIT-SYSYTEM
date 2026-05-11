import React, { useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import { 
  TrendingDown, 
  Sparkles, 
  Share2, 
  RotateCcw, 
  Download, 
  ChevronRight, 
  AlertTriangle,
  Zap,
  Target,
  FileText,
  Copy,
  CheckCircle2,
  BarChart3,
  Table
} from 'lucide-react';

const ResultsPage = ({ results, onReset, isPublic = false }) => {
  const [copied, setCopied] = React.useState(false);
  const [leadInfo, setLeadInfo] = React.useState({
    email: '',
    companyName: '',
    role: '',
    teamSize: '',
    website: ''
  });
  const [leadMessage, setLeadMessage] = React.useState(null);
  const [leadError, setLeadError] = React.useState(null);
  const [leadLoading, setLeadLoading] = React.useState(false);
  const reportRef = useRef(null);

  const getSafeNumber = (value) => Number(value ?? 0);
  const formatCurrency = (value) => `$${getSafeNumber(value).toFixed(2)}`;
  const safeBreakdown = Array.isArray(results?.breakdown) ? results.breakdown : [];

  const handleLeadChange = (field, value) => {
    setLeadInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/results/${results?.shareId ?? ''}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    try {
      console.log('📄 [PDF EXPORT] Starting export', { reportExists: !!reportRef.current });
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;

      if (!reportRef.current) {
        console.warn('⚠️ [PDF EXPORT] reportRef is undefined. Aborting PDF export.');
        return;
      }

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#0f172a'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('ai-audit-report.pdf');
      console.log('✅ [PDF EXPORT] PDF saved successfully');
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF download failed. Please try again.');
    }
  };

  return (
    <div ref={reportRef} className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass p-10 rounded-[3rem] relative overflow-hidden flex flex-col justify-between min-h-[400px]"
        >
          {/* Background Decorative Element */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full" />
          
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
              <Zap size={14} fill="currentColor" /> Optimization Analysis Complete
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
              Save up to <br />
              <span className="text-emerald-400 font-black">${results?.totalYearlySavings ?? 0}</span>
              <span className="text-3xl text-slate-500 font-bold ml-4">/ Year</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
              Our AI engine identified major cost-saving opportunities by optimizing your tool tiers and reducing seat redundancy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 relative z-10">
            {isPublic ? (
              <>
                <button type="button" className="btn-primary flex items-center gap-2" onClick={handleDownloadPDF}>
                  <Download size={18} /> Download PDF Report
                </button>
                <button 
                  type="button"
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-3 bg-white/5 text-slate-300 rounded-2xl font-bold hover:bg-white/10 flex items-center gap-2 transition-all"
                >
                  <RotateCcw size={18} /> Create Your Own Audit
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn-primary flex items-center gap-2" onClick={handleDownloadPDF}>
                  <Download size={18} /> Download Detailed Report
                </button>
                <button 
                  type="button"
                  onClick={onReset}
                  className="px-6 py-3 bg-white/5 text-slate-300 rounded-2xl font-bold hover:bg-white/10 flex items-center gap-2 transition-all"
                >
                  <RotateCcw size={18} /> New Audit
                </button>
              </>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-10 rounded-[3rem] space-y-8 flex flex-col justify-center border-emerald-500/20"
        >
          <div className="space-y-2">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Monthly Burn Reduction</div>
            <div className="text-5xl font-black text-white">${results?.totalMonthlySavings ?? 0}</div>
          </div>
          
          <div className="h-px bg-slate-800" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium">Potential ROI</span>
              <span className="text-emerald-400 font-black">+450%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium">Optimization Score</span>
              <span className="text-blue-400 font-black">92/100</span>
            </div>
          </div>

          <div className="pt-4">
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "92%" }}
                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Summary Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-12 bg-gradient-to-br from-blue-600/5 to-violet-600/5 border-blue-500/10"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Sparkles size={24} />
          </div>
          <h2 className="text-3xl font-black text-white">Executive AI Summary</h2>
        </div>
        <p className="text-slate-300 text-lg leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-blue-500">
          {results?.aiSummary ?? ''}
        </p>
      </motion.div>

      {/* Savings Analytics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-12"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <BarChart3 size={24} />
          </div>
          <h2 className="text-3xl font-black text-white">Savings Analytics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <div className="text-sm font-bold text-slate-400 mb-2">Total Monthly Savings</div>
            <div className="text-3xl font-black text-emerald-400">${results?.totalMonthlySavings ?? 0}</div>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <div className="text-sm font-bold text-slate-400 mb-2">Annual Savings</div>
            <div className="text-3xl font-black text-emerald-400">${results?.totalYearlySavings ?? 0}</div>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <div className="text-sm font-bold text-slate-400 mb-2">Optimization Rate</div>
            <div className="text-3xl font-black text-blue-400">92%</div>
          </div>
        </div>
      </motion.div>

      {!isPublic && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass-card p-10 rounded-[3rem] border border-slate-800/50 bg-slate-950/80"
        >
          <div className="mb-8 space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Lead Capture</p>
            <h3 className="text-3xl font-black text-white">Get a follow-up from our optimization team</h3>
            <p className="text-slate-400 max-w-2xl">Enter your email and company details so we can help you turn these savings into action.</p>
          </div>

          {leadMessage && (
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200 mb-6">
              {leadMessage}
            </div>
          )}
          {leadError && (
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 mb-6">
              {leadError}
            </div>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLeadError(null);
              setLeadMessage(null);

              if (!leadInfo.email || !leadInfo.email.includes('@')) {
                setLeadError('Please enter a valid email address.');
                return;
              }

              setLeadLoading(true);
              try {
                const response = await axios.post(`${API_URL}/api/lead`, {
                  email: leadInfo.email,
                  companyName: leadInfo.companyName,
                  role: leadInfo.role,
                  teamSize: leadInfo.teamSize,
                  website: leadInfo.website,
                  auditSummary: results?.aiSummary,
                  monthlySavings: results?.totalMonthlySavings,
                  yearlySavings: results?.totalYearlySavings,
                  shareUrl: `${window.location.origin}/results/${results?.shareId ?? ''}`
                });
                if (response?.data?.success) {
                  setLeadMessage('Thanks! Your interest has been captured. We will contact you shortly.');
                  setLeadInfo({ email: '', companyName: '', role: '', teamSize: '', website: '' });
                } else {
                  setLeadError(response?.data?.error || 'Unable to save your details at this time.');
                }
              } catch (error) {
                console.error('Lead capture failed:', error);
                setLeadError(error.response?.data?.error || 'Unable to submit your lead form. Please try again later.');
              } finally {
                setLeadLoading(false);
              }
            }}
            className="grid gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-300">Email *</span>
                <input
                  type="email"
                  value={leadInfo.email}
                  onChange={(e) => handleLeadChange('email', e.target.value)}
                  required
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-300">Company Name</span>
                <input
                  type="text"
                  value={leadInfo.companyName}
                  onChange={(e) => handleLeadChange('companyName', e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                />
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-300">Role</span>
                <input
                  type="text"
                  value={leadInfo.role}
                  onChange={(e) => handleLeadChange('role', e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-slate-300">Team Size</span>
                <input
                  type="number"
                  min="1"
                  value={leadInfo.teamSize}
                  onChange={(e) => handleLeadChange('teamSize', e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
                />
              </label>
            </div>
            <input
              type="text"
              name="website"
              value={leadInfo.website}
              onChange={(e) => handleLeadChange('website', e.target.value)}
              className="hidden"
              autoComplete="off"
              tabIndex="-1"
            />
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={leadLoading}
                className="btn-primary px-6 py-4 rounded-2xl font-bold flex items-center justify-center"
              >
                {leadLoading ? 'Submitting...' : 'Request Follow-Up'}
              </button>
              <p className="text-sm text-slate-500">We’ll never share your email. No spam.</p>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tool Breakdown Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-12"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
            <Table size={24} />
          </div>
          <h2 className="text-3xl font-black text-white">Tool Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="pb-4 text-slate-400 font-bold">Tool</th>
                <th className="pb-4 text-slate-400 font-bold">Current Plan</th>
                <th className="pb-4 text-slate-400 font-bold">Recommended Plan</th>
                <th className="pb-4 text-slate-400 font-bold">Current Cost</th>
                <th className="pb-4 text-slate-400 font-bold">Optimized Cost</th>
                <th className="pb-4 text-slate-400 font-bold">Monthly Savings</th>
                <th className="pb-4 text-slate-400 font-bold">Risk</th>
                <th className="pb-4 text-slate-400 font-bold">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {safeBreakdown.map((item, index) => (
                <tr key={index} className="hover:bg-slate-800/30">
                  <td className="py-4 text-white font-bold">{item.tool || 'Unknown'}</td>
                  <td className="py-4 text-slate-300">{item.currentPlan || 'N/A'}</td>
                  <td className="py-4 text-blue-400 font-bold">{item.recommendedPlan || 'N/A'}</td>
                  <td className="py-4 text-slate-300">{formatCurrency(item.currentCost)}</td>
                  <td className="py-4 text-emerald-400 font-bold">{formatCurrency(item.optimizedCost)}</td>
                  <td className="py-4 text-emerald-400 font-bold">{getSafeNumber(item.monthlySavings) > 0 ? formatCurrency(item.monthlySavings) : 'None'}</td>
                  <td className="py-4 text-yellow-300 font-bold">{item.riskLevel || 'Unknown'}</td>
                  <td className="py-4 text-slate-400 max-w-xs truncate">{item.reason || 'No recommendation available.'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Share Section */}
      {results?.shareId && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 border-violet-500/20"
        >
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black text-white flex items-center justify-center md:justify-start gap-3">
              <Share2 size={24} className="text-violet-500" /> Share This Report
            </h3>
            <p className="text-slate-400 max-w-sm">
              Generate a public, secure link to share these insights with your team or stakeholders.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:w-96 bg-slate-950 px-6 py-4 rounded-2xl border border-slate-800 text-sm text-blue-400 font-mono truncate">
              {`${window.location.origin}/results/${results.shareId}`}
            </div>
            <button 
              onClick={handleCopy}
              className={`p-4 rounded-2xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}
            >
              {copied ? <CheckCircle2 size={24} /> : <Copy size={24} />}
            </button>
          </div>
        </motion.div>
      )}

      {/* CTA Bottom */}
      <div className="pb-20">
        <div className="glass p-12 rounded-[3rem] text-center space-y-6 bg-gradient-to-tr from-slate-900 to-blue-900/20">
          <h3 className="text-3xl font-black text-white tracking-tight">Need help implementing these savings?</h3>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Our consultants can help you negotiate enterprise contracts and automate seat management.
          </p>
          <button className="btn-primary px-10 py-4 shadow-blue-500/20">
            Talk to an Expert
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
