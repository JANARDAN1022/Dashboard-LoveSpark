import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface GenderData {
  _id: string;
  categories: {
    categoryName: string;
    count: number;
  }[];
}

const Linechart = () => {
  const [genderData, setGenderData] = useState<GenderData[]>([]);

  const fetchGenderData = useCallback(async () => {
    try {
      const Route = `https://dashboard-love-spark-backend.vercel.app/api/Users/GenderDistribution`;
      const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      };

      const { data } = await axios.get<{ genderData: GenderData[] }>(Route, config);
      setGenderData(data.genderData);
    } catch (error) {
      console.error('Error fetching gender data:', error);
    }
  }, []);

  useEffect(() => {
    fetchGenderData();
  }, [fetchGenderData]);
  const processGenderData = (data: GenderData[]): any[] => {
    let genders: string[] = [];
  
    // Check if the genderData has the expected structure
    if (data.length > 0 && data[0].categories && data[0].categories.length > 0) {
      genders = data[0].categories.map((category) => category.categoryName);
    }
  
    return data.map((entry) => {
      const entryData: any = {
        name: new Date(entry._id).toLocaleString('default', { month: 'short' }), // Format date as a short month string
      };
  
      genders.forEach((gender) => {
        const genderCategory = entry.categories.find((category) => category.categoryName === gender);
        entryData[gender] = genderCategory ? genderCategory.count : 0;
      });
  
      return entryData;
    });
  };
  

  const formattedGenderData = processGenderData(genderData);

  return (
    <div className='w-[550px] flex flex-col gap-2 border border-white rounded-[5px] p-2 bg-gradient-to-r from-gray-700 via-gray-900 to-black'>
      <span className='text-white'>Comparing User Gender Count</span>
      <ResponsiveContainer width='100%' height={200}>
        <LineChart
          width={500}
          height={200}
          data={formattedGenderData}
          syncId='anyId'
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          {formattedGenderData[0] && Object.keys(formattedGenderData[0]).map((key, index) => {
            if (key !== 'name') {
              return <Line type='monotone' key={key} dataKey={key} stroke={`#${index}c9${index}d3`} />;
            }
            return null;
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Linechart;
