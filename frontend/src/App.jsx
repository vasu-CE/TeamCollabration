import { Routes, Route } from "react-router-dom";
import CreateTeam from "./components/CreateTeam";
import TeamDashboard from "./components/TeamDashboard";
import StudentPanel from "./components/studentdashbord";
import JoinTeam from "./components/JoinTeam";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StudentPanel />} />
      <Route path="/create-team" element={<CreateTeam />} />
      <Route path="/join-team" element={<JoinTeam/>}/>
      <Route path="/dashboard" element={<TeamDashboard />} />
    </Routes>
  );
}
