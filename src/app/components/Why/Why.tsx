'use client';

import { useEffect, useRef } from 'react';
import styles from './Why.module.css';

const Why = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const initAnimations = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const trigger = { trigger: sectionRef.current, start: 'top 70%' };

        // ── 1. Background Shapes Animation ──
        gsap.from(`.${styles.shapeRect}`, {
          x: -200, opacity: 0,
          duration: 1.4, ease: 'power3.out',
          scrollTrigger: trigger
        });

        gsap.from(`.${styles.shapeEllipse}`, {
          x: -250, opacity: 0,
          duration: 1.4, ease: 'power3.out',
          delay: 0.15,
          scrollTrigger: trigger
        });

        gsap.from(`.${styles.illus1}`, {
          y: 120, opacity: 0,
          duration: 1.2, ease: 'power3.out',
          delay: 0.35,
          scrollTrigger: trigger
        });

        gsap.from(`.${styles.illus2}`, {
          y: 120, opacity: 0,
          duration: 1.2, ease: 'power3.out',
          delay: 0.5,
          scrollTrigger: trigger
        });

        gsap.from([`.${styles.tag}`, `.${styles.heading}`, `.${styles.body}`, `.${styles.learnMore}`], {
          y: 40, opacity: 0,
          duration: 0.8, ease: 'power2.out',
          stagger: 0.12,
          delay: 0.6,
          scrollTrigger: trigger
        });

      }, sectionRef);

      return () => ctx.revert();
    };

    initAnimations();
  }, []);

  return (
    <section className={styles.why} ref={sectionRef}>

      <div className={styles.leftPanel}>
        
        <div className={styles.shapesLayer}>
          <img src="/assets/4. Why/Why_Shapes_Rectangle.svg" alt="Yellow Pill Shape" className={styles.shapeRect} />
          <img src="/assets/4. Why/Why_Shapes_Ellipse.svg" alt="Dark Ring Shape" className={styles.shapeEllipse} />
        </div>

        <div className={styles.illusLayer}>
          <img src="/assets/4. Why/Why_Illustration-1.svg" alt="Rank Card" className={styles.illus1} />
          
          <img src="/assets/4. Why/Why_Illustration-2.svg" alt="Top Earners Card" className={styles.illus2} />
        </div>

      </div>

      <div className={styles.rightPanel}>
        <h2 className={styles.heading}>
          Why do you need<br />task management<br />software?
        </h2>

        <p className={styles.body}>
          Do you waste time organizing sticky notes, searching your email and
          apps for to-dos, and figuring out what to work on first? Then you
          need one solution to prioritize your tasks, manage your time, and
          meet your deadlines.
        </p>

        <a href="#" className={styles.learnMore}>
          LEARN MORE
          <img src="/assets/4. Why/Arrow_icon.svg" alt="Arrow" className={styles.arrowIcon} />
        </a>
      </div>

    </section>
  );
};

export default Why;