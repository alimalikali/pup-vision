'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { SectionHeading } from '@/components/common/section-heading';

export function Faqs() {
  const faqsData = [
    {
      id: '1',
      question: 'How is Pup different from other dating apps?',
      answer: 'Unlike traditional dating apps that focus on superficial traits, Pup matches people based on shared purpose, values, and life missions. We believe that relationships built on aligned purpose create the strongest foundation for lasting connection.',
    },
    {
      id: '2',
      question: 'How does the purpose matching algorithm work?',
      answer: 'Our proprietary algorithm analyzes multiple dimensions of purpose alignment, including core values, life missions, and complementary archetypes. We look beyond surface-level interests to find deep compatibility based on what truly matters to you.',
    },
    {
      id: '3',
      question: 'Is Pup only for people seeking marriage?',
      answer: "While many of our users are seeking marriage, Pup is for anyone looking for purpose-aligned relationships. Whether you're seeking a life partner, a collaborator on meaningful projects, or someone who shares your vision for change, Pup can help you find your match.",
    },
    {
      id: '4',
      question: 'How long does it typically take to find a match?',
      answer:
        'The timeline varies for each person, but our users typically begin receiving quality matches within the first month. Because we focus on meaningful connections rather than quantity, you may receive fewer matches than on other platforms, but they will be significantly more aligned with your purpose.',
    },
    {
      id: '5',
      question: "Can I use Pup if I'm not sure about my purpose yet?",
      answer: 'Many of our users are still exploring their purpose. Our onboarding process includes tools to help you clarify your values and mission, and our community features connect you with others on similar journeys of purpose discovery.',
    },
    {
      id: '6',
      question: 'Is there a free version of Pup?',
      answer: 'Yes, we offer a free basic membership that allows you to create a profile, receive matches, and send a limited number of messages. Our premium tiers offer additional features like advanced filtering, priority matching, and unlimited messaging.',
    },
  ];

  return (
    <section>
      <div className="mx-auto   px-4 md:px-6 container">
        <SectionHeading
          title="Frequently Asked Questions"
          description="Discover quick and comprehensive answers to common questions about our platform, services, and features."
          className="mx-auto max-w-xl"
          titleClassName="text-balance text-3xl font-bold md:text-5xl"
          descriptionClassName="text-muted-foreground text-balance"
        />

        <div className="mx-auto p-8 md:p-12 max-w-4xl">
          <Accordion type="single" collapsible className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0">
            {faqsData.map(item => (
              <AccordionItem key={item.id} value={item.id} className="border-dashed">
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-base">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="text-muted-foreground mt-6 px-8 text-center">
            Can&apos;t find what you&apos;re looking for? Contact our{' '}
            <Link href="#" className="text-primary font-medium hover:underline">
              customer support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
