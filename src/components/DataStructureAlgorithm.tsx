import React from 'react';
import { motion } from 'motion/react';
import { Code, Target, BookOpen, ArrowLeft, PlayCircle } from 'lucide-react';
import { Button } from './ui/button';

// YouTube playlists - you can add more playlists here
const playlists = [
  {
    id: 'backtracking',
    title: 'Backtracking DSA Solutions',
    description: 'Comprehensive solutions to backtracking problems',
    playlistId: 'PLEFt4nVWzKBLDWYem5Pujw1VvdI2u-_Ar',
    thumbnail: 'https://img.youtube.com/vi/VDfui-cvCWQ/maxresdefault.jpg',
  },
  // Add more playlists here as you create them
];

export function DataStructureAlgorithm() {
  const handleBack = () => {
    window.location.hash = '#services';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPlaylistEmbedUrl = (playlistId: string) => {
    return `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
  };

  return (
    <section id="services/leetcoding" className="py-24 bg-gradient-to-b from-background to-muted/30 min-h-screen">
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
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Code className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-5xl mb-4">Data Structure and Algorithm</h2>
          <p className="text-xl text-muted-foreground mb-2">
            Master coding interviews with structured practice and video tutorials
          </p>
        </motion.div>

        {/* YouTube Playlists Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <PlayCircle className="w-8 h-8 text-green-500" />
            <h3 className="text-3xl font-bold">Video Tutorials</h3>
          </div>

          <div className="grid md:grid-cols-1 gap-8">
            {playlists.map((playlist, index) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-card border rounded-xl overflow-hidden shadow-lg"
              >
                <div className="p-6">
                  <h4 className="text-2xl font-semibold mb-2">{playlist.title}</h4>
                  <p className="text-muted-foreground mb-4">{playlist.description}</p>
                  
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <iframe
                      width="100%"
                      height="100%"
                      src={getPlaylistEmbedUrl(playlist.playlistId)}
                      title={playlist.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-card border rounded-lg p-8"
          >
            <Target className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-2xl mb-4">What We Cover</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Data structures and algorithms</li>
              <li>• Problem-solving patterns and strategies</li>
              <li>• Time and space complexity analysis</li>
              <li>• Mock coding interviews</li>
              <li>• Company-specific preparation</li>
              <li>• Common interview questions</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-card border rounded-lg p-8"
          >
            <BookOpen className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-2xl mb-4">Our Approach</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Video tutorials with detailed explanations</li>
              <li>• Step-by-step problem solving</li>
              <li>• Multiple solution approaches</li>
              <li>• Code walkthroughs</li>
              <li>• Tips and best practices</li>
              <li>• Interview simulation</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

