import { Routes, Route } from "react-router-dom";
<<<<<<< HEAD

import Dashboard from "./components/facultydashbord"
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard/>} />
=======
import CreateTeam from "./components/CreateTeam";
import TeamDashboard from "./components/TeamDashboard";
import StudentPanel from "./components/studentdashbord";
import JoinTeam from "./components/JoinTeam";
import Login from "./components/login";
import Temp from "./components/temp";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/create-team" element={<CreateTeam />} />
      <Route path="/join-team" element={<JoinTeam/>}/>
      <Route path="/dashboard" element={<TeamDashboard />} />
      <Route path="/temp" element={<Temp />} />
>>>>>>> 9de0d20a25edd6f982f9629b8f71b0590612db7a
    </Routes>
  );
}
