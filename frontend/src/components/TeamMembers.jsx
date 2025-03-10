import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { HOME_API } from "@/lib/constant";
import { setTeams, clearTeams } from "@/redux/teamSlice";
import Sidebar from "../page/SideBar"; // ✅ Ensure correct import

const TeamMembers = () => {
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.team.teams);
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;

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
        dispatch(setTeams(res.data.message)); 
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
      dispatch(clearTeams());
    };
  }, [userId]);

  return (
    <div className="flex h-screen">
      {/* ✅ Sidebar - Fixed on the left */}
      <Sidebar />

      {/* ✅ Main content - Takes full width minus Sidebar */}
      <div className="flex-1 p-8 bg-gray-100 overflow-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">🚀 Your Teams</h2>

        {teams.length === 0 ? (
          <p className="text-center text-gray-500">No teams found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div key={team.id} className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-blue-600">{team.name}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Team Code: <span className="font-bold text-gray-800">{team.teamCode}</span>
                </p>

                <h4 className="text-lg font-medium text-gray-700">👥 Members:</h4>
                <ul className="mt-2">
                  {team.students.length > 0 ? (
                    team.students.map((member) => (
                      <li key={member.id} className="flex items-center gap-2 p-2 bg-gray-100 rounded-md mt-1">
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full">
                          {member.user.name.charAt(0)}
                        </div>
                        <span className="text-gray-700 font-medium">{member.user.name}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No members in this team.</p>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMembers;
