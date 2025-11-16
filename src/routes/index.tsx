import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="ml-4 text-5xl font-semibold mb-2">StartSmith</h1>
      <p>TS Schema in TanstackStart form out</p>
    </div>
  );
}
