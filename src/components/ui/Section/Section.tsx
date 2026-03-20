import styles from './Section.module.scss';

type Props = {
  children: React.ReactNode;
  variant?: 'default' | 'alt';
};

export default function Section({ children, variant = 'default' }: Props) {
  return (
    <section
      className={`${styles.section} ${
        variant === 'alt' ? styles.alt : ''
      }`}
    >
      {children}
    </section>
  );
}