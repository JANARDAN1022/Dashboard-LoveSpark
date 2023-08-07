import {useState,useRef,useEffect,useCallback} from 'react';
import { UpdateUser } from '../../Actions/AdminActions';
import { useAppDispatch,useAppSelector } from '../../Hooks';
import { useNavigate } from 'react-router-dom';
//import { unwrapResult } from '@reduxjs/toolkit';
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage';
import {storage} from '../../firebase';
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

const UpdateInfo = () => {
  const [AdminInfo,setAdminInfo]=useState({
    Email:'',
    Password:'',
    NewEmail:'',
    NewPassword:'',
  });
  const [Error,setError]=useState({
    EmailE:'',
    PassE:'',
    NewEmailE:'',
    NewPassE:'',
    other:''
  });
  const [ExistsAdmin,setExistsAdmin]=useState<AdminExists["Length"] | null>(null);
  const [ProfilePic, setProfilePic] = useState<any | null>(null);
  const [Loading,setLoading]=useState(false);
  const EmailRef = useRef<HTMLInputElement>(null);
  const PassRef = useRef<HTMLInputElement>(null);
  const NewEmailRef = useRef<HTMLInputElement>(null);
  const NewPassRef = useRef<HTMLInputElement>(null);
  const {error,Admin}= useAppSelector((state)=>state.user);
  const Dispatch = useAppDispatch();
  const Navigate = useNavigate();


  const AdminExists = useCallback(async()=>{
    try {
     const Route = `http://localhost:5000/api/Admin/AdminExists`;
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
      if(ExistsAdmin && ExistsAdmin<1){
        Navigate('/Register');
      }
      if(Admin===null){
        Navigate('/Login');
      }
     },[Navigate,ExistsAdmin,Admin]);

     const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
       setProfilePic(file);
    };

    const HandleUpdate = async (e: any) => {
      e.preventDefault();
    
      const isValidEmail = (email: string) => email.split('@').length > 1;
    
      const { Email, Password, NewEmail, NewPassword } = AdminInfo;
    
      if (Email !== '' && Password !== '') {
        const isValidCurrentEmail = isValidEmail(Email);
        const isValidNewEmail = isValidEmail(NewEmail);
    
        if (!isValidCurrentEmail) {
          EmailRef.current?.focus();
          setError({ ...Error, EmailE: 'Please Enter A Valid Email' });
          setTimeout(() => setError({ ...Error, EmailE: '' }), 2000);
        } else if (Email !== Admin?.Email && NewEmail!=='') {
          EmailRef.current?.focus();
          setError({ ...Error, other: 'Invalid Current Email or Password' });
          setTimeout(() => setError({ ...Error, other: '' }), 3000);
        } else if (NewEmail === '' && NewPassword === '' && ProfilePic === '') {
          setError({ ...Error, other: 'NewFields cannot be Empty' });
          setTimeout(() => setError({ ...Error, other: '' }), 3000);
        } else if (!isValidNewEmail && NewEmail !== '') {
          NewEmailRef.current?.focus();
          setError({ ...Error, NewEmailE: 'Please Enter A Valid Email' });
          setTimeout(() => setError({ ...Error, NewEmailE: '' }), 2000);
        } else if (Email === NewEmail || NewPassword === Password) {
          setError({ ...Error, other: 'New Field Cannot Be Same As Old' });
          setTimeout(() => setError({ ...Error, other: '' }), 3000);
        }else if(NewEmail==='' && NewPassword==='' && ProfilePic===null){
          setError({ ...Error, other: 'Update Atleast One Field' });
          setTimeout(() => setError({ ...Error, other: '' }), 3000);
        } 
        else {
          const profileRef = ref(storage, `AdminProfilePic/${Admin?._id}`);
          setLoading(true);
          setTimeout(() => setLoading(false), 5500);
    
          try {
            const [profileSnapshot] = await Promise.all([uploadBytes(profileRef, ProfilePic)]);
            const profileUrl = profileSnapshot ? await getDownloadURL(profileSnapshot.ref) : '';
    
            const response = await Dispatch(UpdateUser({
              Email,
              Password,
              NewEmail: NewEmail !== '' ? NewEmail : '',
              NewPassword: NewPassword !== '' ? NewPassword : '',
              NewProfileUrl: profileUrl !== '' ? profileUrl : '',
            }));
    
            const result = unwrapResult(response);
            if (result?.success) {
              setAdminInfo({ Email: '', Password: '', NewEmail: '', NewPassword: '' });
              Navigate('/');
            } else {
              setAdminInfo({ Email: '', Password: '', NewEmail: '', NewPassword: '' });
              EmailRef.current?.focus();
              setError({ ...Error, other: error });
              setTimeout(() => setError({ ...Error, other: '' }), 2000);
            }
          } catch (error) {
            // Handle any errors here
          }
        }
      } else {
        if (Email === '') {
          EmailRef.current?.focus();
          setError({ ...Error, EmailE: 'Email Cannot Be Empty' });
          setTimeout(() => setError({ ...Error, EmailE: '' }), 2000);
        } else if (Password === '') {
          PassRef.current?.focus();
          setError({ ...Error, PassE: 'Password Cannot be Empty' });
          setTimeout(() => setError({ ...Error, PassE: '' }), 2000);
        }
      }
    };
    
    console.log(ProfilePic);
    
  return (
    <>
    <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-black flex min-h-screen flex-1 flex-col justify-center px-6  lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    <div className='flex justify-center items-center'>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="border-white border  md:w-14 md:h-14 w-10 h-10 text-white p-2 bg-pink-500 rounded-full" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
      </div>
      <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-white">
        Update Ur Details
      </h2>
    </div>

    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" action="#" method="POST">
      <div className={`${Error.EmailE?'w-[640px]':''}`}>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
            Current Email address
          </label>
          <div className="mt-2 flex gap-5">
            <input
            placeholder='Enter Your Current Email Address'
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
             Current Password
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
            placeholder='Enter Your Current Password'
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

        <div className={`${Error.NewEmailE?'w-[640px]':''}`}>
          <div className='flex justify-between items-center'>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
            New Email
          </label>
          <span className='text-[rgba(255,255,255,0.7)] text-sm'>(Leave It Empty To only Change Password)</span>
          </div>
          <div className="mt-2 flex gap-5">
            <input
            placeholder='Enter New Email Address'
            value={AdminInfo.NewEmail}
            ref={NewEmailRef}
            onChange={(e)=>setAdminInfo({...AdminInfo,NewEmail:e.target.value})}
              id="Newemail"
              name="Newemail"
              type="email"
              autoComplete="email"
              required
              className={`pl-5 block ${Error.NewEmailE?'w-[60%]':'w-full'} rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
              />
                     <span className={`${Error.NewEmailE===''?'hidden':''} text-red-500 font-bold`}>{Error.NewEmailE}*</span>
          </div>
        </div>


        <div>
          <div className="flex  items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
             New Password
             </label>
             <span className='text-[rgba(255,255,255,0.7)] text-sm'>(Leave It Empty To only Change Email)</span>
          </div>
          <div className={`${Error.NewPassE?'w-[640px]':''} mt-2 flex gap-5 `}>
            <input
            value={AdminInfo.NewPassword}
            ref={NewPassRef}
            onChange={(e)=>setAdminInfo({...AdminInfo,NewPassword:e.target.value})}
            placeholder='Enter New Password'
              id="Newpassword"
              name="Newpassword"
              type="password"
              autoComplete="current-password"
              required
              className={`pl-5 block ${Error.NewPassE?'w-[60%]':'w-full'} rounded-md border-0 py-1.5 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
              />
                <span className={`${Error.NewPassE===''?'hidden':''} text-red-500 font-bold`}>{Error.NewPassE}*</span>
          </div>
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
           
            ):Admin?.ProfileUrl!==''?
            (
              <img
              src={Admin?.ProfileUrl}
              alt="ProfilePicc"
              className="h-12 w-12 md:w-[80px] md:h-[80px] rounded-full object-cover"
            />
          )
        :
        null
        }            
            </div>



        <div className='flex flex-col justify-center gap-3'>
          <button
            type="submit"
            className=" font-bold flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm  leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={HandleUpdate}
         >
           Update Info
          </button>
          <div role="status" className={`absolute right-[600px] ${Loading?'':'hidden'}`}>
    <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>
          <span className={`${Error.other!==''?'':'hidden'} text-red-500 font-bold mt-2`}>{Error.other}*</span>
        </div>
        <div className='flex justify-center items-center'>
          <span onClick={()=>Navigate('/')} className='text-[rgba(255,255,255,0.8)] hover:text-white transition-all duration-100 ease-in-out font-bold cursor-pointer'>Changed Your Mind, Go Back To Dashboard?</span>
        </div>
      </form>
    </div>
  </div>
</>

  )
}

export default UpdateInfo