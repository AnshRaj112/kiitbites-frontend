import styles from './styles/Signup.module.scss';

export default function SignupPage() {
  return (
    <div className={styles.container}>
      <h1>Sign Up</h1>
      <form>
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
