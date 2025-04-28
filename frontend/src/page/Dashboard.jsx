import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { HOME_API } from "@/lib/constant";
import { setTeams, clearTeams } from "@/redux/teamSlice";
import Sidebar from "../page/SideBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Code, Calendar, Clock } from "lucide-react";

const Dashboard = () => {
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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />

      <ScrollArea className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name || 'Student'}!</h1>
            <p className="text-gray-600 mt-2">Here's an overview of your teams and projects</p>
          </div>

          {teams?.length === 0 ? (
            <Card className="bg-white shadow-lg">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Teams Yet</h3>
                <p className="text-gray-600">You haven't been assigned to any teams yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams?.map((team) => (
                <Card key={team.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-blue-600 flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      {team.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Created {new Date(team.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-500 mb-2">Team Code</div>
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md inline-block font-mono">
                        {team.teamCode}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">Team Members</div>
                      <div className="space-y-2">
                        {team?.students.length > 0 ? (
                          team?.students?.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full">
                                {member.user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{member.user.name}</div>
                                <div className="text-xs text-gray-500">{member.user.email}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No members in this team.</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Dashboard;
