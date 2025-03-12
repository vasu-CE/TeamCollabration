import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { toast } from "sonner";
import axios from "axios";
import { HOME_API } from "@/lib/constant";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import Sidebar from "@/page/SideBar";

export default function TeamDetailsPage() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [team, setTeam] = useState(null);
  const [userId, setUserId] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [studentId, setstudentId] = useState("");
  const user = useSelector((state) => state.user.user);
  const loggedInUserId = user?.id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technology: [],
    gitHubLink: "",
    isUnderSgp: false,
    semester: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${HOME_API}/students/get-team/${id}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          // console.log(res.data.data.students)
          setTeam(res.data.data);
          setTeamMembers(res.data.data.students);
        }
      } catch (error) {
        toast.error("Failed to load team data");
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!team?.leaderId) return;
    async function fetchLeaderUserId() {
      try {
        const resID = await axios.get(
          `${HOME_API}/students/get-leaderIdToUserId/${team.leaderId}`,
          { withCredentials: true }
        );
        if (resID.data.success) {
          setUserId(resID.data.message.userId);
        }
      } catch (err) {
        toast.error("Failed to fetch leader ID to UserId");
      }
    }
    fetchLeaderUserId();
  }, [team]);

  if (!team)
    return (
      <p className="text-center text-lg font-semibold">
        Loading team details...
      </p>
    );

  const isTeamLeader = userId === loggedInUserId;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechnologyChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      technology: e.target.value.split(",").map((tech) => tech.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${HOME_API}/students/create-project/${id}`,
        formData,
        { withCredentials: true }
      );
      console.log(res.data.success);
      if (res.data.success) {
        toast.success("Project created successfully!");
        // setTeam((prev) => ({ ...prev, projects: [...prev.projects, res.data.project] }));
        setOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create project");
    }
  };

  const handleRemoveMember = async (memberId) => {
    console.log(memberId);
    if (!isTeamLeader) return;

    try {
      const res = await axios.get(
        `${HOME_API}/students/student-remove/${memberId}`,
        { withCredentials: true }
      );
      console.log(res);
      if (res.data.success) {
        toast.success("Member removed successfully!");
        setTeamMembers((prev) =>
          prev.filter((member) => member.user.id !== memberId)
        );
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Failed to remove member");
    }
  };
  const handleSendJoinRequest = async (studentId) => {
    try {
      const res = await axios.get(
        `${HOME_API}/students/send-request/${studentId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Join request sent successfully!");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send join request");
    }
  };

  return (
    <div className="flex min-h-screen w-screen">
    <Sidebar />
        <div className="p-8 w-screen">
      <h1 className="text-4xl font-bold text-gray-800">{team.name}</h1>

      {/* 🔹 Team Members Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-700">Team Members</h2>
        <ul className="mt-3 space-y-2">
          {teamMembers?.map((member) => (
            <li
              key={member.user.id}
              className="flex justify-between items-center border p-3 rounded-lg shadow-sm bg-gray-100"
            >
              <div>
                <span className="font-medium text-gray-800">
                  {member.user.name}
                </span>
                <span className="text-gray-500 text-sm">
                  {" "}
                  ({member.user.role})
                </span>
              </div>

              {member.user.id === userId ? (
                <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded">
                  Leader
                </span>
              ) : (
                isTeamLeader && (
                  <Button
                    variant="destructive"
                    className="ml-4 bg-red-500 text-white text-xs px-2 py-1 rounded"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    Remove
                  </Button>
                )
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 🔹 Projects Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700">Projects</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.projects?.map((project) => (
            <Card key={project.id} onClick={() => navigate(`/project/${project.id}`)} className="shadow-lg border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {project.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{project.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.technology?.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-600 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 🔹 Allow only Team Leader to create a project */}
        {isTeamLeader && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="mt-6 bg-blue-500 text-white">
                Create New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="title"
                  placeholder="Project Title"
                  required
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                />
                <Input
                  name="description"
                  placeholder="Description"
                  required
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                />
                <Input
                  name="technology"
                  placeholder="Technologies (comma-separated)"
                  required
                  onChange={handleTechnologyChange}
                  className="border border-gray-300 p-2 rounded-md"
                />
                <Input
                  name="gitHubLink"
                  placeholder="GitHub Link"
                  required
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                />
                <Input
                  name="semester"
                  placeholder="Semester"
                  required
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isUnderSgp"
                    name="isUnderSgp"
                    checked={formData.isUnderSgp}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isUnderSgp: e.target.checked,
                      }))
                    }
                  />
                  <label htmlFor="isUnderSgp" className="text-gray-600">
                    Under SGP?
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-500 text-white"
                >
                  Submit
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {isTeamLeader && (
          <div>
            <h2 className="text-xl font-semibold mt-6">Invite Students</h2>
            <div className="flex gap-3 mt-3">
              <Input
                type="text"
                placeholder="Enter Student ID"
                value={studentId}
                onChange={(e) => setstudentId(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
              <Button
                onClick={() => handleSendJoinRequest(studentId)}
                className="bg-blue-500 text-white px-4 py-2"
              >
                Send Request
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
