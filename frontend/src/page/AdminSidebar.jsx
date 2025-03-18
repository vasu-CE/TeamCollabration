import { NavLink } from "react-router-dom";
import { Home, Users, ClipboardCheck, Settings, LogOut } from "lucide-react";

export default function AdminSideBar() {
  return (
    <div className="w-64 h-screen bg-[#F8FAFC] border-r shadow-md p-6 flex flex-col fixed">
      
      <div className="text-3xl font-bold text-blue-600">TAPMS</div>

      <nav className="mt-6 space-y-1">
        <SidebarItem to="/dashboard" icon={<Home className="h-5 w-5" />} label="Dashboard" />
        <SidebarItem to="/" icon={<Users className="h-5 w-5" />} label="Teams" />
        <SidebarItem to="/" icon={<ClipboardCheck className="h-5 w-5" />} label="Marks" />
      </nav>

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
