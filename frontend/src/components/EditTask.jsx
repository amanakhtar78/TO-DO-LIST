import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory

const EditTask = () => {
  const { id } = useParams();
  const [task, setTask] = useState({ title: "", description: "" });
  const navigate = useNavigate(); // Create a navigate instance

  useEffect(() => {
    const fetchTask = async () => {
      const response = await axios.get(`http://localhost:5000/api/tasks/${id}`);
      setTask({
        title: response.data.title,
        description: response.data.description,
      });
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api/tasks/${id}`, task);
    navigate("/"); // Navigate to the main page after updating
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Edit Task</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className="border p-2 w-full"
            required
          />
        </div>
        {/*  */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Task
        </button>
      </form>
    </div>
  );
};

export default EditTask;
