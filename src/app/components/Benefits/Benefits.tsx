'use client';

import { useEffect, useRef } from 'react';
import styles from './Benefits.module.css';

// Inline SVGs from uploaded assets
const TrackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="124" height="103" viewBox="0 0 124 103">
    <defs>
      <filter id="track-a" x="0" y="0" width="124" height="103" filterUnits="userSpaceOnUse">
        <feOffset dy="3" in="SourceAlpha"/>
        <feGaussianBlur stdDeviation="3" result="b"/>
        <feFlood floodOpacity="0.161"/>
        <feComposite operator="in" in2="b"/>
        <feComposite in="SourceGraphic"/>
      </filter>
    </defs>
    <g transform="translate(-517 -1827)">
      <g transform="matrix(1, 0, 0, 1, 517, 1827)" filter="url(#track-a)">
        <rect width="106" height="85" rx="11" transform="translate(9 6)" fill="#fff"/>
      </g>
      <rect width="44.333" height="7" rx="3.5" transform="translate(572 1859)" fill="#0634ff"/>
      <rect width="74.333" height="7" rx="3.5" transform="translate(542 1876)" fill="#8097ff" opacity="0.3"/>
      <rect width="74.333" height="7" rx="3.5" transform="translate(542 1893)" fill="#8097ff" opacity="0.3"/>
      <rect width="13.333" height="5" rx="2.5" transform="translate(544.028 1856.627) rotate(30)" fill="#0634ff"/>
      <rect width="24.333" height="5" rx="2.5" transform="matrix(0.643, -0.766, 0.766, 0.643, 548.769, 1864.507)" fill="#0634ff"/>
    </g>
  </svg>
);

const PrioritizeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="124" height="103" viewBox="0 0 124 103">
    <defs>
      <filter id="prio-a" x="0" y="0" width="124" height="103" filterUnits="userSpaceOnUse">
        <feOffset dy="3" in="SourceAlpha"/>
        <feGaussianBlur stdDeviation="3" result="b"/>
        <feFlood floodOpacity="0.161"/>
        <feComposite operator="in" in2="b"/>
        <feComposite in="SourceGraphic"/>
      </filter>
    </defs>
    <g transform="translate(-517 -1827)">
      <g transform="matrix(1, 0, 0, 1, 517, 1827)" filter="url(#prio-a)">
        <rect width="106" height="85" rx="11" transform="translate(9 6)" fill="#fff"/>
      </g>
      <rect width="36.891" height="7.5" rx="3.75" transform="translate(535 1849)" fill="#0634ff"/>
      <rect width="36.891" height="7.5" rx="3.75" transform="translate(535 1865)" fill="#8097ff" opacity="0.18"/>
      <path d="M3.75,0H33.141a3.75,3.75,0,0,1,0,7.5H3.75a3.75,3.75,0,0,1,0-7.5Z" transform="translate(586 1865)" fill="#8097ff" opacity="0.18"/>
      <rect width="36.891" height="7.5" rx="3.75" transform="translate(535 1881)" fill="#8097ff" opacity="0.18"/>
      <rect width="36.891" height="7.5" rx="3.75" transform="translate(586 1881)" fill="#8097ff" opacity="0.18"/>
      <rect width="36.891" height="7.5" rx="3.75" transform="translate(535 1897)" fill="#8097ff" opacity="0.18"/>
      <rect width="36.891" height="7.5" rx="3.75" transform="translate(586 1897)" fill="#8097ff" opacity="0.18"/>
      <rect width="36.891" height="7.5" rx="3.75" transform="translate(586 1849)" fill="#0634ff"/>
    </g>
  </svg>
);

const CollaborateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="124" height="103" viewBox="0 0 124 103">
    <defs>
      <filter id="collab-a" x="0" y="0" width="124" height="103" filterUnits="userSpaceOnUse">
        <feOffset dy="3" in="SourceAlpha"/>
        <feGaussianBlur stdDeviation="3" result="b"/>
        <feFlood floodOpacity="0.161"/>
        <feComposite operator="in" in2="b"/>
        <feComposite in="SourceGraphic"/>
      </filter>
    </defs>
    <g transform="translate(-1278.909 -1830)">
      <g transform="translate(761.909 3)">
        <g transform="matrix(1, 0, 0, 1, 517, 1827)" filter="url(#collab-a)">
          <rect width="106" height="85" rx="11" transform="translate(9 6)" fill="#fff"/>
        </g>
        <rect width="44" height="8" rx="4" transform="translate(540.091 1877)" fill="#8097ff" opacity="0.1"/>
        <rect width="54.333" height="8" rx="4" transform="translate(540 1895)" fill="#8097ff" opacity="0.1"/>
      </g>
      <g transform="translate(11)">
        <circle cx="6" cy="6" r="6" transform="translate(1307 1841)" fill="#f1f1f1"/>
        <circle cx="11" cy="11" r="11" transform="translate(1302 1848)" fill="#f1f1f1"/>
        <circle cx="6" cy="6" r="6" transform="translate(1307 1853)" fill="#fff"/>
      </g>
      <circle cx="2" cy="2" r="2" transform="translate(1322 1845)" fill="#fff"/>
      <circle cx="6" cy="6" r="6" transform="translate(1307 1841)" fill="#0634ff"/>
      <circle cx="11" cy="11" r="11" transform="translate(1302 1848)" fill="#0634ff"/>
      <circle cx="6" cy="6" r="6" transform="translate(1307 1853)" fill="#fff"/>
      <circle cx="2" cy="2" r="2" transform="translate(1311 1845)" fill="#fff"/>
    </g>
  </svg>
);

const benefits = [
  {
    Icon: TrackIcon,
    title: 'Keep tasks in one place',
    description:
      'Save time, avoid losing work and information, delegate, and track tasks to stay on schedule.',
  },
  {
    Icon: PrioritizeIcon,
    title: 'Prioritize your work',
    description:
      'Tracking tasks allows everyone to understand which are more important or require more time, so you can plan accordingly.',
  },
  {
    Icon: CollaborateIcon,
    title: 'Improve collaboration',
    description:
      'Tracking tasks allows everyone to understand which are more important or require more time, so teams stay aligned.',
  },
];

const Benefits = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const initAnimations = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Heading fade up
        gsap.from('.benefits-heading', {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.benefits-heading',
            start: 'top 85%',
          },
        });

        // Cards slide up from bottom — staggered
        gsap.from('.benefit-card', {
          opacity: 0,
          y: 100,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.18,
          scrollTrigger: {
            trigger: '.benefits-cards',
            start: 'top 88%',
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    };

    initAnimations();
  }, []);

  return (
    <section className={styles.benefits} ref={sectionRef}>
      <h2 className={`${styles.heading} benefits-heading`}>
        Key benefits of using task<br />management software
      </h2>

      <div className={`${styles.cardsGrid} benefits-cards`}>
        {benefits.map(({ Icon, title, description }) => (
          <div className={`${styles.card} benefit-card`} key={title}>
            <div className={styles.iconWrap}>
              <Icon />
            </div>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardDesc}>{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
