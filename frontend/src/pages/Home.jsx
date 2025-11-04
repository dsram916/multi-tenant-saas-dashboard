import React from 'react';
import { motion } from 'framer-motion';
import EmailCaptureWidget from '../components/EmailCaptureWidget';
import Accordion from '../components/Accordion';

// ===================================
// 1. DATA AND CONSTANTS
// ===================================

const IconBox = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);
const IconPalette = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.5 2.5m2.5-2.5l-2.5-2.5M13.684 16.6l-5.464 5.464a1.125 1.125 0 101.59 1.59l5.465-5.464m0-5.464l5.464 5.464a1.125 1.125 0 11-1.59 1.59l-5.464-5.464m0-5.464l-5.464 5.464a1.125 1.125 0 101.59 1.59l5.464-5.464M3 3l2.25 2.25m0 0l2.25 2.25M5.25 5.25l2.25-2.25m0 0l2.25-2.25m2.25 2.25l2.25 2.25m0 0l-2.25 2.25m2.25-2.25l2.25-2.25m0 0l2.25 2.25M7.5 7.5l2.25-2.25" />
  </svg>
);
const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const publishers = [
  'Bertelsmann', 'Thomson Reuters', 'Penguin Random House',
  'Hachette Livre', 'HarperCollins', 'Pearson', 'Elsevier',
  'Springer Nature', 'Wiley', 'SAGE Publishing', 'Scholastic',
  'Macmillan Publishers', 'Simon & Schuster',
];

const featureData = [
  {
    icon: <IconBox />,
    title: 'Data Isolation',
    description: 'Your store, your data. Enforce per-tenant partitioning in MongoDB with a strict `tenantId` discriminator.',
  },
  {
    icon: <IconPalette />,
    title: 'Runtime Theming',
    description: 'Apply your brand (logo, colors) at runtime from your admin console. No redeploys needed.',
  },
  {
    icon: <IconLock />,
    title: 'Access Control',
    description: 'JWT-based auth that includes `tenantId` ensures users only access resources for their tenant.',
  },
];

const faqData = [
  {
    question: 'How does multi-tenancy work?',
    answer: 'Our platform uses a single application and database, but your data (books, orders, customers) is strictly isolated using a unique `tenantId`. You never see another store\'s data, and they never see yours.',
  },
  {
    question: 'Can I customize my storefront?',
    answer: 'Yes! From your Admin Console, you can upload your own logo and set your primary brand color. These changes are applied instantly to your public storefront.',
  },
  {
    question: 'Is this built for performance?',
    answer: 'Absolutely. We use pagination for all product lists and compound indexes in MongoDB (`tenantId`, `createdAt`, etc.) to ensure your queries are fast, no matter how large your inventory grows.',
  },
];


const PublisherMarquee = () => (
  <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-slow-scroll">
      {publishers.concat(publishers).map((name, i) => (
        <li key={i} className="text-xl font-semibold text-text-secondary whitespace-nowrap">
          {name}
        </li>
      ))}
    </ul>
  </div>
);
// ===================================
// END DATA AND CONSTANTS
// ===================================


export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section (Stays separate) */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-center px-4 overflow-hidden">
        
        {/* --- Video Background --- */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/assets/book-reading-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* --- Darker Overlay --- */}
        <div className="absolute inset-0 bg-black/50 z-10" /> 
        
        <div className="relative z-20 flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-7xl font-extrabold mb-4 text-white"
          >
            Build Your Digital Bookstore.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8"
          >
            A multi-tenant SaaS platform with isolated data, runtime theming,
            and a full admin console. Built for sellers.
          </motion.p>
        </div>
      </section>

      {/* --- FIX: NEW CONTAINER FOR CONTINUOUS BACKGROUND --- */}
      {/* This new container will hold the texture for all sections below the hero */}
      <div className="w-full bg-bg-main"> 
        
        {/* Publisher Marquee */}
        <section className="py-16 border-y border-border-color">
          <p className="text-center text-text-secondary mb-8 font-semibold">
            Powering stores for the world's top publishers
          </p>
          <PublisherMarquee />
        </section>

        {/* "Cool" Feature Grid */}
        <section className="container mx-auto px-6 py-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-3xl md:text-5xl font-bold text-center mb-16 text-text-primary"
          >
            An all-in-one platform.
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featureData.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1 }}
                // Cards float on the background texture
                className="bg-white p-8 rounded-lg border border-border-color shadow-lg"
              >
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-text-primary">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-6 py-24 pb-48 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-text-primary">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <Accordion key={i} title={faq.question} content={faq.answer} />
            ))}
          </div>
        </section>

      </div>
      {/* --- END NEW CONTAINER --- */}
      
      <EmailCaptureWidget />
    </div>
  );
}