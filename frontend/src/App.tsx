import { useEffect } from "react";
import { BrowserRouter as Router,Routes,Route, useNavigate } from "react-router-dom";
import Mainpage from "./Components/Pages/MainPage";
import Login from "./Components/Layout/Login";
import Register from "./Components/Layout/Register";
import UpdateInfo from "./Components/Layout/UpdateInfo";
import { useAppSelector } from "./Hooks";


function App() {  
const Navigate = useNavigate();
const {Admin} = useAppSelector((state)=>state.user);


useEffect(()=>{
if(!Admin){
  Navigate('/Login');
}
},[Admin]);


  return (
     <Router>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/UpdateInfo" element={<UpdateInfo />} />
      </Routes>
     </Router>
  );
}

export default App;
