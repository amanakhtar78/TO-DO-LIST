import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import CreateTask from "./components/CreateTask";
import EditTask from "./components/EditTask";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/create" element={<CreateTask />} />
      <Route path="/edit/:id" element={<EditTask />} />
    </Routes>
  </Router>
);
