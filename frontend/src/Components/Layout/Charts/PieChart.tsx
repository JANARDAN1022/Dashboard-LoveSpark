import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect,useCallback } from 'react';
import axios from 'axios';

interface LocationData {
  location: string[];
  count: number;
}

const Piechart = ()=>{
  const [data, setData] = useState<{name:string; value:number}[]>([]);

  // Fetch dynamic data here
  const fetchData = useCallback(async () => {
    try {
      const Route = `http://localhost:5000/api/Users/LocationCount`;
      const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      };
      const {data} = await axios.get<{ locationData: LocationData[] }>(Route,config);
     // Transform data to the required format for PieChart
     const transformedData=data.locationData.map((item) => ({
      name: item.location[0] || 'Unknown',
      value: item.count,
    }));
    setData(transformedData);
    } catch (error) {
      console.log(error);
    }
  },[]);

  useEffect(()=>{
   fetchData();
  },[fetchData]);



  return(
    <div className='h-[260px] w-[340px] gap-2 flex flex-col border border-white rounded-[5px] p-2 bg-gradient-to-r from-gray-700 via-gray-900 to-black'>
      <span className='text-white'>User Count Based on Location</span>
      <ResponsiveContainer  width="100%" height="100%">
        <PieChart  width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

    </div>
  )
}


export default Piechart;