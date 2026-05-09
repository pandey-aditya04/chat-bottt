import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/card';

const TopQuestionsTable = ({ questions = [] }) => {
  const { isDark } = useTheme();

  const trendIcons = {
    up: <TrendingUp className="w-3.5 h-3.5 text-success" />,
    down: <TrendingDown className="w-3.5 h-3.5 text-danger" />,
    stable: <Minus className="w-3.5 h-3.5 text-dark-text-secondary" />,
  };

  return (
    <Card padding="none">
      <div className="p-6 pb-3">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
          Top Questions
        </h3>
        <p className={`text-sm mt-1 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          Most frequently asked questions across all bots
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={isDark ? 'border-b border-dark-border' : 'border-b border-light-border'}>
              <th className={`text-left text-xs font-medium uppercase tracking-wider px-6 py-3 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>#</th>
              <th className={`text-left text-xs font-medium uppercase tracking-wider px-6 py-3 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Question</th>
              <th className={`text-right text-xs font-medium uppercase tracking-wider px-6 py-3 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Count</th>
              <th className={`text-center text-xs font-medium uppercase tracking-wider px-6 py-3 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, i) => (
              <tr key={i} className={`${isDark ? 'border-b border-dark-border/50 hover:bg-dark-surface-2/50' : 'border-b border-light-border/50 hover:bg-light-surface-2/50'} transition-colors`}>
                <td className={`px-6 py-4 text-sm font-medium ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                  {i + 1}
                </td>
                <td className={`px-6 py-4 text-sm ${isDark ? 'text-dark-text' : 'text-light-text'}`}>
                  {q.question}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    {q.count}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {trendIcons[q.trend]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TopQuestionsTable;
