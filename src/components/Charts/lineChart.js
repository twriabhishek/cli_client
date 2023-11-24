import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
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

const ChartLine = (/*data*/) => {
  const [connected, setConnected] = useState(false);
  const [auditData, setAuditData] = useState([]);

  useEffect(() => {
    let stompClient = null;

    // Create the WebSocket connection when the component mounts
    const socket = new SockJS('http://localhost:8085/stomp-endpoint');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
      setConnected(true);
      console.log('Connected: ' + frame);

      // Send a message to the /app/hello WebSocket endpoint (once the connection is established)
      stompClient.send('/app/hello', {}, '');

      stompClient.subscribe('/topic/auditContacts', function (response) {
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
    const date = entry.date; 
    const status = entry.status;

    // Initialize date entry if not present
    if (!dateWiseStats[date.slice(0,10)]) {
      dateWiseStats[date.slice(0,10)] = {
        valid: 0,
        invalid: 0,
      };
    }

    // Update the count based on the status
    if (status === 'Valid' || status === 'valid') {
      dateWiseStats[date.slice(0,10)].valid += 1;
    } else if (status === 'Invalid' || status === 'invalid') {
      dateWiseStats[date.slice(0,10)].invalid += 1;
    }
  });

  return dateWiseStats;
};


const formatChartData = () => {
  const dateWiseStats = calculateStats();

  // Extract all dates and sort them in descending order
  const allDates = Object.keys(dateWiseStats).sort((a, b) => new Date(a) - new Date(b));

  // Take only the first 6 dates
  const latestDates = allDates.slice(-6);

  const formattedData = latestDates.map((date) => {
    const formattedDate = new Date(date);
    const formattedDateString = formattedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });

    return {
      date: formattedDateString,
      Valid: dateWiseStats[date.slice(0, 10)].valid,
      Invalid: dateWiseStats[date.slice(0, 10)].invalid,
    };
  });

  return formattedData;
};

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
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
        <Line
          type="monotone"
          dataKey="Valid"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="Invalid" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartLine;
