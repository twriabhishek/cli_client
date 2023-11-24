import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import GaugeChart from "react-gauge-chart";

const ChartGauge = () => {
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
      const date = entry.date;
      const status = entry.status;

      // Initialize date entry if not present
      if (!dateWiseStats[date.slice(0, 10)]) {
        dateWiseStats[date.slice(0, 10)] = {
          valid: 0,
          invalid: 0,
        };
      }

      // Update the count based on the status
      if (status === "Valid" || status === "valid") {
        dateWiseStats[date.slice(0, 10)].valid += 1;
      } else if (status === "Invalid" || status === "invalid") {
        dateWiseStats[date.slice(0, 10)].invalid += 1;
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

    // Take only the first date (max date)
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().slice(0, 10);

    if (!dateWiseStats[currentDateString]) {
      // If there is no data for today, return an empty array
      return [];
    }

    const totalContacts =
      dateWiseStats[currentDateString].valid + dateWiseStats[currentDateString].invalid;

    // Calculate invalid percentage in the "0.00" format
    const invalidPercentage = (
      (dateWiseStats[currentDateString].invalid / totalContacts) * 100
    ).toFixed(2);

    return invalidPercentage;
  };

  const gaugePercentage = formatChartData();
  console.log(gaugePercentage);

  const colors = ["green", "red"];
  const remainingPercentage = (100 - gaugePercentage).toFixed(2);

  return (
    <div>
      <GaugeChart
        id="gauge-chart3"
        nrOfLevels={2}
        colors={colors}
        arcWidth={0.2}
        percent={gaugePercentage / 100} // Divide by 100 to convert percentage to a value between 0 and 1
        textColor={"black"}
        // hideText={true} // If you want to hide the text
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ color: colors[0] }}>{remainingPercentage}% Valid</div>
        <div style={{ color: colors[1] }}>{gaugePercentage}% Invalid</div>
      </div>
    </div>
  );
};

export default ChartGauge;