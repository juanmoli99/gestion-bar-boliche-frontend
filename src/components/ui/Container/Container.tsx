import type { ReactNode } from 'react';

import styles from './Container.module.css';

type ContainerSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'fluid';

interface ContainerProps {
  children: ReactNode;
  size?: ContainerSize;
  centered?: boolean;
  className?: string;
}

export function Container({
  children,
  size = 'lg',
  centered = false,
  className = '',
}: ContainerProps) {
  const classNames = [
    styles.container,
    styles[size],
    centered ? styles.centered : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <main className={classNames}>
      {children}
    </main>
  );
}