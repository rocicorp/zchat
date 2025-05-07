// app/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [output, setOutput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8787/chat", {
        method: "POST",
        body: inputRef.current!.value,
      });

      if (!response.ok) {
        alert(`Error: ${response.status} ${response.statusText}`);
        return;
      }

      if (!response.body) {
        alert("Response body is null.");
        return;
      }

      const decoder = new TextDecoder();

      setOutput("");
      for await (const value of response.body) {
        const chunk = decoder.decode(value, { stream: true });
        setOutput((prev) => prev + chunk);
      }
    } catch (error) {
      alert(`Streaming Error: ${error.message}`);
    }
  };

  return (
    <>
      <div>
        <input ref={inputRef} type="text" placeholder="Ask something..." />
        <button type="button" onClick={onSubmit}>
          Submit
        </button>
      </div>
      <div>
        <textarea rows={10} cols={50} value={output}></textarea>
      </div>
    </>
  );
}
