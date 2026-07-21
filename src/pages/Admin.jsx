import { useEffect, useState } from "react";
import api from "../api/client.js";

const empty = { name: "", description: "", location: "", date: "", capacity: 100 };

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [regs, setRegs] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const [{ data: ev }, { data: rg }] = await Promise.all([
      api.get("/events"),
      api.get("/admin/registrations"),
    ]);
    setEvents(ev);
    setRegs(rg);
  };

  useEffect(() => { load().catch(() => setMsg("Failed to load")); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/events/${editingId}`, form);
      } else {
        await api.post("/events", form);
      }
      setForm(empty);
      setEditingId(null);
      await load();
    } catch (err) {
      setMsg(err.response?.data?.error || "Save failed");
    }
  };

  const edit = (ev) => { setEditingId(ev.id); setForm(ev); };
  const remove = async (id) => {
    if (!confirm("Delete this event?")) return;
    await api.delete(`/events/${id}`);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-3">{editingId ? "Edit Event" : "Create Event"}</h1>
        <form onSubmit={submit} className="grid gap-2 md:grid-cols-2">
          <input className="border rounded p-2" placeholder="Name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="border rounded p-2" placeholder="Location" value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <input className="border rounded p-2" placeholder="Date (e.g. 2026-08-15)" value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input type="number" className="border rounded p-2" placeholder="Capacity" value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
          <textarea className="border rounded p-2 md:col-span-2" placeholder="Description" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button className="bg-slate-900 text-white py-2 rounded md:col-span-2">
            {editingId ? "Update" : "Create"}
          </button>
        </form>
        {msg && <p className="text-sm mt-2">{msg}</p>}
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-3">All Events</h2>
        <div className="space-y-2">
          {events.map((e) => (
            <div key={e.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-semibold">{e.name}</p>
                <p className="text-sm text-slate-600">{e.date} · {e.location}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => edit(e)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Edit</button>
                <button onClick={() => remove(e.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-3">Registrations ({regs.length})</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left"><th>ID</th><th>User</th><th>Event</th></tr></thead>
          <tbody>
            {regs.map((r) => (
              <tr key={r.id} className="border-t">
                <td>{r.id}</td><td>{r.user_id}</td><td>{r.event_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
