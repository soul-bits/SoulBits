import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExternalLink, Github, Play } from "lucide-react";

export function FeaturedProject() {
  return (
    <section id="featured" className="py-24">
      <div className="max-w-[1440px] mx-auto px-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl mb-4">Featured Project</h2>
          <p className="text-xl text-muted-foreground">
            Our latest creation that's making waves
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-50 group-hover:opacity-75"></div>
          
          <div className="relative bg-card rounded-2xl overflow-hidden border border-border/50">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Video/Image Section */}
              <div className="relative aspect-video md:aspect-auto bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center p-12">
                <a 
                  href="https://www.youtube.com/watch?v=d2wVIfOglys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative w-full h-full rounded-xl overflow-hidden group cursor-pointer"
                >
                  <img
                    src="https://img.youtube.com/vi/d2wVIfOglys/maxresdefault.jpg"
                    alt="Tiny Legends Demo Video"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center"
                    >
                      <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                    </motion.div>
                  </div>
                </a>
              </div>

              {/* Content Section */}
              <div className="p-12 flex flex-col justify-center">
                <h3 className="text-4xl mb-4">
                  Tiny Legends
                </h3>
                <p className="text-xl text-primary mb-4">
                  AI-Powered Children's Story Creation Platform
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  An innovative platform that transforms comic books into interactive children's stories 
                  through intelligent character extraction, story generation, and visual storytelling. 
                  Built with LlamaIndex, CopilotKit, and OpenAI.
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    LlamaIndex
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    CopilotKit
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    OpenAI
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    React
                  </Badge>
                </div>

                <div className="flex gap-4">
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/50 transition-all"
                    asChild
                  >
                    <a href="https://youtu.be/d2wVIfOglys" target="_blank" rel="noopener noreferrer">
                      <Play className="w-4 h-4 mr-2" />
                      View Demo
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    asChild
                  >
                    <a href="https://github.com/soul-bits/tiny_legends" target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-2 mt-8 text-muted-foreground"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="text-sm">More featured projects coming soon</span>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
        </motion.div>
      </div>
    </section>
  );
}
