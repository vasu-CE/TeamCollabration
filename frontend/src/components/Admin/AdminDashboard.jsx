import AdminSideBar from "@/page/AdminSidebar";
// import { Input, Select, SelectItem } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { HOME_API } from "@/lib/constant";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useSelector } from "react-redux";

function AdminDashboard() {
  const user = useSelector(state => state.user.user);
  const [userType, setUserType] = useState("student");
  const [userData, setUserData] = useState({
    studentId: "",
    email: "",
    name: "",
    department: user.department,
    current_study_year: "",
    passing_year: "",
    batch: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = userType === "student" ? "/add-student" : "/add-faculty";
      const payload =
        userType === "student"
          ? userData
          : {
              name: userData.name,
              email: userData.email,
              department: userData.department,
            };
        console.log({
          name: userData.name,
          email: userData.email,
          department: userData.department,
        })
      const response = await axios.post(
        `${HOME_API}/admin${endpoint}`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(
          `${
            userType === "student" ? "Student" : "Faculty"
          } added successfully!`
        );
        setUserData({
          studentId: "",
          email: "",
          name: "",
          department: "CE",
          current_study_year: "",
          passing_year: "",
          batch: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex">
      <AdminSideBar />
      <div className="ml-64 flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Add {userType === "student" ? "Student" : "Faculty"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <Button
                variant="outline"
                onClick={() => setUserType("student")}
                className={`mr-2 ${
                  userType === "student" ? "bg-blue-500 text-white" : ""
                }`}
              >
                Student
              </Button>
              <Button
                variant="outline"
                onClick={() => setUserType("faculty")}
                className={`${
                  userType === "faculty" ? "bg-blue-500 text-white" : ""
                }`}
              >
                Faculty
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="name"
                placeholder="Full Name"
                value={userData.name}
                onChange={handleChange}
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={userData.email}
                onChange={handleChange}
                required
              />

              <Select
                name="department"
                value={userData.department}
                onChange={handleChange}
                required
              >
                <SelectContent>
                  <SelectItem value="CE">CE</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                </SelectContent>
              </Select>

              <Select
                name="department"
                value={userData.department}
                onChange={handleChange}
                required
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CE">CE</SelectItem>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                </SelectContent>
              </Select>

              {userType === "student" && (
                <>
                  <Input
                    type="text"
                    name="studentId"
                    placeholder="Student ID"
                    value={userData.studentId}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    type="text"
                    name="current_study_year"
                    placeholder="Current Study Year"
                    value={userData.current_study_year}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    type="text"
                    name="passing_year"
                    placeholder="Passing Year"
                    value={userData.passing_year}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    type="text"
                    name="batch"
                    placeholder="Batch"
                    value={userData.batch}
                    onChange={handleChange}
                    required
                  />
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add {userType === "student" ? "Student" : "Faculty"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
