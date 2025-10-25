import { motion } from "motion/react";
import { ExternalLink, Linkedin } from "lucide-react";
import { Card } from "./ui/card";
import { thoughtsData } from "../data/thoughts";

export function ThoughtsSection() {
  return (
    <section id="thoughts" className="py-24 bg-card/30">
      <div className="max-w-[1440px] mx-auto px-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 flex items-center justify-center gap-3">
            <span style={{ fontFamily: "var(--font-courier)" }} className="text-primary font-bold">
              #
            </span>
            <span>Thoughts</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our insights, learnings, and reflections on building meaningful technology
          </p>
        </motion.div>

        {/* Thoughts Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {thoughtsData.map((thought, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <a
                href={thought.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <Card className="h-full p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 group relative overflow-hidden">
                  {/* Glassmorphism effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    {/* LinkedIn Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Linkedin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-foreground">{thought.author}</p>
                          <p className="text-xs text-muted-foreground">{thought.date}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>

                    {/* Content */}
                    <h3 className="mb-3 text-foreground group-hover:text-primary transition-colors">
                      {thought.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {thought.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {thought.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </Card>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground">
            Want to see more?{" "}
            <a
              href="https://www.linkedin.com/in/dm-divyamahajan/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Follow Divya
            </a>
            {" and "}
            <a
              href="https://www.linkedin.com/in/guptaachin/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Follow Achin
            </a>
            {" on LinkedIn"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
