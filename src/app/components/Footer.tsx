import styles from './styles/Footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="/team">Team</a></li>
            <li><a href="#">Food Courts</a></li>
            <li><a href="#">KIIT Kafe</a></li>
            <li><a href="#">Central Canteen</a></li>
            <li><a href="#">Maggie Point</a></li>
          </ul>
        </div>
        <div className={styles.section}>
          <h4>Contact Us</h4>
          <ul>
            <li><a href="/help">Help</a></li>
          </ul>
        </div>
        <div className={styles.section}>
          <h4>Legal</h4>
          <ul>
            {/* <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Cookie Policy</a></li>
            <li><a href="#">Privacy Policy</a></li> */}
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© KIITBites {currentYear}. All rights reserved.</p>
        <div className={styles.downloadLinks}>
          <a href="#"><img src="/appstore.png" alt="Download on the App Store" /></a>
          <a href="#"><img src="/googleplay.png" alt="Get it on Google Play" /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
