import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function StudentPanel() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg bg-white rounded-2xl">
        <h2 className="text-2xl font-semibold text-center mb-4">Student Panel</h2>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={() => navigate("/create-team")} className="w-full">
            Create a Team
          </Button>
          <Button onClick={() => navigate("/join-team")} className="w-full" variant="outline">
            Join Team
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
