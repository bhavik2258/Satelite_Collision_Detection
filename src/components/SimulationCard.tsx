import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SimulationCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  onRun: (simType: string) => void;
  onDownload: (simType: string) => void;
}

const SimulationCard = ({ id, title, description, image, onRun, onDownload }: SimulationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="glass-panel border-neon-cyan/20 hover:border-neon-cyan/40 transition-all duration-500 group hover:scale-105 hover:glow-soft"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden rounded-t-xl">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-space-dark/80 to-transparent" />
          
          {/* Animated overlay on hover */}
          <div className={`absolute inset-0 bg-primary/10 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute inset-0 border border-primary/50 rounded-t-xl animate-pulse-glow" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <CardTitle className="text-xl font-semibold text-foreground font-poppins">
          {title}
        </CardTitle>
        
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        <div className="flex gap-3 pt-2">
          <Button 
            onClick={() => onRun(id)}
            className="bg-primary text-primary-foreground glow-cyan hover:glow-cyan flex-1 rounded-lg hover:scale-105 transition-all duration-300"
          >
            Run
          </Button>
          <Button 
            variant="outline"
            onClick={() => onDownload(id)}
            className="border-neon-green text-accent hover:bg-accent/10 rounded-lg hover:scale-105 transition-all duration-300"
          >
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationCard;