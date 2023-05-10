import jwtDecode from "jwt-decode";

export class jwtUtils {
    static isAuth = (token) =>{
        if(!token) {
            return false;
        }
        const decoded = jwtDecode(token);
        console.log(decoded);
    }

    static getId = (token) => {
        const decoded = jwtDecode(token);
    }
}