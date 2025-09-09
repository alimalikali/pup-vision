'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { SectionHeading } from '@/components/common/section-heading';

export const PupVisualizer = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9]);

  // Handle video autoplay when in view
  useEffect(() => {
    if (isInView && videoRef.current && isVideoLoaded) {
      videoRef.current.play().catch(console.error);
      setIsPlaying(true);
    } else if (!isInView && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isInView, isVideoLoaded]);

  // Handle video load
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  // Handle video play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 8,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-secondary/10 blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 10,
          ease: 'easeInOut',
        }}
      />

      <motion.div className="container mx-auto px-4 relative z-10" style={{ opacity, y, scale }}>
        {/* Header */}
        <SectionHeading title="Visualize Pup" description="See how purpose-driven connections come alive." className="mb-12" titleClassName="text-4xl md:text-5xl lg:text-6xl " descriptionClassName="text-xl md:text-2xl" />

        {/* Video Container */}
        <motion.div className="relative max-w-7xl mx-auto" initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div className="relative w-full aspect-video bg-black/5 rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm">
            {/* Video */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              onLoadedData={handleVideoLoad}
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect width='1920' height='1080' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='system-ui' font-size='48' fill='%236b7280'%3ELoading...%3C/text%3E%3C/svg%3E"
            >
              {/* Add your video source here */}
              <source src="/videos/pup-demo.mp4" type="video/mp4" />
              <source src="/videos/pup-demo.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>

            {/* Play/Pause Overlay */}
            <motion.button className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors duration-300 group" onClick={togglePlayPause} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <motion.div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover:bg-white transition-colors duration-300" animate={{ scale: isPlaying ? 0 : 1, opacity: isPlaying ? 0 : 1 }} transition={{ duration: 0.3 }}>
                {isPlaying ? <Pause className="w-8 h-8 text-primary ml-1" /> : <Play className="w-8 h-8 text-primary ml-1" />}
              </motion.div>
            </motion.button>

            {/* Loading State */}
            {!isVideoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                <motion.div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }} />
              </div>
            )}

            {/* Decorative elements */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-slate-700">✨ Interactive Demo</div>

            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-slate-700">Click to {isPlaying ? 'pause' : 'play'}</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
