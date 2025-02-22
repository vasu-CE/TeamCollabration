import * as React from "react"
import { Plus, Search, Filter, Grid2X2, List, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Sidebar from "../page/Dashboard"

const teams = [
  {
    id: 1,
    name: "TEAM 1",
    members: [
      { name: "Maitrik", avatar: "/placeholder.svg", role: "Member" },
      { name: "Oscar Davis", avatar: "/placeholder.svg", role: "Member" },
      { name: "Leader", avatar: "/placeholder.svg", role: "Leader" },
    ],
  },
  { id: 2, name: "TEAM 2", members: [{ name: "Team Member", avatar: "/placeholder.svg", role: "Member" }] },
  { id: 3, name: "TEAM 3", members: [{ name: "Team Member", avatar: "/placeholder.svg", role: "Member" }] },
  { id: 4, name: "TEAM 4", members: [{ name: "Team Member", avatar: "/placeholder.svg", role: "Member" }] },
  { id: 5, name: "TEAM 5", members: [{ name: "Team Member", avatar: "/placeholder.svg", role: "Member" }] },
]

const analyticsData = [
  { website: "website.net", sessions: 4321, change: "+84%" },
  { website: "website.net", sessions: 4033, change: "-8%" },
  { website: "website.net", sessions: 3128, change: "+2%" },
  { website: "website.net", sessions: 2104, change: "+33%" },
  { website: "website.net", sessions: 2003, change: "+30%" },
]

export default function TeamsPage() {
  const [view, setView] = React.useState("grid")

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Teams</h1>
          <Button>CREATE/JOIN TEAM</Button>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search teams..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <div className="flex items-center rounded-md border bg-background">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setView("grid")}>
                    <Grid2X2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Grid view</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setView("list")}>
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>List view</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={view === "calendar" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setView("calendar")}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Calendar view</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card key={team.id}>
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex -space-x-2">
                  {team.members.map((member, i) => (
                    <Avatar key={i} className="border-2 border-gray-200">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  <Button size="icon" variant="outline" className="ml-2 border-gray-400/50 rounded-full">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsData.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>Title</TableCell>
                    <TableCell>{row.website}</TableCell>
                    <TableCell>{row.sessions}</TableCell>
                    <TableCell className={row.change.startsWith("+") ? "text-green-600" : "text-red-600"}>
                      {row.change}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
