import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>TaskMan</div>
        <button className={styles.ctaButton}>Try free</button>
      </div>
    </nav>
  );
};

export default Navbar;