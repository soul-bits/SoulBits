import { motion } from "motion/react";
import { Trophy, Mic, Calendar, Users } from "lucide-react";

const events = [
  {
    title: "TED AI SF Hackathon Winner",
    date: "October 2025",
    description: "TED AI San Francisco Hackathon Winner - Google Gemini",
    icon: Trophy,
    image: "https://images.unsplash.com/photo-1698502744308-b187f6612ead?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWNrYXRob24lMjB0ZWFtJTIwd2lubmVyfGVufDF8fHx8MTc2MTMyNzE5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "Buildathon 2025 Awardee",
    date: "July 2025",
    description: "Special Award in Graph Thinking - Recognized for innovative approach to graph-based problem solving.",
    icon: Trophy,
    image: "https://images.unsplash.com/photo-1660165458059-57cfb6cc87e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMHRlY2hub2xvZ3klMjBhYnN0cmFjdHxlbnwxfHx8fDE3NjEzMDM0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function EventsTimeline() {
  return (
    <section id="events" className="py-24 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl mb-4">Events & Wins</h2>
          <p className="text-xl text-muted-foreground mb-2">
            Our journey of achievements and milestones
          </p>
          <p className="text-primary italic">This is just the beginning.</p>
        </motion.div>

        {/* Horizontal Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -translate-y-1/2"></div>

          {/* Scrollable Container */}
          <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide">
            {events.map((event, index) => {
              const Icon = event.icon;
              return (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="flex-shrink-0 w-80 relative"
                >
                  {/* Connector Dot */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary border-4 border-background shadow-lg shadow-primary/50 z-10"></div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ 
                      y: -12, 
                      boxShadow: "0 25px 50px rgba(15, 242, 232, 0.3)"
                    }}
                    className="bg-card rounded-2xl overflow-hidden border border-border/50 mt-16 cursor-pointer group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
                      
                      {/* Icon */}
                      <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-sm text-primary mb-2">{event.date}</p>
                      <h3 className="text-xl mb-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Scroll Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, 10, 0] }}
            transition={{ 
              opacity: { duration: 0.6, delay: 0.8 },
              x: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="text-center mt-8 text-muted-foreground text-sm"
          >
            ← Scroll to explore →
          </motion.div>
        </div>
      </div>
    </section>
  );
}
