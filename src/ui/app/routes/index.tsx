// app/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const doit = async () => {
    console.log("Fetching stream from /chat...");
    try {
      const response = await fetch("http://localhost:8787/chat");

      if (!response.ok) {
        alert(`Error: ${response.status} ${response.statusText}`);
        return;
      }

      if (!response.body) {
        alert("Response body is null.");
        return;
      }

      const decoder = new TextDecoder();

      console.log("Starting to read stream:");
      let total = "";
      for await (const value of response.body) {
        const chunk = decoder.decode(value, { stream: true });
        total += chunk;
        console.log("Received chunk:", chunk);
      }
      console.log("Stream complete.");
      console.log("Total:", total);
    } catch (error) {
      console.error("Error during stream fetch:", error);
      alert(`Streaming Error: ${error.message}`);
    }
  };

  return (
    <button type="button" onClick={doit}>
      Fetch and Log Stream
    </button>
  );
}
