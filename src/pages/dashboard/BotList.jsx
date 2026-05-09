import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Bot, Globe, Trash2, Code2, Edit, MessageSquare } from 'lucide-react';
import { Card } from '../../components/ui/card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useBots } from '../../context/BotContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../utils/formatDate';

const BotList = () => {
  const { bots, loading, deleteBot } = useBots();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const toast = useToast();
  const [deleteModal, setDeleteModal] = useState(null);

  const statusVariant = { Active: 'success', Draft: 'warning', Paused: 'default' };

  const handleDelete = () => {
    if (deleteModal) {
      deleteBot(deleteModal.id);
      toast.success(`${deleteModal.name} deleted successfully`);
      setDeleteModal(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (bots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6"><Bot className="w-12 h-12 text-primary" /></div>
        <h2 className={`text-3xl md:text-4xl font-semibold mb-4 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>No chatbots yet</h2>
        <p className={`text-base leading-relaxed mb-8 max-w-md text-center ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Create your first chatbot and start automating customer support</p>
        <Button icon={Plus} size="lg" onClick={() => navigate('/dashboard/bots/new')}>Create Your First Bot</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-3xl md:text-4xl font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>My Chatbots</h2>
          <p className={`text-base leading-relaxed mt-4 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{bots.length} chatbot{bots.length !== 1 ? 's' : ''}</p>
        </div>
        <Button icon={Plus} onClick={() => navigate('/dashboard/bots/new')}>Create New Bot</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {bots.map(bot => (
          <Card key={bot.id} hover padding="none">
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: (bot.primaryColor || '#6366f1') + '15' }}>
                  <Bot className="w-6 h-6" style={{ color: bot.primaryColor || '#6366f1' }} />
                </div>
                <Badge variant={statusVariant[bot.status]}>{bot.status}</Badge>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-dark-text' : 'text-light-text'}`}>{bot.name}</h3>
              <div className="flex items-center gap-1.5 mb-4">
                <Globe className={`w-3.5 h-3.5 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`} />
                <span className={`text-xs truncate ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{bot.website}</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className={`w-3.5 h-3.5 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`} />
                  <span className={`text-xs ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{bot.faqCount || bot.faqs?.length || 0} FAQs</span>
                </div>
                <span className={`text-xs ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>{formatDate(bot.created_at || bot.created)}</span>
              </div>
            </div>
            <div className={`flex border-t ${isDark ? 'border-dark-border' : 'border-light-border'}`}>
              <button onClick={() => navigate('/dashboard/bots/new')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors ${isDark ? 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-surface-2' : 'text-light-text-secondary hover:text-light-text hover:bg-light-surface-2'}`}>
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
              <div className={`w-px ${isDark ? 'bg-dark-border' : 'bg-light-border'}`} />
              <button onClick={() => navigate(`/dashboard/bots/${bot.id}/embed`)} className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors ${isDark ? 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-surface-2' : 'text-light-text-secondary hover:text-light-text hover:bg-light-surface-2'}`}>
                <Code2 className="w-3.5 h-3.5" /> Embed
              </button>
              <div className={`w-px ${isDark ? 'bg-dark-border' : 'bg-light-border'}`} />
              <button onClick={() => setDeleteModal(bot)} className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium text-danger hover:bg-danger/10 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Bot" size="sm">
        <p className={`text-sm mb-6 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          Are you sure you want to delete <strong className={isDark ? 'text-dark-text' : 'text-light-text'}>{deleteModal?.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteModal(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Delete Bot</Button>
        </div>
      </Modal>
    </div>
  );
};

export default BotList;
