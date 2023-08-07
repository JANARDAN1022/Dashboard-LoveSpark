export interface Admin {
    AdminName:string,
    Email:string,
    ProfileUrl:any,
    _V:number,
    _id:string,
}

export interface AdminState {
    loading:boolean,
    isAuthenticated:boolean,
    Admin:Admin | null,
    error?:any
}

