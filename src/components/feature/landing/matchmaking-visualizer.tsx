'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// Purpose tags for visualization
const purposeTags = [
  { text: 'Education', color: 'bg-primary' },
  { text: 'Social Justice', color: 'bg-blue-500' },
  { text: 'Environment', color: 'bg-green-500' },
  { text: 'Healthcare', color: 'bg-red-500' },
  { text: 'Spirituality', color: 'bg-purple-500' },
  { text: 'Technology', color: 'bg-yellow-500' },
  { text: 'Arts', color: 'bg-pink-500' },
  { text: 'Community', color: 'bg-orange-500' },
];

// Archetypes
const archetypes = [
  { text: 'Teacher', emoji: '👨‍🏫' },
  { text: 'Healer', emoji: '🧠' },
  { text: 'Builder', emoji: '👷' },
  { text: 'Advocate', emoji: '🗣️' },
  { text: 'Connector', emoji: '🤝' },
  { text: 'Innovator', emoji: '💡' },
  { text: 'Guardian', emoji: '🛡️' },
  { text: 'Strategist', emoji: '🧩' },
];

export function MatchmakingVisualizer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const [person1, setPerson1] = useState<{
    purpose: string;
    archetype: string;
    color: string;
  } | null>(null);
  const [person2, setPerson2] = useState<{
    purpose: string;
    archetype: string;
    color: string;
  } | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);

  // Simulate matching loop
  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      const randomPurpose1 =
        purposeTags[Math.floor(Math.random() * purposeTags.length)];
      const randomArchetype1 =
        archetypes[Math.floor(Math.random() * archetypes.length)];
      const randomPurpose2 =
        purposeTags[Math.floor(Math.random() * purposeTags.length)];
      const randomArchetype2 =
        archetypes[Math.floor(Math.random() * archetypes.length)];

      setPerson1({
        purpose: randomPurpose1.text,
        archetype: randomArchetype1.text,
        color: randomPurpose1.color,
      });
      setPerson2({
        purpose: randomPurpose2.text,
        archetype: randomArchetype2.text,
        color: randomPurpose2.color,
      });

      setIsMatching(true);
      setMatchScore(null);

      setTimeout(() => {
        let score = 30;
        if (randomPurpose1.text === randomPurpose2.text) score += 40;
        if (randomArchetype1.text === randomArchetype2.text) score += 20;
        score += Math.floor(Math.random() * 10);

        setMatchScore(Math.min(score, 98));
        setIsMatching(false);
      }, 2000);
    }, 6000);

    return () => clearInterval(interval);
  }, [isInView]);

  // Card for each person
  const PersonCard = ({
    person,
    label,
    side,
  }: {
    person: { purpose: string; archetype: string; color: string };
    label: string;
    side: string;
  }) => (
    <motion.div
      key={`${person.purpose}-${person.archetype}`}
      className="w-full md:w-1/3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl text-center"
      initial={{ opacity: 0, x: side === 'left' ? -60 : 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: side === 'left' ? -60 : 60 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-24 h-24 rounded-full bg-background/80 mx-auto mb-4 flex items-center justify-center text-4xl">
        👤
      </div>
      <h3 className="text-lg font-bold mb-4">{label}</h3>
      <div className="space-y-3">
        <div
          className={`${person.color} text-white px-3 py-1 rounded-full inline-block shadow-md`}
        >
          {person.purpose}
        </div>
        <div className="bg-muted px-3 py-1 rounded-full inline-block">
          {person.archetype}{' '}
          {archetypes.find(a => a.text === person.archetype)?.emoji}
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      <motion.div
        className="container mx-auto px-4 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
            Purpose-First Matching
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how people connect through shared purpose and archetypes.
          </p>
        </div>

        {/* Visualization */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {/* Person 1 */}
          <AnimatePresence mode="wait">
            {person1 && (
              <PersonCard person={person1} label="Person 1" side="left" />
            )}
          </AnimatePresence>

          {/* Middle Match */}
          <div className="relative w-full md:w-1/4 h-48 flex items-center justify-center">
            {isMatching && (
              <motion.div
                className="w-16 h-16 z-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              />
            )}

            {matchScore !== null && (
              <motion.div
                key={matchScore}
                className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-tr from-primary/20 to-purple-500/20 flex items-center justify-center shadow-inner"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <div className="text-2xl font-bold text-primary z-10">
                  {matchScore}%
                </div>
              </motion.div>
            )}

            {/* Glowing connection line */}
            <motion.div
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-full opacity-10"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isMatching || matchScore !== null ? 1 : 0 }}
              transition={{ duration: 0.8 }}
              style={{ transformOrigin: 'center' }}
            />
          </div>

          {/* Person 2 */}
          <AnimatePresence mode="wait">
            {person2 && (
              <PersonCard person={person2} label="Person 2" side="right" />
            )}
          </AnimatePresence>
        </div>

        {/* Footer text */}
        <motion.p
          className="mt-16 text-center text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Our AI blends purpose, archetypes & human intuition to create
          meaningful matches.
        </motion.p>
      </motion.div>

      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-purple-500/5 pointer-events-none" />
    </section>
  );
}
