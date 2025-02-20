import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function TeamDashboard() {
  const location = useLocation();
  const teamMembers = location.state?.teamMembers || [];
  const teamCode = location.state?.teamCode || "N/A"; // Team Code from CreateTeam.jsx

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState("");

  const chatEndRef = useRef(null);

  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to send a message
  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    setMessages([...messages, { text: newMessage, sender: "You" }]);
    setNewMessage("");
  };

  // Function to add a project
  const addProject = () => {
    if (newProject.trim() === "") return;
    setProjects([...projects, { name: newProject, status: "To-Do" }]);
    setNewProject("");
  };

  // Function to update project status
  const updateProjectStatus = (index, newStatus) => {
    const updatedProjects = [...projects];
    updatedProjects[index].status = newStatus;
    setProjects(updatedProjects);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-100 min-h-screen">
      
      {/* Team Code Display */}
      <Card className="p-4 bg-blue-100 shadow-md">
        <h2 className="text-xl font-semibold mb-2">Team Dashboard</h2>
        <p className="text-lg font-semibold text-blue-600">Team Code: {teamCode}</p>
      </Card>

      {/* Team Members */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-2">Team Members</h2>
        <ul className="list-disc pl-5">
          {teamMembers.length === 0 ? (
            <p className="text-gray-500">No team members yet.</p>
          ) : (
            teamMembers.map((id, index) => (
              <li key={index} className="text-gray-700">{id}</li>
            ))
          )}
        </ul>
      </Card>

      {/* Group Chat */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-2">Group Chat</h2>
        <div className="h-40 overflow-auto bg-gray-200 p-3 rounded-md">
          {messages.length === 0 && <p className="text-gray-500">No messages yet.</p>}
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <strong className="text-blue-600">{msg.sender}: </strong> {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} /> {/* Auto-scroll reference */}
        </div>
        <CardContent className="flex gap-2 mt-3">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button onClick={sendMessage}>Send</Button>
        </CardContent>
      </Card>

      {/* Project Section */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-2">Projects</h2>
        <ul className="list-none space-y-2">
          {projects.length === 0 ? (
            <p className="text-gray-500">No projects yet.</p>
          ) : (
            projects.map((project, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                <span className="text-gray-700">{project.name}</span>
                <select
                  className="border rounded p-1 text-sm"
                  value={project.status}
                  onChange={(e) => updateProjectStatus(index, e.target.value)}
                >
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </li>
            ))
          )}
        </ul>
        <CardContent className="flex gap-2 mt-3">
          <Input
            type="text"
            placeholder="New Project Name"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
          />
          <Button onClick={addProject}>Add</Button>
        </CardContent>
      </Card>
    </div>
  );
}
