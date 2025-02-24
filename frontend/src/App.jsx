import { Route,Routes } from "react-router-dom";
import CreateTeam from "./components/CreateTeam";
import TeamDashboard from "./components/TeamDashboard";
import StudentPanel from "./components/studentdashbord";
import JoinTeam from "./components/JoinTeam";
import Login from "./components/login";
import Temp from "./components/temp";
import TeamsPage from "./components/Teams";
import TeamDetailPage from "./components/Team";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/create-team" element={<CreateTeam />} />
      <Route path="/join-team" element={<JoinTeam/>}/>
      <Route path="/dashboard" element={<TeamDashboard />} />
      <Route path="/temp" element={<Temp />} />
      <Route path="/teams" element = {<TeamsPage />} />
      <Route path="/team" element = {<TeamDetailPage />} />
    </Routes>
  );
}
