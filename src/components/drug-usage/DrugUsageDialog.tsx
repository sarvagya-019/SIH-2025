import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { addDays, format } from "date-fns";

interface DrugUsageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface Animal {
  id: string;
  tag_number: string;
  species: string;
}

interface Drug {
  id: string;
  name: string;
  active_ingredient: string;
  withdrawal_period_meat?: number;
  withdrawal_period_milk?: number;
}

export const DrugUsageDialog = ({ open, onOpenChange, onSuccess }: DrugUsageDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [formData, setFormData] = useState({
    animal_id: "",
    drug_id: "",
    dosage: "",
    dosage_unit: "ml",
    duration_days: "",
    start_date: format(new Date(), 'yyyy-MM-dd'),
    treatment_reason: "",
    frequency: "once_daily",
    administration_route: "",
    notes: ""
  });
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const [animalsResult, drugsResult] = await Promise.all([
        supabase.from('animals').select('id, tag_number, species').eq('status', 'active'),
        supabase.from('drugs').select('*').order('name')
      ]);

      if (animalsResult.error) throw animalsResult.error;
      if (drugsResult.error) throw drugsResult.error;

      setAnimals(animalsResult.data || []);
      setDrugs(drugsResult.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    if (formData.drug_id) {
      const drug = drugs.find(d => d.id === formData.drug_id);
      setSelectedDrug(drug || null);
    }
  }, [formData.drug_id, drugs]);

  const calculateWithdrawalDate = () => {
    if (!selectedDrug || !formData.duration_days) return null;
    
    const startDate = new Date(formData.start_date);
    const treatmentEndDate = addDays(startDate, parseInt(formData.duration_days));
    const withdrawalPeriod = selectedDrug.withdrawal_period_meat || 0;
    
    return addDays(treatmentEndDate, withdrawalPeriod);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const startDate = new Date(formData.start_date);
      const endDate = addDays(startDate, parseInt(formData.duration_days));
      const withdrawalEndDate = calculateWithdrawalDate();

      const usageData = {
        ...formData,
        dosage: parseFloat(formData.dosage),
        duration_days: parseInt(formData.duration_days),
        end_date: format(endDate, 'yyyy-MM-dd'),
        withdrawal_end_date: withdrawalEndDate ? format(withdrawalEndDate, 'yyyy-MM-dd') : format(endDate, 'yyyy-MM-dd'),
        compliance_status: 'compliant'
      };

      const { error } = await supabase
        .from('drug_usage')
        .insert([usageData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Drug usage recorded successfully",
      });

      onSuccess();
      onOpenChange(false);
      setFormData({
        animal_id: "",
        drug_id: "",
        dosage: "",
        dosage_unit: "ml",
        duration_days: "",
        start_date: format(new Date(), 'yyyy-MM-dd'),
        treatment_reason: "",
        frequency: "once_daily",
        administration_route: "",
        notes: ""
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to record drug usage",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Record Drug Treatment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="animal_id">Animal *</Label>
              <Select value={formData.animal_id} onValueChange={(value) => setFormData({ ...formData, animal_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select animal" />
                </SelectTrigger>
                <SelectContent>
                  {animals.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id}>
                      Tag #{animal.tag_number} ({animal.species})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="drug_id">Drug *</Label>
              <Select value={formData.drug_id} onValueChange={(value) => setFormData({ ...formData, drug_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select drug" />
                </SelectTrigger>
                <SelectContent>
                  {drugs.map((drug) => (
                    <SelectItem key={drug.id} value={drug.id}>
                      {drug.name} ({drug.active_ingredient})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage *</Label>
              <Input
                id="dosage"
                type="number"
                step="0.1"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosage_unit">Unit</Label>
              <Select value={formData.dosage_unit} onValueChange={(value) => setFormData({ ...formData, dosage_unit: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="mg">mg</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="cc">cc</SelectItem>
                  <SelectItem value="tablets">tablets</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_days">Duration (days) *</Label>
              <Input
                id="duration_days"
                type="number"
                min="1"
                value={formData.duration_days}
                onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once_daily">Once Daily</SelectItem>
                  <SelectItem value="twice_daily">Twice Daily</SelectItem>
                  <SelectItem value="three_times_daily">Three Times Daily</SelectItem>
                  <SelectItem value="as_needed">As Needed</SelectItem>
                  <SelectItem value="single_dose">Single Dose</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment_reason">Treatment Reason *</Label>
            <Input
              id="treatment_reason"
              value={formData.treatment_reason}
              onChange={(e) => setFormData({ ...formData, treatment_reason: e.target.value })}
              placeholder="e.g., Respiratory infection, Mastitis, Foot rot"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="administration_route">Administration Route</Label>
            <Select value={formData.administration_route} onValueChange={(value) => setFormData({ ...formData, administration_route: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oral">Oral</SelectItem>
                <SelectItem value="intramuscular">Intramuscular</SelectItem>
                <SelectItem value="subcutaneous">Subcutaneous</SelectItem>
                <SelectItem value="intravenous">Intravenous</SelectItem>
                <SelectItem value="topical">Topical</SelectItem>
                <SelectItem value="intramamary">Intramamary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {calculateWithdrawalDate() && (
            <div className="p-3 bg-warning/20 border border-warning rounded-lg">
              <p className="text-sm font-medium text-warning-foreground">
                Withdrawal Period: Until {format(calculateWithdrawalDate()!, 'MMM dd, yyyy')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                No products from this animal should be used for human consumption until this date.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes about the treatment..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Recording..." : "Record Treatment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};