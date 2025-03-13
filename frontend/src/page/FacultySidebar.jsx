import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, ClipboardCheck, Settings, LogOut } from "lucide-react";

export default function FacultySidebar() {
  return (
    <div className="w-64 h-screen bg-[#F8FAFC] border-r shadow-md p-6 flex flex-col">
      {/* Title */}
      <div className="text-3xl font-bold text-blue-600">TAPMS</div>

      {/* Navigation Links */}
      <nav className="mt-6 space-y-1">
        <SidebarItem to="/Fdashboard" icon={<Home className="h-5 w-5" />} label="Dashboard" />
        <SidebarItem to="/Fteams" icon={<Users className="h-5 w-5" />} label="Teams" />
        <SidebarItem to="/Fmarks" icon={<ClipboardCheck className="h-5 w-5" />} label="Marks" />
      </nav>

      {/* Bottom Links */}
      <div className="mt-auto pt-6 border-t">
        <SidebarItem to="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" />
        <SidebarItem to="/logout" icon={<LogOut className="h-5 w-5" />} label="Logout" />
      </div>
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
          isActive
            ? "bg-blue-100 text-blue-600 font-semibold shadow-sm"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
