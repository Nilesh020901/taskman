'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import styles from './Signup.module.css';

const Signup = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusVariant, setStatusVariant] = useState<'success' | 'info' | 'error' | null>(null);

  useEffect(() => {
    const initAnimations = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Text content: fade + slide up from bottom
        gsap.from([`.${styles.heading}`, `.${styles.subtext}`, `.${styles.inputRow}`], {
          opacity: 0,
          y: 60,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%'
          }
        });

        gsap.from(`.${styles.shapeRight}`, {
          scaleY: 0,
          scaleX: 0,
          opacity: 0,
          transformOrigin: 'bottom right',
          duration: 1.2,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%'
          }
        });
      }, sectionRef);

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
    <section className={styles.signup} ref={sectionRef}>
      {/* Right - blue triangle (SVG shape) */}
      <div className={styles.shapeRight}>
        <svg viewBox="0 0 200 600" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <path d="M200 0 L200 600 L0 600 Z" fill="#0634ff" />
        </svg>
      </div>

      {/* Centre content */}
      <div className={styles.content}>
        <h2 className={styles.heading}>Get better work done</h2>
        <p className={styles.subtext}>
          See why millions of people across 195
          <br />
          countries use TaskMan.
        </p>

        <form className={styles.inputRow} onSubmit={handleSubmit} noValidate>
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
            aria-describedby={fieldError ? 'signup-error' : undefined}
            required
          />
          <button className={styles.ctaButton} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Try for free'}
          </button>
        </form>

        {fieldError ? (
          <p className={styles.errorText} id="signup-error" role="alert">
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
      </div>
    </section>
  );
};

export default Signup;
