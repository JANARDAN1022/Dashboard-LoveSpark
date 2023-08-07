import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {Admin,AdminState}  from '../Types/AdminTypes';


const initialState:AdminState ={
    loading: false,
    isAuthenticated: false,
    Admin:{} as Admin,
}

const Req = (state:AdminState)=>{
    state.loading=true;
    state.isAuthenticated=false;
}

const Success = (state:AdminState,action:PayloadAction<Admin>)=>{
    state.loading=false;
    state.isAuthenticated=true;
    state.Admin= action.payload;
}

const Fail = (state:AdminState,action:PayloadAction<string>)=>{
    state.loading=false;
    state.isAuthenticated=false;
    state.Admin=null;
    state.error=action.payload;
}

const AdminSlice = createSlice({
    name:'Admin',
    initialState,
    reducers:{
       loginRequest:Req,
       registerRequest:Req,
       loadrequest:Req,
        loginSuccess:Success,
        registerSuccess:Success,
        loadsuccess:Success,
        updateSuccess:Success,
        loginFail:Fail,
        registerFail:Fail,
        loadFail:Fail,
        logoutSuccess:(state)=>{
         state.loading=false;
         state.isAuthenticated=false;
         state.Admin=null;
        },
        logoutFail:(state,action:PayloadAction<any>)=>{
            state.loading=false;
            state.error=action.payload;
        },
        updateFail:(state,action:PayloadAction<any>)=>{
              state.loading=false;
              state.isAuthenticated=true;
              state.error=action.payload;
        }    
    }
});

export const {loadFail,loadrequest,loadsuccess,loginFail,loginRequest,loginSuccess,logoutFail,logoutSuccess,registerFail,registerRequest,registerSuccess,updateSuccess,updateFail} = AdminSlice.actions;

export default AdminSlice.reducer;