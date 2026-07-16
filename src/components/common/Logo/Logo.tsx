import {
  useEffect,
  useRef,
  useState,
  type AnimationEvent,
} from 'react';

import logo from '../../../assets/images/logo-previa.png';

import styles from './Logo.module.css';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  onAnimationFinished?: () => void;
}

export function Logo({
  size = 'md',
  animated = true,
  onAnimationFinished,
}: LogoProps) {
  const [animationReady, setAnimationReady] =
    useState(!animated);

  const hasFinishedRef = useRef(false);

  useEffect(() => {
    if (!animated) {
      if (!hasFinishedRef.current) {
        hasFinishedRef.current = true;
        onAnimationFinished?.();
      }

      return;
    }

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reducedMotion) {
      setAnimationReady(true);

      if (!hasFinishedRef.current) {
        hasFinishedRef.current = true;
        onAnimationFinished?.();
      }

      return;
    }

    let firstFrame = 0;
    let secondFrame = 0;

    const startAnimation = () => {
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          setAnimationReady(true);
        });
      });
    };

    if (document.readyState === 'complete') {
      startAnimation();
    } else {
      window.addEventListener(
        'load',
        startAnimation,
        {
          once: true,
        },
      );
    }

    return () => {
      window.removeEventListener(
        'load',
        startAnimation,
      );

      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [animated, onAnimationFinished]);

    function handleRevealFinished(
    event: AnimationEvent<HTMLDivElement>,
    ) {
    if (
        event.target !== event.currentTarget ||
        hasFinishedRef.current
    ) {
        return;
    }

    hasFinishedRef.current = true;
    onAnimationFinished?.();
    }
  const classNames = [
    styles.logoWrapper,
    styles[size],
    animationReady
      ? styles.animationReady
      : styles.animationWaiting,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames}>
      <img
        src={logo}
        alt="Previa"
        className={styles.logo}
        draggable={false}
      />

      {animated && (
        <div
          className={styles.revealMask}
          aria-hidden="true"
          onAnimationEnd={handleRevealFinished}
        />
      )}
    </div>
  );
}