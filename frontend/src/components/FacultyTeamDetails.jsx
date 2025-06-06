import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { HOME_API } from "@/lib/constant";
import FacultySidebar from "../page/FacultySidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Badge, Calendar, ChartNoAxesCombined, CheckCircle, Clock, Code, ExternalLink, FileText, Github, MoreHorizontal, PenTool, Star, Users } from "lucide-react";
import { Separator } from "@radix-ui/react-select";

export default function FacultyTeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamLeaderId, setTeamLeaderId] = useState(null);
  const [marks, setMarks] = useState({});
  const [project , setProject] = useState(null);

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

  useEffect(() => {
    setProject(projects[0]);
  },[projects])
  useEffect(() => {
    console.log(project);
  },[project])
  

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

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-project-yellow text-black";
      case "IN_PROGRESS":
        return "bg-project-blue text-white";
      case "COMPLETED":
        return "bg-project-green text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "IN_PROGRESS":
        return <PenTool className="h-4 w-4" />;
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <MoreHorizontal className="h-4 w-4" />;
    }
  };

  const navigate = useNavigate();
  const createdDate = new Date(project?.createdAt).toLocaleDateString();
  const updatedDate = new Date(project?.updatedAt).toLocaleDateString();
  return (
    <div className="flex min-h-screen bg-gray-50">
      <FacultySidebar />
      <div className="flex-1 p-6 lg:p-10 ">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 ">Team Details</h1>
        {/* Team Members Section */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8 ml-64">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Team Members & Marks</h2>
          {team.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((student) => (
                <Card key={student.id}
                 className="p-5 shadow-lg border border-gray-200 bg-white">
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
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 ml-64" >SGP Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ml-64">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Card
                key={project.id}
                className="shadow-md border border-gray-200 bg-white cursor-pointer"
                onClick={() =>
                  navigate(`/project/${project.id}`, { state: { teamId: id } })
                }
                // className="shadow-lg border border-gray-200"
               >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {project?.title}
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

        <div className="flex min-h-screen">
              {/* <Sidebar /> */}
              <div className="ml-64 flex-1 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="container mx-auto py-8 px-4">
        
                  {/* Hero Section */}
                  <div className="mb-8 bg-gradient-blue bg-white text-[#222] rounded-xl p-8 shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h1 className="text-3xl md:text-4xl font-bold">{project?.title}</h1>
                        <div className="mt-3 flex items-center gap-3 flex-wrap">
                          <Badge className={`${getStatusBadge(project?.status)} flex text-[#222] items-center gap-1 px-3 py-1 text-sm font-medium rounded-full`}>
                            {getStatusIcon(project?.status)}
                            {project?.status?.replace("_", " ")}
                          </Badge>
                          {project?.isUnderSgp && (
                            <Badge className="bg-white/20 text-[white] backdrop-blur-sm px-3 py-1 text-sm font-medium rounded-full">
                              SGP {project?.semester}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {project?.gitHubLink && (
                        <div className="flex flex-col gap-3">
                          <Button className="bg-blue-100 hover:bg-blue-200 hover:text-blue-800 text-blue-700 backdrop-blur-sm border border-white/20" size="sm" asChild>
                          <Link
                            to={project?.gitHubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <Github className="mr-2 h-4 w-4" />
                            View on GitHub
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
        
                        <Button
                          onClick = {() => navigate(`/performance` , {state : {githubLink : project.gitHubLink}} )}
                          className="bg-blue-100 hover:bg-blue-200 hover:text-blue-800 text-blue-700 backdrop-blur-sm border border-white/20" size="sm" asChild>
                            <span>
                            <ChartNoAxesCombined className="mr-2 h-4 w-4" />
                            Analyse project
                            </span>
                        </Button>
                        </div>
                        
                      )}
                    </div>
                  </div>
        
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                      {/* Description Card */}
                      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-2 bg-gradient-purple"></div>
                        <CardHeader>
                          <CardTitle className="text-xl md:text-2xl flex items-center">
                            <FileText className="mr-2 h-5 w-5 text-project-purple" />
                            Project Description
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <p className="text-gray-700 leading-relaxed">{project?.description}</p>
                          </div>
                        </CardContent>
                      </Card>
        
                      {/* Technology Stack Card */}
                      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                          <CardTitle className="text-xl md:text-2xl flex items-center">
                            <Code className="mr-2 h-5 w-5 text-blue-600" />
                            Technology Stack
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                          {project?.technology.join(", ")}
                            
                          </div>
                        </CardContent>
                      </Card>
        
                      {/* Team Information Card */}
                      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-2 bg-gradient-orange"></div>
                        <CardHeader>
                          <CardTitle className="text-xl md:text-2xl flex items-center">
                            <Users className="mr-2 h-5 w-5 text-project-orange" />
                            Team Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="bg-orange-50 rounded-lg p-4">
                              <h3 className="font-medium text-gray-700">Team Name</h3>
                              <p className="text-lg font-semibold text-project-orange">{project?.team?.name}</p>
                            </div>
        
                            <div>
                              <h3 className="font-medium text-gray-700 mb-3">Team Members</h3>
                              <ul className="space-y-3">
                                {project?.team?.students?.map((student) => (
                                  <li key={student.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center">
                                      <div className="bg-project-orange/10 text-project-orange p-2 rounded-full mr-3">
                                        <Users className="h-5 w-5" />
                                      </div>
                                      <span className="font-medium">{(student.userId).toUpperCase()} {student.user.name}</span>
                                    </div>
                                    <span className="text-gray-600 bg-gray-200 px-2 py-1 rounded-full text-xs">{student.batch}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
        
                    <div className="space-y-6">
                      {/* Project Details Card */}
                      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-2 bg-gradient-blue"></div>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <Star className="mr-2 h-5 w-5 text-project-blue" />
                            Project Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                            <span className="text-gray-700 font-medium">Project ID</span>
                            <span className="font-mono bg-white px-2 py-1 rounded border border-blue-100 text-project-blue">{project?.id}</span>
                          </div>
        
                          <Separator className="bg-gray-200" />
        
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Created</span>
                            <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                              <Calendar className="mr-2 h-4 w-4 text-project-blue" />
                              <span>{createdDate}</span>
                            </div>
                          </div>
        
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Last Updated</span>
                            <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                              <Calendar className="mr-2 h-4 w-4 text-project-blue" />
                              <span>{updatedDate}</span>
                            </div>
                          </div>
        
                          {project?.isUnderSgp && (
                            <>
                              <Separator className="bg-gray-200" />
                              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                                <span className="text-gray-700 font-medium">SGP Semester</span>
                                <span className="bg-project-blue text-white px-3 py-1 rounded-full">{project?.semester}</span>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
        
                      {/* Actions Card */}
                      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-2 bg-gradient-purple"></div>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <PenTool className="mr-2 h-5 w-5 text-project-purple" />
                            Actions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button className="w-full bg-project-blue hover:bg-blue-700 transition-colors">
                            Edit Project
                          </Button>
                          <Button variant="outline" className="w-full border-project-violet text-project-violet hover:bg-project-violet/10 transition-colors">
                            Project Timeline
                          </Button>
                          <Button className="w-full bg-gradient-to-r from-project-purple to-project-violet hover:opacity-90 transition-opacity text-white">
                            Generate Report
                          </Button>
                        </CardContent>
                      </Card>
        
                      {/* Quick Stats Card */}
                      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="h-2 bg-gradient-green"></div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <Star className="mr-2 h-5 w-5 text-project-green" />
                            Project Stats
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-green-50 p-3 rounded-lg text-center">
                              <p className="text-gray-600 text-sm">Team Size</p>
                              <p className="text-2xl font-bold text-project-green">
                                {project?.team?.students?.length || 0}
                              </p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg text-center">
                              <p className="text-gray-600 text-sm">Technologies</p>
                              <p className="text-2xl font-bold text-project-purple">
                                {project?.technology?.length || 0}
                              </p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg text-center col-span-2">
                              <p className="text-gray-600 text-sm">Project Age</p>
                              <p className="text-xl font-bold text-project-blue">
                                {Math.ceil((new Date() - new Date(project?.createdAt)) / (1000 * 60 * 60 * 24))} days
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
        </div>
      </div>
    </div>
  );
}
