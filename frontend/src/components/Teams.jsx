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
import axios from "axios";
import { toast } from "sonner";
import { setTeams, clearTeams } from "@/redux/teamSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function TeamsPage() {
  // const [teams, setTeams] = useState([]);
   const dispatch = useDispatch();
    const teams = useSelector((state) => state.team.teams); // Get teams from Redux
    const user = useSelector((state) => state.user.user); // Get user from Redux
    const userId = user?.id; // Extract user ID safely
    const navigate = useNavigate();
  

  useEffect(() => {
    const fetchTeams = async () => {
      if (!userId) {
        toast.error("User ID is missing.");
        return;
      }
  
      try {
        const res = await axios.get(`${HOME_API}/students/get-teams`, {
          withCredentials: true,
        });
  
        if (res.data.success) {
          dispatch(setTeams(res.data.message)); // Store teams in Redux
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch teams");
      }
    };
    fetchTeams();
     return () => {
          dispatch(clearTeams()); // Clear teams on component unmount
        };
  }, [userId]);

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
          {teams?.map((team) => (
            <Card key={team.id} onClick={() => navigate(`/team/${team.id}`)}>
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex -space-x-2">
                  {team?.students?.map((student, i) => (
                    <Avatar key={i} className="border-2 border-gray-200">
                      <AvatarImage src={student?.avatar || "/placeholder.svg"} alt={student.user.name} />
                      <AvatarFallback>
                        {student.user.name
                          .split(" ")
                          .map((n) => n[0].toUpperCase())
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
