import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { HOME_API } from "@/lib/constant";
import { setTeams } from "@/redux/teamSlice";

const ChatSidebar = ({ setChatUser }) => {
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.team.teams); // Get teams from Redux
  const user = useSelector((state) => state.user.user); // Get user from Redux
  const userId = user?.id;

  // Fetch Teams if not already available
  useEffect(() => {
    const fetchTeams = async () => {
      if (!userId) return;

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

    if (teams.length === 0) {
      fetchTeams();
    }
  }, [userId, teams, dispatch]);

  return (
    <div className="w-1/3 p-4 bg-gray-100 border-r min-h-screen">
      <h2 className="text-lg font-semibold mb-4">Team Members</h2>
      {teams.length === 0 ? (
        <p className="text-gray-500">No teams found.</p>
      ) : (
        <ul className="space-y-2">
          {teams.map((team) =>
            team.students.map((member) => (
              <li
                key={member.id}
                className="p-2 border-b cursor-pointer hover:bg-gray-200 rounded-md"
                onClick={() => setChatUser(member.user)}
              >
                {member.user.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default ChatSidebar;
