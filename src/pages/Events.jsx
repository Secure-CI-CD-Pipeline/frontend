import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/events");
      setEvents(data);
    } catch (e) {
      setError("Failed to load events");
    }
  };

  useEffect(() => { load(); }, []);

  const search = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.get(`/events/search?name=${encodeURIComponent(q)}`);
      // search returns raw rows
      setEvents(data);
    } catch {
      setError("Search failed");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <form onSubmit={search} className="mb-4 flex gap-2">
        <input
          className="border rounded p-2 flex-1"
          placeholder="Search by name"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="bg-slate-900 text-white px-4 rounded">Search</button>
        <button type="button" onClick={load} className="bg-slate-200 px-4 rounded">Reset</button>
      </form>
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid gap-3 md:grid-cols-2">
        {events.map((e) => (
          <Link
            key={e.id}
            to={`/events/${e.id}`}
            className="bg-white p-4 rounded shadow hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg">{e.name}</h2>
            <p className="text-sm text-slate-600">{e.date} · {e.location}</p>
            <p className="text-sm mt-1">{e.description}</p>
          </Link>
        ))}
        {events.length === 0 && <p className="text-slate-500">No events found.</p>}
      </div>
    </div>
  );
}
