export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center", padding: 24 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>Future Readiness</h1>
        <p style={{ color: "#475569", marginTop: 8 }}>Open the interactive L&D maturity assessment.</p>
        <a
          href="/maturity"
          style={{
            display: "inline-block",
            marginTop: 16,
            padding: "10px 16px",
            borderRadius: 12,
            background: "#2B6DEF",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600
          }}
        >
          Launch Assessment
        </a>
      </div>
    </main>
  );
}
