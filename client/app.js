async function main() {
  const res = await fetch("http://localhost:3000/polls");
  const data = await res.json();
  document.querySelector("#app").textContent = `Server says: ${JSON.stringify(data)}`;
}

main();
