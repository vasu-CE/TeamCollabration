import React from "react";
import TeamMembers from "../components/TeamMembers";


const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Show Team Members Component */}
      <TeamMembers />
  
    </div>
  );
};

export default Dashboard;
