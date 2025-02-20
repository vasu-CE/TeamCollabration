import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function JoinTeam({ setTeamCode }) {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  // Function to generate a random 6-character team code
  const generateTeamCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleJoin = () => {
    const finalCode = code.trim() !== "" ? code : generateTeamCode();
    setTeamCode(finalCode);
    navigate("/dashboard", { state: { teamCode: finalCode } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-6 w-96 text-center">
        <h2 className="text-xl font-semibold mb-4">Enter or Generate Team Code</h2>
        <CardContent className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Enter Team Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button onClick={handleJoin} className="w-full">Join or Create Team</Button>
        </CardContent>
      </Card>
    </div>
  );
}
