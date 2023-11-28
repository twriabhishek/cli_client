import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ChartBar = () => {
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
      const date = entry.date.slice(0, 10);
      const status = entry.status;

      // Initialize date entry if not present
      if (!dateWiseStats[date]) {
        dateWiseStats[date] = {
          valid: 0,
          invalid: 0,
        };
      }

      // Update the count based on the status
      if (status === "Valid" || status === "valid") {
        dateWiseStats[date].valid += 1;
      } else if (status === "Invalid" || status === "invalid") {
        dateWiseStats[date].invalid += 1;
      }
    });
    console.log(dateWiseStats);
    return dateWiseStats;
  };

  // Format the date in "13 Dec 23" format
  const formatChartData = () => {
    const dateWiseStats = calculateStats();
    console.log(dateWiseStats);

    // Check if auditData is empty or undefined
    if (!auditData || auditData.length === 0) {
      return [];
    }

    // Take only the last date (current date)
    const currentDat = new Date();
    const year = currentDat.getFullYear();
    const month = String(currentDat.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(currentDat.getDate()).padStart(2, "0");
    const formattedDat = `${year}-${month}-${day}`;
    console.log(formattedDat);

    if (!dateWiseStats[formattedDat]) {
      // If there is no data for today, return an empty array
      return [];
    }

    const formattedData = [
      {
        date: formattedDat,
        Valid: dateWiseStats[formattedDat].valid,
        Invalid: dateWiseStats[formattedDat].invalid,
      },
    ];

    return formattedData;
  };

  const chartData = formatChartData();

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={chartData}
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
          <Legend
            formatter={(value, entry) => {
              const count = chartData[0]?.[value] || 0;
              return `${value} (${count})`;
            }}
          />

          <Bar
            dataKey="Valid"
            fill="#82ca9d"
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          />
          <Bar
            dataKey="Invalid"
            fill="#ff817e"
            activeBar={<Rectangle fill="gold" stroke="purple" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default ChartBar;
