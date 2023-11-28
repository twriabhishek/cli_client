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
  const filterTypeweek = "week";
  const filterValueweek = filterStatus[filterTypeweek];
  const filterTypemonth = "month";
  const filterValuemonth = filterStatus[filterTypemonth];
  let filterType = "";
  let filterValue = "";

  if (filterValueweek === undefined) {
    filterType = "month";
    filterValue = filterStatus[filterTypemonth];
  } else {
    filterType = "week";
    filterValue = filterStatus[filterTypeweek];
  }

  const [fetcheddata, setFetcheddata] = useState([]);

  useEffect(() => {
    fetchData();
  }, [filterStatus.month, filterStatus.week]);

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
    const filterStatusInt = parseInt(filterValue, 10);
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
    Object.values(groupedData).forEach((entry) => {
      const totalEntries = entry.Valid + entry.Invalid;
      entry.Valid = ((entry.Valid / totalEntries) * 100).toFixed(2);
      entry.Invalid = ((entry.Invalid / totalEntries) * 100).toFixed(2);
    });
    // Convert the grouped data object to an array
    const chartData = Object.values(groupedData);
    // Sort the data based on the order of months
    const sortedChartData = chartData.sort(
      (a, b) => monthOrder.indexOf(a.date) - monthOrder.indexOf(b.date)
    );
    return sortedChartData;
  };

  //For week wise filter
  const filterDataForLastNWeeks = () => {
    const filterWeeks = parseInt(filterValue, 10);
    const currentDate = new Date();
    const nWeeksAgo = new Date();
    nWeeksAgo.setDate(currentDate.getDate() - filterWeeks * 7);
    console.log(currentDate, nWeeksAgo);
    return fetcheddata.filter((entry) => new Date(entry.date) >= nWeeksAgo);
  };

  const getCustomWeek = (date) => {
    const currentDate = new Date(date);
    const daysDifference = Math.floor(
      (new Date() - currentDate) / (24 * 60 * 60 * 1000)
    );

    // Calculate the custom week number
    const customWeekNumber = Math.ceil((daysDifference + 1) / 7);
    console.log(customWeekNumber);
    return customWeekNumber;
  };
  const groupDataByWeek = () => {
    const filteredData = filterDataForLastNWeeks();
    console.log(filteredData);
    const groupedData = filteredData.reduce((acc, entry) => {
      const weekNumber = getCustomWeek(new Date(entry.date));
      const status = entry.status.toLowerCase();
      acc[weekNumber] = acc[weekNumber] || {
        week: weekNumber,
        Valid: 0,
        Invalid: 0,
      };
      if (status === "valid") {
        acc[weekNumber].Valid += 1;
      } else if (status === "invalid") {
        acc[weekNumber].Invalid += 1;
      }
      return acc;
    }, {});

    // Calculate percentages for each month
    Object.values(groupedData).forEach((entry) => {
      const totalEntries = entry.Valid + entry.Invalid;
      entry.Valid = ((entry.Valid / totalEntries) * 100).toFixed(2);
      entry.Invalid = ((entry.Invalid / totalEntries) * 100).toFixed(2);
    });

    // Convert the grouped data object to an array
    const chartData = Object.values(groupedData);
    // Sort the data based on the week number
    const sortedChartData = chartData.sort((a, b) => b.week - a.week);
    console.log(sortedChartData);
    return sortedChartData;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        // data=
        data={filterType === "month" ? groupDataByMonth() : groupDataByWeek()}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {/* <XAxis dataKey="date" /> */}
        <XAxis
        dataKey={filterType === "month" ? "date" : "week"} 
        tickFormatter={(value) => {
          return filterType === "week" ? `Last ${value} week${value > 1 ? "s" : ""}` : value;
        }}/>
        <YAxis />
        <Tooltip 
        formatter={(value, name, props) => [`${value}%`, name]}/>
        <Legend />
        <Line
          type="monotone"
          dataKey="Valid"
          stroke="#82ca9d"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="Invalid" stroke="#ff817e" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartLineReport;
