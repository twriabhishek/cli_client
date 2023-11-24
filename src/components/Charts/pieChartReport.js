import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

const PieChartReport = ({ filterStatus }) => {
  const [fetcheddata, setFetcheddata] = useState([]);

  useEffect(() => {
    fetchData();
    console.log(filterStatus);
  }, [filterStatus]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8085/contactInfo/auditContacts");
      const data = await response.json();
      setFetcheddata(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filterDataForLast6Months = () => {
    const filterStatusInt = parseInt(filterStatus, 10);
    const currentMonth = new Date().getMonth() + 1;
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - (currentMonth - filterStatusInt + 1));
    return fetcheddata.filter((entry) => new Date(entry.date) >= sixMonthsAgo);
  };

  const calculatePercentage = (total, value) => {
    return ((value / total) * 100).toFixed(2);
  };

  const calculateTotalCount = (data) => {
    return data.reduce((total, entry) => total + entry.Valid + entry.Invalid, 0);
  };

  const pieChartData = () => {
    const filteredData = filterDataForLast6Months();
    console.log(filteredData);

    const total = calculateTotalCount(filteredData);
    console.log(total);
    const validCount = filteredData.reduce((count, entry) => count + entry.Valid, 0);
    const invalidCount = filteredData.reduce((count, entry) => count + entry.Invalid, 0);

    const validPercentage = calculatePercentage(total, validCount);
    const invalidPercentage = calculatePercentage(total, invalidCount);
    console.log(validPercentage, invalidPercentage);

    return [
      { name: "Valid", value: validPercentage, fill: "#82ca9d" },
      { name: "Invalid", value: invalidPercentage, fill: "#ff0800" },
    ];
  };

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieChartData()}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={(entry) => `${entry.name}: ${entry.value}%`}
          >
            {pieChartData().map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default PieChartReport;