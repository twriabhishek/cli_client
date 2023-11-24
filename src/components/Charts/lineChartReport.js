import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ChartLineReport = ({ filterStatus }) => {
  const [fetcheddata, setFetcheddata] = useState([]);

  useEffect(() => {
    fetchData();
    console.log(filterStatus);
  }, [filterStatus]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8085/contactInfo/auditContacts"
      );
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
    sixMonthsAgo.setMonth(
      currentDate.getMonth() - (currentMonth - filterStatusInt + 1)
    );
    return fetcheddata.filter((entry) => new Date(entry.date) >= sixMonthsAgo);
  };

  const groupDataByMonth = () => {
    const filteredData = filterDataForLast6Months();
    const monthOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    // Group data by month and sum valid and invalid counts
    const groupedData = filteredData.reduce((acc, entry) => {
      const month = new Date(entry.date).toLocaleString("en-GB", {
        month: "short",
      });
      const status = entry.status.toLowerCase(); // Convert status to lowercase

      acc[month] = acc[month] || { date: month, Valid: 0, Invalid: 0 };
      if (status === "valid") {
        acc[month].Valid += 1;
      } else if (status === "invalid") {
        acc[month].Invalid += 1;
      }
      return acc;
    }, {});

    
  // Calculate percentages for each month
  Object.values(groupedData).forEach(entry => {
    const totalEntries = entry.Valid + entry.Invalid;
    entry.Valid = ((entry.Valid / totalEntries) * 100).toFixed(2) ;
    entry.Invalid = ((entry.Invalid / totalEntries) * 100).toFixed(2);
  });

  // Convert the grouped data object to an array
  const chartData = Object.values(groupedData);

  // Sort the data based on the order of months
  const sortedChartData = chartData.sort((a, b) => monthOrder.indexOf(a.date) - monthOrder.indexOf(b.date));

  return sortedChartData;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={groupDataByMonth()}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="Valid"
          stroke="#82ca9d"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="Invalid" stroke="#ff0800" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartLineReport;
