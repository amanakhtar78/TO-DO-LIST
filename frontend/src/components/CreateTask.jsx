import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Loading from "./Loading";
const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [LoadingTrue, setLoadingTrue] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmSave = window.confirm(
      "Are you sure you want to save this task?"
    );

    if (confirmSave) {
      try {
        setLoadingTrue(true);
        await axios.post("http://localhost:5000/api/tasks", {
          title,
          description,
        });
        alert("Task created successfully!");
        navigate("/");
        setLoadingTrue(false);
      } catch (error) {
        alert("Error creating task. Please try again.");
        console.error("Create task error: ", error);
        setLoadingTrue(false);
      }
    } else {
      alert("Task creation canceled.");
      setLoadingTrue(false);
    }
  };
  if (LoadingTrue) {
    return <Loading />;
  }
  return (
    <div className="p-6 bg-slate-100 min-h-[100vh]">
      <section className="flex justify-between items-center flex-wrap">
        <h1 className="text-2xl mb-4">Create New Task</h1>
        <Link to="/">
          <button className="bg-blue-500 text-white px-4 py-1 rounded">
            Back
          </button>
        </Link>
      </section>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
