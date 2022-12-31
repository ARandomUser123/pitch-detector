import Main from "./components/Main";
import MyNav from "./components/Navbar";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <MyNav />
        <Main />
      </BrowserRouter>
    </div>
  );
}

export default App;
