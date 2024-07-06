import axios from "axios";

// const REST_API_BASE_URL = 'http://localhost:8080/api/user';

// export const createUser = (user) => axios.post(REST_API_BASE_URL,user);

class UsersService{
    static BASE_URL = "http://localhost:8080"

    static async login(email,password){
        try{
            const response = await axios.post(`${UsersService.BASE_URL}/auth/login`,{email,password})
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async register(userData,token){
        try{
            const response = await axios.post(`${UsersService.BASE_URL}/auth/register`,userData,
            {
              headers:{Authorization:`Bearer ${token}`}

            })
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async getAllUsers(token){
        try{
            const response = await axios.get(`${UsersService.BASE_URL}/admin/get-all-users`,userData,
            {
              headers:{Authorization:`Bearer ${token}`}

            })
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async getYourProfile(token){
        try{
            const response = await axios.get(`${UsersService.BASE_URL}/adminuser/get-profile`,
            {
              headers:{Authorization:`Bearer ${token}`}

            })
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async getUSerById(userId,token){
        try{
            const response = await axios.get(`${UsersService.BASE_URL}/admin/get-user/${userId}`,
            {
              headers:{Authorization:`Bearer ${token}`}

            })
            return response.data;

        }catch(err){
            throw err;
        }
    }

    
    static async deleteUSer(userId,token){
        try{
            const response = await axios.delete(`${UsersService.BASE_URL}/admin/delete/${userId}`,
            {
              headers:{Authorization:`Bearer ${token}`}

            })
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static async updateUSer(userId, userData ,token){
        try{
            const response = await axios.delete(`${UsersService.BASE_URL}/admin/delete/${userId}`,
            {
              headers:{Authorization:`Bearer ${token}`}

            })
            return response.data;

        }catch(err){
            throw err;
        }
    }

    static logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }

    static isAuthenticated(){
        const token =  localStorage.getItem('token') 
        return !! token
    }

    static isAdmin(){
        const role =  localStorage.getItem('role') 
        return role === 'ADMIN'
    }
    static getRole() {
        return localStorage.getItem('role');
    }
    
    static isUser(){
        const role =  localStorage.getItem('role') 
        return role === 'USER'
    }
    static isHdfc(){
        const role =  localStorage.getItem('role')
        return role === 'HDFC'
    }
    static isIcici(){
        const role =  localStorage.getItem('role')
        return role === 'ICICI'
    }
    static isMis(){
        const role = localStorage.getItem('role')
        return role === 'MIS'
    }
    static adminOnly(){
        
        return this.isAuthenticated() && this.isAdmin();
    }
    static userOnly(){
        return this.isAuthenticated() && this.isUser();
    }
    static hdfcOnly(){
        return this.isAuthenticated() && this.isHdfc();
    
    }
    static iciciOnly(){
        return this.isAuthenticated() && this.isIcici();
    }
    static misOnly(){
        return this.isAuthenticated() && this.isMis();
    }
}

export default UsersService;