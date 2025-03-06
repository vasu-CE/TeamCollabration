import React, { useEffect, useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import Sidebar from "../page/SideBar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import CreateJoinTeam from "./CreateJoinTeam";
import { HOME_API } from "@/lib/constant";  // Import the constant API base URL

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${HOME_API}/students/create-teams`);
        if (!response.ok) throw new Error("Failed to fetch teams");
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Teams</h1>
          <Dialog>
            <DialogTrigger className="bg-blue-500 text-white px-4 py-1.5 rounded">
              Create/Join Team
            </DialogTrigger>
            <DialogContent className="w-[25%]">
              <DialogHeader>
                <DialogTitle>Create/Join Team</DialogTitle>
                <CreateJoinTeam onTeamCreated={(newTeam) => setTeams((prev) => [...prev, newTeam])} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search teams..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
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
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
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
      </div>
    </div>
  );
}
