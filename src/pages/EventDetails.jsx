import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [msg, setMsg] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/events/${id}`).then((r) => setEvent(r.data)).catch(() => setMsg("Not found"));
  }, [id]);

  const register = async () => {
    if (!user) return navigate("/login");
    try {
      await api.post(`/events/${id}/register`);
      setMsg("Registered successfully!");
    } catch (err) {
      setMsg(err.response?.data?.error || "Registration failed");
    }
  };

  if (!event) return <p>{msg || "Loading..."}</p>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl">
      <h1 className="text-2xl font-bold">{event.name}</h1>
      <p className="text-slate-600 mt-1">{event.date} · {event.location}</p>
      <p className="mt-4">{event.description}</p>
      <p className="text-sm text-slate-500 mt-2">Capacity: {event.capacity}</p>
      <button
        onClick={register}
        className="mt-4 bg-slate-900 text-white px-4 py-2 rounded"
      >
        Register for this event
      </button>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
}
