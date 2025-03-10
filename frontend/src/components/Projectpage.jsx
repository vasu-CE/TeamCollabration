import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { HOME_API } from "@/lib/constant";
import Sidebar from "../page/SideBar";

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    technology: [], // Set technology as an array
    gitHubLink: "",
    isUnderSgp: false,
    semester: "",
  });

  // Handle Form Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle technology input
  const handleTechnologyChange = (e) => {
    const input = e.target.value;
    // Split the input into an array by commas, removing extra spaces
    const technologiesArray = input.split(",").map((tech) => tech.trim()).filter(Boolean);
    setForm({
      ...form,
      technology: technologiesArray, // Store as array
    });
  };

  // Create Project
  const createProject = async () => {
    try {
      const res = await axios.post(
        `${HOME_API}/students/create-project/${team.id}`,

        form, // Send the form directly, no need to wrap it in an object
        { withCredentials: true }
      );
      console.log(res);
      if (res.data.success) {
        toast.success("Project created successfully");
        setForm({
          title: "",
          description: "",
          technology: [], // Reset the technology array
          gitHubLink: "",
          isUnderSgp: false,
          semester: "",
        });
        // fetchProjects();
      } else {
        toast.error("Failed to create project");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🚀 Projects</h1>

        {/* Project Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Create a New Project</h2>
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-3"
          />
          <textarea
            name="description"
            placeholder="Project Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-3"
          />
          <input
            type="text"
            name="technology"
            placeholder="Technologies Used (comma separated)"
            value={form.technology.join(", ")} // Show array as comma-separated string
            onChange={handleTechnologyChange} // Call the technology change handler
            className="w-full p-2 border rounded-md mb-3"
          />
          <input
            type="text"
            name="gitHubLink"
            placeholder="GitHub Link (optional)"
            value={form.gitHubLink}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-3"
          />
          <div className="flex items-center gap-3 mb-3">
            <input
              type="checkbox"
              name="isUnderSgp"
              checked={form.isUnderSgp}
              onChange={handleChange}
            />
            <label className="text-gray-700">Is this an SGP project?</label>
          </div>
          {form.isUnderSgp && (
            <input
              type="text"
              name="semester"
              placeholder="Semester"
              value={form.semester}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-3"
            />
          )}
          <button
            onClick={createProject}
            className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Create Project
          </button>
        </div>

        {/* Project List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">
              No projects found.
            </p>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-blue-600">
                  {project.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Technologies: <span className="font-bold">{project.technology.join(", ")}</span>
                </p>
                <p className="text-gray-700">{project.description}</p>
                {project.gitHubLink && (
                  <a
                    href={project.gitHubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3 text-blue-500 underline"
                  >
                    GitHub Link
                  </a>
                )}
                <p className="text-gray-500 mt-3">
                  Status:{" "}
                  <span className="font-bold text-green-600">
                    {project.status}
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
