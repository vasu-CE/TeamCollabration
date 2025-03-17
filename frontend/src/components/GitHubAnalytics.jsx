"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import Sidebar from "@/page/SideBar";
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  Star,
  MessageSquare,
  AlertCircle,
  Code,
  Activity,
  Calendar,
  User,
} from "lucide-react";

const API_HEADERS = {
  headers: {
    Authorization: "sedgvdr",
  },
};

const fetchGitHubData = async (url) => {
  try {
    const { data } = await axios.get(url, API_HEADERS);
    return data;
  } catch (error) {
    console.error("GitHub API Error:", error.response?.data || error.message);
    return null;
  }
};

// Helper function to get the appropriate icon for each event type
const getEventIcon = (eventType) => {
  switch (eventType) {
    case "PushEvent":
      return <GitCommit className="h-5 w-5 text-blue-500" />;
    case "PullRequestEvent":
      return <GitPullRequest className="h-5 w-5 text-purple-500" />;
    case "IssuesEvent":
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    case "CreateEvent":
      return <GitBranch className="h-5 w-5 text-green-500" />;
    case "ForkEvent":
      return <GitBranch className="h-5 w-5 text-indigo-500" />;
    case "WatchEvent":
      return <Star className="h-5 w-5 text-yellow-500" />;
    case "IssueCommentEvent":
      return <MessageSquare className="h-5 w-5 text-pink-500" />;
    case "CommitCommentEvent":
      return <MessageSquare className="h-5 w-5 text-teal-500" />;
    default:
      return <Code className="h-5 w-5 text-gray-500" />;
  }
};

const getEventName = (eventType) => {
  switch (eventType) {
    case "PushEvent":
      return "Push";
    case "PullRequestEvent":
      return "Pull Request";
    case "IssuesEvent":
      return "Issue";
    case "CreateEvent":
      return "Create";
    case "ForkEvent":
      return "Fork";
    case "WatchEvent":
      return "Star";
    case "IssueCommentEvent":
      return "Comment";
    case "CommitCommentEvent":
      return "Comment";
    default:
      return eventType.replace("Event", "");
  }
};

// Helper function to format date in a more readable way
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
};

