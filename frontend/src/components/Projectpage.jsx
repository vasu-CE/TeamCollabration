
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, CheckCircle, Clock, Code, ExternalLink, FileText, Github, MoreHorizontal, PenTool, Star, Users } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
// import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { HOME_API } from "@/lib/constant";
import Sidebar from "@/page/SideBar";

const ProjectDetail = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const location = useLocation();
  const teamId = location.state?.teamId;
  // console.log(teamId) 

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${HOME_API}/students/get-project/${id}`, { withCredentials: true });
        // console.log(res.data.message[0]);
        setProject(res.data.message[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="ml-64 flex-1 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-project-blue mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading project details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="ml-64 flex-1 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto py-8 px-4 text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-800">Project not found</h2>
              <p className="mt-2 text-gray-600">The project you're looking for doesn't exist or has been removed.</p>
              <Button className="mt-4 bg-project-blue hover:bg-blue-700" asChild>
                <Link to={`/teams`} >Back to Projects</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format dates
  const createdDate = new Date(project.createdAt).toLocaleDateString();
  const updatedDate = new Date(project.updatedAt).toLocaleDateString();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-64 flex-1 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <Link to={`/team/${teamId}`} className="flex items-center text-sm text-gray-600 hover:text-project-blue transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </div>

          {/* Hero Section */}
          <div className="mb-8 bg-gradient-blue bg-white text-[#222] rounded-xl p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
                <div className="mt-3 flex items-center gap-3 flex-wrap">
                  <Badge className={`${getStatusBadge(project.status)} flex text-[#222] items-center gap-1 px-3 py-1 text-sm font-medium rounded-full`}>
                    {getStatusIcon(project.status)}
                    {project.status?.replace("_", " ")}
                  </Badge>
                  {project.isUnderSgp && (
                    <Badge className="bg-white/20 text-[white] backdrop-blur-sm px-3 py-1 text-sm font-medium rounded-full">
                      SGP {project.semester}
                    </Badge>
                  )}
                </div>
              </div>
              {project.gitHubLink && (
                <Button className="bg-blue-100 hover:bg-blue-200 hover:text-blue-800 text-blue-700 backdrop-blur-sm border border-white/20" size="sm" asChild>
                  <Link
                    to={project.gitHubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
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
                    <p className="text-gray-700 leading-relaxed">{project.description}</p>
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
                    {project.technology?.map((tech, index) => (
                      <Badge 
                        key={index} 
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 text-sm font-medium rounded-full transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
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
                      <p className="text-lg font-semibold text-project-orange">{project.team?.name}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">Team Members</h3>
                      <ul className="space-y-3">
                        {project.team?.students?.map((student) => (
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
                    <span className="font-mono bg-white px-2 py-1 rounded border border-blue-100 text-project-blue">{project.id}</span>
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

                  {project.isUnderSgp && (
                    <>
                      <Separator className="bg-gray-200" />
                      <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                        <span className="text-gray-700 font-medium">SGP Semester</span>
                        <span className="bg-project-blue text-white px-3 py-1 rounded-full">{project.semester}</span>
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
                        {project.team?.students?.length || 0}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                      <p className="text-gray-600 text-sm">Technologies</p>
                      <p className="text-2xl font-bold text-project-purple">
                        {project.technology?.length || 0}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-center col-span-2">
                      <p className="text-gray-600 text-sm">Project Age</p>
                      <p className="text-xl font-bold text-project-blue">
                        {Math.ceil((new Date() - new Date(project.createdAt)) / (1000 * 60 * 60 * 24))} days
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
  );
};

export default ProjectDetail;