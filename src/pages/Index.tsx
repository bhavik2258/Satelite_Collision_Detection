import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SpaceNavbar from "@/components/SpaceNavbar";
import SpaceHero from "@/components/SpaceHero";
import SimulationCard from "@/components/SimulationCard";
import { Card, CardContent } from "@/components/ui/card";
import orbitalSimulation from "@/assets/orbital-simulation.jpg";
import collisionSimulation from "@/assets/collision-simulation.jpg";
import satelliteTracking from "@/assets/satellite-tracking.jpg";

const Index = () => {
  const navigate = useNavigate();

  const handleRunSimulation = (simType: string) => {
    switch(simType) {
      case 'orbit':
        navigate('/orbital-mechanics');
        break;
      case 'tracking':
        navigate('/real-tracking');
        break;
      case 'collisions':
        navigate('/collisions');
        break;
      default:
        break;
    }
  };

  const handleDownloadSimulation = (simType: string) => {
    // TODO: Connect Backend API here
    console.log(`Downloading ${simType} simulation data...`);
  };

  const simulations = [
    {
      id: "orbit",
      title: "Orbital Mechanics",
      description: "Simulate circular and elliptical orbits with adjustable altitude and velocity parameters.",
      image: orbitalSimulation
    },
    {
      id: "tracking",
      title: "Real Satellite Tracking",
      description: "Visualizes the orbits of multiple real satellites in 3D using their TLE data.",
      image: satelliteTracking
    },
    {
      id: "collisions",
      title: "Satellite Collisions",
      description: "Explore collision scenarios and debris field generation in space environments.",
      image: collisionSimulation
    }
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <SpaceNavbar />
      
      {/* Hero Section */}
      <SpaceHero />
      
      {/* Quick Intro */}
      <section id="intro" className="py-16 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="glass-panel border-neon-cyan/20 glow-soft">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4 font-poppins">
                  Fast, accurate & interactive
                </h3>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Each simulation is optimized for the web and includes export options. 
                  Click "Run" to navigate to the full-screen simulation interface.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      
      {/* Simulations Grid */}
      <section id="simulations" className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4 font-poppins">
              Space Simulations
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore different aspects of space physics through interactive simulations
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {simulations.map((sim, index) => (
              <motion.div
                key={sim.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SimulationCard
                  id={sim.id}
                  title={sim.title}
                  description={sim.description}
                  image={sim.image}
                  onRun={handleRunSimulation}
                  onDownload={handleDownloadSimulation}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="animate-fade-in-up">
              <h3 className="text-3xl font-bold text-foreground mb-6 font-poppins">
                About this project
              </h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Built as an interactive set of experiments for learning classical mechanics and visualization techniques.
                </p>
                <p>
                  Space is vast and expansive, but Earth's orbit is becoming increasingly crowded with satellites, 
                  space debris, and active spacecraft. Collisions in space aren't just theoretical problems—they've 
                  already happened, creating thousands of debris pieces that threaten future space missions.
                </p>
                <p>
                  One of the most well-known satellite-on-satellite collisions occurred on February 10, 2009, 
                  when an Iridium-33 communications satellite and the inactive Russian Cosmos-2251 satellite 
                  collided over Siberia, generating a massive cloud of debris.
                </p>
              </div>
            </div>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Card className="glass-panel border-neon-purple/20 glow-soft">
                <CardContent className="p-8">
                  <h4 className="text-xl font-semibold text-foreground mb-4 font-poppins">
                    Mission Critical
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    With thousands of satellites already in orbit and more launching every year, 
                    space agencies must actively monitor and predict potential collisions. Scientists use 
                    orbital mechanics, real-time tracking, and collision-avoidance algorithms to keep satellites safe.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 rounded-lg bg-space-medium/50">
                      <div className="text-2xl font-bold text-primary">34,000+</div>
                      <div className="text-muted-foreground">Objects Tracked</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-space-medium/50">
                      <div className="text-2xl font-bold text-secondary">5,000+</div>
                      <div className="text-muted-foreground">Active Satellites</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-neon-cyan/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-muted-foreground">
            <div>
              &copy; {new Date().getFullYear()} Satellite Orbital Dynamics Simulator
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
