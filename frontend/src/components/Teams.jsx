import React, { useEffect, useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import Sidebar from "../page/SideBar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import CreateJoinTeam from "./CreateJoinTeam";
import { HOME_API } from "@/lib/constant";
import axios from "axios";
import { toast } from "sonner";
import { setTeams, clearTeams } from "@/redux/teamSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function TeamsPage() {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState([]);

  const teams = useSelector((state) => state.team.teams);
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      if (!userId) {
        toast.error("User ID is missing.");
        return;
      }

      try {
        const res = await axios.get(`${HOME_API}/students/get-teams`, { withCredentials: true });

        if (res.data.success) {
          dispatch(setTeams(res.data.message));
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch teams");
      }
    };

    fetchTeams();
    return () => {
      dispatch(clearTeams());
    };
  }, [userId]);

  useEffect(() => {
    async function fetchData() {
      try {
        const getres = await axios.get(`${HOME_API}/students/get-requests`, { withCredentials: true });
        if (getres.data.success) {
          setRequests(getres.data.data);
        }
      } catch (error) {
        toast.error("Failed to load team data");
      }
    }
    fetchData();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    try {
      const res = await axios.get(`${HOME_API}/students/accept-request/${requestId}`, { withCredentials: true });
      if (res.data.success) {
        toast.success("Request accepted!");
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to accept request");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const res = await axios.get(`${HOME_API}/students/reject-request/${requestId}`, { withCredentials: true });
      if (res.data.success) {
        toast.success("Request rejected!");
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to reject request");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">Teams</h1>
          <Dialog>
            <DialogTrigger className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition">
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

        {/* Search & Filter */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <Input placeholder="Search teams..." className="pl-10 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-200" />
          </div>
          <Button variant="outline" size="icon" className="border-gray-300 shadow-md">
            <Filter className="h-5 w-5 text-gray-600" />
          </Button>
        </div>

        {/* Teams Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teams?.map((team) => (
            <Card key={team.id} onClick={() => navigate(`/team/${team.id}`)} className="cursor-pointer transition hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{team.name}</CardTitle>
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
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Join Requests Section */}
        <div className="mt-10 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Join Requests</h2>
          {requests && requests.length > 0 ? (
            <ul className="space-y-3">
              {requests.map((req) => (
                <li key={req.id} className="p-4 border border-gray-300 rounded-md bg-gray-100 shadow-sm">
                  <p className="text-gray-700 font-medium">Request from:</p>
                  <p className="text-gray-900 font-semibold">{req.teamName}</p>

                  <div className="mt-3 flex gap-3">
                    <Button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition" onClick={() => handleAcceptRequest(req.id)}>
                      Accept
                    </Button>
                    <Button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition" onClick={() => handleRejectRequest(req.id)}>
                      Reject
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-center">
              No join requests
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
