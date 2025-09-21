import { motion } from 'framer-motion';
import { ArrowRight, Shield, BarChart3, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FarmScene } from '@/components/3d/FarmScene';
import { SimpleFarmVisualization } from '@/components/3d/SimpleFarm';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-hero opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Shield className="w-4 h-4 mr-2" />
              MRL & AMU Compliance System
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
              <span className="gradient-text bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                VetTrace
              </span>
              <br />
              Stewardship
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Digital Farm Management Portal for monitoring Maximum Residue Limits (MRL) 
              and Antimicrobial Usage (AMU) in livestock. Ensuring food safety and 
              antimicrobial stewardship excellence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" variant="hero" asChild className="group">
              <Link to="/dashboard" className="flex items-center">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild>
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50"
          >
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">99.9%</p>
              <p className="text-sm text-muted-foreground">Compliance Rate</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">24/7</p>
              <p className="text-sm text-muted-foreground">Monitoring</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">1000+</p>
              <p className="text-sm text-muted-foreground">Farms Protected</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Farm Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative h-[600px] rounded-2xl overflow-hidden shadow-strong border border-border/50"
        >
          <SimpleFarmVisualization />
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-20 h-20 gradient-primary rounded-full blur-xl opacity-30"
      />
      
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-32 right-32 w-32 h-32 bg-accent/20 rounded-full blur-2xl opacity-40"
      />
    </section>
  );
};