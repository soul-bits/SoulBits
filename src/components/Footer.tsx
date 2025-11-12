import { motion } from "motion/react";
import { Github, Linkedin, Mail, Youtube, Twitter } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border/50 py-12">
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="grid grid-cols-3 gap-12 mb-12">
          {/* Logo & Tagline */}
          <div>
            <a href="#" className="flex items-center mb-4">
              <span style={{ fontFamily: "var(--font-courier)" }} className="text-3xl text-primary font-bold">
                #
              </span>
              <span style={{ fontFamily: "var(--font-script)" }} className="text-3xl text-primary">
                Soul
              </span>
              <span style={{ fontFamily: "var(--font-courier)" }} className="text-3xl text-primary font-bold">
                Bits
              </span>
            </a>
            <p className="text-muted-foreground text-sm">
              Building tech that teaches, creates, and inspires.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              <a href="#projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Projects
              </a>
              <a href="#events" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Events
              </a>
              <a href="#learn" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Learn
              </a>
              {/* <a href="#thoughts" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Thoughts
              </a> */}
              <a href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About
              </a>
            </nav>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-sm mb-4">Connect</h4>
            <div className="flex gap-3 mb-6">
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
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/20 hover:text-primary"
                asChild
              >
                <a href="https://www.linkedin.com/search/results/all/?keywords=%23soulbits" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/20 hover:text-primary"
                asChild
              >
                <a href="https://www.youtube.com/@SoulBitsBuilds" target="_blank" rel="noopener noreferrer">
                  <Youtube className="w-5 h-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/20 hover:text-primary"
                asChild
              >
                <a href="mailto:sb.soulbits@gmail.com">
                  <Mail className="w-5 h-5" />
                </a>
              </Button>
            </div>
            <a
              href="mailto:sb.soulbits@gmail.com"
              className="text-sm text-primary hover:underline"
            >
              sb.soulbits@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom Line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-border/50 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Made with curiosity and caffeine by{" "}
            <span className="text-primary">#SoulBits</span> © 2025
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
