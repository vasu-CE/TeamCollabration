import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { HOME_API } from "@/lib/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser, loadUserFromStorage } from "@/redux/userSlice";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    identifier: "",
    oldPassword: "",
    newPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [isAuthenticated, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setForgotPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${HOME_API}/auth/login`, loginData, {
        withCredentials: true,
      });

      if (response.data.success) {
        dispatch(setUser(response.data.message));
        toast.success(`Welcome ${response.data.message.name}`);

        if (response.data.message.role === "FACULTY") {
          navigate("/Fdashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${HOME_API}/auth/reset-password`,
        forgotPasswordData,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setForgotPasswordMode(false);
        setForgotPasswordData({ identifier: "", oldPassword: "", newPassword: "" });
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
            {forgotPasswordMode ? "Reset Password" : "Login"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={forgotPasswordMode ? handleForgotPassword : handleSubmit}
            className="space-y-5"
          >
            <div>
              <Input
                type="text"
                name="identifier"
                placeholder="Enrollment ID or Email"
                value={
                  forgotPasswordMode
                    ? forgotPasswordData.identifier
                    : loginData.identifier
                }
                onChange={handleInputChange}
                required
                className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {forgotPasswordMode && (
              <>
                <div className="relative">
                  <Input
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    placeholder="Old Password"
                    value={forgotPasswordData.oldPassword}
                    onChange={handleInputChange}
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
                    value={forgotPasswordData.newPassword}
                    onChange={handleInputChange}
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
              </>
            )}
            {!forgotPasswordMode && (
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  required
                  className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-blue-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 hover:text-blue-600" />
                  )}
                </button>
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all"
            >
              {forgotPasswordMode ? "Reset Password" : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          {forgotPasswordMode ? (
            <button
              onClick={() => setForgotPasswordMode(false)}
              className="text-sm text-blue-600 hover:underline"
            >
              Back to Login
            </button>
          ) : (
            <button
              onClick={() => setForgotPasswordMode(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}