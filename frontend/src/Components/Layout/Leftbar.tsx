import {useState,useContext} from 'react';
import { Link } from 'react-router-dom';
//import {RxHamburgerMenu} from 'react-icons/rx';
import {BiSolidDashboard} from 'react-icons/bi';
import {MdReportGmailerrorred,MdExpandMore} from 'react-icons/md';
import {FaUsers} from 'react-icons/fa';
import {BiBarChartSquare} from 'react-icons/bi';
import {AiOutlineArrowLeft} from 'react-icons/ai';
import { MainPageContext } from '../../Context/MainPageContext';
//import { Skeleton } from '@mui/material';
//import { useAppSelector } from '../../Hooks';

interface LeftbarProps {
  ToggleBar:boolean,
  setToggleBar:React.Dispatch<React.SetStateAction<boolean>>
}


const Leftbar = ({ToggleBar,setToggleBar}:LeftbarProps) => {
  const [ShowMenu,setShowMenu]=useState(false);
  const [Tooltip,setTooltip]=useState(false);
  const [Selected,setSelected]=useState({
    Dashboard:true,
    users:false,
    PieChart:false,
    Chart:false,
    Reports:false
  });
  const {setShowComponent} = useContext(MainPageContext);
  //const {loading} = useAppSelector((state)=>state.user);
  return (
    
    <div className={`${ToggleBar===true?'w-[80px]':'w-[280px]'} h-[100vh]  flex flex-col transition-all duration-300 ease-in-out`}>
      <div className="pr-8 border border-l-0 border-t-0 border-[rgba(255,255,255,0.8)] flex p-5 justify-center  relative bg-gradient-to-r from-gray-700 via-gray-900 to-black">
      <Link to={'/'} className="flex title-font font-medium items-center text-gray-900 mb-4 sm:mb-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="border-white border  md:w-10 md:h-10 w-8 h-8 text-white p-2 bg-pink-500 rounded-full" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
        <span className={`${ToggleBar?'hidden':''} ml-3 sm:text-[14px] md:text-xl text-white`}>LoveSpark</span>
      </Link>
   </div>

      <div className='flex flex-col gap-8 border-r border-[rgba(255,255,255,0.8)]   h-[90%] bg-gradient-to-r from-gray-600 via-gray-800 to-black'>
        <div onClick={()=>{
          setSelected({Dashboard:true,Chart:false,PieChart:false,Reports:false,users:false})
          setShowComponent('Dashboard');
          }} className={`${Selected.Dashboard?'bg-gradient-to-r from-gray-500 via-gray-600 to-black':''} hover:bg-gradient-to-r from-gray-500 via-gray-600 to-black flex items-center p-5  gap-5  cursor-pointer  text-[rgba(255,255,255,0.8)] hover:text-white border-b border-[rgba(255,255,255,0.5)] shadow-sm shadow-[rgba(255,255,255,0.3)]`}>
          <BiSolidDashboard size={28} className='' />
          <span className={`${ToggleBar?'hidden':''} font-serif text-xl cursor-pointer `}>DashBoard</span>
        </div>

        <div className='flex flex-col gap-4'>
         <div className='flex flex-col'>
        <div onClick={()=>setShowMenu(!ShowMenu)} className={`hover:bg-gradient-to-r from-gray-500 via-gray-600 to-black flex items-center p-5 ${ToggleBar?'gap-0':'gap-14'}  cursor-pointer  text-[rgba(255,255,255,0.8)] hover:text-white `}>
          <div className='flex gap-4'>
          <BiBarChartSquare size={28} className='' />
          <span className={`${ToggleBar?'hidden':''} font-serif text-xl cursor-pointer`}>OverView</span>
          </div>
          <div className='flex justify-center '>
           <MdExpandMore size={28} className={`${ShowMenu?'rotate-180':''} transition-all ease-in-out`} onClick={()=>setShowMenu(!ShowMenu)} />
          </div>
        </div>
        <div className={`${ShowMenu?'':'hidden'} flex flex-col gap-2 mb-2 text-white`}>
        <div onClick={()=>{
          setSelected({Dashboard:false,Chart:false,PieChart:false,Reports:false,users:true});
          setShowComponent('Users');
          }} className={`${Selected.users?'bg-gradient-to-r from-gray-500 via-gray-600 to-black':''} hover:bg-gradient-to-r from-gray-500 via-gray-600 to-black flex items-center p-5 gap-5  cursor-pointer  text-[rgba(255,255,255,0.8)] hover:text-white `}>
          <FaUsers size={28} className='' />
          <span className={`${ToggleBar?'hidden':''} font-serif text-xl cursor-pointer `}>Users</span>
        </div>
        </div>
        </div>
        
        <div  onClick={()=>{
          setSelected({Dashboard:false,Chart:false,PieChart:false,Reports:true,users:false})
          setShowComponent('Reports')
          }} className={`${Selected.Reports?'bg-gradient-to-r from-gray-500 via-gray-600 to-black':''} hover:bg-gradient-to-r from-gray-500 via-gray-600 to-black flex items-center p-5 gap-5  cursor-pointer  text-[rgba(255,255,255,0.8)] hover:text-white `}>
          <MdReportGmailerrorred size={28} className='' />
          <span className={`${ToggleBar?'hidden':''} font-serif text-xl cursor-pointer `}>Reports</span>
        </div>
        </div>
      </div>
      <div className="flex border-r border-white p-5 justify-end gap-2 relative bg-gradient-to-r from-gray-700 via-gray-900 to-black">
       <span className={`${Tooltip && !ToggleBar?'':'hidden'} text-white`}>Hide SideBar</span>
         <AiOutlineArrowLeft onClick={()=>setToggleBar(!ToggleBar)} size={28} className={`text-white cursor-pointer ${ToggleBar?'rotate-180':''} transition-all duration-300 delay-100 ease-in-out`} onMouseEnter={()=>setTooltip(true)} onMouseLeave={()=>setTooltip(false)} />
      </div>

    </div>
  )
}

export default Leftbar