const GitHubAnalytics = () => {
  const [commits, setCommits] = useState([]);
  const [issues, setIssues] = useState([]);
  const [repoData, setRepoData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const COLORS = ["#3b82f6", "#ef4444", "#facc15", "#10b981", "#8b5cf6", "#ec4899"];

  useEffect(() => {
    const fetchData = async () => {
      const repoUrl = "https://api.github.com/repos/clubgamma/club-gamma-backend";

      const repo = await fetchGitHubData(repoUrl);
      if (repo) setRepoData(repo);

      const commitData = await fetchGitHubData(`${repoUrl}/commits`);
      if (Array.isArray(commitData)) setCommits(commitData);

      const issueData = await fetchGitHubData(`${repoUrl}/issues?state=open`);
      if (Array.isArray(issueData)) setIssues(issueData);

      const eventsData = await fetchGitHubData(`${repoUrl}/events?per_page=10`);
      if (Array.isArray(eventsData)) setRecentActivity(eventsData);
    };

    fetchData();
  }, []);
  useEffect(() => {
    {
      console.log(commits);
    }
  }, [commits]);
  const recentCommits = commits.slice(0,-10).map((commit, index) => ({
    name: commit.commit.author.name,
    date: new Date(commit.commit.author.date).toLocaleDateString(), // Format date
    message: commit.commit.message,
    index: index + 1, // Just for ordering
  }));
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, message, date } = payload[0].payload;
      return (
        <div className="p-2 bg-white shadow-md border rounded-md">
          <p className="font-bold">{name}</p>
          <p>{message}</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      );
    }
    return null;
  };

  const commitCountsByAuthor = commits.reduce((acc, commit) => {
    const author = commit.commit.author.name;
    acc[author] = (acc[author] || 0) + 1;
    return acc;
  }, {});
  
  // Convert grouped data into an array for the chart
  const chartData = Object.entries(commitCountsByAuthor).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-screen my-5 p-6 bg-white text-gray-800 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          {" "}
          GitHub Analytics
        </h2>
        {repoData && (
          <Card className="mb-6">
            <CardContent>
              <h3 className="text-xl font-semibold text-blue-600">
                {repoData.name}
              </h3>
              <p className="text-gray-600">{repoData.description}</p>
              <div className="flex gap-4 mt-2">
                <span className="bg-blue-200 text-blue-700 px-3 py-1 rounded-full">
                  ⭐ {repoData.stargazers_count} Stars
                </span>
                <span className="bg-green-200 text-green-700 px-3 py-1 rounded-full">
                  🍴 {repoData.forks_count} Forks
                </span>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Commit Chart */}
        <h3 className="text-xl font-semibold mt-6 text-blue-600">
          📈 Recent Commits
        </h3>
        <Card className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={recentCommits}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="index" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <h3 className="text-xl font-semibold mt-6 text-red-600 flex items-center gap-2">
  🐛 Open Issues
</h3>
{issues.length > 0 ? (
  <ul className="space-y-3 mt-2">
    {issues.map((issue) => (
      <li
        key={issue.id}
        className="p-4 bg-red-50 border border-red-300 rounded-lg shadow-sm hover:bg-red-100 transition"
      >
        <a
          href={issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-700 font-medium hover:underline"
        >
          {issue.title}
        </a>
        <div className="text-sm text-gray-600 mt-1 flex flex-wrap items-center gap-2">
          <span>🕒 {new Date(issue.created_at).toLocaleDateString()}</span>
          {issue.labels.map((label) => (
            <span
              key={label.id}
              className="px-2 py-1 text-xs font-semibold bg-red-200 text-red-800 rounded-md"
            >
              {label.name}
            </span>
          ))}
        </div>
      </li>
    ))}
  </ul>
) : (
  <p className="text-gray-500 mt-2">No open issues found 🎉</p>
)}

<h3 className="text-xl font-semibold mt-6 text-red-600 flex items-center gap-2">
  Contributors
</h3>
<Card className="p-4 mt-4">
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie 
        data={chartData} 
        dataKey="count" 
        nameKey="name" 
        cx="50%" 
        cy="50%" 
        innerRadius={60} // 👈 Creates the hole (Donut effect)
        outerRadius={100} 
        fill="#8884d8" 
        label
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</Card>;
        {/* Recent Activity Section - Improved UI */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="h-6 w-6 text-indigo-600" />
            <h3 className="text-2xl font-bold text-indigo-600">
              Recent Activity
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentActivity.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    {/* Left sidebar with event type icon */}
                    <div className="w-16 flex items-center justify-center bg-gradient-to-b from-indigo-500 to-blue-600">
                      {getEventIcon(event.type)}
                    </div>

                    {/* Main content */}
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-indigo-700">
                            {getEventName(event.type)}
                          </span>
                          <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                            {event.repo.name.split("/")[1]}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {formatDate(event.created_at)}
                        </div>
                      </div>

                      <div className="flex items-center mt-3">
                        <div className="flex-shrink-0 mr-3">
                          <img
                            src={event.actor.avatar_url || "/placeholder.svg"}
                            alt={event.actor.login}
                            className="h-8 w-8 rounded-full border-2 border-indigo-200"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                              {event.actor.login}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {event.type === "PushEvent" &&
                              event.payload.commits &&
                              `Pushed ${event.payload.commits.length} commit${
                                event.payload.commits.length !== 1 ? "s" : ""
                              }`}
                            {event.type === "PullRequestEvent" &&
                              `${event.payload.action} pull request #${event.payload.pull_request?.number}`}
                            {event.type === "IssuesEvent" &&
                              `${event.payload.action} issue #${event.payload.issue?.number}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {recentActivity.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No recent activity found</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubAnalytics;
