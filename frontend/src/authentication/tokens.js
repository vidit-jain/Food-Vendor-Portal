import axios from "axios"
const setToken = () => {
    let token = "";
    try {
      token = window.localStorage.getItem("Authorization");  
    } catch {}
    axios.defaults.headers.common["Authorization"] = token;
}
const logout = () => {
    let token = "";
    try {
      token = window.localStorage.removeItem("Authorization");  
    } catch {}
    delete axios.defaults.headers.common["Authorization"];
}

export {setToken, logout}