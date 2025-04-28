import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "react-redux";
import axios from "axios";
import { HOME_API } from "@/lib/constant";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useSelector((state) => state.user);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${HOME_API}/auth/reset-password`,
        {
          identifier: user?.email,
          oldPassword,
          newPassword,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setOldPassword("");
        setNewPassword("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-6">
      <Card className="w-full max-w-md p-6 rounded-2xl shadow-lg bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="p-3 rounded-lg border border-gray-300 bg-gray-100"
              />
            </div>
            <div className="relative">
              <Input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showOldPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500 hover:text-blue-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500 hover:text-blue-600" />
                )}
              </button>
            </div>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500 hover:text-blue-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500 hover:text-blue-600" />
                )}
              </button>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all"
            >
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
