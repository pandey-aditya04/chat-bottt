import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, X, Check, Bot, Upload, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card } from '../../components/ui/card';
import ChatWidget from '../../components/chatbot/ChatWidget';
import FadeIn from '../../components/ui/FadeIn';
import { useBots } from '../../context/BotContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';

const stepLabels = ['Basic Info', 'FAQs', 'Behavior', 'Appearance', 'Preview'];

const CreateBot = () => {
  const navigate = useNavigate();
  const { addBot } = useBots();
  const { isDark } = useTheme();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', website: '', description: '',
    faqs: [{ question: '', answer: '' }],
    tone: 'Friendly', fallbackMessage: "I'm not sure about that. Please contact our support team.",
    customInstructions: '', maxResponseLength: 'Medium',
    primaryColor: '#6366f1', chatPosition: 'Right',
    welcomeMessage: 'Hi! How can I help you today?', chatWindowTitle: 'Support Chat',
    launcherIcon: 'Chat Bubble', avatar: null,
  });
  const [errors, setErrors] = useState({});

  const updateForm = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const validateStep = () => {
    const errs = {};
    if (step === 0) {
      if (!form.name.trim()) errs.name = 'Bot name is required';
      if (!form.website.trim()) errs.website = 'Website URL is required';
    } else if (step === 1) {
      if (form.faqs.length === 0) errs.faqs = 'Add at least one FAQ';
      form.faqs.forEach((f, i) => {
        if (!f.question.trim()) errs[`faq_q_${i}`] = 'Question required';
        if (!f.answer.trim()) errs[`faq_a_${i}`] = 'Answer required';
      });
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => Math.min(s + 1, 4)); };
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const addFaq = () => updateForm('faqs', [...form.faqs, { question: '', answer: '' }]);
  const removeFaq = (i) => updateForm('faqs', form.faqs.filter((_, idx) => idx !== i));
  const updateFaq = (i, key, val) => {
    const updated = [...form.faqs];
    updated[i] = { ...updated[i], [key]: val };
    updateForm('faqs', updated);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      const bot = await addBot({
        name: form.name, website: form.website, description: form.description,
        faqs: form.faqs, status: 'Active', tone: form.tone,
        fallbackMessage: form.fallbackMessage, primaryColor: form.primaryColor,
        chatPosition: form.chatPosition, welcomeMessage: form.welcomeMessage,
        chatWindowTitle: form.chatWindowTitle, launcherIcon: form.launcherIcon,
        maxResponseLength: form.maxResponseLength,
      });
      toast.success('Bot published successfully! 🎉');
      navigate(`/dashboard/bots/${bot.id}/embed`);
    } catch (err) {
      toast.error(err.message || 'Failed to publish bot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      await addBot({ ...form, status: 'Draft', faqs: form.faqs });
      toast.success('Bot saved as draft');
      navigate('/dashboard/bots');
    } catch (err) {
      toast.error(err.message || 'Failed to save draft. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-3xl font-black tracking-tight mb-2">Create New Bot</h2>
        <p className="text-text-secondary">Follow the steps to configure your AI assistant.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 bg-surface-raised/50 p-6 rounded-2xl border border-border">
        {stepLabels.map((label, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all duration-500 ${
                i < step 
                  ? 'bg-success text-white shadow-lg shadow-success/20' 
                  : i === step 
                    ? 'bg-brand text-white shadow-glow-brand scale-110' 
                    : 'bg-surface-overlay text-text-muted border border-border'
              }`}>
                {i < step ? <Check className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`text-[10px] mt-3 font-black uppercase tracking-widest hidden sm:block ${
                i <= step ? 'text-brand' : 'text-text-muted'
              }`}>
                {label}
              </span>
            </div>
            {i < 4 && (
              <div className="flex-1 h-1 mx-4 rounded-full bg-surface-overlay overflow-hidden">
                <motion.div 
                  className="h-full bg-success"
                  initial={{ width: '0%' }}
                  animate={{ width: i < step ? '100%' : '0%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Card className="mb-8 border-border/60 shadow-xl shadow-black/10">
              {step === 0 && (
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-2">Basic Information</h3>
                  <Input label="Bot Name" placeholder="e.g. Support Bot" value={form.name} onChange={e => updateForm('name', e.target.value)} error={errors.name} required id="bot-name" />
                  <Input label="Website URL" type="url" placeholder="https://yourwebsite.com" value={form.website} onChange={e => updateForm('website', e.target.value)} error={errors.website} required id="bot-website" />
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-text-secondary">Description</label>
                    <textarea value={form.description} onChange={e => updateForm('description', e.target.value)} placeholder="Describe what this chatbot does..." rows={3} className="w-full rounded-xl px-4 py-3 text-sm bg-surface-overlay border border-border text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all" />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">FAQ Questions</h3>
                      <p className="text-xs text-text-muted mt-1">{form.faqs.length} entries added</p>
                    </div>
                    <Button variant="outline" size="sm" icon={Plus} onClick={addFaq} className="text-xs">Add FAQ</Button>
                  </div>
                  {errors.faqs && <p className="text-danger text-xs font-bold">{errors.faqs}</p>}
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {form.faqs.map((faq, i) => (
                      <div key={i} className="rounded-2xl p-5 bg-surface-overlay border border-border group">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">FAQ Entry #{i + 1}</span>
                          {form.faqs.length > 1 && (
                            <button onClick={() => removeFaq(i)} className="p-1.5 rounded-lg hover:bg-danger/10 text-danger transition-all opacity-0 group-hover:opacity-100"><X className="w-4 h-4" /></button>
                          )}
                        </div>
                        <div className="space-y-4">
                          <Input placeholder="Enter question..." value={faq.question} onChange={e => updateFaq(i, 'question', e.target.value)} error={errors[`faq_q_${i}`]} id={`faq-q-${i}`} />
                          <textarea value={faq.answer} onChange={e => updateFaq(i, 'answer', e.target.value)} placeholder="Enter answer..." rows={2} className={`w-full rounded-xl px-4 py-3 text-sm bg-surface-raised border border-border text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all ${errors[`faq_a_${i}`] ? 'border-danger' : ''}`} />
                          {errors[`faq_a_${i}`] && <p className="text-danger text-[10px] font-bold">{errors[`faq_a_${i}`]}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-2">Bot Personality</h3>
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-text-secondary">Tone of Voice</label>
                    <select value={form.tone} onChange={e => updateForm('tone', e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm bg-surface-overlay border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all appearance-none">
                      {['Friendly','Formal','Professional','Sales-Focused','Casual'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <Input label="Fallback Message" value={form.fallbackMessage} onChange={e => updateForm('fallbackMessage', e.target.value)} id="fallback" />
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-text-secondary">Custom Personality Instructions</label>
                    <textarea value={form.customInstructions} onChange={e => updateForm('customInstructions', e.target.value)} placeholder="e.g. Be very helpful and always sign off with 'Have a great day!'" rows={3} className="w-full rounded-xl px-4 py-3 text-sm bg-surface-overlay border border-border text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-text-primary">Appearance</h3>
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-text-secondary">Brand Color</label>
                      <div className="flex items-center gap-4 bg-surface-overlay p-3 rounded-xl border border-border">
                        <input type="color" value={form.primaryColor} onChange={e => updateForm('primaryColor', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
                        <span className="text-sm font-mono font-bold tracking-wider">{form.primaryColor}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-black uppercase tracking-widest text-text-secondary">Chat Position</label>
                      <div className="flex gap-2 p-1 bg-surface-overlay rounded-xl border border-border">
                        {['Left','Right'].map(pos => (
                          <button key={pos} onClick={() => updateForm('chatPosition', pos)} className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${form.chatPosition === pos ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-text-muted hover:text-text-primary'}`}>{pos}</button>
                        ))}
                      </div>
                    </div>
                    <Input label="Welcome Message" value={form.welcomeMessage} onChange={e => updateForm('welcomeMessage', e.target.value)} id="welcome" />
                    <Input label="Window Title" value={form.chatWindowTitle} onChange={e => updateForm('chatWindowTitle', e.target.value)} id="title" />
                  </div>
                  <div className="relative">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4">Interface Preview</p>
                    <div className="sticky top-0 bg-surface-overlay rounded-3xl p-2 border border-border shadow-2xl">
                      <ChatWidget faqs={form.faqs.filter(f => f.question && f.answer)} primaryColor={form.primaryColor} welcomeMessage={form.welcomeMessage} chatWindowTitle={form.chatWindowTitle} fallbackMessage={form.fallbackMessage} launcherIcon={form.launcherIcon} inline isDemo={true} />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8 text-center">
                  <div>
                    <h3 className="text-xl font-black mb-2">Ready to Publish?</h3>
                    <p className="text-sm text-text-secondary">Testing your bot now will save time later.</p>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-full max-w-sm bg-surface-overlay rounded-3xl p-2 border border-border shadow-2xl">
                      <ChatWidget faqs={form.faqs.filter(f => f.question && f.answer)} primaryColor={form.primaryColor} position={form.chatPosition} welcomeMessage={form.welcomeMessage} chatWindowTitle={form.chatWindowTitle} fallbackMessage={form.fallbackMessage} launcherIcon={form.launcherIcon} inline isDemo={true} />
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-10">
        <Button 
          variant="outline" 
          icon={ArrowLeft} 
          onClick={prev} 
          disabled={step === 0}
          className="border-border hover:bg-surface-raised"
        >
          Back
        </Button>
        <div className="flex gap-4">
          {step === 4 && <Button variant="secondary" icon={Save} onClick={handleSaveDraft} loading={isSubmitting} className="bg-surface-raised border border-border">Save as Draft</Button>}
          {step < 4 ? (
            <Button onClick={next} className="shadow-lg shadow-brand/20 px-8">
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handlePublish} loading={isSubmitting} className="shadow-glow-brand px-10">
              Publish Chatbot 🚀
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateBot;
