import React, { useState, useEffect } from 'react';
import { auditAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronRight, Info, AlertCircle, Loader2, zap } from 'lucide-react';

const AVAILABLE_TOOLS = ['ChatGPT', 'Claude', 'Gemini', 'GitHub Copilot', 'Cursor', 'Anthropic API', 'OpenAI API', 'Windsurf'];
const PLANS = ['Free', 'Plus/Pro ($20)', 'Team', 'Enterprise'];
const USE_CASES = ['Coding', 'Writing', 'Research', 'Mixed'];

const TOOL_PLANS = {
  'ChatGPT': ['Free', 'Plus', 'Team', 'Enterprise'],
  'Claude': ['Free', 'Pro', 'Team', 'Enterprise'],
  'Gemini': ['Free', 'Pro', 'Team', 'Enterprise'],
  'GitHub Copilot': ['Free', 'Individual', 'Business', 'Enterprise'],
  'Cursor': ['Free', 'Pro', 'Business', 'Enterprise'],
  'Anthropic API': ['Free', 'Pro', 'Team', 'Enterprise'],
  'OpenAI API': ['Free', 'Plus', 'Team', 'Enterprise'],
  'Windsurf': ['Free', 'Pro', 'Team', 'Enterprise']
};

const getPlansForTool = (toolName) => {
  return TOOL_PLANS[toolName] || PLANS;
};

