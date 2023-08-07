import {useState,useCallback,useEffect,useRef} from 'react';
import axios from 'axios';
import {BiBlock} from 'react-icons/bi';
import {AiOutlineSearch} from 'react-icons/ai';
import {LiaUsersCogSolid} from 'react-icons/lia'; 
import {MdExpandMore} from 'react-icons/md';


interface ReportsData {
  Reports: [
    {
        _id: string,
        ReceivedFrom: {
            _id: string,
            FirstName: string,
            email: string
        },
        ReportedUser: {
            _id:string,
            FirstName: string,
            ProfileUrl:string 
           },
       Reason: string,
    }
]
}


const Reports = () => {
  const [Search,setSearch]=useState(false);
    const SearchRef = useRef<HTMLInputElement>(null);
  const [Reports,setReports]=useState<ReportsData["Reports"] | []>([]);

  const FetchReports = useCallback(async()=>{
    try {
       const Route = `http://localhost:5000/api/Reports/GetReports`;
       const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
       const {data} = await axios.get<ReportsData>(Route,config);
       setReports(data.Reports);
    } catch (error) {
       console.log(error);
    }
  },[]);

   useEffect(()=>{
    FetchReports();
   },[FetchReports]);
      
   const HandleSearch = ()=>{
    setSearch(!Search);
    if(SearchRef.current){
        SearchRef.current.focus();
    }
}
  return (
    <div className='w-[1200px] h-[550px] border'>
    <div className='flex  flex-col bg-gradient-to-r from-gray-900 via-gray-900 to-black'>
    <div className={`h-[80px] w-full flex flex-col  border-b border-[rgba(255,255,255,0.8)]`}>
 <div className='flex justify-between mt-5'>
     <div className={`ml-5 flex gap-5 items-center`}>
     <LiaUsersCogSolid className={`text-white ml-2 cursor-default`} size={40} />
         <span className={`text-white text-[22px]`}>Reports</span>
     </div>
     <div className={`mr-10 flex gap-8 items-center`}>
         <div className='flex items-center gap-2'>
         <input ref={SearchRef} type='search' placeholder='Search...' className={`${Search?'scale-x-100':'scale-x-0'} text-base transition-all duration-700 ease-in-out  rounded-[5px] outline-none pl-2 h-[25px]`} />
         <AiOutlineSearch onClick={HandleSearch} size={28} className='text-[rgba(255,255,255,0.8)] hover:text-white cursor-pointer'/>
         </div>
         <div className='flex relative text-white'>
         <span>Filter</span>
        <MdExpandMore size={28} className='text-white cursor-pointer'/>
         </div>
     </div>
 </div>
 </div>
 <div className='h-[465px] overflow-y-scroll ScrollStyle'>
   <table className="text-white w-full">
<thead>
 <tr className='border border-white'>
   <th align='center'className='border border-white' colSpan={2}>Recieved From</th>
   <th align='center' colSpan={2} className='border border-white'>Reported User</th>
   <th align='center' className='border border-white w-[400px]' >Reason</th>
   <th align='center' className='border border-white'>Actions</th>
 </tr>
 <tr>
<th align='center' className='border border-white w-[120px]'>FirstName</th>
<th align='center' className='border border-white w-[250px]'>EmailId</th>
<th align='center' className='border border-white w-[120px]'>FirstName</th>
<th align='center' className='border border-white w-[170px]'>Profile-Picture</th>
 </tr>
</thead>
<tbody className=''>
 {Reports.length>0 && Reports.map((Report)=>(
<tr className='text-center items-center' key={Report._id}>
 <td className='py-8'>{Report.ReceivedFrom.FirstName}</td>
 <td>{Report.ReceivedFrom.email}</td>
 <td className='py-8'>{Report.ReportedUser.FirstName}</td>
 <td className='flex justify-center items-center py-8'>
 <img src={Report.ReportedUser.ProfileUrl} alt='IMG' className='w-[50px] h-[50px] rounded-full'/>
 </td>
 <td>{Report.Reason}</td>
 <td className='flex justify-center'> <BiBlock size={28} className='text-red-500 '/></td>
</tr>
 ))}
</tbody>
</table>
</div>
 </div>
  </div>
  )
}

export default Reports