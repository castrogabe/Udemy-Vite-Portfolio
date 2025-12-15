export default function Footer() {
  return (
    <footer
      style={{
        padding: 16,
        marginTop: 32,
        borderTop: '1px solid #ddd',
        textAlign: 'center',
      }}
    >
      <p>&copy;{new Date().getFullYear()} My Website. All rights reserved.</p>
    </footer>
  );
}
