import { motion } from 'framer-motion';
import { 
  Heart, 
  Pill, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Activity
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const stats = [
    {
      title: "Total Animals Monitored",
      value: "2,847",
      change: "+12% from last month",
      changeType: "positive" as const,
      icon: Heart,
      gradient: true
    },
    {
      title: "Active Treatments",
      value: "23",
      change: "-8% from last week", 
      changeType: "positive" as const,
      icon: Pill
    },
    {
      title: "Compliance Alerts",
      value: "3",
      change: "2 resolved today",
      changeType: "neutral" as const,
      icon: AlertTriangle
    },
    {
      title: "MRL Compliance Rate",
      value: "99.8%",
      change: "+0.2% this month",
      changeType: "positive" as const,
      icon: TrendingUp,
      gradient: true
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: "withdrawal_warning",
      severity: "medium",
      message: "Animal #2847 withdrawal period ends in 2 days",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "compliance_check",
      severity: "low",
      message: "Weekly compliance report generated",
      time: "1 day ago"
    },
    {
      id: 3,
      type: "treatment_update",
      severity: "high",
      message: "New treatment started for Animal #1923",
      time: "3 hours ago"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-danger/10 text-danger border-danger/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your farm's antimicrobial usage and compliance status
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Compliance Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="data-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Compliance Overview
              </CardTitle>
              <CardDescription>
                Current compliance status across all monitored parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">MRL Compliance</span>
                  <span className="text-sm text-muted-foreground">99.8%</span>
                </div>
                <Progress value={99.8} className="h-2" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Withdrawal Period Tracking</span>
                  <span className="text-sm text-muted-foreground">96.2%</span>
                </div>
                <Progress value={96.2} className="h-2" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Documentation Completeness</span>
                  <span className="text-sm text-muted-foreground">94.5%</span>
                </div>
                <Progress value={94.5} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="data-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Recent Alerts
              </CardTitle>
              <CardDescription>
                Latest compliance notifications and warnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 bg-card/50"
                  >
                    <Badge className={`${getSeverityColor(alert.severity)} text-xs`}>
                      {alert.severity}
                    </Badge>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {alert.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="data-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts for efficient farm management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 p-4 rounded-lg border border-border/50 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-smooth"
              >
                <Heart className="w-6 h-6 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Add Animal</p>
                  <p className="text-sm text-muted-foreground">Register new livestock</p>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 p-4 rounded-lg border border-border/50 bg-gradient-to-r from-accent/5 to-accent/10 hover:from-accent/10 hover:to-accent/20 transition-smooth"
              >
                <Pill className="w-6 h-6 text-accent" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Record Treatment</p>
                  <p className="text-sm text-muted-foreground">Log antimicrobial use</p>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 p-4 rounded-lg border border-border/50 bg-gradient-to-r from-success/5 to-success/10 hover:from-success/10 hover:to-success/20 transition-smooth"
              >
                <Calendar className="w-6 h-6 text-success" />
                <div className="text-left">
                  <p className="font-medium text-foreground">Schedule Check</p>
                  <p className="text-sm text-muted-foreground">Plan compliance review</p>
                </div>
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}