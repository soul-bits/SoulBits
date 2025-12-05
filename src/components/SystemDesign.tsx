import React from 'react';
import { motion } from 'motion/react';
import { Network, Layers, Zap, ArrowLeft, Calendar, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

const liveSessions = [
  {
    id: 'level-1',
    title: 'Level 1: Foundational Workshop',
    subtitle: 'Live Solve Session',
    description: 'Establishing the Basics: Hashing, IDs, and Utility Services. Focus on core database choices, basic data partitioning, unique ID generation, and rate limiting algorithms.',
    topics: ['URL Shortener (TinyURL)', 'API Rate Limiter', 'Unique ID Generator'],
    level: 'Foundational',
    url: 'https://luma.com/oyu1hgzf',
    date: '2025-12-03T19:00:00', // Wed, 3 Dec 19:00
  },
  {
    id: 'level-2',
    title: 'Session 2: Data Partitioning & Distributed Storage',
    subtitle: 'Live Solve Session',
    description: 'Scaling Data Layer: Caching, Key-Value Stores, and Indexing. Introducing distributed storage concepts, trade-offs between consistency and availability, efficient indexing.',
    topics: ['Consistent Hashing (Deep Dive)', 'Image Hosting Service (Instagram)', 'Key-Value Store (Simplified DynamoDB)'],
    level: 'Intermediate',
    url: 'https://luma.com/1u2m6w4g',
    date: '2025-12-09T18:00:00', // Tue, 9 Dec, 18:00
  },
  {
    id: 'level-3',
    title: 'Session 3: Complex Indexing & Fan-Out Systems',
    subtitle: 'Live Solve Session',
    description: 'The Twitter/Facebook Challenge: Search, Feeds, and Large-Scale Data Flow. Designing systems that require massive-scale indexing, real-time index updates, and managing the "fan-out" problem.',
    topics: ['Twitter Newsfeed / Facebook News Feed', 'Twitter Search', 'Cloud Storage (Dropbox/Google Drive)'],
    level: 'Advanced',
    url: 'https://luma.com/3cqd626t',
    date: '2025-12-11T18:00:00', // Thu, 11 Dec, 18:00
  },
  {
    id: 'level-4',
    title: 'Session 4: Expert Real-Time & Geospatial Systems',
    subtitle: 'Live Solve Session',
    description: 'The Real-Time Frontier: Chat, Streaming, and Geospatial Matching. Designing the most challenging systems, requiring low-latency communication, complex state management, and specialized geospatial indexing.',
    topics: ['Ride-Sharing Service (Uber/Lyft)', 'Real-Time Chat System (WhatsApp/Messenger)', 'Video Streaming (YouTube/Netflix)'],
    level: 'Expert',
    url: 'https://luma.com/rc8scvv2',
    date: '2025-12-17T19:00:00', // Wed, 17 Dec, 19:00
  },
];

export function SystemDesign() {
  const handleBack = () => {
    window.location.hash = '#services';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get today's date and time for comparison
  const getToday = () => {
    return new Date();
  };

  const today = getToday();

  // Sort sessions chronologically and separate past/upcoming
  const sortedSessions = [...liveSessions].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  const pastSessions = sortedSessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate < today;
  });

  const upcomingSessions = sortedSessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= today;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Foundational':
        return 'from-blue-500/20 to-cyan-500/20 text-blue-500';
      case 'Intermediate':
        return 'from-green-500/20 to-emerald-500/20 text-green-500';
      case 'Advanced':
        return 'from-orange-500/20 to-amber-500/20 text-orange-500';
      case 'Expert':
        return 'from-red-500/20 to-pink-500/20 text-red-500';
      default:
        return 'from-orange-500/20 to-red-500/20 text-orange-500';
    }
  };

  return (
    <section id="services/system-design" className="py-24 bg-gradient-to-b from-background to-muted/30 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mx-auto mb-6">
            <Network className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-5xl mb-4">System Design</h2>
          <p className="text-xl text-muted-foreground mb-2">
            Learn to design scalable, robust systems and architectures
          </p>
          <p className="text-primary italic">Join our hands-on, collaborative workshop series</p>
        </motion.div>

        {/* Live Solve Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-8 h-8 text-orange-500" />
            <h3 className="text-3xl font-bold">Live Solve Sessions</h3>
          </div>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Join our four-part, hands-on, collaborative system design workshop series. Each 1-hour session is limited to a small, curated group (max 7 participants) to ensure deep engagement and real-time problem-solving. <strong>This is an application-based series.</strong>
          </p>

          {/* Upcoming Sessions */}
          {upcomingSessions.length > 0 && (
            <div className="mb-12">
              <h4 className="text-2xl font-semibold mb-6 text-foreground">Upcoming Sessions</h4>
              <div className="grid md:grid-cols-2 gap-6">
                {upcomingSessions.map((session, index) => {
                  const levelColor = getLevelColor(session.level);
                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      className="bg-card border-2 border-primary/20 rounded-xl p-6 hover:shadow-lg transition-all hover:border-primary/40"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-br ${levelColor}`}>
                              {session.level}
                            </div>
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                              {formatDate(session.date)}
                            </span>
                          </div>
                          <h4 className="text-xl font-semibold mb-1">{session.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{session.subtitle}</p>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4">{session.description}</p>
                      
                      <div className="mb-4">
                        <p className="text-sm font-semibold mb-2">Case Studies:</p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {session.topics.map((topic, idx) => (
                            <li key={idx}>• {topic}</li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        variant="default"
                        size="sm"
                        className="w-full"
                        onClick={() => window.open(session.url, '_blank', 'noopener,noreferrer')}
                      >
                        Register for Session
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past Sessions */}
          {pastSessions.length > 0 && (
            <div>
              <h4 className="text-2xl font-semibold mb-6 text-muted-foreground">Past Sessions</h4>
              <div className="grid md:grid-cols-2 gap-6">
                {pastSessions.map((session, index) => {
                  const levelColor = getLevelColor(session.level);
                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + (upcomingSessions.length + index) * 0.1 }}
                      className="bg-card border rounded-xl p-6 opacity-60 grayscale hover:opacity-80 hover:grayscale-0 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-br ${levelColor}`}>
                              {session.level}
                            </div>
                            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                              {formatDate(session.date)}
                            </span>
                          </div>
                          <h4 className="text-xl font-semibold mb-1 text-muted-foreground">{session.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{session.subtitle}</p>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4">{session.description}</p>
                      
                      <div className="mb-4">
                        <p className="text-sm font-semibold mb-2 text-muted-foreground">Case Studies:</p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {session.topics.map((topic, idx) => (
                            <li key={idx}>• {topic}</li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full opacity-50 cursor-not-allowed"
                        disabled
                      >
                        Past Session
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-card border rounded-lg p-8"
          >
            <Layers className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-2xl mb-4">Topics Covered</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Scalability and performance</li>
              <li>• Load balancing and caching</li>
              <li>• Database design and optimization</li>
              <li>• Microservices architecture</li>
              <li>• Distributed systems</li>
              <li>• Real-world system design patterns</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-card border rounded-lg p-8"
          >
            <Zap className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-2xl mb-4">What You'll Learn</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Design scalable systems from scratch</li>
              <li>• Evaluate trade-offs in design decisions</li>
              <li>• Handle high-traffic scenarios</li>
              <li>• Design for reliability and fault tolerance</li>
              <li>• Best practices and common pitfalls</li>
              <li>• Real-world case studies</li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-muted/50 border rounded-lg p-8 text-center"
        >
          <h3 className="text-2xl mb-4">Ready to Master System Design?</h3>
          <p className="text-muted-foreground mb-6">
            Join our application-based workshop series with hands-on problem-solving and expert guidance.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="default"
              size="lg"
              onClick={() => window.open('https://luma.com/oyu1hgzf', '_blank', 'noopener,noreferrer')}
            >
              View All Sessions
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.location.href = 'mailto:sb.soulbits@gmail.com?subject=System Design Session Request'}
            >
              Contact Us
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

