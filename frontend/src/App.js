import './App.css';
import AppBar from "./components/AppBar"
import FoodPage from "./components/order.component"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register.component"
import Login from "./components/Login.component"

function App() {
  return (
    <div className="container">
      <AppBar/>
      <BrowserRouter>
      <Routes>
          <Route path="/food" element={<FoodPage/>}/>
          <Route path="/signup" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
