import {useContext,useState} from 'react';
import {RxHamburgerMenu} from 'react-icons/rx';
import { MainPageContext } from '../../Context/MainPageContext';
import {RiAdminLine} from 'react-icons/ri';
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
    const {ShowComponent,setLogoutLoading} = useContext(MainPageContext);
    const [Tooltip,setTooltip]=useState(false);
    const [ShowAcccount,setShowAcccount]=useState(false);
    const [Loading,setLoading]=useState(false);
    const {Admin} = useAppSelector((state)=>state.user);
    const dispatch = useAppDispatch();
    const Navigate = useNavigate();


    const HandleLogout = async()=>{
      if(!Loading){
      setLoading(true);
      setLogoutLoading(true);
     const response = await dispatch(LogoutUser());
      if (response.meta.requestStatus === 'fulfilled'){
        setLoading(false);
        setLogoutLoading(false);
       Navigate('/Login');
      }else{
        setLoading(false);
        setLogoutLoading(false);
      }
    }else{
      return;
    }
    }
   
  return (
    <div className={`${ShowComponent!=='Reports'?'h-[165px]':'h-[81px]'} w-full  flex flex-col  border-b border-[rgba(255,255,255,0.8)] bg-gradient-to-r from-gray-900 via-gray-900 to-black`}>
    <div className='flex justify-between mt-5'>
        <div className={`ml-5 flex gap-5 items-center`}>
        <RxHamburgerMenu className={`text-white ml-2 cursor-pointer`} size={20} onClick={()=>setToggleBar(!ToggleBar)}/>
            <span className={`text-white`}>Home / {ShowComponent}</span>
        </div>
        <div className={`mr-10 flex gap-8 items-center`}>
          
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
                <span className={`${Tooltip && !Loading?'':'hidden'} top-[-30px] text-white absolute`}>Logout</span>
                <div className={`${Loading?'':'hidden'}  top-[-30px] absolute`}>
                <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                 <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
         </div>
            </div>
        </div>
    </div>
    </div>
  )
}

export default NavBar;