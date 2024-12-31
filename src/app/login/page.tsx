import styles from './styles/Login.module.scss';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
