import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { HOME_API } from "@/lib/constant";
import FacultySidebar from "../page/FacultySidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FacultyTeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamLeaderId, setTeamLeaderId] = useState(null);
  const [marks, setMarks] = useState({});

  // Fetch team details and projects
  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const res = await axios.get(`${HOME_API}/faculty/get-team/${id}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          const { students, projects, leaderId } = res.data.data;
          setTeam(students);
          setProjects(projects?.filter((p) => p.isUnderSgp));
          setTeamLeaderId(leaderId);
        } else {
          toast.warning("Team not found");
        }
      } catch (error) {
        toast.error("Failed to load team details");
      }
    };

    fetchTeamDetails();
  }, [id]);

  // Handle marks input change
  const handleMarkChange = (studentId, field, value) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

  // Handle mark submission
  const handleMarkSubmit = async (studentId, existingMarkId) => {
    const studentMarks = marks[studentId] || {};

    try {
      let res;
      if (existingMarkId) {
        res = await axios.post(`${HOME_API}/marks/update/${existingMarkId}`, studentMarks, {
          withCredentials: true,
        });
      } else {
        res = await axios.post(`${HOME_API}/marks/create`, { studentId, ...studentMarks }, {
          withCredentials: true,
        });
      }

      if (res.data.success) {
        toast.success("Marks updated successfully");
      } else {
        toast.warning(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update marks");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FacultySidebar />
      <div className="flex-1 p-6 lg:p-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Team Details</h1>

        {/* Team Members Section */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Team Members & Marks</h2>
          {team.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((student) => (
                <Card key={student.id} className="p-5 shadow-lg border border-gray-200 bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-800 font-medium">{student.userId}</span>
                    {student.id === teamLeaderId && (
                      <span className="text-xs text-white bg-blue-500 px-2 py-1 rounded-md">
                        Leader
                      </span>
                    )}
                  </div>

                  {/* Marks Input Fields */}
                  <div className="space-y-3">
                    <Input
                      type="number"
                      placeholder="Mark"
                      className="text-sm"
                      value={marks[student.id]?.internal1 || ""}
                      onChange={(e) => handleMarkChange(student.id, "internal1", e.target.value)}
                      disabled={student.marks?.internal1}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleMarkSubmit(student.id, student.marks?.id)}
                  >
                    {student.marks?.id ? "Update Marks" : "Allocate Marks"}
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No members found</p>
          )}
        </div>

        {/* SGP Projects Section */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">SGP Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Card key={project.id} className="shadow-md border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    <strong>Tech Stack:</strong> {project.technology.join(", ")}
                  </p>
                  <p className="text-gray-700">
                    <strong>Semester:</strong> {project.semester}
                  </p>
                  <a
                    href={project.gitHubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline block mt-2"
                  >
                    GitHub Repository
                  </a>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No SGP projects found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
