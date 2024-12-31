import Link from 'next/link';
import styles from './styles/Header.module.scss';

const Header = () => (
  <header className={styles.header}>
    <nav>
      <ul>
        <li><Link href="/home">Home</Link></li>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/signup">Sign Up</Link></li>
      </ul>
    </nav>
  </header>
);

export default Header;
