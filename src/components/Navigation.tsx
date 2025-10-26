import { motion } from "motion/react";
import { Button } from "./ui/button";

export function Navigation() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-[1440px] mx-auto px-20 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center">
          <span style={{ fontFamily: "var(--font-courier)" }} className="text-4xl text-primary font-bold">
            #
          </span>
          <span style={{ fontFamily: "var(--font-script)" }} className="text-4xl text-primary">
            Soul
          </span>
          <span style={{ fontFamily: "var(--font-courier)" }} className="text-4xl text-primary font-bold">
            Bits
          </span>
        </a>

        <div className="flex items-center gap-8">
          <a
            href="#projects"
            className="text-foreground hover:text-primary transition-colors"
          >
            Projects
          </a>
          <a
            href="#events"
            className="text-foreground hover:text-primary transition-colors"
          >
            Events
          </a>
          {/* <a
            href="#learn"
            className="text-foreground hover:text-primary transition-colors"
          >
            Learn
          </a> */}
          <a
            href="#thoughts"
            className="text-foreground hover:text-primary transition-colors"
          >
            Thoughts
          </a>
          <a
            href="#about"
            className="text-foreground hover:text-primary transition-colors"
          >
            About
          </a>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <a href="mailto:sb.soulbits@gmail.com">Contact</a>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
