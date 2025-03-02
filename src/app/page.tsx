import Link from 'next/link';

export default function Landing() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to KIITBites</h1>
      <p>Select an option to get started:</p>
      <nav>
        <Link href="/home">Home</Link> | <Link href="/login">Login</Link> | <Link href="/signup">Sign Up</Link>
      </nav>
    </div>
  );
}
