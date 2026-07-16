import styles from './PlaceholderPage.module.css';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>
          {title}
        </h1>

        <p className={styles.description}>
          {description}
        </p>
      </div>
    </section>
  );
}