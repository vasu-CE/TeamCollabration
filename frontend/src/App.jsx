<<<<<<< HEAD
import { Route,Routes } from "react-router-dom";
import CreateTeam from "./components/CreateTeam";
=======
import { Routes, Route } from "react-router-dom"; 
>>>>>>> c4b65ad6a57541bd0687d9a3c5203068475641cd
import TeamDashboard from "./components/TeamDashboard";
import Login from "./components/login";
import Temp from "./components/temp";
import TeamsPage from "./components/Teams";
import TeamDetailPage from "./components/Team";
import ChatInterface from "./page/ChatInterface";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<TeamDashboard />} />
      <Route path="/temp" element={<Temp />} />
      <Route path="/teams" element = {<TeamsPage />} />
      <Route path="/team" element = {<TeamDetailPage />} />
      <Route path="/chat" element = {<ChatInterface />} />
      
    </Routes>
  );
}
