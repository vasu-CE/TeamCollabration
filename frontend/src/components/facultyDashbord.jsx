import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { HOME_API } from "@/lib/constant";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import FacultySidebar from "../page/FacultySidebar"; // Sidebar

export default function FacultyDashboard() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await axios.get(`${HOME_API}/faculty/get-students`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setStudents(res.data.message);
        }
      } catch (error) {
        toast.error("Failed to load student data");
      }
    }

    fetchStudents();
  }, []);

//   // 🔍 Filter students by name dynamically
//   const filteredStudents = students.filter((student) =>
//     student.name?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <FacultySidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 ml-64">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Faculty Dashboard</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-3 rounded-md w-full shadow-sm"
          />
        </div>

        {/* Students Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {students?.length > 0 ? (
            students?.map((student) => (
              <Card key={student.id} className="shadow-lg border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-700">
                    {student.user.name || "Unknown"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">📧 Email: {student.user.email || "N/A"}</p>
                  <p className="text-gray-600">🆔 ID: {student.userId}</p>
                  <p className="text-gray-600">🎓 Year: {student.current_study_year}</p>
                  <p className="text-gray-600">📆 Passing Year: {student.passing_year}</p>
                  <p className="text-gray-600">📌 Batch: {student.batch}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">No students found</p>
          )}
        </div>
      </div>
    </div>
  );
}
