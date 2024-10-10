import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { Link } from "react-router-dom";
import Loading from "./components/Loading";
import { FaSortUp, FaSortDown } from "react-icons/fa"; // Importing arrow icons

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // For general search
  const [searchId, setSearchId] = useState(""); // For ID-based search
  const [NoResult, setNoResult] = useState(""); // For ID-based search
  const [taskById, setTaskById] = useState(null); // Task fetched by ID
  const [sortOrder, setSortOrder] = useState("asc"); // Sorting order: 'asc' or 'desc'

  // Fetch tasks from the backend
  useEffect(() => {
    setLoading(true);
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tasks");
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        alert("Error fetching tasks. Please try again.");
        console.error("Fetch error: ", error);
        setLoading(false);
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
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`);
        setTasks(tasks.filter((task) => task.id !== id));
        alert("Task deleted successfully.");
        setLoading(false);
      } catch (error) {
        alert("Error deleting task. Please try again.");
        console.error("Delete error: ", error);
        setLoading(false);
      }
    }
  };

  // Search for a task by ID
  const fetchTaskById = async (id) => {
    if (!searchId) {
      alert("Please provide an ID.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks/${id}`);
      setTaskById(response.data);
      setNoResult("");
      setLoading(false);
    } catch (error) {
      setNoResult("No result found for this ID.");
      console.error("ID search error: ", error);
      setLoading(false);
      setTaskById(null); // Reset if not found
    }
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter((item) => {
    const searchData = searchQuery.toLowerCase().split(" ").filter(Boolean);

    const textMatch = searchData.every((term) => {
      return ["title", "id", "description", "updated_at"].some((key) => {
        const columnValue = String(item[key]).toLowerCase();
        return columnValue.includes(term);
      });
    });

    return textMatch;
  });

  // Sort the filtered tasks based on updated_at and sortOrder
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.updated_at);
    const dateB = new Date(b.updated_at);
    if (sortOrder === "asc") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  // Toggle sort order between ascending and descending
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 bg-slate-100 min-h-[100vh]">
      {/* Header Section */}
      <section className="flex flex-col lg:flex-row items-baseline gap-4 lg:gap-10">
        <h1 className="text-2xl mb-4">Welcome User</h1>

        <div className="lg:flex items-center gap-4">
          <Link
            to="/create"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            + Add New Task
          </Link>

          {/* Search by ID */}
          <div className="flex items-center gap-2 lg:ml-16 mt-4 lg:mt-0">
            <input
              type="number"
              placeholder="Enter task ID..."
              className="border p-2 rounded"
              value={searchId}
              onChange={(e) => {
                setSearchId(e.target.value);
                setNoResult("");
              }}
            />
            <button
              onClick={() => fetchTaskById(searchId)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Search by ID
            </button>
          </div>
        </div>
      </section>

      {/* Display No Result Message */}
      {NoResult && (
        <p className="text-red-400 font-semibold text-sm mt-2">{NoResult}</p>
      )}

      {/* Display task found by ID */}
      {taskById && (
        <div className="bg-white p-4 rounded shadow mt-2">
          <h3 className="font-semibold mb-2">
            Id-{taskById.id}) {taskById.title}
          </h3>
          <p className="text-gray-500 text-[10px] font-semibold">
            Last Updated :&nbsp;
            {new Date(taskById.updated_at).toLocaleDateString("en-GB")}{" "}
            {taskById.updated_at?.slice(11, 16)}
          </p>
          <p className="text-gray-600 mb-4">{taskById.description}</p>
        </div>
      )}

      {/* Search by Keyword */}
      <div className="mt-6 flex items-center lg:gap-4 gap-2 flex-wrap">
        <label htmlFor="search" className="font-semibold">
          Search:
        </label>
        <input
          type="text"
          id="search"
          placeholder="Search tasks..."
          className="border p-2 rounded w-full md:w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* Sort Button */}
        <div className=" flex items-center gap-2 lg:ml-8">
          <button
            onClick={toggleSortOrder}
            className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded"
          >
            Sort by Date
            {sortOrder === "asc" ? (
              <FaSortUp className="ml-2" />
            ) : (
              <FaSortDown className="ml-2" />
            )}
          </button>
          <span className="text-sm text-gray-600">
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </span>
        </div>
      </div>

      {/* Task List */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">
                Id-{task.id}) {task.title}
              </h3>
              <p className="text-gray-500 text-[10px] font-semibold">
                Last Updated :&nbsp;
                {new Date(task.updated_at).toLocaleDateString("en-GB")}{" "}
                {task.updated_at?.slice(11, 16)}
              </p>
              <p className="text-gray-600 mb-4">{task.description}</p>

              <div className="flex items-center gap-2">
                <Link
                  to={`/edit/${task.id}`}
                  className="bg-yellow-500 text-white px-3 py-[2px] rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 text-white px-3 py-[2px] rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default App;
