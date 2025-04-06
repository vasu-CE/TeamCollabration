import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import AdminSidebar from "@/page/AdminSidebar";
import { HOME_API } from "@/lib/constant";
import { useSelector } from "react-redux";

const AdminBulkUploader = () => {
  const user = useSelector((state) => state.user.user);
  const [userType, setUserType] = useState("student");
  const [addedCount, setAddedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (!jsonData.length) {
        toast.error("Excel file is empty or invalid");
        return;
      }

      setTotalCount(jsonData.length);
      setAddedCount(0);
      toast.info(`${jsonData.length} records found. Starting upload...`);

      let successCount = 0;

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];

        const payload =
          userType === "student"
            ? {
                studentId: row.studentId,
                email: row.email,
                name: row.name,
                department: row.department || user.department,
                current_study_year: row.current_study_year,
                passing_year: String(row.passing_year),
                batch: row.batch,
              }
            : {
                name: row.name,
                email: row.email,
                department: row.department || user.department,
              };

        try {
          const endpoint = userType === "student" ? "/add-student" : "/add-faculty";
          const response = await axios.post(`${HOME_API}/admin${endpoint}`, payload, {
            withCredentials: true,
          });

          if (response.data.success) {
            successCount++;
            setAddedCount(successCount);
          }
        } catch (error) {
          console.error(`Row ${i + 1} failed:`, error.response?.data?.message || error.message);
        }
      }

      toast.success(`${successCount} ${userType}s added successfully`);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">Admin Bulk Uploader</h1>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Upload {userType === "student" ? "Students" : "Faculty"} via Excel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <Button
                variant="outline"
                onClick={() => setUserType("student")}
                className={`mr-2 ${userType === "student" ? "bg-blue-500 text-white" : ""}`}
              >
                Student
              </Button>
              <Button
                variant="outline"
                onClick={() => setUserType("faculty")}
                className={`${userType === "faculty" ? "bg-blue-500 text-white" : ""}`}
              >
                Faculty
              </Button>
            </div>

            <Input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleExcelUpload}
              className="mb-4"
            />

            {totalCount > 0 && (
              <div className="text-center text-sm text-gray-600">
                Added {addedCount} of {totalCount} {userType}s
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminBulkUploader;
