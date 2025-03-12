"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, ExternalLink, Github, Users } from "lucide-react"
// import Link from "next/link"
import { Link, useParams } from "react-router-dom"
import Sidebar from "@/page/SideBar"
import axios from "axios"
import { HOME_API } from "@/lib/constant"

const ProjectDetail = () => {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const {id} = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      const res = await axios.get(`${HOME_API}/students/get-project/${id}` , {withCredentials : true})
      {console.log(res.data.message[0])}
      setProject(res.data.message[0]);
      // console.log(project);
      setLoading(false)
    }

    fetchProject()
  }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "secondary"
      case "IN_PROGRESS":
        return "default"
      case "COMPLETED":
        return "success"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold">Project not found</h2>
        <p className="mt-2 text-muted-foreground">The project you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-4" asChild>
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>
    )
  }

  // Format dates
  const createdDate = new Date(project.createdAt).toLocaleDateString()
  const updatedDate = new Date(project.updatedAt).toLocaleDateString()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/projects" className="flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  
                  <CardTitle className="text-2xl md:text-3xl">{project.title}</CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-2">
                    <Badge variant={getStatusBadge(project.status)}>{project.status?.replace("_", " ")}</Badge>
                    {project.isUnderSgp && (
                      <Badge variant="outline" className="ml-2">
                        SGP {project.semester}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
                {project.gitHubLink && (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      to={`${project.gitHubLink}`}
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
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{project.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Technology Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technology?.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Team Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Team Name</h3>
                  <p>{project.team?.name}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Team Members</h3>
                  <ul className="space-y-2">
                    {project.team?.students?.map((student) => (
                      <li key={student.id} className="flex justify-between">
                        <span>{(student.userId).toUpperCase()} {student.user.name}</span>
                        <span className="text-muted-foreground">{student.batch}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Project ID</span>
                <span>{project.id}</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{createdDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{updatedDate}</span>
                </div>
              </div>

              {project.isUnderSgp && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">SGP Semester</span>
                    <span>{project.semester}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">Edit Project</Button>
              <Button variant="outline" className="w-full">
                Project Timeline
              </Button>
              <Button variant="secondary" className="w-full">
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  )
}

export default ProjectDetail

