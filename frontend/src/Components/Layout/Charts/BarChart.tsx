import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from 'recharts';
  import { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import Skeleton from '@mui/material/Skeleton/Skeleton';
import { MainPageContext } from '../../../Context/MainPageContext';

interface UserData {
  premium: number;
  nonPremium: number;
}

  
  
  

const BarChart = () => {
  const [BarChartLoading,setBarChartLoading]=useState(false);
  const [userData, setUserData] = useState<UserData>({
    premium: 0,
    nonPremium: 0,
  });
const {LogoutLoading} = useContext(MainPageContext);
  const fetchUserData = useCallback(async () => {
    try {
      setBarChartLoading(true);
      const Route = `https://dashboard-love-spark-backend.vercel.app/api/Users/CompareRoles`;
      const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      };
      const { data } = await axios.get<UserData>(Route, config);
      setUserData(data);
      setBarChartLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setBarChartLoading(false);
    }
  }, [setBarChartLoading]);

  const data = [
    {
      name: 'Premium',
      uv: userData.premium,
    },
    {
      name: 'Non-Premium',
      uv: userData.nonPremium,
    },
  ];

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  
  return (
    BarChartLoading || LogoutLoading?

<Skeleton width={450} height={300} animation='wave' variant='rectangular' className='border border-white rounded-[5px]  bg-gradient-to-r from-gray-700 via-gray-900 to-black' />

    :

    <div className='w-[450px] h-[300px] flex flex-col gap-2 border border-white rounded-[5px] p-2 bg-gradient-to-r from-gray-700 via-gray-900 to-black'>
       <span className='text-white'>Premium vs NonPremium Comparison</span>
        <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" scale="band" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="uv" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="uv" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChart