import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ChartPie = () => {
  const [connected, setConnected] = useState(false);
  const [auditData, setAuditData] = useState([]);

  useEffect(() => {
    let stompClient = null;

    // Create the WebSocket connection when the component mounts
    const socket = new SockJS("http://localhost:8085/stomp-endpoint");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
      setConnected(true);
      console.log("Connected: " + frame);

      // Send a message to the /app/hello WebSocket endpoint (once the connection is established)
      stompClient.send("/app/hello", {}, "");

      stompClient.subscribe("/topic/auditContacts", function (response) {
        const connectionMessage = response.body;
        const parsedMessage = JSON.parse(connectionMessage);
        setAuditData(parsedMessage);
        console.log(parsedMessage);
      });
    });

    // Cleanup the WebSocket connection when the component unmounts
    return () => {
      if (stompClient && stompClient.connected) {
        console.log("Hello");
        stompClient.disconnect();
      }
    };
  }, []); // Empty dependency array to run this effect once

  
  // Process the audit data to calculate date-wise number of valid and invalid contacts
  const calculateStats = () => {
    const dateWiseStats = {};

    auditData.forEach((entry) => {
      const date = new Date(entry.date);
      console.log(date);
      const extractedDate = date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const status = entry.status;

      // Initialize date entry if not present
      if (!dateWiseStats[extractedDate]) {
        dateWiseStats[extractedDate] = {
          valid: 0,
          invalid: 0,
        };
      }

      // Update the count based on the status
      if (status === "Valid" || status === "valid") {
        dateWiseStats[extractedDate].valid += 1;
      } else if (status === "Invalid" || status === "invalid") {
        dateWiseStats[extractedDate].invalid += 1;
      }
    });

    return dateWiseStats;
  };

// Format the date in "13 Dec 23" format
const formatChartData = () => {
  const dateWiseStats = calculateStats();

  // Check if auditData is empty or undefined
  if (!auditData || auditData.length === 0) {
    return [];
  }

  // Extract all dates and sort them in descending order
  const allDates = Object.keys(dateWiseStats).sort((a, b) => new Date(b) - new Date(a));

  // Check if allDates array is empty
  if (allDates.length === 0) {
    return [];
  }

    // Take only the last date (current date)
    const currentDate = new Date();
    const currentDateString = currentDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  if (!dateWiseStats[currentDateString]) {
    // If there is no data for today, return an empty array
    return [];
  }

  const formattedData = [
    {
      name: "Valid",
      value: dateWiseStats[currentDateString].valid,
    },
    {
      name: "Invalid",
      value: dateWiseStats[currentDateString].invalid,
    },
  ];

  return formattedData;
};
const pieChartData = formatChartData();
console.log(pieChartData);


  // Function to format the tooltip content with percentage values for the current date
  const renderTooltipContent = (props) => {
    const dateWiseStats = calculateStats();
    const { payload } = props;

    if (payload && payload.length > 0) {
      const entry = payload[0].payload;
      const currentDate = new Date();
      const currentDateString = currentDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      if (dateWiseStats[currentDateString]) {
        const totalCount = dateWiseStats[currentDateString].valid + dateWiseStats[currentDateString].invalid;
        const percentage = ((entry.value / totalCount) * 100).toFixed(2);

        return (
          <div style={{ backgroundColor: '#fff', padding: '5px', border: '1px solid #ccc' }}>
            <p>{`${entry.name}: ${percentage}%`}</p>
          </div>
        );
      }
    }

    return null;
  };

  const COLORS = ["#008000", "#ff0800", "#FFBB28", "#FF8042", "#AF19FF", "#82ca9d", "#ffc658"];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip content={renderTooltipContent}/>
        <Legend layout="horizontal" />
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={false}
          labelLine={false}
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ChartPie;