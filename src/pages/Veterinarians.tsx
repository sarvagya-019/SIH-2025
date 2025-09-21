import { useState, useEffect } from "react";
import { Plus, Stethoscope, Phone, Mail, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VeterinarianDialog } from "@/components/veterinarians/VeterinarianDialog";

interface Veterinarian {
  id: string;
  full_name?: string;
  email: string;
  phone?: string;
  license_number?: string;
  role: string;
  created_at: string;
}

const Veterinarians = () => {
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchVeterinarians = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'veterinarian')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVeterinarians(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch veterinarians",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVeterinarians();
  }, []);

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Veterinarians</h1>
          <p className="text-muted-foreground">Manage veterinary professionals in your network</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Veterinarian
        </Button>
      </div>

      {/* Statistics Card */}
      <Card className="gradient-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Veterinarians</CardTitle>
          <Stethoscope className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{veterinarians.length}</div>
          <p className="text-xs text-muted-foreground">
            Licensed professionals
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          veterinarians.map((vet, index) => (
            <motion.div
              key={vet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="farm-card-hover cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 gradient-secondary rounded-full flex items-center justify-center">
                      <Stethoscope className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {vet.full_name || 'Unnamed Veterinarian'}
                      </CardTitle>
                      {vet.license_number && (
                        <div className="flex items-center gap-1 mt-1">
                          <Award className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            License: {vet.license_number}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {vet.email}
                  </div>
                  
                  {vet.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {vet.phone}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-2">
                    <Badge variant="outline" className="text-success border-success">
                      Active
                    </Badge>
                    <Button variant="outline" size="sm">
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}

        {veterinarians.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No veterinarians found</h3>
            <p>Add veterinary professionals to your network.</p>
          </div>
        )}
      </div>

      <VeterinarianDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchVeterinarians}
      />
    </div>
  );
};

export default Veterinarians;