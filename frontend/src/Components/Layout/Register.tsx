import {useState,useRef,useCallback,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Link} from 'react-router-dom';
import { useAppDispatch,useAppSelector } from '../../Hooks';
import { RegisterUser } from '../../Actions/AdminActions';
import {BiSolidShow,BiSolidHide} from 'react-icons/bi';
import axios from 'axios';
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage';
import {storage} from '../../firebase';

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

const Register = () => {
    const [AdminInfo,setAdminInfo]=useState({
        Name:'',
        Email:'',
        Password:'',
        confirmPassword:'',
    });
    const NameRef = useRef<HTMLInputElement>(null);
    const EmailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPassRef = useRef<HTMLInputElement>(null);
    const [ProfilePic, setProfilePic] = useState<any | null>(null);
    const [ExistsAdmin,setExistsAdmin]=useState<AdminExists["Length"] | null>(null);
    const [ShowPassword,setShowPassword]=useState({
      Pass:false,
      ConfirmPass:false
    })
    const [Error,setError]=useState({
      NameE:'',
      EmailE:'',
      PasswordE:'',
      confirmPasswordE:'',
      other:'',
    });
    const [Loading,setLoading]=useState(false);
    const {Admin,isAuthenticated,loading} = useAppSelector((state)=>state.user);
    const dispatch = useAppDispatch();
    const Navigate =useNavigate();
   
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

    useEffect(()=>{
      if(ExistsAdmin && ExistsAdmin>0){
        Navigate('/Login');
      }else if((!loading && isAuthenticated) || Admin!==null){
        Navigate('/');
       }
    },[ExistsAdmin,loading,isAuthenticated,Admin,Navigate]);

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
       setProfilePic(file);
    };

    const HandleRegister = async(e:any)=>{
      e.preventDefault();
      const Empty = Object.values(AdminInfo).some((value) => value === '');
      if(!Empty && AdminInfo.Password===AdminInfo.confirmPassword){
        const profileRef = ref(storage, `AdminProfilePic/${Admin?._id}`);
// Upload the profile picture and cover picture to Firebase Storage
setLoading(true);
setTimeout(() => {
  setLoading(false);
}, 5500);
Promise.all([uploadBytes(profileRef, ProfilePic)])
.then((snapshots) => {
  // Get the download URLs for both images
  const [profileSnapshot] = snapshots;
  return Promise.all([getDownloadURL(profileSnapshot.ref)]);
})
.then(async(urls) => {
  const [profileUrl] = urls;
  const response = await dispatch(RegisterUser({Name:AdminInfo.Name,Email:AdminInfo.Email,Password:AdminInfo.Password,ProfileUrl:profileUrl,confirmPassword:AdminInfo.confirmPassword}));
        if (response.meta.requestStatus === 'fulfilled') {
          setAdminInfo({Name:'',Email:'',Password:'',confirmPassword:''});
         Navigate('/');
        }else{
          setAdminInfo({Name:'',Email:'',Password:'',confirmPassword:''});
          setError({...Error,other:'Registeration Failed Try Again in Few Minutes or Later'});
        }
})}else{
        if((AdminInfo.Password!==''&& AdminInfo.confirmPassword!=='') && AdminInfo.Password!==AdminInfo.confirmPassword){
         setError({...Error,other:'Password Does Not Match'});
         setTimeout(() => {
          setError({...Error,other:''});
         }, 2000);
        }
        if(AdminInfo.Name===''){
        NameRef.current && NameRef.current.focus();
        setError({...Error,NameE:'Please Enter Your Name'});
        setTimeout(() => {
          setError({...Error,other:''});
        }, 2000);
        }else if(AdminInfo.Email===''){
          EmailRef.current && EmailRef.current.focus();
          setError({...Error,EmailE:'Email Cannot Be Empty'});
          setTimeout(() => {
            setError({...Error,EmailE:''});
          }, 2000);
        }else if(AdminInfo.Password===''){
          passwordRef.current && passwordRef.current.focus();
          setError({...Error,PasswordE:'Password  Cannot be Empty'});
          setTimeout(() => {
           setError({...Error,PasswordE:''});
          }, 2000);
        }else if(AdminInfo.confirmPassword===''){
          confirmPassRef.current && confirmPassRef.current.focus();
          setError({...Error,confirmPasswordE:'Confirm Your Password'});
          setTimeout(() => {
           setError({...Error,confirmPasswordE:''});
          }, 2000);
        }else if(AdminInfo.Password!=='' && AdminInfo.Password.length<6){
          passwordRef.current && passwordRef.current.focus();
          setError({...Error,PasswordE:'Atleast 6 Letters'});
          setTimeout(() => {
           setError({...Error,confirmPasswordE:''});
          }, 2000);
        }
      }
    }
   
      
  return (
    <>
    <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-black flex min-h-screen flex-1 flex-col justify-center px-6 py-5 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    <div className='flex justify-center items-center'>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="border-white border  md:w-14 md:h-14 w-10 h-10 text-white p-2 bg-pink-500 rounded-full" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
      </div>
      <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-white">
        Register your Admin account
      </h2>
    </div>

    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-4" action="#" method="POST">
        <div className={`${Error.NameE?'w-[640px]':''}`}>
          <label htmlFor="Name" className="block text-sm font-medium leading-6 text-white">
            Admin Name
          </label>
          <div className="mt-2 flex gap-5">
            <input
            ref={NameRef}
            onChange={(e)=>setAdminInfo({...AdminInfo,Name:e.target.value})}
              id="Name"
              name="Name"
              type="text"
              autoComplete="Name"
              required
              className={`pl-5 block ${Error.NameE?'w-[60%]':'w-full'} rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
            />
            <span className={`${Error.NameE===''?'hidden':''} text-red-500 font-bold`}>{Error.NameE}*</span>
          </div>
        </div>

        <div className={`${Error.EmailE?'w-[640px]':''}`}>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
            Email address
          </label>
          <div className="mt-2 flex gap-5">
            <input
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

        <div className={`${Error.PasswordE?'w-[640px]':''}`}>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
              Password
            </label>
          </div>
          <div className="mt-2 flex gap-5 relative">
            <input
              ref={passwordRef}
              onChange={(e)=>setAdminInfo({...AdminInfo,Password:e.target.value})}
              id="password"
              name="password"
              type={`${ShowPassword.Pass?'text':'password'}`}
              autoComplete="current-password"
              required
              className={`pl-5 block ${Error.PasswordE?'w-[60%]':'w-full'} rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
             />
             {ShowPassword.Pass?<BiSolidShow className='absolute right-5 top-2  cursor-pointer' size={20} onClick={()=>setShowPassword({...ShowPassword,Pass:false})}/>:<BiSolidHide className='absolute right-5 top-2  cursor-pointer' size={20} onClick={()=>setShowPassword({...ShowPassword,Pass:true})}/>}
            <span className={`${Error.PasswordE===''?'hidden':''} text-red-500 font-bold`}>{Error.PasswordE}*</span>
          </div>
        </div>

        <div className={`${Error.confirmPasswordE?'w-[640px]':''}`}>
          <div className="flex items-center justify-between">
            <label htmlFor="Confirmpassword" className="block text-sm font-medium leading-6 text-white">
              Confirm Password
            </label>
          </div>
          <div className="mt-2 flex gap-5 relative">
            <input
              ref={confirmPassRef}
              onChange={(e)=>setAdminInfo({...AdminInfo,confirmPassword:e.target.value})}
              id="Confirmpassword"
              name="Confirmpassword"
              type={`${ShowPassword.ConfirmPass?'text':'password'}`}
              autoComplete="Confirmpassword"
              required
              className={`pl-5 block ${Error.confirmPasswordE?'w-[60%]':'w-full'} rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
           />
             {ShowPassword.ConfirmPass?<BiSolidShow className='absolute right-5 top-2  cursor-pointer' size={20} onClick={()=>setShowPassword({...ShowPassword,ConfirmPass:false})}/>:<BiSolidHide className='absolute right-5 top-2  cursor-pointer' size={20} onClick={()=>setShowPassword({...ShowPassword,ConfirmPass:true})}/>}
            <span className={`${Error.confirmPasswordE===''?'hidden':''} text-red-500 font-bold`}>{Error.confirmPasswordE}*</span>
          </div>
        </div>
        <div className='flex justify-center mt-5'>
       <span className={`${Error.other!==''?'':'hidden'} text-red-500 font-bold mt-2`}>{Error.other}*</span>
        </div>
        <div className="col-span-full flex gap-20">
          <div className='flex flex-col '>
          <label
                htmlFor="photo"
                className="block text-sm md:text-2xl md:mb-5 font-medium leading-6 text-white"
              >
                Profile Photo
              </label>
              <div className="mt-2 flex items-center gap-x-10">
                <div className="flex items-center gap-x-3">
                <label
                    htmlFor="photo"
                    className="rounded-md md:w-[150px] md:text-center bg-white  text-sm md:text-lg font-semibold text-pink-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
                  >
                    Change
                  </label>
                  <input
                    type="file"
                    id="photo"
                    accept="image/*" // Specify the accepted file types if needed
                    className="hidden" // Hide the input element visually
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>
              </div>  
              {ProfilePic ? (
               
               <img
              src={URL.createObjectURL(ProfilePic)}
              alt="ProfilePic"
              className="h-12 w-12 md:w-[80px] md:h-[80px] rounded-full object-cover"
            />
           
            ): (
        null
          )}            
            </div>

        <div className='flex flex-col gap-2 relative'>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={HandleRegister}
         >
           Register & Sign in
          </button>
          
<div role="status" className={`absolute right-5 ${Loading?'':'hidden'}`}>
    <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
</div>

          <Link to={'/Login'} className='text-white  self-end'>Already Registered?Login As Admin</Link>
        </div>
         </form>
    </div>
  </div>
</>

  )
}

export default Register