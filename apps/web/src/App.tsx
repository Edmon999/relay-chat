import { HealthResponse } from "@super/shared";

const health: HealthResponse = HealthResponse.parse({
  status: "ok",
  timestamp: new Date().toISOString(),
});

function App() {
  return (
    <main>
      <h1>SUPER</h1>
      <pre>{JSON.stringify(health, null, 2)}</pre>
    </main>
  );
}

export default App;
