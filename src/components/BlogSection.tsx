import { motion } from "motion/react";
import { Button } from "./ui/button";
import { ArrowRight, Calendar, Clock } from "lucide-react";

const posts = [
  {
    title: "Building Tiny Legends: Lessons from Our TEDAI Win",
    excerpt: "How we built an AI-powered story creation platform in 48 hours and won the hackathon. Here's what we learned about rapid prototyping and team dynamics.",
    image: "https://images.unsplash.com/photo-1755469013282-028a1d33fac6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHN0b3J5dGVsbGluZyUyMG1hZ2ljYWx8ZW58MXx8fHwxNzYxMzI3MTkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "October 20, 2024",
    readTime: "8 min read",
  },
  {
    title: "The Art of Clean Code: Patterns That Scale",
    excerpt: "After reviewing hundreds of codebases, here are the patterns that separate good code from great code. Practical tips you can apply today.",
    image: "https://images.unsplash.com/photo-1719400471588-575b23e27bd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjB3b3Jrc3BhY2UlMjB0ZWNofGVufDF8fHx8MTc2MTMyNjQ2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    date: "October 15, 2024",
    readTime: "12 min read",
  },
  {
    title: "Why Every Developer Should Learn AI in 2025",
    excerpt: "AI isn't replacing developers—it's amplifying them. Here's why learning AI fundamentals will make you a better engineer, regardless of your domain.",
    image: "https://images.unsplash.com/photo-1660165458059-57cfb6cc87e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMHRlY2hub2xvZ3klMjBhYnN0cmFjdHxlbnwxfHx8fDE3NjEzMDM0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "October 10, 2024",
    readTime: "10 min read",
  },
];

export function BlogSection() {
  return (
    <section className="py-24">
      <div className="max-w-[1440px] mx-auto px-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl mb-4">Thoughts & Insights</h2>
          <p className="text-xl text-muted-foreground">
            Curated posts from our LinkedIn and beyond
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.title}
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
              {/* Hero Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </div>
                </div>

                <h3 className="text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary hover:bg-primary/10 p-0 h-auto"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Neon Border on Hover */}
              <div className="absolute inset-0 rounded-xl border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
