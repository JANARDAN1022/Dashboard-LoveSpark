import {useState,useRef,useEffect,useCallback} from 'react';
import { LoginUser } from '../../Actions/AdminActions';
import { useAppDispatch,useAppSelector } from '../../Hooks';
import { useNavigate } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import axios from 'axios';

interface AdminExists {
  Length: number,
  admin: [
      {
          _id: string,
          AdminName: string,
          Email: string,
          ProfileUrl: string,
      }
  ]
}

const Login = () => {
  const [AdminInfo,setAdminInfo]=useState({
    Email:'',
    Password:'',
  });
  const [Error,setError]=useState({
    EmailE:'',
    PassE:'',
    other:''
  });
  const [ExistsAdmin,setExistsAdmin]=useState<AdminExists["Length"] | null>(null);
  const EmailRef = useRef<HTMLInputElement>(null);
  const PassRef = useRef<HTMLInputElement>(null);
  const {error,Admin,isAuthenticated,loading}= useAppSelector((state)=>state.user);
  const Dispatch = useAppDispatch();
  const Navigate = useNavigate();

  useEffect(()=>{
    if((!loading && isAuthenticated) || Admin!==null){
     Navigate('/');
    }
  },[Navigate,loading,isAuthenticated,Admin]);

  const AdminExists = useCallback(async()=>{
    try {
     const Route = `https://dashboard-love-spark-backend.vercel.app/api/Admin/AdminExists`;
     const config = {
       headers: { 'Content-Type': 'application/json' },
       withCredentials: true,
     };
     const {data} = await axios.get<AdminExists>(Route,config);
     setExistsAdmin(data.Length);
    } catch (error) {
     console.log(error);
    }
     },[]);
 
     useEffect(()=>{
       AdminExists();
     },[AdminExists]);

    const HandleLogin = async(e:any)=>{
      e.preventDefault();
      const Empty = Object.values(AdminInfo).some((value) => value === '');
      const ValidEmail = AdminInfo.Email.split('@').length>1;
      if(!Empty){
        if(!ValidEmail){
            setError({...Error,EmailE:'Please Enter A Valid Email'});
            setTimeout(() => {
              setError({...Error,EmailE:''});
            }, 2000);
        }else{
      const response = await Dispatch(LoginUser({Email:AdminInfo.Email,Password:AdminInfo.Password}));
      const result = unwrapResult(response);  
      if (result?.success){
        setAdminInfo({Email:'',Password:''});
         Navigate('/');
        }else{
          setAdminInfo({Email:'',Password:''});
          EmailRef.current && EmailRef.current.focus();
          setError({...Error,other:error});
          setTimeout(() => {
            setError({...Error,other:''});
          }, 2000);
        }
    }
      }else{
        if(AdminInfo.Email===''){
          EmailRef.current && EmailRef.current.focus();
          setError({...Error,EmailE:'Email Cannot Be Empty'});
          setTimeout(() => {
            setError({...Error,EmailE:''});
          }, 2000);
        }else if(AdminInfo.Password===''){
          PassRef.current && PassRef.current.focus();
          setError({...Error,PassE:'Password Cannot be Empty'});
          setTimeout(() => {
            setError({...Error,PassE:''});
          }, 2000);
        }
      }
    }
  return (
    <>
    <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-black flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    <div className='flex justify-center items-center'>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="border-white border  md:w-14 md:h-14 w-10 h-10 text-white p-2 bg-pink-500 rounded-full" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
      </div>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
        Sign in to your account
      </h2>
    </div>

    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" action="#" method="POST">
      <div className={`${Error.EmailE?'w-[640px]':''}`}>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
            Email address
          </label>
          <div className="mt-2 flex gap-5">
            <input
            value={AdminInfo.Email}
            ref={EmailRef}
            onChange={(e)=>setAdminInfo({...AdminInfo,Email:e.target.value})}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`pl-5 block ${Error.EmailE?'w-[60%]':'w-full'} rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
              />
                     <span className={`${Error.EmailE===''?'hidden':''} text-red-500 font-bold`}>{Error.EmailE}*</span>
          </div>
        </div>

        <div>
          <div className="flex  items-center justify-between ">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
              Password
            </label>
            <div className="text-sm">
              <a href="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
          </div>
          <div className={`${Error.PassE?'w-[640px]':''} mt-2 flex gap-5 `}>
            <input
            value={AdminInfo.Password}
            onChange={(e)=>setAdminInfo({...AdminInfo,Password:e.target.value})}
            ref={PassRef}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={`pl-5 block ${Error.PassE?'w-[60%]':'w-full'} rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
              />
                <span className={`${Error.PassE===''?'hidden':''} text-red-500 font-bold`}>{Error.PassE}*</span>
          </div>
        </div>

        <div className='flex flex-col justify-center gap-3'>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={HandleLogin}
         >
            Sign in
          </button>
          <span className={`${Error.other!==''?'':'hidden'} text-red-500 font-bold mt-2`}>{Error.other}*</span>
        </div>
        <div className='flex justify-center items-center'>
          <span onClick={()=>Navigate(`${'/Register'}`)} className={`${ExistsAdmin && ExistsAdmin>0?'hidden':''} text-[rgba(255,255,255,0.8)] hover:text-white transition-all duration-100 ease-in-out font-bold cursor-pointer`}>'Dont Have an Account Register?</span>
        </div>
      </form>
    </div>
  </div>
</>

  )
}

export default Login