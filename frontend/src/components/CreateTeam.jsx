import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateTeam() {
  const [studentId, setStudentId] = useState("");
  const [students, setStudents] = useState([]);
  const [teamCode, setTeamCode] = useState(""); // Store generated team code
  const navigate = useNavigate();

  // Function to generate a random team code
  const generateTeamCode = () => {
    return "TEAM-" + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  // Add student to the team
  const addStudent = () => {
    if (studentId.trim() !== "" && !students.includes(studentId)) {
      setStudents([...students, studentId]);
      setStudentId("");
    }
  };

  // Navigate to Student Dashboard with team members & team code
  const createTeam = () => {
    if (students.length === 0) return; // Ensure at least one student is added
    const newTeamCode = generateTeamCode(); // Generate team code
    setTeamCode(newTeamCode);
    
    navigate("/dashboard", { state: { teamMembers: students, teamCode: newTeamCode } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg bg-white rounded-2xl">
        <h2 className="text-2xl font-semibold text-center mb-4">Create a Team</h2>
        <CardContent className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <Button onClick={addStudent} className="w-full">Add Student</Button>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Team Members:</h3>
            <ul className="list-disc ml-5 mt-2">
              {students.map((id, index) => (
                <li key={index} className="text-gray-700">{id}</li>
              ))}
            </ul>
          </div>

          {teamCode && (
            <div className="mt-4 p-3 bg-gray-200 rounded-md text-center">
              <h3 className="text-lg font-semibold">Team Code:</h3>
              <p className="text-xl font-bold text-blue-600">{teamCode}</p>
            </div>
          )}

          <Button onClick={createTeam} className="w-full mt-4" variant="default">
            Create Team & Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
