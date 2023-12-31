import {useState,useContext, useCallback, useEffect} from 'react';
import Leftbar from "../Layout/Leftbar"
import NavBar from '../Layout/NavBar';
import { MainPageContext } from '../../Context/MainPageContext';
import Dashboard from '../Layout/Dashboard';
import Reports from '../Layout/Reports';
import Users from '../Layout/Users';
import Chart from '../Layout/Charts/Chart';
import  Piechart  from '../Layout/Charts/PieChart';
import axios from 'axios';
import { Loaduser } from '../../Actions/AdminActions';
import { useAppDispatch,useAppSelector } from '../../Hooks';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';


interface userCount {
  Total:number,
  Premium:number,
  NonPremium:number 
}

const MainPage = () => {
const [ToggleBar,setToggleBar]=useState(false);
const {ShowComponent,LogoutLoading} = useContext(MainPageContext);
const [ApiLoading,setApiLoading]=useState(false);
const [UserCount,setUserCount]=useState({
  Total:0,
  Premium:0,
  NonPremium:0,
});
const dispatch = useAppDispatch();
const {loading,isAuthenticated,Admin} = useAppSelector((state)=>state.user);
const Navigate = useNavigate();

useEffect(()=>{
  if(!loading  && !isAuthenticated){
   Navigate('/Login');
  }
},[Navigate,loading,isAuthenticated,Admin]);

useEffect(()=>{
dispatch(Loaduser());
},[dispatch]);


const FetchUserCount = useCallback(async()=>{
  try {
    setApiLoading(true);
    const Route = `https://dashboard-love-spark-backend.vercel.app/api/Users/Count`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    const {data} = await axios.get<userCount>(Route,config);
    setUserCount({Total:data.Total,Premium:data.Premium,NonPremium:data.NonPremium});
  setApiLoading(false);
  } catch (error) {
    console.log(error);
    setApiLoading(false);
  }
},[setApiLoading]);

useEffect(()=>{
FetchUserCount();
},[FetchUserCount]);

  return (
    <div className="flex w-full">
  <Leftbar ToggleBar={ToggleBar} setToggleBar={setToggleBar}/>
   <div className="flex flex-col h-screen w-full bg-gray-800">
      {loading || LogoutLoading?
      <Skeleton animation='wave' variant='rectangular' width='100%' height={180} className='border border-white bg-gradient-to-r from-gray-700 via-gray-900 to-black' />
      :
      <NavBar ToggleBar={ToggleBar} setToggleBar={setToggleBar} />
      }
      <div className='p-5 pt-10 flex justify-center overflow-y-scroll SCROLL mb-4'>
       <div className='flex flex-wrap'>
          {ShowComponent==='Dashboard'?
        <Dashboard Count={UserCount} ApiLoading={ApiLoading} />
        :ShowComponent==='Reports'?
        <Reports />
        :ShowComponent==='Users'?
        <Users />
        :  
        ShowComponent==='Chart'?
        <Chart />
        :
        <Piechart />
        }
       </div>
      </div>
      </div>
    </div>
  )
}

export default MainPage