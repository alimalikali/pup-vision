'use client';

import { LazyImage } from '@/components/common/lazy-image';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ImageIcon, Sparkles, X, Heart, Users } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { SectionHeading } from '@/components/common/section-heading';

// Define the image data with real Unsplash images and enhanced metadata
const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80',
    alt: 'Couple smiling together',
    caption: 'Sarah & Ahmed found each other through shared educational values',
    height: 500,
    category: 'Education',
    year: '2023',
    gradient: 'from-blue-500/20 to-purple-500/20',
  },
  {
    src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80',
    alt: 'Couple at graduation',
    caption: 'Omar & Layla connected over their passion for social justice',
    height: 700,
    category: 'Social Justice',
    year: '2022',
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    src: 'https://images.unsplash.com/photo-1511405889574-b01de1da5441?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    alt: 'Couple volunteering',
    caption: 'Yusuf & Aisha bonded through their environmental activism',
    height: 400,
    category: 'Environment',
    year: '2023',
    gradient: 'from-green-500/20 to-lime-500/20',
  },
  {
    src: 'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    alt: 'Couple at conference',
    caption: 'Zainab & Khalid met through their shared spiritual journey',
    height: 600,
    category: 'Spirituality',
    year: '2022',
    gradient: 'from-violet-500/20 to-purple-500/20',
  },
  {
    src: 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80',
    alt: 'Couple teaching together',
    caption: 'Fatima & Ibrahim now run educational workshops together',
    height: 450,
    category: 'Education',
    year: '2023',
    gradient: 'from-orange-500/20 to-red-500/20',
  },
  {
    src: 'https://images.unsplash.com/photo-1439539698758-ba2680ecadb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    alt: 'Couple at community event',
    caption: 'Noor & Hassan found purpose in community building',
    height: 550,
    category: 'Community',
    year: '2023',
    gradient: 'from-cyan-500/20 to-blue-500/20',
  },
  {
    src: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    alt: 'Couple hiking together',
    caption: 'Maya & Ali share a passion for environmental conservation',
    height: 480,
    category: 'Environment',
    year: '2022',
    gradient: 'from-emerald-500/20 to-green-500/20',
  },
  {
    src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    alt: 'Couple working on project',
    caption: 'Leila & Karim collaborate on community art initiatives',
    height: 520,
    category: 'Arts',
    year: '2023',
    gradient: 'from-pink-500/20 to-rose-500/20',
  },
  {
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80',
    alt: 'Couple at tech conference',
    caption: 'Amina & Tariq innovate together in sustainable technology',
    height: 380,
    category: 'Technology',
    year: '2023',
    gradient: 'from-indigo-500/20 to-violet-500/20',
  },
  {
    src: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80',
    alt: 'Couple at health clinic',
    caption: 'Dr. Yasmin & Dr. Hassan serve their community together',
    height: 420,
    category: 'Healthcare',
    year: '2022',
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
];

export function MasonryGallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [selectedImage, setSelectedImage] = useState<null | (typeof galleryImages)[0]>(null);
  const [columns, setColumns] = useState(3);
  const [masonryImages, setMasonryImages] = useState<(typeof galleryImages)[]>([]);

  // Responsive columns
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumns(1);
      } else if (window.innerWidth < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Distribute images into columns for masonry layout
  useEffect(() => {
    const columnArrays: (typeof galleryImages)[] = Array.from({ length: columns }, () => []);

    // Sort images by height (optional, creates a more balanced layout)
    const sortedImages = [...galleryImages].sort((a, b) => a.height - b.height);

    // Distribute images across columns
    sortedImages.forEach(image => {
      // Find the column with the least height
      const shortestColumnIndex = columnArrays.map(column => column.reduce((acc, img) => acc + img.height, 0)).reduce((minIndex, height, index, heights) => (height < heights[minIndex] ? index : minIndex), 0);

      columnArrays[shortestColumnIndex].push(image);
    });

    setMasonryImages(columnArrays);
  }, [columns]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, 100]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const openLightbox = (image: (typeof galleryImages)[0]) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section className="" ref={ref}>
      <motion.div className="container mx-auto px-4" style={{ opacity, y }}>
        <div className="text-center mb-16">
          <SectionHeading
            title="Real People. Real Stories."
            description="Discover how purpose-aligned couples are building meaningful relationships and changing the world together."
            titleClassName="text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent"
            descriptionClassName="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed"
          />
        </div>

        <div className="flex flex-wrap -mx-3">
          {masonryImages.map((column, columnIndex) => (
            <div key={columnIndex} className={`px-3 w-full ${columns === 1 ? 'w-full' : columns === 2 ? 'sm:w-1/2' : 'sm:w-1/2 lg:w-1/3'}`}>
              <motion.div variants={containerVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'} className="space-y-6">
                {column.map((image, imageIndex) => (
                  <motion.div key={imageIndex} className="break-inside-avoid" variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <div className="relative overflow-hidden rounded-2xl cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50" onClick={() => openLightbox(image)}>
                      <div className="relative" style={{ height: `${image.height / 2}px` }}>
                        <Image id={`gallery-${columnIndex}-${imageIndex}`} src={image.src} alt={image.alt} fill sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw`} className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${image.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 backdrop-blur-sm">{image.category}</span>
                      </div>

                      {/* Year Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 backdrop-blur-sm">{image.year}</span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end">
                        <div className="p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <div className="flex items-center gap-2 mb-3">
                            <Heart className="h-4 w-4 text-pink-400" />
                            <Users className="h-4 w-4 text-blue-400" />
                          </div>
                          <p className="text-sm font-medium leading-relaxed">{image.caption}</p>
                        </div>
                      </div>

                      {/* Bottom gradient for text readability */}
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        {/* <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-200/20 dark:border-pink-500/20">
              <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                500+
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                Couples Matched
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-200/20 dark:border-blue-500/20">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                95%
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                Success Rate
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200/20 dark:border-emerald-500/20">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                50+
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                Cities Worldwide
              </div>
            </div>
          </div>
        </motion.div> */}
      </motion.div>

      {/* Enhanced Lightbox */}
      {selectedImage && (
        <motion.div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeLightbox}>
          <motion.div className="relative max-w-6xl max-h-[90vh] w-full" initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} onClick={(e: unknown) => (e as React.MouseEvent).stopPropagation()}>
            <button className="absolute top-6 right-6 z-20 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110" onClick={closeLightbox}>
              <X className="h-6 w-6" />
            </button>

            <div className="relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative">
                <LazyImage
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={1200}
                  height={800}
                  className="w-full h-auto max-h-[70vh] object-cover"
                  loadingClassName="bg-slate-200 dark:bg-slate-700 h-[70vh]"
                  fallback={
                    <div className="flex items-center justify-center h-[70vh] bg-slate-200 dark:bg-slate-700">
                      <ImageIcon className="h-12 w-12 text-slate-400" />
                    </div>
                  }
                />

                {/* Image overlay with category and year */}
                <div className="absolute top-6 left-6 flex gap-3">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 backdrop-blur-sm">{selectedImage.category}</span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 backdrop-blur-sm">{selectedImage.year}</span>
                </div>
              </div>

              {/* Enhanced content section */}
              <div className="p-8 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <Users className="h-5 w-5 text-blue-500" />
                  <Sparkles className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{selectedImage.caption}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">This couple found each other through our platform and have been making a positive impact in their community together. Their story represents the power of purpose-driven relationships.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
