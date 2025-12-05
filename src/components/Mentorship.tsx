import React from 'react';
import { motion } from 'motion/react';
import { Users, Calendar, MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

export function Mentorship() {
  const handleBack = () => {
    window.location.hash = '#services';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="services/mentorship" className="py-24 bg-gradient-to-b from-background to-muted/30 min-h-screen">
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
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-purple-500" />
          </div>
          <h2 className="text-5xl mb-4">Mentorship Sessions</h2>
          <p className="text-xl text-muted-foreground mb-2">
            Intentional, high-focus, and high-impact 1:1 sessions
          </p>
          <p className="text-primary italic mb-4">Craft clarity, momentum, and real next steps — one SoulBit at a time.</p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <span className="text-2xl font-bold text-purple-500">50+</span>
            <span className="text-muted-foreground">1:1 sessions completed</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card border rounded-xl p-8 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <Calendar className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-2xl font-semibold">What We Offer</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <div>
                  <span className="font-semibold text-foreground">Career Strategy</span>
                  <span className="text-muted-foreground"> — clarity, direction, next steps</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <div>
                  <span className="font-semibold text-foreground">Interview Prep Mock</span>
                  <span className="text-muted-foreground"> — structure, approach, problem-solving</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <div>
                  <span className="font-semibold text-foreground">Resume / LinkedIn Review</span>
                  <span className="text-muted-foreground"> — branding, positioning</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <div>
                  <span className="font-semibold text-foreground">Elevator Pitch & Communication</span>
                  <span className="text-muted-foreground"> — storytelling, clarity, confidence</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <div>
                  <span className="font-semibold text-foreground">AI & Emerging Tech</span>
                  <span className="text-muted-foreground"> — LangGraph, MCP, AGI, A2A, tools & learning path</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <div>
                  <span className="font-semibold text-foreground">Project Ideation & Development</span>
                  <span className="text-muted-foreground"> — turn your idea into a real project</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <div>
                  <span className="font-semibold text-foreground">System Design & Technical Depth</span>
                  <span className="text-muted-foreground"> — architecture, scaling, distributed systems</span>
                </div>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card border rounded-xl p-8 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-2xl font-semibold">Session Format</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <span className="text-foreground">20 minutes to 1 hour one-on-one sessions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <span className="text-foreground">Scheduling is based on availability</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <span className="text-foreground">Video call or in-person (if local)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <span className="text-foreground">Follow-up resources and action items</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <span className="text-foreground">Ongoing support via email or LinkedIn</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-500/10 border-2 border-purple-500/20 rounded-xl p-8 text-center shadow-lg"
        >
          <h3 className="text-3xl font-bold mb-3">Ready to Get Started?</h3>
          <p className="text-lg text-muted-foreground mb-2">
            Book a 1:1 mentorship session and take the next step in your career journey.
          </p>
          <p className="text-sm text-muted-foreground mb-8 italic">
            Every request is reviewed, and invites are sent on approval basis so I can give each person the depth and attention they deserve.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Button
              variant="default"
              size="lg"
              className="w-full h-auto py-4 px-6 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
              onClick={() => window.open('https://forms.gle/UsCcyDKuJLPQiF7dA', '_blank', 'noopener,noreferrer')}
            >
              <span className="font-semibold">January 2026</span>
              <span className="text-xs opacity-90">Book Session</span>
            </Button>

            <Button
              variant="default"
              size="lg"
              className="w-full h-auto py-4 px-6 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
              onClick={() => window.open('https://forms.gle/5SjUmeLDTNvUv2946', '_blank', 'noopener,noreferrer')}
            >
              <span className="font-semibold">February 2026</span>
              <span className="text-xs opacity-90">Book Session</span>
            </Button>

            <Button
              variant="default"
              size="lg"
              className="w-full h-auto py-4 px-6 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
              onClick={() => window.open('https://forms.gle/TUag6eYEQNZNfnGFA', '_blank', 'noopener,noreferrer')}
            >
              <span className="font-semibold">March 2026</span>
              <span className="text-xs opacity-90">Book Session</span>
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-6">
            Learn! Build! Grow! — 1:1 with Divya (#SoulBits)
          </p>
        </motion.div>
      </div>
    </section>
  );
}

