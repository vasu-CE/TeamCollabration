import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Import xlsx for Excel generation
import { saveAs } from "file-saver"; // Import file-saver for downloading the file
import { toast } from "sonner";
import { HOME_API } from "@/lib/constant";
import FacultySidebar from "../page/FacultySidebar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function FacultyMarks() {
  const [year, setYear] = useState("");
  const [batch, setBatch] = useState("");
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    setBatch("");
  }, [year]);

  // Fetch marks based on selected year & batch
  const handleFetchMarks = async () => {
    if (!year || !batch) {
      toast.error("Please select both Year and Batch");
      return;
    }
    try {
      const res = await axios.get(`${HOME_API}/marks/getMarks`, {
        params: { year, batch },
        withCredentials: true,
      });

      if (res.data.statusCode === 200) {
        setMarks(res.data.message);
        toast.success("Marks loaded successfully");
      } else {
        setMarks([]);
        toast.warning("No marks found");
      }
    } catch (error) {
      toast.error("Failed to load marks");
      setMarks([]);
    }
  };

  // 🔹 Generate and Download Excel File
  const handleExportExcel = () => {
    if (!marks.length) {
      toast.warning("No data available to export");
      return;
    }

    // Define column headers
    const data = marks.map((mark) => ({
      "Student ID": mark.student?.userId || "-",
      "Mark": mark.internal1 ?? "-",
      "Batch": mark.student?.batch || "-",
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Marks");

    // Convert workbook to binary
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Create Blob and trigger download
    const file = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(file, `Marks_${year}_${batch}.xlsx`);
    toast.success("Excel file downloaded");
  };

  return (
    <div className="flex min-h-screen">
      <FacultySidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800">Faculty Marks</h1>

        {/* Filters */}
        <div className="flex gap-4 mt-4">
          {/* Year Selection */}
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-1/2 border p-2 rounded-md">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((yr) => (
                <SelectItem key={yr} value={yr}>{`${yr}`}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Batch Selection */}
          <Select value={batch} onValueChange={setBatch} disabled={!year}>
            <SelectTrigger className="w-1/2 border p-2 rounded-md">
              <SelectValue placeholder="Select Batch" />
            </SelectTrigger>
            <SelectContent>
              {["A1", "B1", "C1", "D1"].map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="mt-4 flex gap-4">
          <Button onClick={handleFetchMarks} className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Submit
          </Button>

          {/* 🔹 Export Excel Button */}
          <Button onClick={handleExportExcel} className="bg-green-600 text-white px-4 py-2 rounded-md">
            Export Excel
          </Button>
        </div>

        {/* Selected Values */}
        <div className="mt-4 text-lg font-semibold">
          {year} {batch && `- ${batch}`}
        </div>

        {/* Display Marks Table */}
        <div className="mt-6 overflow-x-auto">
          <Table className="min-w-full border rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Mark</TableHead>
                <TableHead>Batch</TableHead>

                {/* <TableHead>Internal 2</TableHead>
                <TableHead>External</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {marks?.length > 0 ? (
                marks.map((mark) => (
                  <TableRow key={mark.id}>
                    <TableCell>{mark.student?.userId || "-"}</TableCell>
                    <TableCell>{mark.internal1 ?? "-"}</TableCell>
                    <TableCell>{mark.student?.batch || "-"}</TableCell>

                    {/* <TableCell>{mark.internal2 ?? "-"}</TableCell>
                    <TableCell>{mark.external ?? "-"}</TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-600 py-4">
                    No marks found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
