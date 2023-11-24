import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import ChartBar from "./Charts/barChart.js";
import Chartpie from "./Charts/pieChart.js";
import ChartGauge from "./Charts/GaugeChart.js";

const ShowDetails = () => {
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

  const calculateStats = () => {
    const dateWiseStats = {};

    auditData.forEach((entry) => {
      const date = new Date(entry.date).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const status = entry.status;

      if (!dateWiseStats[date.slice(0, 10)]) {
        dateWiseStats[date.slice(0, 10)] = {
          valid: 0,
          invalid: 0,
          formattedDate: date,
        };
      }

      if (status === "Valid" || status === "valid") {
        dateWiseStats[date.slice(0, 10)].valid += 1;
      } else if (status === "Invalid" || status === "invalid") {
        dateWiseStats[date.slice(0, 10)].invalid += 1;
      }
    });
    console.log(dateWiseStats);
    return dateWiseStats;
  };

  const dateWiseStats = calculateStats();

  // const currentDate = new Date().toISOString().slice(0, 10);
  // console.log(currentDate);
  // const currentData = auditData.filter((entry) => entry.date.slice(0, 10) === currentDate);
  // console.log(currentData);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  // console.log(formattedDate);
    const currentData = auditData.filter((entry) => {
    const entryDate = new Date(entry.date);
    // console.log(entryDate);
    // // Convert entry.date to UTC
    // const entryDateUTC = new Date(entryDate.getTime() + entryDate.getTimezoneOffset() * 60000);
    const extractedDate = entryDate.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    console.log(extractedDate);

    return extractedDate === formattedDate;
  });

  console.log(currentData);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Admin Dashboard</h1>
      <div class="container-fluid">
        <div className="row container-fluid">
          <div className="col" style={{ height: "300px" }}>
            <Chartpie />
          </div>
          <div className="col" style={{ height: "300px" }}>
            <ChartBar />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div
              style={{
                width: "75%",
                overflowY: "auto",
                margin: "auto",
                marginTop: "20px",
                height: "250px",
              }}
            >
              <table class="table table-striped table-bordered">
                <thead
                  style={{
                    borderBottom: "1px solid black",
                    borderTop: "1px solid black",
                    borderLeft: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  <tr>
                    <th scope="col">Display Num</th>
                    <th scope="col">Phone Name</th>
                    <th scope="col">Phone Num</th>
                    <th scope="col">Date & Time</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((entry) => (
                    <tr key={entry.callId}>
                      <td>{entry.displayNum}</td>
                      <td>{entry.phoneName}</td>
                      <td>{entry.phoneNum}</td>
                      <td>
                        {" "}
                        {new Date(entry.date).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td>{entry.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetails;
