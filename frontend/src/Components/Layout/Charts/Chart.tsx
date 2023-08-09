import { useCallback, useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface GrowthDataEntry {
  date: string; // Change the type of date from Date to string
  users: number;
}

const Chart = () => {
  const [growthData, setGrowthData] = useState<GrowthDataEntry[]>([]);

  const FetchGrowthData = useCallback(async () => {
    try {
      const Route = `https://dashboard-love-spark-backend.vercel.app/api/Users/UserGrowth`;
      const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      };
      const { data } = await axios.get<{ growthData: GrowthDataEntry[] }>(Route, config);
      setGrowthData(data.growthData);
    } catch (error) {
      console.error('Error fetching growth data:', error);
    }
  }, []);

  useEffect(() => {
    FetchGrowthData();
  }, [FetchGrowthData]);

  return (
    <div className='w-[700px] text-white gap-2 flex flex-col h-[300px] border border-white rounded-[5px] p-2 bg-gradient-to-r from-gray-700 via-gray-900 to-black'>
      <span>Monthly User-Growth</span>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          width={500}
          height={400}
          data={growthData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="users" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
