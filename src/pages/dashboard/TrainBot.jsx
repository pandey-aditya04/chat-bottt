import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { Globe, FileText, AlignLeft, Trash2, RefreshCw, AlertCircle, FileUp, Database } from 'lucide-react';
import { useBots } from '../../context/BotContext';
import { trainingAPI } from '../../lib/api';
import { useToast } from '../../hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';

const TrainBot = () => {
  const { botId } = useParams();
  const { getBot } = useBots();
  const bot = getBot(botId);
  const navigate = useNavigate();
  const toast = useToast();

  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('url');
  
  // Forms state
  const [url, setUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [textName, setTextName] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (bot) fetchSources();
  }, [bot]);

  const fetchSources = async () => {
    try {
      const { data } = await trainingAPI.getSources(botId);
      setSources(data);
    } catch (error) {
      toast.error('Failed to load training sources');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sourceId) => {
    try {
      await trainingAPI.deleteSource(botId, sourceId);
      setSources(prev => prev.filter(s => s.id !== sourceId));
      toast.success('Source deleted');
    } catch (error) {
      toast.error('Failed to delete source');
    }
  };

  const handleRetrain = async () => {
    try {
      setIsSubmitting(true);
      await trainingAPI.retrain(botId);
      toast.success('Bot successfully retrained! Knowledge base is synced.');
      await fetchSources();
    } catch (error) {
      toast.error('Failed to retrain bot');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddUrl = async (e) => {
    e.preventDefault();
    if (!url) return;
    setIsSubmitting(true);
    try {
      await trainingAPI.trainWithUrl(botId, url);
      toast.success('URL added to training queue');
      setUrl('');
      fetchSources();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add URL');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddText = async (e) => {
    e.preventDefault();
    if (!textName || !textContent) return;
    setIsSubmitting(true);
    try {
      await trainingAPI.trainWithText(botId, textName, textContent);
      toast.success('Text content added to knowledge base');
      setTextName('');
      setTextContent('');
      fetchSources();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add text');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setIsSubmitting(true);
    try {
      await trainingAPI.trainWithFile(botId, file);
      toast.success('File uploaded to training queue');
      setFile(null);
      // Reset file input
      document.getElementById('file-upload').value = '';
      fetchSources();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to upload file');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bot) {
    return (
      <div className="text-center py-24 animate-fade-in">
        <p className="text-text-secondary mb-6 font-bold uppercase tracking-widest text-xs">Bot not found</p>
        <Button onClick={() => navigate('/dashboard/bots')}>Return to Dashboard</Button>
      </div>
    );
  }

  const tabs = [
    { id: 'url', label: 'Website URL', icon: Globe },
    { id: 'file', label: 'File Upload', icon: FileUp },
    { id: 'text', label: 'Raw Text', icon: AlignLeft },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2">Knowledge Base</h2>
          <p className="text-text-secondary text-sm">Train {bot.name} with your custom content and documents.</p>
        </div>
        <Button onClick={handleRetrain} loading={isSubmitting} icon={RefreshCw} className="shadow-lg shadow-brand/20">
          Retrain Bot
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Col - Add New Source */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-border/60 p-1">
            <div className="flex bg-surface-raised rounded-xl p-1 mb-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-4 pt-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'url' && (
                    <form onSubmit={handleAddUrl} className="space-y-4">
                      <Input 
                        label="Website URL to scrape" 
                        placeholder="https://example.com/docs" 
                        value={url} 
                        onChange={e => setUrl(e.target.value)} 
                        id="train-url" 
                        required 
                      />
                      <Button type="submit" className="w-full" loading={isSubmitting}>Fetch & Add URL</Button>
                    </form>
                  )}

                  {activeTab === 'file' && (
                    <form onSubmit={handleFileUpload} className="space-y-4">
                      <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-brand/50 transition-colors">
                        <FileText className="w-8 h-8 text-brand mx-auto mb-3" />
                        <label className="block text-sm font-bold text-text-primary mb-1 cursor-pointer">
                          Click to upload file
                          <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt,.csv,.md" />
                        </label>
                        <p className="text-[10px] text-text-muted uppercase tracking-widest">PDF, DOCX, TXT, CSV, MD (Max 10MB)</p>
                      </div>
                      {file && <p className="text-xs text-text-secondary text-center truncate">{file.name}</p>}
                      <Button type="submit" className="w-full" loading={isSubmitting} disabled={!file}>Upload Document</Button>
                    </form>
                  )}

                  {activeTab === 'text' && (
                    <form onSubmit={handleAddText} className="space-y-4">
                      <Input 
                        label="Title" 
                        placeholder="e.g. Return Policy" 
                        value={textName} 
                        onChange={e => setTextName(e.target.value)} 
                        id="train-text-title" 
                        required 
                      />
                      <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-widest text-text-secondary">Content</label>
                        <textarea 
                          value={textContent} 
                          onChange={e => setTextContent(e.target.value)} 
                          placeholder="Paste your content here..." 
                          rows={6} 
                          required
                          className="w-full rounded-xl px-4 py-3 text-sm bg-surface-overlay border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-brand/50 custom-scrollbar" 
                        />
                      </div>
                      <Button type="submit" className="w-full" loading={isSubmitting}>Save Content</Button>
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* Right Col - Sources List */}
        <div className="md:col-span-2">
          <Card className="border-border/60 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Database className="w-4 h-4 text-brand" /> Training Sources
              </h3>
              <Badge variant="outline" className="text-xs">{sources.length} Items</Badge>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-brand/20 border-t-brand rounded-full animate-spin"></div>
              </div>
            ) : sources.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-surface-raised flex items-center justify-center mb-4">
                  <Database className="w-8 h-8 text-text-muted" />
                </div>
                <p className="text-sm font-bold text-text-primary mb-1">No training data yet</p>
                <p className="text-xs text-text-secondary">Add some URLs, files, or text to make your bot smarter.</p>
              </div>
            ) : (
              <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[500px]">
                {sources.map(source => (
                  <div key={source.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface-overlay group hover:border-brand/30 transition-colors">
                    <div className="flex items-start gap-4 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                        {source.type === 'url' ? <Globe className="w-5 h-5 text-brand" /> :
                         source.type === 'file' ? <FileText className="w-5 h-5 text-brand" /> :
                         <AlignLeft className="w-5 h-5 text-brand" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-text-primary truncate">{source.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant={source.status === 'ready' ? 'success' : source.status === 'failed' ? 'danger' : 'warning'} className="text-[9px] px-2 py-0">
                            {source.status}
                          </Badge>
                          <span className="text-[10px] text-text-muted font-mono">{source.char_count?.toLocaleString() || 0} chars</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(source.id)}
                      className="p-2 rounded-lg text-text-muted hover:bg-danger/10 hover:text-danger opacity-0 group-hover:opacity-100 transition-all shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrainBot;
