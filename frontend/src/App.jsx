import { Route,Routes } from "react-router-dom";
// import TeamDashboard from "./components/TeamDashboard";
import Login from "./components/login";
import Temp from "./components/temp";
import TeamsPage from "./components/Teams";
import TeamDetailPage from "./components/Team";
import ChatInterface from "./page/ChatInterface";
import Chat from "./components/Chat";
import Dashboard from "./page/Dashboard";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/temp" element={<Temp />} />
      <Route path="/teams" element = {<TeamsPage />} />
      <Route path="/performance" element = {<TeamDetailPage />} />
      <Route path="/chat" element = {<ChatInterface />} />
      <Route path="/chatnew" element = {<Chat />} />
      
    </Routes>
  );
}
