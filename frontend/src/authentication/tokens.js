import axios from "axios"
const setToken = () => {
    let token = "";
    try {
      token = window.localStorage.getItem("Authorization");  
    } catch {}
    axios.defaults.headers.common["Authorization"] = token;
}

export {setToken}