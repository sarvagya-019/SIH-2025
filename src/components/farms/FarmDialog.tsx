import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FarmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const FarmDialog = ({ open, onOpenChange, onSuccess }: FarmDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    registration_number: "",
    farm_type: "",
    address: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const farmData = {
        ...formData,
        owner_id: user.id,
        registration_number: formData.registration_number || null,
        address: formData.address || null,
        farm_type: formData.farm_type || null
      };

      const { error } = await supabase
        .from('farms')
        .insert([farmData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Farm added successfully",
      });

      onSuccess();
      onOpenChange(false);
      setFormData({
        name: "",
        registration_number: "",
        farm_type: "",
        address: ""
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add farm",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Farm</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Farm Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter farm name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registration_number">Registration Number</Label>
            <Input
              id="registration_number"
              value={formData.registration_number}
              onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
              placeholder="Enter registration number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="farm_type">Farm Type</Label>
            <Select value={formData.farm_type} onValueChange={(value) => setFormData({ ...formData, farm_type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select farm type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dairy">Dairy Farm</SelectItem>
                <SelectItem value="beef">Beef Farm</SelectItem>
                <SelectItem value="poultry">Poultry Farm</SelectItem>
                <SelectItem value="sheep">Sheep Farm</SelectItem>
                <SelectItem value="goat">Goat Farm</SelectItem>
                <SelectItem value="pig">Pig Farm</SelectItem>
                <SelectItem value="mixed">Mixed Livestock</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter farm address"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Farm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};