const AuditForm = ({ onResults }) => {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('aiAuditData');
    return saved ? JSON.parse(saved) : {
      teamSize: '',
      useCase: '',
      tools: [],
      website: '' // Honeypot
    };
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    localStorage.setItem('aiAuditData', JSON.stringify(formData));
  }, [formData]);

  const addTool = () => {
    const defaultTool = 'ChatGPT';
    const defaultPlans = getPlansForTool(defaultTool);
    setFormData({
      ...formData,
      tools: [...formData.tools, { name: defaultTool, plan: defaultPlans[1] || defaultPlans[0], spend: 0, users: 1 }]
    });
  };

  const removeTool = (index) => {
    const newTools = formData.tools.filter((_, i) => i !== index);
    setFormData({ ...formData, tools: newTools });
  };

  const updateTool = (index, field, value) => {
    const newTools = [...formData.tools];
    newTools[index] = { ...newTools[index], [field]: value };
    setFormData({ ...formData, tools: newTools });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.teamSize || formData.teamSize <= 0) newErrors.teamSize = 'Team size is required';
    if (!formData.useCase) newErrors.useCase = 'Use case is required';
    
    formData.tools.forEach((tool, index) => {
      if (tool.spend < 0) newErrors[`tool_${index}_spend`] = 'Spend cannot be negative';
      if (tool.users <= 0) newErrors[`tool_${index}_users`] = 'Users must be at least 1';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (validate()) {
      setLoading(true);
      try {
        const response = await auditAPI.analyze(formData);
        onResults(response.data);
      } catch (err) {
        setApiError(err.response?.data?.error || 'Failed to connect to the audit server. Ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.form 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={handleSubmit} 
        className="space-y-12 glass p-8 md:p-12 rounded-[2.5rem] border-slate-800/50 shadow-2xl relative overflow-hidden"
      >
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] pointer-events-none" />
        
        {/* Honeypot */}
        <input type="text" name="website" value={formData.website} onChange={handleInputChange} className="hidden" tabIndex="-1" autoComplete="off" />

        <div className="space-y-4">
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">1</span>
            Core Configuration
          </h2>
          <p className="text-slate-400">Tell us about your team and primary focus.</p>
        </div>

        {/* Global Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              Team Size <Info size={14} className="text-slate-500" />
            </label>
            <div className="relative group">
              <input
                type="number"
                name="teamSize"
                value={formData.teamSize || ""}
                onChange={handleInputChange}
                placeholder="e.g. 50"
                className={`w-full bg-slate-900/50 px-6 py-4 rounded-2xl border ${errors.teamSize ? 'border-red-500' : 'border-slate-800'} focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-white placeholder:text-slate-600`}
              />
              {errors.teamSize && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{errors.teamSize}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-300 uppercase tracking-widest">Primary Use Case</label>
            <div className="relative">
              <select
                name="useCase"
                value={formData.useCase || ""}
                onChange={handleInputChange}
                className={`w-full bg-slate-900/50 px-6 py-4 rounded-2xl border ${errors.useCase ? 'border-red-500' : 'border-slate-800'} focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-white appearance-none cursor-pointer`}
              >
                <option value="" className="bg-slate-900">Select Use Case</option>
                {USE_CASES.map(uc => <option key={uc} value={uc} className="bg-slate-900">{uc}</option>)}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <ChevronRight size={18} className="rotate-90" />
              </div>
            </div>
            {errors.useCase && <p className="text-red-500 text-xs font-bold mt-2 ml-1">{errors.useCase}</p>}
          </div>
        </div>

        {/* Dynamic Tools Section */}
        <div className="space-y-8 pt-8 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-white flex items-center gap-3">
                <span className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-sm">2</span>
                Tool Inventory
              </h2>
              <p className="text-slate-400">Add the AI tools your team currently uses.</p>
            </div>
            <button
              type="button"
              onClick={addTool}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 hover:-translate-y-0.5 transition-all"
            >
              <Plus size={20} className="text-blue-500" /> Add Tool
            </button>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {formData.tools.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 border-2 border-dashed border-slate-800/50 rounded-3xl bg-slate-900/20"
                >
                  <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                    <Zap size={32} />
                  </div>
                  <p className="text-slate-500 font-medium">No tools added yet. Start by clicking "Add Tool".</p>
                </motion.div>
              ) : (
                formData.tools.map((tool, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative p-8 bg-slate-900/40 rounded-3xl border border-slate-800/50 hover:border-blue-500/30 hover:bg-slate-900/60 transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => removeTool(index)}
                      className="absolute -top-3 -right-3 w-10 h-10 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl backdrop-blur-xl"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tool Name</label>
                        <select
                          value={tool.name || ""}
                          onChange={(e) => updateTool(index, 'name', e.target.value)}
                          className="w-full bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-white outline-none focus:border-blue-500/50 transition-colors"
                        >
                          {AVAILABLE_TOOLS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Active Plan</label>
                        <select
                          value={tool.plan || ""}
                          onChange={(e) => updateTool(index, 'plan', e.target.value)}
                          className="w-full bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-white outline-none focus:border-blue-500/50 transition-colors"
                        >
                          {getPlansForTool(tool.name).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Monthly Spend ($)</label>
                        <input
                          type="number"
                          value={tool.spend || 0}
                          onChange={(e) => updateTool(index, 'spend', parseFloat(e.target.value))}
                          className="w-full bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-white outline-none focus:border-blue-500/50 transition-colors"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Total Users</label>
                        <input
                          type="number"
                          value={tool.users || 1}
                          onChange={(e) => updateTool(index, 'users', parseInt(e.target.value))}
                          className="w-full bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-white outline-none focus:border-blue-500/50 transition-colors"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Error/Submit Section */}
        <div className="pt-12 border-t border-slate-800/50 space-y-6">
          {apiError && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm font-bold flex items-center gap-3"
            >
              <AlertCircle size={20} />
              {apiError}
            </motion.div>
          )}

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4 text-slate-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm font-medium">Your data is safe & never stored without consent.</p>
            </div>
            <button
              type="submit"
              disabled={loading || formData.tools.length === 0}
              className={`w-full md:w-auto min-w-[240px] px-10 py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl ${loading || formData.tools.length === 0 ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-95'}`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} /> Analyzing...
                </>
              ) : (
                <>
                  Generate Optimization Plan <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default AuditForm;
