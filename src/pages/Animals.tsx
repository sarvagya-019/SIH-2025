import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AnimalDialog } from "@/components/animals/AnimalDialog";

interface Animal {
  id: string;
  tag_number: string;
  species: string;
  breed?: string;
  weight?: number;
  birth_date?: string;
  status: string;
  farm_id: string;
  farms?: { name: string };
}

const Animals = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchAnimals = async () => {
    try {
      const { data, error } = await supabase
        .from('animals')
        .select(`
          *,
          farms (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnimals(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch animals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const filteredAnimals = animals.filter(animal =>
    animal.tag_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (animal.breed && animal.breed.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'sick': return 'bg-danger text-danger-foreground';
      case 'treatment': return 'bg-warning text-warning-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Animals</h1>
          <p className="text-muted-foreground">Manage your livestock inventory</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Animal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search animals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-muted rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAnimals.map((animal, index) => (
                <motion.div
                  key={animal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      {animal.tag_number.slice(-2)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Tag #{animal.tag_number}</h3>
                      <p className="text-sm text-muted-foreground">
                        {animal.species} • {animal.breed || 'Unknown breed'} • {animal.farms?.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {animal.weight && (
                      <span className="text-sm text-muted-foreground">{animal.weight}kg</span>
                    )}
                    <Badge className={getStatusColor(animal.status)}>
                      {animal.status}
                    </Badge>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
              
              {filteredAnimals.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  No animals found matching your search.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AnimalDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchAnimals}
      />
    </div>
  );
};

export default Animals;