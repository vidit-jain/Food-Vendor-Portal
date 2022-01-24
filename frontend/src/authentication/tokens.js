import axios from "axios"
const setToken = () => {
    let token = "";
    try {
      token = window.localStorage.getItem("Authorization");  
    } catch { return 1;}
    axios.defaults.headers.common["Authorization"] = token;
    if (token == null) return 1;
    return 0;
}
const logout = () => {
    let token = "";
    try {
      token = window.localStorage.removeItem("Authorization");  
    } catch {}
    delete axios.defaults.headers.common["Authorization"];
}

export {setToken, logout}