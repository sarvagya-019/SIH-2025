import { motion } from 'framer-motion';
import { Heart, Shield, Activity } from 'lucide-react';
import heroDashboard from '@/assets/hero-dashboard.jpg';

export const SimpleFarmVisualization = () => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroDashboard} 
          alt="Farm Management Dashboard"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/60" />
      </div>
      
      {/* Floating Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute top-20 left-16"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl p-4 shadow-medium"
        >
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-success" />
            <div>
              <p className="text-sm font-semibold text-foreground">2,847</p>
              <p className="text-xs text-muted-foreground">Animals Monitored</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="absolute top-32 right-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl p-4 shadow-medium"
        >
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">99.8%</p>
              <p className="text-xs text-muted-foreground">Compliance Rate</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="absolute bottom-24 left-20"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl p-4 shadow-medium"
        >
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-accent" />
            <div>
              <p className="text-sm font-semibold text-foreground">23</p>
              <p className="text-xs text-muted-foreground">Active Treatments</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Animated Dots */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/40 rounded-full"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
};