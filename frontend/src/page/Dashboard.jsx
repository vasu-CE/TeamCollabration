import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Sidebar from "@/page/SideBar";

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="p-8 w-full space-y-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <TeamMembers />
          <RecentActivities />
        </div>
      </div>
    </div>
  );
}

const projects = [
  { title: "Website Redesign", progress: 75, dueDate: "2023-12-31" },
  { title: "Mobile App Development", progress: 40, dueDate: "2024-03-15" },
  { title: "Marketing Campaign", progress: 90, dueDate: "2023-11-30" },
];

function ProjectCard({ title, progress, dueDate }) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="mb-2" />
        <p className="text-sm text-gray-500">Due: {new Date(dueDate).toLocaleDateString()}</p>
      </CardContent>
    </Card>
  );
}

function TeamMembers() {
  const members = [
    { name: "Alice Johnson", role: "Project Manager" },
    { name: "Bob Smith", role: "Developer" },
    { name: "Carol Williams", role: "Designer" },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        {members.map(({ name, role }) => (
          <div key={name} className="flex items-center space-x-4 mb-4">
            <Avatar>
              <AvatarImage src="/default-avatar.png" alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm text-gray-500">{role}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RecentActivities() {
  const activities = [
    { user: "Alice", action: "updated", item: "Website Redesign" },
    { user: "Bob", action: "commented on", item: "Mobile App task" },
    { user: "Carol", action: "completed", item: "Logo design" },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.map(({ user, action, item }, index) => (
          <p key={index} className="text-sm">
            <span className="font-medium">{user}</span> {action}{" "}
            <span className="text-gray-500">{item}</span>
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}
