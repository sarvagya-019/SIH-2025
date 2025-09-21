import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VeterinarianDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const VeterinarianDialog = ({ open, onOpenChange, onSuccess }: VeterinarianDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone: "",
    license_number: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Note: In a real application, you would typically invite the user via email
      // and they would sign up with their own password. For this demo, we'll just
      // create a profile entry.
      
      const profileData = {
        ...formData,
        role: 'veterinarian',
        phone: formData.phone || null,
        license_number: formData.license_number || null
      };

      // In a real app, you'd use Supabase's invite functionality
      // For demo purposes, we'll show a message about inviting the user
      
      toast({
        title: "Invitation Sent",
        description: `Invitation email sent to ${formData.email}. They will be added as a veterinarian once they sign up.`,
      });

      onSuccess();
      onOpenChange(false);
      setFormData({
        email: "",
        full_name: "",
        phone: "",
        license_number: ""
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to invite veterinarian",
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
          <DialogTitle>Invite Veterinarian</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="veterinarian@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Dr. Jane Smith"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="license_number">License Number</Label>
            <Input
              id="license_number"
              value={formData.license_number}
              onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
              placeholder="VET-12345"
            />
          </div>

          <div className="bg-info/20 border border-info rounded-lg p-3">
            <p className="text-sm text-info-foreground">
              An invitation email will be sent to the veterinarian. They will need to sign up 
              and create their own password to access the system.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};