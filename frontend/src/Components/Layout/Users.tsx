//import React from 'react'
import UserInfo from "./UserInfo"
import Linechart from "./Charts/LineChart";
import BarChart from "./Charts/BarChart";
import Piechart from "./Charts/PieChart";
import Chart from "./Charts/Chart";

const Users = () => {
  

  return (
    <div className="flex flex-col gap-10">
    <div className="w-[1200px] h-[550px] border">
      <UserInfo />
    </div>
    <div className="flex flex-col items-center gap-10">
      <span className="text-white text-2xl">Chart Analysis :-</span>
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
    </div>
    </div>
  )
}

export default Users