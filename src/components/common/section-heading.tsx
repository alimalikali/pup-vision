'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface SectionHeadingProps {
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  centered?: boolean;
  animated?: boolean;
  delay?: number;
}

export function SectionHeading({ title, description, className = '', titleClassName = '', descriptionClassName = '', centered = true, animated = true, delay = 0 }: SectionHeadingProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerClasses = `
    ${centered ? 'text-center' : 'text-left'}
    ${className}
  `.trim();

  const titleClasses = `
    text-3xl md:text-4xl lg:text-5xl font-bold mb-4
    ${titleClassName}
  `.trim();

  const descriptionClasses = `
    text-lg md:text-xl text-muted-foreground max-w-3xl
    ${centered ? 'mx-auto' : ''}
    ${descriptionClassName}
  `.trim();

  if (!animated) {
    return (
      <div ref={ref} className={containerClasses}>
        <h2 className={titleClasses}>{title}</h2>
        {description && <p className={descriptionClasses}>{description}</p>}
      </div>
    );
  }

  return (
    <div ref={ref} className={containerClasses}>
      <motion.h2 className={titleClasses} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.6, delay }}>
        {title}
      </motion.h2>
      {description && (
        <motion.p className={descriptionClasses} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.6, delay: delay + 0.1 }}>
          {description}
        </motion.p>
      )}
    </div>
  );
}
