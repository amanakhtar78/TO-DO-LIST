import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { Link } from "react-router-dom";
import Loading from "./components/Loading";
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [LoadingTrue, setLoadingTrue] = useState(false);

  // Fetch tasks from the backend
  useEffect(() => {
    setLoadingTrue(true);
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tasks");
        setTasks(response.data);
        setLoadingTrue(false);
      } catch (error) {
        alert("Error fetching tasks. Please try again.");
        console.error("Fetch error: ", error);
        setLoadingTrue(false);
      }
    };
    fetchTasks();
  }, []);

  // Delete task
  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
      setLoadingTrue(true);

      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`);
        setTasks(tasks.filter((task) => task.id !== id));
        alert("Task deleted successfully.");
        setLoadingTrue(false);
      } catch (error) {
        alert("Error deleting task. Please try again.");
        console.error("Delete error: ", error);
        setLoadingTrue(false);
      }
    }
  };
  if (LoadingTrue) {
    return <Loading />;
  }
  return (
    <div className="p-6 bg-slate-100 min-h-[100vh]">
      <section className="flex items-baseline gap-10">
        <h1 className="text-2xl mb-4">Welcome User</h1>

        <Link to="/create" className="bg-blue-500 text-white px-4 py-2 rounded">
          + Add New Task
        </Link>
      </section>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-gray-500">
              {new Date(task.updated_at).toLocaleDateString()}
            </p>
            <div className="mt-2">
              <Link
                to={`/edit/${task.id}`}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </Link>
              <button
                onClick={() => deleteTask(task.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
