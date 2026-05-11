import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, ShieldCheck, BarChart3, TrendingDown, Cpu, Sparkles, CheckCircle2, Globe, Laptop, Database, Code } from 'lucide-react';

const LandingPage = ({ onStartAudit }) => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section id="product" className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles size={14} />
            The Future of AI Cost Management
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black tracking-tight"
          >
            Stop Overpaying <br />
            <span className="text-gradient animate-glow">For AI Tools</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Instantly audit your startup’s AI spending and discover hidden savings opportunities. 
            Connect your tools and let our AI optimize your monthly burn.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button 
              onClick={onStartAudit}
              className="btn-primary flex items-center gap-2 group w-full sm:w-auto"
            >
              Start Free Audit 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#features" className="btn-secondary w-full sm:w-auto text-center">
              Explore Features
            </a>
          </motion.div>

          {/* Trusted Tools */}
          <div className="pt-20 opacity-50 space-y-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Supporting your favorite stack</p>
            <div className="flex flex-wrap justify-center gap-12 grayscale">
               <span className="text-2xl font-bold text-slate-400 italic">ChatGPT</span>
               <span className="text-2xl font-bold text-slate-400 italic">Claude</span>
               <span className="text-2xl font-bold text-slate-400 italic">Gemini</span>
               <span className="text-2xl font-bold text-slate-400 italic">Cursor</span>
               <span className="text-2xl font-bold text-slate-400 italic">Copilot</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 max-w-7xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Engineered for Efficiency</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to regain control over your AI subscriptions and maximize your budget.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Zap className="text-yellow-400" />, title: "Instant Analysis", desc: "Get a comprehensive audit of your entire AI stack in less than 60 seconds." },
            { icon: <TrendingDown className="text-emerald-400" />, title: "Cost Reduction", desc: "Identify redundant seats and suggest plan downgrades based on real usage." },
            { icon: <ShieldCheck className="text-blue-400" />, title: "Secure & Private", desc: "Your data is encrypted and never shared. We only look at plan metrics." },
            { icon: <Cpu className="text-violet-400" />, title: "AI-Powered Tips", desc: "Get dynamic recommendations tailored to your team's specific workflows." },
            { icon: <BarChart3 className="text-blue-500" />, title: "Usage Monitoring", desc: "Track how often your seats are actually being used by your team members." },
            { icon: <Sparkles className="text-indigo-400" />, title: "Enterprise Ready", desc: "Manage multi-tool environments and enterprise-level licensing with ease." }
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8 group">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 max-w-7xl mx-auto px-4 space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Simple, Transparent Pricing</h2>
          <p className="text-slate-400">Choose the plan that fits your organization's needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Starter", price: "$0", features: ["Up to 3 Tools", "Basic AI Insights", "1 User Admin", "Community Support"], btn: "Get Started Free", popular: false },
            { name: "Professional", price: "$49", features: ["Unlimited Tools", "Advanced AI Summary", "3 User Admins", "Priority Support", "Historical Analytics"], btn: "Go Pro Now", popular: true },
            { name: "Enterprise", price: "Custom", features: ["White-label Reports", "API Access", "Unlimited Admins", "Dedicated Manager", "Custom Integrations"], btn: "Contact Sales", popular: false }
          ].map((plan, i) => (
            <div key={i} className={`glass p-10 rounded-[3rem] space-y-8 flex flex-col relative ${plan.popular ? 'border-blue-500/50 scale-105 shadow-2xl shadow-blue-500/10' : 'border-slate-800/50'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1 rounded-full tracking-widest">
                  Most Popular
                </div>
              )}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-400">{plan.name}</h3>
                <div className="text-5xl font-black text-white">{plan.price}<span className="text-lg text-slate-600 ml-1">/mo</span></div>
              </div>
              <ul className="space-y-4 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-400">
                    <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-2xl font-black transition-all ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                {plan.btn}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Docs Section */}
      <section id="docs" className="py-32 max-w-7xl mx-auto px-4 overflow-hidden">
        <div className="glass p-12 md:p-20 rounded-[3rem] relative border-violet-500/20">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-600/10 blur-[100px] rounded-full" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Developer Friendly <br /><span className="text-violet-500">Documentation</span></h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Integrate AuditAI into your existing CI/CD pipelines or internal dashboards. 
                Our RESTful API and comprehensive SDKs make automation a breeze.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3 text-slate-300 font-bold">
                  <Code size={20} className="text-violet-500" /> API Access
                </div>
                <div className="flex items-center gap-3 text-slate-300 font-bold">
                  <Database size={20} className="text-violet-500" /> Webhooks
                </div>
                <div className="flex items-center gap-3 text-slate-300 font-bold">
                  <Globe size={20} className="text-violet-500" /> Global Nodes
                </div>
                <div className="flex items-center gap-3 text-slate-300 font-bold">
                  <Laptop size={20} className="text-violet-500" /> CLI Tool
                </div>
              </div>
              <button className="btn-secondary py-4 px-10">Read Documentation</button>
            </div>
            
            <div className="glass bg-slate-950 p-6 rounded-3xl border-slate-800 shadow-2xl relative">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <div className="ml-4 text-[10px] font-mono text-slate-600">bash — audit-cli --run</div>
              </div>
              <pre className="text-sm font-mono text-slate-400 overflow-x-auto">
                <code>{`$ audit-cli login --key=********
$ audit-cli run --all-tools

[INFO] Analyzing ChatGPT (Enterprise)...
[WARN] 12 inactive seats detected.
[INFO] Potential Savings: $360/mo.

Generated optimization plan at:
https://auditai.com/results/xY87...`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 max-w-4xl mx-auto px-4">
        <div className="glass p-12 md:p-16 rounded-[3rem] text-center space-y-10 border-blue-500/20">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Get in Touch</h2>
            <p className="text-slate-400 text-lg">Have questions? Our team of AI cost experts is ready to help.</p>
          </div>
          
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <input type="text" placeholder="John Doe" className="w-full bg-slate-950 px-6 py-4 rounded-2xl border border-slate-800 text-white outline-none focus:border-blue-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
              <input type="email" placeholder="john@company.com" className="w-full bg-slate-950 px-6 py-4 rounded-2xl border border-slate-800 text-white outline-none focus:border-blue-500 transition-all" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Message</label>
              <textarea rows="4" placeholder="Tell us about your organization..." className="w-full bg-slate-950 px-6 py-4 rounded-2xl border border-slate-800 text-white outline-none focus:border-blue-500 transition-all resize-none"></textarea>
            </div>
            <button type="submit" className="md:col-span-2 btn-primary py-5 text-lg">Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
