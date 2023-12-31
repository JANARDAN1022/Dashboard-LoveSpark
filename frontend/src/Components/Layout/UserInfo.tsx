import {useState,useRef,useEffect, useCallback, useContext} from 'react';
import {AiOutlineSearch} from 'react-icons/ai';
import {LiaUsersCogSolid} from 'react-icons/lia'; 
import {MdExpandMore,MdAccountCircle} from 'react-icons/md';
import {BiBlock} from 'react-icons/bi';
import { RxCross1 } from 'react-icons/rx';
import { Skeleton } from '@mui/material';
import axios from 'axios';
import { MainPageContext } from '../../Context/MainPageContext';

interface User {
            _id: string,
            FirstName: string,
            LastName: string | "",
            email: string,
            bio:string, 
            Gender: string,
            sexuality: string,
            age: string,
            Birthday: string | '',
            interests: string[],
            occupation: string,
            Location: [
                {
                    country: string,
                    State: string,
                    city: string,
                    _id: string,
                }
            ],
            ProfileUrl:string, 
            CoverUrl:string, 
             ExtraUrl: string[] | [],
            role: string,
            ProfileStatus: string,
            createdAt: string,
            Blocked:boolean,
            __v: number,
            pincode: string
    }

const UserInfo = () => {
    const [Search,setSearch]=useState(false);
    const SearchRef = useRef<HTMLInputElement>(null);
    const [users,setusers]=useState<User[] | []>([]);
    const [Searched,setSearched]=useState('');
    const [ShowFilters,setShowFilters]=useState(false);
    const [FileterdCount,setFileterdCount]=useState(0);
    const [ApiLoading,setApiLoading]=useState(false);
    const {LogoutLoading} = useContext(MainPageContext);
    const [Filters,setFilters]=useState({
      Premium:false,
      NonPremium:false,
      ProfileComplete:false,
      ProfileIncomplete:false,
    });

    const FetchUsers = useCallback(async () => {

      try {
        setApiLoading(true);
        let query = '';
    
        // Build the filter query based on the selected filters
        const filterQuery = Object.entries(Filters)
          .filter(([_, value]) => value)
          .map(([key, _]) => `${key}=true`)
          .join('&');
        // Add the filter query to the main query if any filters are selected
        if (filterQuery) {
          query += filterQuery;
        }
        // Add the search query to the main query if SearchQuery is not empty
        if (Searched!=='') {
          if (query) query += '&';
          query += `Search=${Searched}`;
        }

        // Make the API request with the constructed query
        const Route = query!==''
          ? `https://dashboard-love-spark-backend.vercel.app/api/Users/All?${query}`
          : `https://dashboard-love-spark-backend.vercel.app/api/Users/All`;
    
        const config = {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        };
        const { data } = await axios.get<any>(Route, config);
        setusers(data.users);
        setApiLoading(false);
      } catch (error) {
        console.log(error);
        setApiLoading(false);
      }
    }, [Searched, Filters]);
    

    // Debounce the API call when the search input changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      FetchUsers();
    }, 500); // Adjust the debounce time as needed

    return () => clearTimeout(debounceTimer);
  }, [Searched, FetchUsers]);
   
    const HandleSearch = (e:any)=>{
        setSearch(!Search);
        if(SearchRef.current){
            SearchRef.current.focus();
        }
    }

    const HandleBlock = async(id:string,blocked:boolean)=>{
      try {
        setApiLoading(true);
        const Route = `https://love-spark.vercel.app/api/Users/Update/${id}`
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        const Data = blocked===true?{Blocked:false}:{Blocked:true};
        await axios.put(Route,Data,config);
        setApiLoading(false);
       FetchUsers();
      } catch (error) {
        console.log(error);
        setApiLoading(false);
        
      }
     }
 

    useEffect(()=>{
    const Count = Object.values(Filters).filter((value) => value===true).length; 
    setFileterdCount(Count);  
  },[Filters]);
    

    return (
      ApiLoading || LogoutLoading?

<Skeleton animation='wave' variant='rectangular' height='548px' width='100%' className='bg-gradient-to-r from-gray-900 via-gray-900 to-black' />

      :

    <div className='flex  flex-col bg-gradient-to-r from-gray-900 via-gray-900 to-black'>
       <div className={`h-[80px] w-full flex flex-col  border-b border-[rgba(255,255,255,0.8)]`}>
    <div className='flex justify-between mt-5'>
        <div className={`ml-5 flex gap-5 items-center`}>
        <LiaUsersCogSolid className={`text-white ml-2 cursor-default`} size={40} />
            <span className={`text-white text-[22px]`}>Users</span>
        </div>
        <div className={`mr-10 flex gap-8 items-center`}>
            <div className='flex items-center gap-2'>
            <input onChange={(e:any)=>setSearched(e.target.value)} ref={SearchRef} type='search' placeholder='Search...' className={`${Search?'scale-x-100':'scale-x-0'} text-base transition-all duration-700 ease-in-out  rounded-[5px] outline-none pl-2 h-[25px]`} />
            <AiOutlineSearch onClick={HandleSearch} size={28} className='text-[rgba(255,255,255,0.8)] hover:text-white cursor-pointer'/>
            </div>
            <div className='flex relative text-white' onClick={()=>setShowFilters(!ShowFilters)}>
            <span className='cursor-pointer'>Filter</span>
            <span className={`${FileterdCount<1?'hidden':''} absolute bg-yellow-300 text-red-500 rounded-full flex justify-center items-center font-bold w-[20px] h-[20px] right-5 top-[-10px]`}>{FileterdCount}</span>
            <div className={`${ShowFilters?'':'hidden'} transition-all ease-in-out duration-300 w-[200px] h-[220px] left-[-140px] cursor-pointer top-10 rounded-[5px] gap-3  bg-gradient-to-r from-gray-900 via-gray-900 to-black absolute  z-10 flex flex-col justify-center items-center text-white border-white border`}>
            <span onClick={()=>setFilters({...Filters,Premium:!Filters.Premium,NonPremium:false})} className={`${Filters.Premium?'bg-gradient-to-r from-gray-600 via-gray-600 to-black':''} p-2 w-full text-center hover:bg-gradient-to-r from-gray-600 via-gray-600 to-black text-yellow-500`}>Premium Users</span>
            <span onClick={()=>setFilters({...Filters,NonPremium:!Filters.NonPremium,Premium:false})} className={`${Filters.NonPremium?'bg-gradient-to-r from-gray-600 via-gray-600 to-black':''} p-2  w-full text-center hover:bg-gradient-to-r from-gray-600 via-gray-600 to-black text-green-500`} >Non-Premium Users</span>
            <span onClick={()=>setFilters({...Filters,ProfileComplete:!Filters.ProfileComplete,ProfileIncomplete:false})} className={`${Filters.ProfileComplete?'bg-gradient-to-r from-gray-600 via-gray-600 to-black':''} p-2  w-full text-center hover:bg-gradient-to-r from-gray-600 via-gray-600 to-black text-pink-500`}>Profile-Complete</span>
            <span onClick={()=>setFilters({...Filters,ProfileIncomplete:!Filters.ProfileIncomplete,ProfileComplete:false})} className={`${Filters.ProfileIncomplete?'bg-gradient-to-r from-gray-600 via-gray-600 to-black':''} p-2  w-full text-center hover:bg-gradient-to-r from-gray-600 via-gray-600 to-black text-red-100`}>Profile-Incomplete</span>
            </div>
           <MdExpandMore size={28} className={`${ShowFilters?'rotate-180':''} transition-all duration-100 ease-in-out text-white cursor-pointer `}/>
            </div>
        </div>
    </div>
    </div>
    <div className='h-[465px] overflow-y-scroll ScrollStyle'>
      <table className="text-white w-full">
  <thead>
    <tr className='border border-white'>
      <th align='center'>FirstName</th>
      <th align='center'>Country</th>
      <th align='center'>EmailID</th>
      <th align='center'>ProfileStatus</th>
      <th align='center'>Profile-Picture</th>
      <th align='center'>Type</th>
      <th align='center'>Block User</th>
    </tr>
  </thead>
  <tbody className=''>
    {users?.length>0 && users.map((user)=>(
   <tr key={user._id} className='text-center items-center'>
    <td className='py-8'>{user.FirstName}</td>
    <td>
  {user.Location.every((L) => L.country === '')
    ? '-----------'
    : user.Location.filter((L) => L.country !== '')
        .map((L) => L.country)
        .join(', ')}
</td>
 <td>{user.email}</td>
    <td>{user.ProfileStatus}</td>
    <td className='flex justify-center items-center py-8'>
      {user.ProfileUrl?
    <img src={user.ProfileUrl} alt='IMG' className='w-[50px] h-[50px] rounded-full object-cover'/>
      :
      <MdAccountCircle className='w-[50px] h-[50px]'/>    
  }
    </td>
    <td>{user.role==='user'?'Non-Premuim':'Premium'}</td>
    <td onClick={()=>HandleBlock(user._id,user.Blocked)} className='flex justify-center'> 
    <button className='items-center hover:shadow-sm hover:shadow-white flex gap-3 justify-center border-white border w-[110px] p-2'>
    {user.Blocked?
 <RxCross1 size={28} className='text-green-500'/>
 :
 <BiBlock size={28} className='text-red-500 '/>
 }
    <span className={`${user.Blocked?'text-green-500':'text-red-500'}`}>{user.Blocked?'UnBlock':'Block'}</span>
    </button>
    </td>
   </tr>
    ))}
  </tbody>
</table>
</div>
    </div>
  )
}

export default UserInfo