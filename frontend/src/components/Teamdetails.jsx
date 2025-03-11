import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const [UserId, setUserId] = useState(null);

  // Get logged-in user from Redux
  const user = useSelector((state) => state.user.user);
  const loggedInUserId = user?.id;
  // const user = useSelector((state) => state.user.user);
  console.log("Redux User State:", user);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technology: [],
    gitHubLink: "",
    isUnderSgp: false,
    semester: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${HOME_API}/students/get-team/${id}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          // console.log(res.data);
          setTeam(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to load team data");
      }
    }
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      if (res.data.success) {
        toast.success("Project created successfully!");

        setTeam((prev) => ({
          ...prev,
          projects: [...prev.projects, res.data.project],
        }));
        setOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create project");
    }
  };
  useEffect(() => {
    console.log(team?.leaderId);
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

  if (!team) return <p>Loading team details...</p>;

  // Check if the logged-in user is the team leader
  console.log(UserId);
  console.log("login user id ", loggedInUserId);
  const isTeamLeader = UserId === loggedInUserId;
  console.log(isTeamLeader);

  return (
    <div className="flex min-h-screen">
    <Sidebar />
      <div className="p-8">
        <h1 className="text-4xl font-bold">{team.name}</h1>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Projects</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.projects?.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{project.description}</p>
                  {project.technology?.map((tech, i) => (
                    <span key={i} className="mr-2">
                      {tech}
                    </span>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
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
                />
                <Input
                  name="description"
                  placeholder="Description"
                  required
                  onChange={handleChange}
                />
                <Input
                  name="technology"
                  placeholder="Technologies (comma-separated)"
                  required
                  onChange={handleTechnologyChange}
                />
                <Input
                  name="gitHubLink"
                  placeholder="GitHub Link"
                  required
                  onChange={handleChange}
                />
                <Input
                  name="semester"
                  placeholder="Semester"
                  required
                  onChange={handleChange}
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
                  <label htmlFor="isUnderSgp">Under SGP?</label>
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
      </div>
    </div>
  );
}
