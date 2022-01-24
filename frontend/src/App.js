import './App.css';
import AppBar from "./components/AppBar"
import FoodPage from "./components/order.component"
import { BrowserRouter, Routes, Route, Outlet} from "react-router-dom";
import Register from "./components/Register.component"
import Profile from "./components/Profile.component"
import Login from "./components/Login.component"
import Wallet from "./components/Wallet.component"
import BuyerDashboard from "./components/Dashboard.component"

const Skeleton = () => {
  return (
    <div>
      <AppBar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};
function App() {
  return (
    <div className="container">
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Skeleton/>}>
          <Route path="/food" element={<FoodPage/>}/>
          <Route path="/signup" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/wallet" element={<Wallet/>}/>
          <Route path="/dashboard" element={<BuyerDashboard/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
