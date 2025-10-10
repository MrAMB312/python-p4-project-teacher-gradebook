import React, { useState } from "react";

function AssignmentList({ assignments, setAssignments }) {
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [totalPoints, setTotalPoints] = useState("");

  const handleAddAssignment = (e) => {
    e.preventDefault();

    fetch("/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        category,
        total_points: parseInt(totalPoints),
      }),
    })
      .then(res => res.json())
      .then(newAssignment => {
        setAssignments([...assignments, newAssignment]);
        setTitle("");
        setCategory("");
        setTotalPoints("");
        setShowAdd(false);
      });
  };

  return (
    <div>
      <h2>Assignments</h2>
      <ul>
        {assignments.map(a => (
          <li key={a.id}>
            {a.title} ({a.category}) - {a.total_points} pts
          </li>
        ))}
      </ul>

      <button onClick={() => setShowAdd(!showAdd)}>
        {showAdd ? "Cancel" : "Add Assignment"}
      </button>

      {showAdd && (
        <form onSubmit={handleAddAssignment}>
          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <input
            placeholder="Category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Total Points"
            value={totalPoints}
            onChange={e => setTotalPoints(e.target.value)}
            required
          />
          <button type="submit">Add</button>
        </form>
      )}
    </div>
  );
}

export default AssignmentList;