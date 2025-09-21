import { HeroSection } from "@/components/landing/HeroSection";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border/50"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-xl text-foreground">VetTrace</span>
          </div>
          <ThemeToggle />
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-16">
        <HeroSection />
      </main>
    </div>
  );
};

export default Index;
