import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { HOME_API } from "@/lib/constant";
import { setTeams, clearTeams } from "@/redux/teamSlice";

const TeamMembers = () => {
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.team.teams); // Get teams from Redux
  const user = useSelector((state) => state.user.user); // Get user from Redux
  const userId = user?.id; // Extract user ID safely

  // Fetch Teams
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
        dispatch(setTeams(res.data.teams)); // Store teams in Redux
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch teams");
    }
  };

  useEffect(() => {
    fetchTeams();
    return () => {
      dispatch(clearTeams()); // Clear teams on component unmount
    };
  }, [userId]);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Team Members</h2>
      {teams.length === 0 ? (
        <p className="text-gray-500">No teams found.</p>
      ) : (
        <div className="space-y-4">
          {teams.map((team) => (
            <div key={team.id} className="p-4 border rounded-md">
              <h3 className="text-lg font-semibold">{team.name}</h3>
              <p className="text-gray-600">Team Code: {team.teamCode}</p>
              <h4 className="mt-2 text-md font-semibold">Members:</h4>
              <ul className="ml-4 list-disc">
                {team.students.map((member) => (
                  <li key={member.id}>{member.user.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
