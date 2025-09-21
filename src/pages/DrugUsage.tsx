import { useState, useEffect } from "react";
import { Plus, Calendar, AlertTriangle, Pill } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DrugUsageDialog } from "@/components/drug-usage/DrugUsageDialog";
import { format } from "date-fns";

interface DrugUsage {
  id: string;
  animal_id: string;
  drug_id: string;
  dosage: number;
  dosage_unit: string;
  start_date: string;
  end_date: string;
  withdrawal_end_date: string;
  treatment_reason: string;
  compliance_status: string;
  animals?: { tag_number: string; species: string };
  drugs?: { name: string; active_ingredient: string };
}

const DrugUsage = () => {
  const [drugUsages, setDrugUsages] = useState<DrugUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchDrugUsages = async () => {
    try {
      const { data, error } = await supabase
        .from('drug_usage')
        .select(`
          *,
          animals (tag_number, species),
          drugs (name, active_ingredient)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDrugUsages(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch drug usage records",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrugUsages();
  }, []);

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-success text-success-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      case 'violation': return 'bg-danger text-danger-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const isWithdrawalActive = (withdrawalDate: string) => {
    return new Date(withdrawalDate) > new Date();
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Drug Usage</h1>
          <p className="text-muted-foreground">Monitor antimicrobial treatments and compliance</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Record Treatment
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Treatments</CardTitle>
            <Pill className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {drugUsages.filter(du => new Date(du.end_date) >= new Date()).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Withdrawal Periods</CardTitle>
            <Calendar className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {drugUsages.filter(du => isWithdrawalActive(du.withdrawal_end_date)).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {drugUsages.filter(du => du.compliance_status !== 'compliant').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Drug Usage Records</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-muted rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {drugUsages.map((usage, index) => (
                <motion.div
                  key={usage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 gradient-secondary rounded-full flex items-center justify-center">
                      <Pill className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {usage.drugs?.name} - Animal #{usage.animals?.tag_number}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {usage.treatment_reason} • {usage.dosage} {usage.dosage_unit}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Treatment: {format(new Date(usage.start_date), 'MMM dd')} - {format(new Date(usage.end_date), 'MMM dd')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {isWithdrawalActive(usage.withdrawal_end_date) && (
                      <Badge variant="outline" className="text-warning border-warning">
                        Withdrawal until {format(new Date(usage.withdrawal_end_date), 'MMM dd')}
                      </Badge>
                    )}
                    <Badge className={getComplianceColor(usage.compliance_status)}>
                      {usage.compliance_status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
              
              {drugUsages.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  No drug usage records found.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <DrugUsageDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchDrugUsages}
      />
    </div>
  );
};

export default DrugUsage;