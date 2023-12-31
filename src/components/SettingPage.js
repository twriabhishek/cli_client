import React, { useEffect, useState } from "react";
import "rc-slider/assets/index.css";
import ChartBarReport from "./Charts/barChartReport.js";
import ChartLineReport from "./Charts/lineChartReport.js";
import * as XLSX from "xlsx";
import "./component.css";
import { RiDownloadLine } from "react-icons/ri";

function ShowDetails() {
  const [searchCriteria, setSearchCriteria] = useState({
    phoneName: "",
    fromdate: "",
    todate: "",
  });
  const [filterCriteria, setFilterCriteria] = useState({
    month: "7",
    week: undefined,
  });
  const [fetcheddata, setFetcheddata] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8085/contactInfo/auditContacts"
      );
      const data = await response.json();
      setFetcheddata(data);
      setSearchData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = () => {
    console.log(searchCriteria);
    console.log(searchData);
    const filtered = searchData.filter((item) => {
      const phoneNameMatch =
        item.phoneName &&
        item.phoneName
          .toLowerCase()
          .includes(searchCriteria.phoneName.toLowerCase());
      const fromDateMatch =
        searchCriteria.fromdate === "" ||
        new Date(item.date.slice(0, 10)) >= new Date(searchCriteria.fromdate);
      const toDateMatch =
        searchCriteria.todate === "" ||
        new Date(item.date.slice(0, 10)) <= new Date(searchCriteria.todate);
      return phoneNameMatch && fromDateMatch && toDateMatch;
    });

    console.log(filtered);
    setFetcheddata(filtered);
  };

  const handleFilterChange = (e) => {
    setFilterCriteria({ month: e.target.value });

    console.log(e.target.value);
  };
  const handleFilterChangeWeek = (e) => {
    setFilterCriteria({ week: e.target.value });
    console.log(e.target.value);
  };

  const handleReset = async () => {
    setSearchCriteria({
      phoneName: "",
      fromdate: "",
      todate: "",
    });
    // setFilterCriteria({ status: "" });
    await fetchData(); // Fetch all data after reset
  };

  const handleDownload = () => {
    const modifiedData = fetcheddata.map((item) => ({
      ...item,
      // Assuming 'date' is a string in ISO format (e.g., "2023-11-27T12:34:56.789Z")
      date: item.date ? item.date.slice(0, 10) : null,
      time: item.date ? new Date(item.date).toLocaleTimeString() : null,
    }));
    console.log(modifiedData);

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(modifiedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "table_data.xlsx");
  };

  return (
    <div className="pt-1 dash-bg" id="showDetails">
      <div className="row m-0">
        <div className="col-lg-1 col-md-1 pt-4">
          <div
            className="col-md-12"
            id="boxStyling"
            style={{ border: "1px solid #a7a7a7", padding: "10px" }}
          >
            <h4 className="mt-4 text-center">Filter</h4>
            <div>
              <label htmlFor="" className="fs-5">
                Month
              </label>
              <select
                className="w-100"
                aria-label="Default select example"
                value={filterCriteria.month}
                onChange={handleFilterChange}
              >
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            <div>
              <label htmlFor="" className="fs-5">
                Week
              </label>
              <select
                className="w-100"
                aria-label="Default select example"
                value={filterCriteria.week}
                onChange={handleFilterChangeWeek}
              >
                <option value="1">Select</option>
                <option value="1">1 week</option>
                <option value="2">2 week</option>
                <option value="3">3 week</option>
                <option value="4">4 week</option>
                <option value="5">5 week</option>
                <option value="6">6 week</option>
                <option value="7">7 week</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col-lg-11 col-md-11  pt-4">
          <div className="search d-flex pb-2">
            <input
              type="text"
              name="Phone"
              value={searchCriteria.phoneName}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  phoneName: e.target.value,
                })
              }
              className="form-control"
              id="Phone"
              placeholder="Phone Name"
            />

            <input
              type="date"
              name="fromdate"
              value={searchCriteria.fromdate}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  fromdate: e.target.value,
                })
              }
              className="form-control mx-2 "
              id="Phone"
              placeholder="choose date"
            />

            <span className="pt-2">To</span>

            <input
              type="date"
              name="todate"
              value={searchCriteria.todate}
              onChange={(e) =>
                setSearchCriteria({ ...searchCriteria, todate: e.target.value })
              }
              className="form-control mx-2 "
              id="Phone"
              placeholder="choose date"
            />
            <div>
              <button className="button-4" role="button" onClick={handleSearch}>
                Search
              </button>
              <button className="button-4" role="button" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-7">
              <div
                className="col-12 mb-3"
                id="boxStyling"
                style={{
                  border: "1px solid #a7a7a7",
                  padding: "10px",
                  boxShadow:
                    "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                }}
              >
                <>
                  <div
                    className="chart-bg"
                    style={{
                      height: "15rem",
                    }}
                  >
                    {/* <ChartBarReport value={filteredData}></ChartBarReport> */}
                    <ChartBarReport filterStatus={filterCriteria} />
                  </div>
                </>
              </div>
            </div>
            <div className="col-5">
              <div
                className="col-12 mb-3"
                id="boxStyling"
                style={{
                  border: "1px solid #a7a7a7",
                  padding: "10px",
                  boxShadow:
                    "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                }}
              >
                <>
                  <div
                    className="chart-bg"
                    style={{
                      height: "15rem",
                    }}
                  >
                    <ChartLineReport filterStatus={filterCriteria} />
                  </div>
                </>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 ">
              <div
                className="col-md-12 mb-3"
                id="boxStyling"
                style={{ border: "1px solid #a7a7a7" }}
              >
                <>
                  <div
                    style={{
                      maxHeight: "15rem",
                      overflowY: "auto",
                      overflowX: "auto",
                    }}
                  >
                    <div className="" style={{ float: "right" }}>
                      {/* <button onClick={handleDownload} style={{borderRadius:"5px", padding:"2px", margin:"2px"}}>Download</button> */}
                      <button
                        class="button-4"
                        role="button"
                        onClick={handleDownload}
                      >
                        <RiDownloadLine/>
                        Download
                      </button>
                    </div>
                    <table
                      className="table table-striped text-center"
                      style={{ borderRadius: "10px" }}
                    >
                      <thead>
                        <tr className="">
                          <th scope="col">Phone Name</th>

                          <th scope="col text-center">Display Number</th>

                          <th scope="col text-center">Phone Number</th>

                          <th scope="col text-center">Date</th>

                          <th scope="col text-center">Call ID</th>

                          <th scope="col text-center">Status</th>

                          <th scope="col text-center">QueueDeviceIdentifier</th>

                          <th scope="col text-center">MonitorCrossRefID</th>
                        </tr>
                      </thead>

                      <tbody className="">
                        {fetcheddata.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center data1">
                              {item.phoneName}
                            </td>
                            <td className="text-center data1">
                              {item.displayNum}
                            </td>
                            <td className="text-center data1">
                              {item.phoneNum}
                            </td>
                            <td className="text-center data1">
                              {new Date(item.date).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                            </td>
                            <td className="text-center data1">{item.callId}</td>

                            <td
                              style={{
                                color:
                                  item.status === "valid" ||
                                  item.status === "Valid"
                                    ? "green"
                                    : "red",
                                textTransform: "capitalize",
                              }}
                            >
                              {item.status}
                            </td>
                            <td className="text-center data1">
                              {item.queueDeviceIdentifier}
                            </td>
                            <td className="text-center data1">
                              {item.monitorCrossRefID}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowDetails;
