import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/card';
import { motion, useSpring, useTransform } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
  const { isDark } = useTheme();
  const [displayValue, setDisplayValue] = useState(0);

  const colors = {
    primary: { bg: 'bg-brand/10', text: 'text-brand', icon: 'text-brand' },
    success: { bg: 'bg-success/10', text: 'text-success', icon: 'text-success' },
    accent: { bg: 'bg-accent/10', text: 'text-accent', icon: 'text-accent' },
    warning: { bg: 'bg-warning/10', text: 'text-warning', icon: 'text-warning' },
    danger: { bg: 'bg-danger/10', text: 'text-danger', icon: 'text-danger' },
    info: { bg: 'bg-info/10', text: 'text-info', icon: 'text-info' },
  };

  const c = colors[color] || colors.primary;

  // Simple count-up animation
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (isNaN(end)) return;
    
    const duration = 1.5;
    const increment = end / (duration * 60);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <Card className="hover:border-brand/30 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">
            {title}
          </p>
          <p className="text-3xl font-black tracking-tight text-text-primary">
            {typeof value === 'number' ? displayValue.toLocaleString() : value}
          </p>
          {trend && (
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                trend === 'up' ? 'bg-success/10 text-success' : 
                trend === 'down' ? 'bg-danger/10 text-danger' : 
                'bg-text-muted/10 text-text-muted'
              }`}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
              </span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                vs last month
              </span>
            </div>
          )}
        </div>
        <div className={`p-3.5 rounded-2xl ${c.bg} group-hover:scale-110 transition-transform duration-500`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
