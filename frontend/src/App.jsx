import { Route,Routes } from "react-router-dom";
// import TeamDashboard from "./components/TeamDashboard";
import Login from "./components/login";
// import Temp from "./components/temp";
import TeamsPage from "./components/Teams";
import ProjectPage from "./components/Projectpage";
import ChatInterface from "./page/ChatInterface";
import Chat from "./components/Chat";
import Dashboard from "./page/Dashboard";
import TeamDetailsPage from "./components/Teamdetails";
import FacultyDashboard from "./components/facultyDashbord"
import FacultyTeams from "./components/FacultyTeams";
import FacultyTeamDetails from "./components/FacultyTeamDetails";
import FacultyMarks from "./components/getMark"
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route path="/temp" element={<Temp />} /> */}
      <Route path="/teams" element = {<TeamsPage />} />
      <Route path="/projects" element = {<ProjectPage />} />
      <Route path="/chat" element = {<ChatInterface />} />
      <Route path="/chatnew" element = {<Chat />} />
      <Route path="/team/:id" element = {<TeamDetailsPage />} />
      <Route path="/project/:id" element = {<ProjectPage />} />
      <Route path="/Fdashboard" element={<FacultyDashboard/>}/>
      <Route path="/Fteams" element={<FacultyTeams/>}/>
      <Route path="/Fteam/:id" element={<FacultyTeamDetails/>}/>
      <Route path="/Fmarks" element={<FacultyMarks/>}/>

      
    </Routes>
  );
}
