import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import ChartBar from "./Charts/barChart.js";
import Chartpie from "./Charts/pieChart.js";
import "./component.css";

const ShowDetails = () => {
  const [connected, setConnected] = useState(false);
  const [auditData, setAuditData] = useState([]);
  const [sortedcurrentData, setSortedcurrentData] = useState([]);

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

  // Sort currentData in descending order based on the date and time
  const sortedData = auditData.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const currentDat = new Date();
  const year = currentDat.getFullYear();
  const month = String(currentDat.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(currentDat.getDate()).padStart(2, "0");
  const formattedDat = `${year}-${month}-${day}`;

  const currentData = sortedData.filter((entry) => {
    return formattedDat === entry.date.slice(0, 10);
  });

  return (
    <div className="dash-bg" >
      <div className="center-row container-fluid">
      {/* <h1 style={{backgroundColor:"rgb(7, 141, 146)", display:"inline"}}>Dashboard</h1> */}
      </div>

<div id="myHeading">
  <h3>DashBoard</h3>
</div>

      <div class="container-fluid">
        <div className="row" style={{margin:'10px' , display:"flex", justifyContent:"center"}}>
            <div className="col-5 chart-bg" style={{ height: "300px",border:"1px solid #a7a7a7", marginRight:'8px', boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"}} id="boxStyling">
              <Chartpie />
            </div>
            <div className="col-5 chart-bg" style={{ height: "300px",border:"1px solid #a7a7a7", marginLeft:'8px', boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"}} id="boxStyling">
              <ChartBar />
            </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div
              style={{
                width: "75%",
                overflowY: "auto",
                overflowX: "auto",
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
                    <tr key={entry.id}>
                      <td>{entry.displayNum}</td>
                      <td>{entry.phoneName}</td>
                      <td>{entry.phoneNum}</td>
                      <td>
                        {new Date(entry.date).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td style={{ color: entry.status === "valid" || entry.status === "Valid" ? "green" : "red" , textTransform:"capitalize"}}>
                        {entry.status}
                      </td>
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
