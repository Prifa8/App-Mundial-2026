async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/wc-results/sync', { method: 'POST' });
    console.log("Status:", res.status);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log("Response text:", text.slice(0, 500));
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
test();
