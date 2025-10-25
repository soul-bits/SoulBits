import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Zap, BookOpen, Share2, RotateCw } from "lucide-react";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-20">
      <div className="max-w-[1440px] mx-auto px-20 w-full">
        {/* Centered Brand Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto space-y-12"
        >
          <div className="space-y-6">
            <h1 className="flex items-baseline justify-center">
              <motion.span
                style={{ fontFamily: "var(--font-courier)" }}
                className="text-8xl text-foreground font-bold"
                whileHover={{ scale: 1.05, color: "#0FF2E8" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                #
              </motion.span>
              <motion.span
                style={{ fontFamily: "var(--font-script)" }}
                className="text-8xl text-foreground"
                whileHover={{ scale: 1.05, color: "#0FF2E8" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Soul
              </motion.span>
              <motion.span
                style={{ fontFamily: "var(--font-courier)" }}
                className="text-8xl text-foreground font-bold"
                whileHover={{ scale: 1.05, color: "#0FF2E8" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Bits
              </motion.span>
            </h1>
            
            {/* Visual Cycle */}
            <div className="flex items-center justify-center gap-6 flex-wrap max-w-4xl mx-auto my-8">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <span className="text-2xl text-foreground">Hack</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-primary text-2xl"
              >
                →
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <span className="text-2xl text-foreground">Learn</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-primary text-2xl"
              >
                →
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-primary" />
                </div>
                <span className="text-2xl text-foreground">Share</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="text-primary text-2xl"
              >
                →
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <RotateCw className="w-6 h-6 text-primary" />
                </div>
                <span className="text-2xl text-foreground">Repeat</span>
              </motion.div>
            </div>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We prototype AI tools at hackathons, learn from building, and share our knowledge with the community through tutorials and open-source projects.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/50 transition-all px-8 py-6"
            >
              <a href="#projects">Explore Projects</a>
            </Button>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all px-8 py-6"
            >
              <a href="#featured">Watch Demos</a>
            </Button>
          </div>

          {/* Brand Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative mt-16"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 blur-3xl"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}