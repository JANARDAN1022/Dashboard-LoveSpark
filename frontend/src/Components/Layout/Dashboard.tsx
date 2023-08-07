//import React from 'react';
import {FaUsers} from 'react-icons/fa';
import UserInfo from './UserInfo';
import Chart from './Charts/Chart';
import BarChart from './Charts/BarChart';
import Piechart  from './Charts/PieChart';
import Linechart from './Charts/LineChart';


interface UserCount {
  Total:number,
  Premium:number,
  NonPremium:number 
} 

interface DashboardProps {
 Count:UserCount
}

const Dashboard = ({Count}:DashboardProps) => {

  return (
    <div className='flex'>
      <div className='flex flex-col w-full gap-8'>
        <div className='flex items-center justify-around gap-10 flex-wrap '>
          <div className='flex flex-col gap-3 items-center relative w-[350px] h-[155px] border border-white rounded-[7px] p-2 bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white'>
            <FaUsers size={38} className='text-blue-600'/>
            <span className='text-2xl'>{Count.Total}</span>
            <span className='text-lg'>Total Users</span>
           </div>

           <div className='flex flex-col gap-3 items-center relative w-[350px] h-[155px] border border-white rounded-[7px] p-2 bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white'>
            <FaUsers size={38} className='text-yellow-600'/>
            <span className='text-2xl'>{Count.Premium}</span>
            <span className='text-lg'>Premium Users</span>
           </div>

           <div className='flex flex-col gap-3 items-center relative w-[350px] h-[155px] border border-white rounded-[7px] p-2 bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white'>
            <FaUsers size={38} className='text-green-600'/>
            <span className='text-2xl'>{Count.NonPremium}</span>
            <span className='text-lg'>Non-Premium Users</span>
           </div>
        </div>

        <div className='flex gap-10 md:justify-center flex-wrap'>
          <div className='flex flex-col gap-5 items-center'>
          <Chart />
          <Linechart />
          </div>
          <div className='flex flex-col items-center gap-5'>
           <BarChart />
           <Piechart />
          </div>
        </div>

        <div className='border'>
        <UserInfo />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
