import './App.css';
import AppBar from "./components/AppBar"
import FoodPage from "./components/order.component"
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="container">
      <AppBar/>
      <BrowserRouter>
      <Routes>
          <Route path="/food" element={<FoodPage/>}>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
