import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./Homepage.css";

function Homepage() {
  const [showForm, setShowForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [displayNumber, setDisplayNumber] = useState("");
  const [phoneName, setPhoneName] = useState("");
  const [queueDeviceIdentifier, setQueueDeviceIdentifier] = useState("");
  const [defflectNumber, setDefflectNumber] = useState("");
  const [numberList, setNumberList] = useState([]);
  const [updateIndex, setUpdateIndex] = useState(null);
  const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState("");
  const [updatedDisplayNumber, setUpdatedDisplayNumber] = useState("");
  const [updatedPhoneName, setUpdatedPhoneName] = useState("");
  const [updatedQueueDeviceIdentifier, setUpdatedQueueDeviceIdentifier] = useState("");
  const [updatedDefflectNumber, setUpdatedDefflectNumber] = useState("");
  const [formError, setFormError] = useState("");
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  

  useEffect(() => {
    fetchAllNumbers();
  }, []);

  const apiUrl = "http://localhost:8085/contactInfo";
  const getAllApi = `${apiUrl}/validContacts`;
  const getOneApi = (id) => `${apiUrl}/validContact/${id}`;
  const deleteApi = (id) => `${apiUrl}/validContact/${id}`;
  const updateApi = `${apiUrl}/validContact`;
  const createApi = `${apiUrl}/addValidContact`;

  const fetchAllNumbers = async () => {
    try {
      console.log("Hello");
      const response = await axios.get(getAllApi);
      console.log(response.data);
      setNumberList(response.data);
      console.log(numberList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleDisplayNumberChange = (e) => {
    setDisplayNumber(e.target.value);
  };

  const handlePhoneNameChange = (e) => {
    setPhoneName(e.target.value);
  };

  const handleQueueDeviceIdentifierChange = (e) => {
    setQueueDeviceIdentifier(e.target.value);
  };

  const handleDefflectNumberChange = (e) => {
    setDefflectNumber(e.target.value);
  };

  const handleUpdatedPhoneNameChange = (e) => {
    setUpdatedPhoneName(e.target.value);
  };
  
  const handleUpdatedQueueDeviceIdentifierChange = (e) => {
    setUpdatedQueueDeviceIdentifier(e.target.value);  
  };
  
  const handleUpdatedDefflectNumberChange = (e) => {
    setUpdatedDefflectNumber(e.target.value);
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("Hi");
    console.log(phoneNumber, displayNumber, phoneName, queueDeviceIdentifier, defflectNumber);

    if (phoneNumber.trim() === "" || displayNumber.trim() === "") {
      setFormError("Both fields are required.");
      return;
    }

    try {
      const response = await axios.post(createApi, {
        displayNum: displayNumber,
        phoneNum: phoneNumber,
        customerPhoneName: phoneName,
        queueDeviceIdentifier: queueDeviceIdentifier,
        deflectNum: defflectNumber
      });
      console.log(response.status);

      if (response.status === 200) {
        fetchAllNumbers(); // Refresh the list
        toast.success("Saved successfully");
      }
    } catch (error) {
      console.error("Error creating data:", error);
      toast.error("Error creating data");
    }

    setPhoneNumber("");
    setDisplayNumber("");
    setPhoneName("");
    setQueueDeviceIdentifier("");
    setDefflectNumber("");
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(deleteApi(id));

      if (response.status === 200) {
        fetchAllNumbers(); // Refresh the list
        toast.error("Deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Error deleting data");
    }
  };

  const handleUpdate = (index) => {
    const itemToEdit = numberList[index];
    console.log(index, itemToEdit);
    setUpdateIndex(itemToEdit.id);
    setUpdatedPhoneNumber(itemToEdit.phoneNum);
    setUpdatedDisplayNumber(itemToEdit.displayNum);
    setIsUpdateMode(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (
      updatedPhoneNumber.trim() === "" ||
      updatedDisplayNumber.trim() === "" ||
      updatedPhoneName.trim() === "" ||
      updatedQueueDeviceIdentifier.trim() === "" ||
      updatedDefflectNumber.trim() === ""
    ) {
      setFormError("All fields are required.");
      return;
    }

    console.log(
      updatedPhoneNumber,
      updatedDisplayNumber,
      updatedPhoneName,
      updatedQueueDeviceIdentifier,
      updatedDefflectNumber
    );

    try {
      const response = await axios.put(updateApi, {
        id: updateIndex,
        phoneNum: updatedPhoneNumber,
        displayNum: updatedDisplayNumber,
        phoneName: updatedPhoneName,
        queueDeviceIdentifier: updatedQueueDeviceIdentifier,
        defflectNumber: updatedDefflectNumber,
      });

      if (response.status === 200) {
        fetchAllNumbers(); // Refresh the list
        toast.success("Updated successfully");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Error updating data");
    }

    setUpdatedPhoneNumber("");
    setUpdatedDisplayNumber("");
    setUpdatedPhoneName("");
    setUpdatedQueueDeviceIdentifier("");
    setUpdatedDefflectNumber("");
    setUpdateIndex(null);
    setIsUpdateMode(false);
    setFormError("");
  };

  return (
    <>
      <div
        style={{ height: "100vh", width: "100vw", backgroundColor: "#ffffff" }}
      >
        {/* <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <h3>Create Phone number:</h3>
          <button
            type="button"
            className="btn btn-300"
            onClick={handleShowForm}
            // style={{ backgroundColor: "#7FFFD4", color: "black" }}
          >
            Create
          </button>
        </div> */}
        {true && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "34%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
                margin: "20px 0px",
                backgroundColor: "#E5E4E2",
                border: "1px solid #dcdcdc",
                borderRadius: "6px",
                height: "300px",
              }}
            >
              <h4>{isUpdateMode ? "Update" : "Create"} Phone Number</h4>
              <div className="input-group flex-nowrap">
                <input
                  type="number"
                  className="form-control m-2"
                  placeholder="Phone Number"
                  aria-label="Username"
                  aria-describedby="addon-wrapping"
                  value={
                    updateIndex !== null ? updatedPhoneNumber : phoneNumber
                  }
                  onChange={
                    updateIndex !== null
                      ? (e) => setUpdatedPhoneNumber(e.target.value)
                      : handlePhoneNumberChange
                  }
                />
              </div>
              <div className="input-group flex-nowrap">
                <input
                  type="number"
                  className="form-control m-2"
                  placeholder="Display Number"
                  aria-label="Username"
                  aria-describedby="addon-wrapping"
                  value={
                    updateIndex !== null ? updatedDisplayNumber : displayNumber
                  }
                  onChange={
                    updateIndex !== null
                      ? (e) => setUpdatedDisplayNumber(e.target.value)
                      : handleDisplayNumberChange
                  }
                />
              </div>
              <div className="input-group flex-nowrap">
                <input
                  type="text"
                  className="form-control m-2"
                  placeholder="Phone Name"
                  value={updateIndex !== null ? updatedPhoneName : phoneName}
                  onChange={
                    updateIndex !== null
                      ? (e) => setUpdatedPhoneName(e.target.value)
                      : handlePhoneNameChange
                  }
                />
              </div>
              <div className="input-group flex-nowrap">
                <input
                  type="text"
                  className="form-control m-2"
                  placeholder="Queue Device Identifier"
                  value={
                    updateIndex !== null
                      ? updatedQueueDeviceIdentifier
                      : queueDeviceIdentifier
                  }
                  onChange={
                    updateIndex !== null
                      ? (e) => setUpdatedQueueDeviceIdentifier(e.target.value)
                      : handleQueueDeviceIdentifierChange
                  }
                />
              </div>
              <div className="input-group flex-nowrap">
                <input
                  type="number"
                  className="form-control m-2"
                  placeholder="Defflect Number"
                  value={
                    updateIndex !== null
                      ? updatedDefflectNumber
                      : defflectNumber
                  }
                  onChange={
                    updateIndex !== null
                      ? (e) => setUpdatedDefflectNumber(e.target.value)
                      : handleDefflectNumberChange
                  }
                />
              </div>

              <div>
                <button
                  className="btn btn-primary mx-2"
                  type="submit"
                  onClick={isUpdateMode ? handleUpdateSubmit : handleFormSubmit}
                  // style={{ backgroundColor: "#7FFFD4", color: "black" }}
                >
                  {isUpdateMode ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "300px",
            overflow: "auto",
          }}
        >
          <div style={{ width: "75%", overflowY: "auto" }}>
            <table className="table table-striped table-bordered">
              <thead
                style={{
                  borderBottom: "2px solid black",
                  borderTop: "2px solid black",
                  borderLeft: "2px solid black",
                  borderRight: "2px solid black",
                }}
              >
                <tr>
                  <th>Phone Number</th>
                  <th>Display Number</th>
                  <th>Phone Name</th>
                  <th>Queue Device Identifier</th>
                  <th>Deflect Number</th>
                </tr>
              </thead>
              <tbody>
                {numberList.map((item, index) => (
                  <tr key={index}>
                    <td>{item.phoneNum}</td>
                    <td>{item.displayNum}</td>
                    <td>{item.customerPhoneName}</td>
                    <td>{item.queueDeviceIdentifier}</td>
                    <td>{item.deflectNum}</td>
                    <td onClick={() => handleDelete(item.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-trash"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6 a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                      </svg>
                    </td>
                    <td onClick={() => handleUpdate(index)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-arrow-clockwise"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                        />
                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default Homepage;
