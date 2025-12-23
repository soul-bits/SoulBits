import React from 'react';
import { motion } from 'motion/react';
import { FileCheck, Users, Code, Network, ArrowRight } from 'lucide-react';

const services = [
  {
    id: 'profile-review',
    title: 'Profile Review',
    description: 'Get AI-powered feedback on your resume and LinkedIn profile to improve your professional presence.',
    icon: FileCheck,
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500',
  },
  {
    id: 'mentorship',
    title: 'Mentorship Sessions',
    description: 'One-on-one guidance sessions to help you navigate your career, make important decisions, and grow professionally.',
    icon: Users,
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-500',
  },
  {
    id: 'leetcoding',
    title: 'Data Structure and Algorithm',
    description: 'Video tutorials and structured practice to master coding interviews and problem-solving techniques.',
    icon: Code,
    color: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-500',
  },
  {
    id: 'system-design',
    title: 'System Design',
    description: 'Learn to design scalable systems and architectures. Get feedback on your designs and improve your system design skills.',
    icon: Network,
    color: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-500',
  },
];

export function Services() {
  const handleServiceClick = (serviceId: string) => {
    window.location.hash = `#services/${serviceId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-[1440px] mx-auto px-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl mb-4">Free Services</h2>
          <p className="text-xl text-muted-foreground mb-2">
            Comprehensive support for your career and technical growth
          </p>
          <p className="text-primary italic">Choose a service to get started.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => handleServiceClick(service.id)}
                className={`
                  bg-card border rounded-2xl p-8 cursor-pointer
                  hover:shadow-xl hover:shadow-primary/10
                  transition-all duration-300
                  group
                `}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-8 h-8 ${service.iconColor}`} />
                </div>
                
                <h3 className="text-2xl mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>
                
                <div className="flex items-center text-primary group-hover:gap-2 transition-all">
                  <span className="font-medium">Get Started</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

