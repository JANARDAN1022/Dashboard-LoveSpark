//import React from 'react'
import UserInfo from "./UserInfo"
import Linechart from "./Charts/LineChart";
import BarChart from "./Charts/BarChart";
import Piechart from "./Charts/PieChart";

const Users = () => {
  return (
    <div className="flex flex-col gap-10">
    <div className="w-[1200px] h-[550px] border">
      <UserInfo />
    </div>
    <div className="flex flex-col items-center gap-10">
      <span className="text-white text-2xl">Chart Analysis :-</span>
      <div className="flex flex-col gap-5 items-center">
        <div className="flex gap-10">
        <Linechart />
        <Piechart />
        </div>
        <BarChart />
      </div>
    </div>
    </div>
  )
}

export default Users