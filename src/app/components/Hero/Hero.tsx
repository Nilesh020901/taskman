'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';
import Navbar from '../Navbar/Navbar';

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusVariant, setStatusVariant] = useState<'success' | 'info' | 'error' | null>(null);

  useEffect(() => {
    const initAnimations = async () => {
      const { gsap } = await import('gsap');

      const ctx = gsap.context(() => {

        gsap.set([`.${styles.shapeBlue}`, `.${styles.shapeYellow}`, `.${styles.shapeDark}`], {
          scale: 0,
          transformOrigin: 'top right',
        });

        gsap.to(`.${styles.shapeBlue}`, { scale: 1, duration: 1.0, ease: 'power3.out', delay: 0.05 });
        gsap.to(`.${styles.shapeYellow}`, { scale: 1, duration: 1.0, ease: 'power3.out', delay: 0.22 });
        gsap.to(`.${styles.shapeDark}`, { scale: 1, duration: 1.0, ease: 'power3.out', delay: 0.38 });

        const cardSelectors = [
          `.${styles.card3}`,
          `.${styles.card4}`,
          `.${styles.card2}`,
          `.${styles.card1}`,
        ];

        gsap.set(cardSelectors, { opacity: 0, y: 50 });

        const cardsTl = gsap.timeline({ delay: 1.15 });
        cardsTl.to(cardSelectors, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power3.out',
          stagger: 0.28,
        });

        gsap.set([`.${styles.title}`, `.${styles.description}`, `.${styles.inputGroup}`], {
          opacity: 0, y: 30,
        });
        gsap.set(`.${styles.logoItem}`, { opacity: 0, y: 10 });

        gsap.to(`.${styles.title}`, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.1 });
        gsap.to(`.${styles.description}`, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.25 });
        gsap.to(`.${styles.inputGroup}`, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.4 });
        gsap.to(`.${styles.logoItem}`, {
          opacity: 1, y: 0, duration: 0.4, ease: 'power1.out', stagger: 0.055, delay: 0.58,
        });

      }, heroRef);

      return () => ctx.revert();
    };

    initAnimations();
  }, []);

  const validateEmail = (value: string) => {
    if (!value) return 'Email is required.';
    if (value.length > 254) return 'Email is too long.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Enter a valid email address.';
    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    setCoupon(null);
    setStatusVariant(null);

    const trimmed = email.trim();
    const error = validateEmail(trimmed);
    setFieldError(error);

    if (error) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed })
      });

      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        coupon?: string;
        delivery?: 'email' | 'log';
        alreadySignedUp?: boolean;
      };

      if (!response.ok || !data.ok) {
        setStatusMessage(data.error || 'Something went wrong. Please try again.');
        setStatusVariant('error');
        if (data.coupon) {
          setCoupon(data.coupon);
        }
        setFieldError(null);
        return;
      }

      const isRepeat = Boolean(data.alreadySignedUp);
      const message = isRepeat
        ? 'Welcome back! Your coupon is on its way.'
        : 'Thanks for signing up! Your coupon is on its way.';

      setStatusMessage(message);
      setStatusVariant(data.delivery === 'log' ? 'info' : 'success');

      if (data.delivery === 'log' && data.coupon) {
        setCoupon(data.coupon);
      }

      setFieldError(null);
      setEmail('');
    } catch (error) {
      setStatusMessage('Unable to submit right now. Please try again.');
      setStatusVariant('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.hero} ref={heroRef}>

      {/* Navbar sits at top, inside hero — NOT fixed */}
      <Navbar />

      {/* Main content row */}
      <div className={styles.heroBody}>

        {/* ══ RIGHT — Shapes + Cards ══ */}
        <div className={styles.rightPanel}>
          <div className={styles.shapesStack}>
            <div className={styles.shapeBlue} />
            <div className={styles.shapeYellow} />
            <div className={styles.shapeDark} />
          </div>

          <div className={styles.cardsCluster}>
            <div className={`${styles.card} ${styles.card1}`}>
              <Image
                src="/assets/1. Hero/Hero_Illustration_Card-1.svg"
                alt="Task list"
                width={280}
                height={215}
                priority
              />
            </div>
            <div className={`${styles.card} ${styles.card2}`}>
              <Image
                src="/assets/1. Hero/Hero_Illustration_Card-2.svg"
                alt="Stats chart"
                width={340}
                height={215}
                priority
              />
            </div>
            <div className={`${styles.card} ${styles.card3}`}>
              <Image
                src="/assets/1. Hero/Hero_Illustration_Card-3.svg"
                alt="Rank list"
                width={230}
                height={185}
              />
            </div>
            <div className={`${styles.card} ${styles.card4}`}>
              <Image
                src="/assets/1. Hero/Hero_Illustration_Card-4.svg"
                alt="Projects"
                width={260}
                height={210}
              />
            </div>
          </div>
        </div>

        {/* ══ LEFT — Text Content ══ */}
        <div className={styles.leftPanel}>
          <h1 className={styles.title}>
            Task Management<br />And Lists Tool
          </h1>

          <p className={styles.description}>
            There are many variations of passages of Lorem Ipsum available,
            but the majority have suffered alteration in some form, by injected humour.
          </p>

          <form className={styles.inputGroup} onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              placeholder="Name@company.com"
              className={`${styles.emailInput} ${fieldError ? styles.emailInputError : ''}`}
              aria-label="Email address"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (fieldError) setFieldError(null);
                if (statusMessage) setStatusMessage(null);
                if (coupon) setCoupon(null);
              }}
              autoComplete="email"
              aria-invalid={Boolean(fieldError)}
              aria-describedby={fieldError ? 'hero-signup-error' : undefined}
              required
            />
            <button className={styles.ctaButton} type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Try for free'}
            </button>
          </form>

          {fieldError ? (
            <p className={styles.errorText} id="hero-signup-error" role="alert">
              {fieldError}
            </p>
          ) : null}

          {statusMessage ? (
            <p
              className={`${styles.statusText} ${
                statusVariant === 'error'
                  ? styles.statusError
                  : statusVariant === 'info'
                    ? styles.statusInfo
                    : styles.statusSuccess
              }`}
              aria-live="polite"
            >
              {statusMessage}
            </p>
          ) : null}

          {coupon ? (
            <div className={styles.couponBox}>
              <span className={styles.couponLabel}>Your coupon</span>
              <span className={styles.couponCode}>{coupon}</span>
            </div>
          ) : null}

          <div className={styles.logosGrid}>
            {[
              { src: '/assets/2. Logos/Cartoon_Network_logo.svg', alt: 'Cartoon Network' },
              { src: '/assets/2. Logos/Booking.com_logo.svg', alt: 'Booking.com' },
              { src: '/assets/2. Logos/Dropbox_logo.svg', alt: 'Dropbox' },
              { src: '/assets/2. Logos/Toshiba_logo.svg', alt: 'Toshiba' },
              { src: '/assets/2. Logos/Slack_logo.svg', alt: 'Slack' },
              { src: '/assets/2. Logos/Netflix_logo.svg', alt: 'Netflix' },
              { src: '/assets/2. Logos/Spotify_logo.svg', alt: 'Spotify' },
              { src: '/assets/2. Logos/CocaCola_logo.svg', alt: 'Coca-Cola' },
              { src: '/assets/2. Logos/RedBull_logo.svg', alt: 'Red Bull' },
            ].map(({ src, alt }) => (
              <div className={styles.logoItem} key={alt}>
                <img src={src} alt={alt} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
