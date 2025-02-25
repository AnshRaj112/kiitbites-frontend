import styles from './styles/Footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year

  return (
    <footer className={styles.footer}>
      <p>© KIITBites {currentYear}. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
