import React from "react";
import "./App.css";
import Login from "./components/Login";
import Tab_navbar from "./components/Tab_navbar";
import { Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage";
import Recording from "./components/Recording";
import SettingPage from "./components/SettingPage";
import ShowDetails from "./components/ShowDetails";
import UserModule from "./components/UserModule";
// import AddUserForm from "./components/AddUserForm";
import AddUserForm from "./components/AddUserForm";
import UpdateUserForm from "./components/UpdateUserForm";
import DeleteUserForm from "./components/DeleteUserForm";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/navbar/" element={<Tab_navbar/>}>
          <Route path="home" element={<Homepage />} />  
          <Route path="showDetails/" element={<ShowDetails />} />
          <Route path="modules/" element={<SettingPage />}></Route>
          <Route path="modules/usermodule/" element={<UserModule />}>
            <Route path="adduserform" element={<AddUserForm />} />
            <Route path="updateuserform" element={<UpdateUserForm/>}/>
            <Route path="deleteuserform" element={<DeleteUserForm />}/>
          </Route>
        </Route>
        <Route path="network/" element={<Recording />}></Route>
        <Route path="showDetails/" element={<ShowDetails />} />
      </Routes>
    </>
  );
}

export default App;
