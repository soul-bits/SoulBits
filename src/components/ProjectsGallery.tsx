import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { Github, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

const projects = [
  {
    title: "CodeMentor AI",
    description: "Interactive coding tutor powered by AI",
    image: "https://images.unsplash.com/photo-1719400471588-575b23e27bd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjB3b3Jrc3BhY2UlMjB0ZWNofGVufDF8fHx8MTc2MTMyNjQ2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Python", "OpenAI", "React"],
  },
  {
    title: "DataViz Studio",
    description: "Beautiful data visualizations made simple",
    image: "https://images.unsplash.com/photo-1660165458059-57cfb6cc87e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMHRlY2hub2xvZ3klMjBhYnN0cmFjdHxlbnwxfHx8fDE3NjEzMDM0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["D3.js", "TypeScript", "Node.js"],
  },
  {
    title: "SmartNotes",
    description: "AI-enhanced note-taking for students",
    image: "https://images.unsplash.com/photo-1719400471588-575b23e27bd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjB3b3Jrc3BhY2UlMjB0ZWNofGVufDF8fHx8MTc2MTMyNjQ2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["React", "Firebase", "AI/ML"],
  },
  {
    title: "DevFlow",
    description: "Streamlined workflow automation tool",
    image: "https://images.unsplash.com/photo-1660165458059-57cfb6cc87e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMHRlY2hub2xvZ3klMjBhYnN0cmFjdHxlbnwxfHx8fDE3NjEzMDM0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Next.js", "PostgreSQL", "API"],
  },
  {
    title: "SkillMap",
    description: "Visual learning path generator",
    image: "https://images.unsplash.com/photo-1719400471588-575b23e27bd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjB3b3Jrc3BhY2UlMjB0ZWNofGVufDF8fHx8MTc2MTMyNjQ2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["React", "GraphQL", "Neo4j"],
  },
  {
    title: "BugHunter Pro",
    description: "Intelligent debugging assistant",
    image: "https://images.unsplash.com/photo-1660165458059-57cfb6cc87e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMHRlY2hub2xvZ3klMjBhYnN0cmFjdHxlbnwxfHx8fDE3NjEzMDM0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Python", "AI", "VS Code"],
  },
];

export function ProjectsGallery() {
  return (
    <section id="projects" className="py-24 bg-card/30">
      <div className="max-w-[1440px] mx-auto px-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl mb-4">Projects Gallery</h2>
          <p className="text-xl text-muted-foreground">
            Explore our collection of innovative solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                y: -8, 
                rotateY: 2,
                rotateX: -2,
                boxShadow: "0 25px 50px rgba(15, 242, 232, 0.3)"
              }}
              className="group relative bg-card rounded-xl overflow-hidden border border-border/50 cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
                
                {/* Hover Icons */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    className="bg-primary/90 text-primary-foreground hover:bg-primary hover:scale-110 transition-all"
                  >
                    <Github className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    className="bg-primary/90 text-primary-foreground hover:bg-primary hover:scale-110 transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Neon Border Glow */}
              <div className="absolute inset-0 rounded-xl border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
