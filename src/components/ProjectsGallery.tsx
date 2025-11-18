import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { Github, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

const projects = [
  {
    title: "Tiny Legends",
    description: "AI-powered platform that creates engaging, age-appropriate content for children. Combines comic book analysis, AI character extraction, story generation, and visual storytelling experiences.",
    image: "https://img.youtube.com/vi/d2wVIfOglys/maxresdefault.jpg",
    tags: ["TypeScript", "AI", "React", "MIT License"],
    githubUrl: "https://github.com/soul-bits/tiny_legends",
    demoUrl: "https://youtu.be/d2wVIfOglys",
  },
  {
    title: "Upbeat Live Music Coach",
    description: "Real-time, AI-powered piano tutor built on Gemini offering a proactive, real-time learning experience, bridging the gap between a private tutor and digital learning tools.",
    image: "https://img.youtube.com/vi/R-OAZ-IH2NE/maxresdefault.jpg",
    tags: ["TypeScript", "AI", "Gemini", "MIT License"],
    githubUrl: "https://github.com/soul-bits/upbeat-LiveMusicCoach",
    demoUrl: "https://www.youtube.com/watch?v=R-OAZ-IH2NE&list=PLEFt4nVWzKBKpx5h_FCVg-K3oKxe2R8bY",
  },
  {
    title: "Adulting · Alfred Life Assistant",
    description: "AI life concierge that reads your calendar, handles the micro-tasks behind every event, and lets you ask Alfred directly to take care of anything so you can stay the superhero of your life.",
    image: "https://img.youtube.com/vi/4oqPPJPyFXc/maxresdefault.jpg",
    tags: ["React", "TypeScript", "AI", "Life Assistant"],
    githubUrl: "https://github.com/soul-bits/adulting",
    demoUrl: "https://www.youtube.com/watch?v=4oqPPJPyFXc",
  },
  {
    title: "EchoDeck",
    description: "AI-powered system that takes a short spoken prompt (≈3 minutes) and produces a polished presentation in multiple formats (PDF, HTML deck, narrated video).",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVzZW50YXRpb24lMjBzbGlkZXN8ZW58MXx8fHwxNzYxMzI3NzUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["TypeScript", "AI", "Presentations"],
    githubUrl: "https://github.com/soul-bits/EchoDeck",
  },
  {
    title: "Data Structures and Algo Solutions",
    description: "Collection of DSA/LeetCode problem solutions with detailed explanations and optimized approaches for coding interviews.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGdvcml0aG0lMjBkYXRhJTIwc3RydWN0dXJlfGVufDF8fHx8fDE3NjEzMjc3NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Python", "Algorithms", "Data Structures"],
    githubUrl: "https://github.com/soul-bits/leetcode-solutions",
    demoUrl: "https://www.youtube.com/@SoulBitsBuilds/playlists",
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
                    asChild
                  >
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-5 h-5" />
                    </a>
                  </Button>
                  {project.demoUrl && (
                    <Button
                      size="icon"
                      className="bg-primary/90 text-primary-foreground hover:bg-primary hover:scale-110 transition-all"
                      asChild
                    >
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </Button>
                  )}
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
