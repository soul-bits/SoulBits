import { motion } from "motion/react";
import { Github, Linkedin, Mail, Globe } from "lucide-react";
import { Button } from "./ui/button";
import divyaPhoto from "../assets/Divya.jpeg";
import achinPhoto from "../assets/Achin.jpeg";

export function DuoIntroduction() {
  return (
    <section id="about" className="py-24 bg-card/30">
      <div className="max-w-[1440px] mx-auto px-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl mb-4">Meet the Bits</h2>
          <p className="text-xl text-muted-foreground">
            Two minds, countless ideas, infinite possibilities
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-12 mb-12">
          {/* Divya Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(15, 242, 232, 0.2)" }}
            className="bg-card rounded-2xl p-8 border border-border/50 backdrop-blur-sm transition-all"
          >
            <div className="relative w-full aspect-square mb-6 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
              <img
                src={divyaPhoto}
                alt="Divya Mahajan"
                className="w-full h-full object-cover"
              />
            </div>
            
            <h3 style={{ fontFamily: "var(--font-courier)" }} className="text-3xl mb-3">
              Divya Mahajan
            </h3>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Software Engineer with a passion for building intuitive experiences. 
              Turning complex problems into elegant solutions, one line of code at a time.
            </p>

            <div className="flex gap-3 mb-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/20 hover:text-primary"
                asChild
              >
                <a href="https://linkedin.com/in/dm-divyamahajan" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/20 hover:text-primary"
                asChild
              >
                <a href="https://github.com/dm-divyamahajan" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/20 hover:text-primary"
                asChild
              >
                <a href="mailto:dm.divya.mahajan@gmail.com">
                  <Mail className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Achin Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(15, 242, 232, 0.2)" }}
            className="bg-card rounded-2xl p-8 border border-border/50 backdrop-blur-sm transition-all"
          >
            <div className="relative w-full aspect-square mb-6 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
              <img
                src={achinPhoto}
                alt="Achin Gupta"
                className="w-full h-full object-cover"
              />
            </div>
            
            <h3 style={{ fontFamily: "var(--font-courier)" }} className="text-3xl mb-3">
              Achin Gupta
            </h3>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Ideator and builder of innovative systems. Staff Software Engineer with 8+ years crafting large-scale distributed platforms and fault-tolerant pipelines processing billions of metrics daily. Transforming complex challenges into elegant, scalable solutions.
            </p>

            <div className="flex gap-3 mb-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/20 hover:text-primary"
                asChild
              >
                <a href="https://linkedin.com/in/guptaachin" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/20 hover:text-primary"
                asChild
              >
                <a href="https://github.com/guptaachin" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/20 hover:text-primary"
                asChild
              >
                <a href="mailto:guptaachin01@gmail.com">
                  <Mail className="w-5 h-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/20 hover:text-primary"
                asChild
              >
                <a href="https://guptaachin.vercel.app/" target="_blank" rel="noopener noreferrer">
                  <Globe className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Common Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center space-y-4"
        >
          <p className="text-muted-foreground">Reach us together at</p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="mailto:sb.soulbits@gmail.com"
              className="text-xl text-primary hover:underline"
            >
              sb.soulbits@gmail.com
            </a>
            <span className="text-muted-foreground">|</span>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/20 hover:text-primary"
              asChild
            >
              <a href="https://github.com/soul-bits" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}