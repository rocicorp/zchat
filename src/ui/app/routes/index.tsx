// app/routes/index.tsx
import { createFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        fetch("http://localhost:8787/hello", {}).then(async (res) => {
          alert(await res.text());
        });
      }}
    >
      Hello?
    </button>
  );
}
