//import React from 'react';
import {FaUsers} from 'react-icons/fa';
import UserInfo from './UserInfo';
import Chart from './Charts/Chart';
import BarChart from './Charts/BarChart';
import Piechart  from './Charts/PieChart';
import Linechart from './Charts/LineChart';
import Skeleton from '@mui/material/Skeleton/Skeleton';
import { useAppSelector } from '../../Hooks';


interface UserCount {
  Total:number,
  Premium:number,
  NonPremium:number 
} 

interface DashboardProps {
 Count:UserCount
}

const Dashboard = ({Count}:DashboardProps) => {
const {loading} = useAppSelector((state)=>state.user);

  return (
    <div className='flex'>
      <div className='flex flex-col w-full gap-8'>
        {loading?
        <div className='flex items-center justify-around gap-10 flex-wrap'>
        <Skeleton width={350} height={155} variant='rectangular' animation='wave' className='bg-gradient-to-r from-gray-700 via-gray-900 to-black rounded-[10px] border border-white'/>
        <Skeleton width={350} height={155} variant='rectangular' animation='wave' className='bg-gradient-to-r from-gray-700 via-gray-900 to-black rounded-[10px] border border-white'/>
        <Skeleton width={350} height={155} variant='rectangular' animation='wave' className='bg-gradient-to-r from-gray-700 via-gray-900 to-black rounded-[10px] border border-white'/>
        </div>
        :

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
        }

        <div className='flex gap-10 md:justify-center flex-wrap'>
          {loading?
          <div className='flex flex-col gap-5 items-center'>
           <Skeleton width={700} height={300} variant='rectangular' animation='wave' className='bg-gradient-to-r from-gray-700 via-gray-900 to-black rounded-[10px] border border-white'/>
           <Skeleton width={550} height={250} variant='rectangular' animation='wave' className='bg-gradient-to-r from-gray-700 via-gray-900 to-black rounded-[10px] border border-white'/>
          </div>
          :
          <div className='flex flex-col gap-5 items-center'>
          <Chart />
          <Linechart />
          </div>
}
         {loading?
          <div className='flex flex-col gap-5 items-center'>
           <Skeleton width={450} height={300} variant='rectangular' animation='wave' className='bg-gradient-to-r from-gray-700 via-gray-900 to-black rounded-[10px] border border-white'/>
           <Skeleton width={340} height={260} variant='rectangular' animation='wave' className='bg-gradient-to-r from-gray-700 via-gray-900 to-black rounded-[10px] border border-white'/>
          </div>
          :
          <div className='flex flex-col items-center gap-5'>
           <BarChart />
           <Piechart />
          </div>
           }
        </div>

        {loading?
          <div className='flex flex-col gap-5 items-center'>
           <Skeleton width='100%' height={475} variant='rectangular' animation='wave' className='bg-gradient-to-r from-gray-700 via-gray-900 to-black  border border-white'/>
          </div>
          :
        <div className='border'>
        <UserInfo />
        </div>
        }
      </div>
    </div>
  );
};

export default Dashboard;
