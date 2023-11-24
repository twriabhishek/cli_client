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
      const date = new Date(entry.date);
      console.log(date);
      const extractedDate = date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      console.log(extractedDate);
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
    // console.log(dateWiseStats);
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

    // Extract all dates and sort them in ascending order
    const allDates = Object.keys(dateWiseStats).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    console.log(allDates);

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
        date: currentDateString,
        Valid: dateWiseStats[currentDateString].valid,
        Invalid: dateWiseStats[currentDateString].invalid,
      },
    ];

    return formattedData;
  };

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={formatChartData()}
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
          <Bar
            dataKey="Valid"
            fill="#008000"
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          />
          <Bar
            dataKey="Invalid"
            fill="#ff0800"
            activeBar={<Rectangle fill="gold" stroke="purple" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default ChartBar;
