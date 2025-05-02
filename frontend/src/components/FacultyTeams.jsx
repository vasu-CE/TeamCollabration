import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { HOME_API } from "@/lib/constant";
import FacultySidebar from "../page/FacultySidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function FacultyTeams() {
  const [year, setYear] = useState("");
  const [batch, setBatch] = useState("");
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  // Reset batch when year changes
  useEffect(() => {
    setBatch(""); // Reset batch when a new year is selected
  }, [year]);

  // Function to fetch teams based on selected year & batch
  const handleBatchTeam = async () => {
    if (!year || !batch) {
      toast.error("Please select both Year and Batch");
      return;
    }

    try {
      const res = await axios.get(`${HOME_API}/faculty/get-teams`, {
        params: { batch, year },
        withCredentials: true,
      });

      if (res.data.success) {
        setTeams(res.data.message);
        toast.success("Teams loaded successfully");
      } else {
        setTeams([]);
        toast.warning("No teams found");
      }
    } catch (error) {
      toast.error("Failed to load teams");
      setTeams([]);
    }
  };

  // Function to navigate to team details page
  const handleTeamClick = (teamId) => {
    navigate(`/Fteam/${teamId}`);
  };

  return (
    <div className="flex min-h-screen">
      <FacultySidebar />
      <div className="flex-1 p-8 ml-64">
        <h1 className="text-3xl font-bold text-gray-800">Faculty Teams</h1>

        {/* Filters */}
        <div className="flex gap-4 mt-4">
          {/* Year Selection */}
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-1/2 border p-2 rounded-md">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((yr) => (
                <SelectItem key={yr} value={yr}>{yr}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Batch Selection */}
          <Select value={batch} onValueChange={setBatch} disabled={!year}>
            <SelectTrigger className="w-1/2 border p-2 rounded-md">
              <SelectValue placeholder="Select Batch" />
            </SelectTrigger>
            <SelectContent>
              {["A1", "B1", "C1", "D1"].map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <Button onClick={handleBatchTeam} className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Submit
          </Button>
        </div>

        {/* Selected Values */}
        <div className="mt-4 text-lg font-semibold">
          {year} {batch && `- ${batch}`}
        </div>

        {/* Display Teams */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teams.length > 0 ? (
            teams.map((team) => (
              <Card 
                key={team.id} 
                className="shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl transition"
                onClick={() => handleTeamClick(team.id)} // Navigate on click
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{team.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Leader: {team.leaderName}</p>
                  <p className="text-gray-600">Members: {team.students?.length || 0}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-600 mt-4">No teams found</p>
          )}
        </div>
      </div>
    </div>
  );
}
