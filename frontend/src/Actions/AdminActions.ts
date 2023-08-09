import axios from "axios";
import {createAsyncThunk,Dispatch } from "@reduxjs/toolkit"; 
import {
    loginRequest,
    loginSuccess,
    loginFail,
    logoutFail,
    logoutSuccess,
    registerFail,
    registerRequest,
    registerSuccess,
    updateFail,
    updateSuccess,
    loadFail,
    loadrequest,
    loadsuccess,
} from '../Reducers/AdminReducer';


const instance = axios.create({
    baseURL:"https://dashboard-love-spark-backend.vercel.app/api/Admin/"   //Api Base Url
});


//Login User
export const LoginUser = createAsyncThunk('Admin/Login',async(loginData:{Email:string,Password:string},{ dispatch }: { dispatch: Dispatch })=>{
    try {
        dispatch(loginRequest());
        const route = '/Login';
        const config = {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        };
        const { data } = await instance.post(route, loginData, config);
        dispatch(loginSuccess(data.user));
        return { success: true }; // Return success status
    } catch (error:any) {
       dispatch(loginFail(error.response.data.message));
    }
});


//Register User
export const RegisterUser = createAsyncThunk('Admin/register',async(registerData:{Name:string,Email:string,Password:string,ProfileUrl:string,confirmPassword:string,},{ dispatch }: { dispatch: Dispatch })=>{
    try {
        dispatch(registerRequest());
        const route = '/Register';
        const config = {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        };
        const { data } = await instance.post(route,registerData, config);
        dispatch(registerSuccess(data.user));
        return {Success:true};

    } catch (error:any) {
      dispatch(registerFail(error.response.data.message));
    }
});

//Logout User
export const LogoutUser = createAsyncThunk('Admin/Logout',async(_,{ dispatch })=>{
    try {
        const route = `/Logout`;
        const config =  {headers:{"Content-Type":"application/json"},withCredentials: true};
        await instance.get(route,config);
        dispatch(logoutSuccess());
        return { success: true }; // Return success status
    } catch (error:any) {
        dispatch(logoutFail(error.response.data.message))
    }
});


//Update Userdetails
export const UpdateUser = createAsyncThunk('user/Update',async(Body:{ Email:string, Password:string, NewEmail?:string, NewPassword?:string, NewProfileUrl?:string },{ dispatch }: { dispatch: Dispatch })=>{
 try {
    const route = `/UpdateInfo`;
    const config =  {headers:{"Content-Type":"application/json"},withCredentials: true};
    const {data} = await instance.put(route,Body,config)   
     dispatch(updateSuccess(data.updatedAdmin));
     return { success: true }; // Return success status
 } catch (error:any) {
     dispatch(updateFail(error.response.data.message));
     console.log(error);
 }
});

//Load User On Reload
export const Loaduser = createAsyncThunk('user/Load', async (_, { dispatch }) => {
    try {
      dispatch(loadrequest());
      const route = `/Info`;
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      const { data } = await instance.get(route, config);
      dispatch(loadsuccess(data.AdminInfo));
    } catch (error:any){
      dispatch(loadFail(error.response.data.message));
      console.log(error);
    }
  });