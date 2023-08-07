import {useContext,useState} from 'react';
import {RxHamburgerMenu} from 'react-icons/rx';
import { MainPageContext } from '../../Context/MainPageContext';
import {RiAdminLine} from 'react-icons/ri';
//import {AiOutlineSearch} from 'react-icons/ai';
import {IoIosNotificationsOutline} from 'react-icons/io';
import {BiLogOut} from 'react-icons/bi';
import { useAppSelector,useAppDispatch } from '../../Hooks';
import { LogoutUser } from '../../Actions/AdminActions';
import { useNavigate } from 'react-router-dom';
import {MdExpandMore} from 'react-icons/md';

interface NavbarProps {
    ToggleBar:boolean,
    setToggleBar:React.Dispatch<React.SetStateAction<boolean>>
  }

const NavBar = ({ToggleBar,setToggleBar}:NavbarProps) => {
    const {ShowComponent} = useContext(MainPageContext);
   // const [Search,setSearch]=useState(false);
   // const SearchRef = useRef<HTMLInputElement>(null);
    const [Tooltip,setTooltip]=useState(false);
    const [ShowAcccount,setShowAcccount]=useState(false);
    const {Admin} = useAppSelector((state)=>state.user);
    const dispatch = useAppDispatch();
    const Navigate = useNavigate();


    const HandleLogout = async()=>{
     const response = await dispatch(LogoutUser());
      if (response.meta.requestStatus === 'fulfilled') {
       Navigate('/Login');
      }
    }
   
  /*  const HandleSearch = ()=>{
        setSearch(!Search);
        if(SearchRef.current){
            SearchRef.current.focus();
        }
    }*/

  return (
    <div className={`${ShowComponent!=='Reports'?'h-[165px]':'h-[81px]'} w-full  flex flex-col  border-b border-[rgba(255,255,255,0.8)] bg-gradient-to-r from-gray-900 via-gray-900 to-black`}>
    <div className='flex justify-between mt-5'>
        <div className={`ml-5 flex gap-5 items-center`}>
        <RxHamburgerMenu className={`text-white ml-2 cursor-pointer`} size={20} onClick={()=>setToggleBar(!ToggleBar)}/>
            <span className={`text-white`}>Home / {ShowComponent}</span>
        </div>
        <div className={`mr-10 flex gap-8 items-center`}>
          {  /*<div className='flex items-center gap-2'>
            <input ref={SearchRef} type='search' placeholder='Search...' className={`${Search?'scale-x-100':'scale-x-0'} text-base transition-all duration-700 ease-in-out  rounded-[5px] outline-none pl-2 h-[25px]`} />
            <AiOutlineSearch onClick={HandleSearch} size={28} className='text-[rgba(255,255,255,0.8)] hover:text-white cursor-pointer'/>
            </div>*/}
            <div className='flex relative'>
           <IoIosNotificationsOutline size={28} className='text-white cursor-pointer'/>
            <span className='rounded-full w-5 justify-center items-center flex right-[-8px] top-[-10px] h-5 bg-yellow-300 text-red-500  absolute font-bold'>1</span>
            </div>
            <div className='flex gap-3 items-center relative'>
            {
            Admin?.ProfileUrl?
            <img  src={(Admin.ProfileUrl)} alt='AdminPic' className='cursor-pointer w-[40px] h-[40px] rounded-full object-cover'/>
          :
          <RiAdminLine size={30} className='text-white' />  
          }
          <div className='flex justify-center ' onClick={()=>setShowAcccount(!ShowAcccount)}>
            <span className='text-white  cursor-pointer font-bold'>{Admin?.AdminName}</span>
            <MdExpandMore size={28} className={`text-white cursor-pointer ${ShowAcccount?'rotate-180':''} transition-all duration-100 ease-in-out`}/>
            </div>
            <div className={`${ShowAcccount?'':'hidden'}  absolute w-[180px] h-[45px]  flex  border border-white  bg-gradient-to-r from-gray-900 via-black to-black  z-50 top-12 right-2 rounded-[5px]`}>
            <span onClick={()=>Navigate('/UpdateInfo')} className='text-[rgba(255,255,255,0.7)] w-full text-center rounded-[5px] self-center p-2  cursor-pointer transition-all duration-100 ease-in-out hover:bg-gradient-to-r hover:from-gray-700 hover:via-gray-800 hover:to-black'>Account Update</span>
            </div>
            </div>
            <div className='flex  justify-center relative'>
                <BiLogOut 
                onClick={HandleLogout}
                onMouseEnter={()=>{
                    setTimeout(() => {
                        setTooltip(true)    
                    }, 500);
                    }} onMouseLeave={()=>setTooltip(false)} size={28} className='text-white cursor-pointer'/>
                <span className={`${Tooltip?'':'hidden'} top-[-30px] text-white absolute`}>Logout</span>
            </div>
        </div>
    </div>
    </div>
  )
}

export default NavBar;