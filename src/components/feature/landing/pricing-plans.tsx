'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { motion, useInView } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { SectionHeading } from '@/components/common/section-heading';

export function PricingPlans() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const plans = [
    {
      name: 'Free',
      description: 'Start your journey with essential features to explore purposeful matches.',
      price: 0,
      features: ['Up to 5 matches per month', 'Purpose profile (basic insights)', 'Essential filters (age, location, education)', 'Community access'],
      cta: 'Get Started',
      popular: false,
    },
    // {
    //   name: 'Premium',
    //   description: 'Unlock full power with insights and unlimited matching.',
    //   price: 1900,
    //   features: [
    //     'Unlimited matches & swipes',
    //     'Deep purpose analysis',
    //     'All filters & preferences unlocked',
    //     'Priority visibility in search results',
    //     'Generated match stories',
    //   ],
    //   cta: 'Upgrade to Premium',
    //   popular: false,
    // },
    {
      name: 'Beauro',
      description: 'Sit back while our experts personally hand-pick matches for you.',
      price: 50000,
      features: ['Personalized match curation done by Pup team', 'In-depth purpose interview & profiling', 'Tailored partner recommendations to your phone', 'One-on-one consultation with match experts', 'Exclusive matchmaking priority'],
      cta: 'Lets connect',
      popular: true,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="pricing">
      <div className="container mx-auto px-4" ref={ref}>
        <SectionHeading title="Simple, Transparent Pricing" description="Choose the plan that works best for your journey to finding a purpose-aligned partner." className="mb-16" />

        <motion.div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto" variants={container} initial="hidden" animate={isInView ? 'show' : 'hidden'}>
          {plans.map((plan, index) => (
            <motion.div key={index} variants={item} className="flex min-w-full">
              <Card className={`flex flex-col h-full border-2 w-full ${plan.popular ? 'border-primary' : 'border-muted'}`}>
                {plan.popular && <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-b-md w-fit mx-auto">Most Popular</div>}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
                    <span className="text-muted-foreground ml-2">{plan.price === 0 ? '' : plan.price === 1900 ? 'monthly' : 'billed once'}</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                    <Link href="/signup">{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
