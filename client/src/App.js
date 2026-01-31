import './App.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


const API = process.env.REACT_APP_URL  || "http://localhost:5000"

function App() {
  const [people, setPeople] = useState([]);
  const [form, setForm] = useState({ name: "", age: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadPeople();
  }, []);

  // Read all people
  const loadPeople = async () => {
    const res = await axios.get(API);
    setPeople(res.data);
  };

  // Add person
  const addPerson = async () => {
    if (!form.name || !form.age)
      return alert("Enter name and age");

    const res = await axios.post(API, {
      name: form.name,
      age: Number(form.age),
    });

    setPeople([...people, res.data]);
    setForm({ name: "", age: "" });
  };

  // update person
  const startEdit = (p) => {
    setEditId(p._id);
    setForm({ name: p.name, age: p.age });
  };

  const updatePerson = async () => {
    const res = await axios.put(`${API}/${editId}`, form);
    setPeople(people.map(p => p._id === editId ? res.data : p));
    setEditId(null);
    setForm({ name: "", age: "" });
  };

  // Delete person
  const deletePerson = async (id) => {
  await axios.delete(`${API}/${id}`);
  setPeople(people.filter(p => p._id !== id));
};


  return (
  <div className="container vh-100 d-flex flex-column align-items-center mt-5">
    
    <h3 className="mb-4">MERN Stack CRUD App</h3>

    <div className="card p-4 shadow" style={{ width: "400px" }}>
      
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="number"
        className="form-control mb-3"
        placeholder="Enter age"
        value={form.age}
        onChange={e => setForm({ ...form, age: e.target.value })}
      />

      {editId ? (
        <button className="btn btn-warning w-100" onClick={updatePerson}>
          Update
        </button>
      ) : (
        <button className="btn btn-primary w-100" onClick={addPerson}>
          Add
        </button>
      )}
    </div>

    {/* List */}
    <ul className="list-group mt-4" style={{ width: "400px" }}>
      {people.map(p => (
        <li key={p._id} className="list-group-item d-flex justify-content-between align-items-center">
          <span>
            <b>{p.name}</b> - {p.age}
          </span>
          <div>
            <button
              className="btn btn-sm btn-outline-primary me-2"
              onClick={() => startEdit(p)}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => deletePerson(p._id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>

  </div>
);

}

export default App;
