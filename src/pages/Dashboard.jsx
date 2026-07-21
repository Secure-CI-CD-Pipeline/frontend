import { useEffect, useState } from "react";
import api from "../api/client.js";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/my-events").then((r) => setEvents(r.data)).catch(() => setError("Failed"));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Registered Events</h1>
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid gap-3">
        {events.map((e) => (
          <div key={e.id} className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">{e.name}</h2>
            <p className="text-sm text-slate-600">{e.date} · {e.location}</p>
          </div>
        ))}
        {events.length === 0 && <p className="text-slate-500">You haven't registered for any events yet.</p>}
      </div>
    </div>
  );
}
