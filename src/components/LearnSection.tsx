import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Play, ExternalLink } from "lucide-react";

const videos = [
  {
    title: "LeetCode Daily Challenge",
    description: "Solving hard problems with elegant solutions",
    thumbnail: "https://images.unsplash.com/photo-1719400471588-575b23e27bd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjB3b3Jrc3BhY2UlMjB0ZWNofGVufDF8fHx8MTc2MTMyNjQ2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    duration: "25:30",
    category: "Coding",
  },
  {
    title: "Building AI Apps with LlamaIndex",
    description: "Complete tutorial series on RAG applications",
    thumbnail: "https://images.unsplash.com/photo-1660165458059-57cfb6cc87e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMHRlY2hub2xvZ3klMjBhYnN0cmFjdHxlbnwxfHx8fDE3NjEzMDM0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    duration: "42:15",
    category: "AI/ML",
  },
  {
    title: "React Patterns You Should Know",
    description: "Advanced patterns for scalable React apps",
    thumbnail: "https://images.unsplash.com/photo-1719400471588-575b23e27bd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjB3b3Jrc3BhY2UlMjB0ZWNofGVufDF8fHx8MTc2MTMyNjQ2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    duration: "35:48",
    category: "Web Dev",
  },
];

export function LearnSection() {
  return (
    <section id="learn" className="py-24 bg-card/30">
      <div className="max-w-[1440px] mx-auto px-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl mb-4">Learn with SoulBits</h2>
          <p className="text-xl text-muted-foreground">
            Free tutorials, challenges, and insights from our journey
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-8 mb-12">
          {videos.map((video, index) => (
            <motion.div
              key={video.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                y: -8,
                boxShadow: "0 25px 50px rgba(15, 242, 232, 0.3)"
              }}
              className="group relative bg-card rounded-xl overflow-hidden border border-border/50 cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-transparent">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center"
                  >
                    <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                  </motion.div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs">
                  {video.duration}
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary/90 text-primary-foreground">
                    {video.category}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl mb-2 group-hover:text-primary transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-muted-foreground">{video.description}</p>
              </div>

              {/* Neon Border on Hover */}
              <div className="absolute inset-0 rounded-xl border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/50 transition-all px-8 py-6"
            asChild
          >
            <a href="https://www.youtube.com/channel/UCJ9bFPzRJuEk_EuoOq6ZQRg" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              See All Videos on YouTube
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
