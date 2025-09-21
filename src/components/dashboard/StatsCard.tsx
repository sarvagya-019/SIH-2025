import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  gradient?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  gradient = false
}) => {
  const changeColor = {
    positive: 'text-success',
    negative: 'text-danger', 
    neutral: 'text-muted-foreground'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        relative overflow-hidden rounded-xl p-6 border border-border/50 
        ${gradient ? 'gradient-card' : 'bg-card/80'} 
        backdrop-blur-sm shadow-soft farm-card-hover
      `}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={`text-sm ${changeColor[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className="relative">
          <div className="absolute inset-0 animate-pulse-glow rounded-full opacity-20" />
          <Icon className="h-8 w-8 text-primary" />
        </div>
      </div>
      
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
      )}
    </motion.div>
  );
};