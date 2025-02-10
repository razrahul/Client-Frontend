import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import routing components
import Navbar from "./containters/Navbar"; // Import Navbar
import Home from "./containters/Home"; // Import Home component
import EmployeeTable from "./containters/EmployeeTable"; // Import EmployeeTable component
import AreaTable from "./pages/Area/AreaTable"; // Import AreaTable component
import TeacherTable from "./pages/Teacher/Teacher"
import FormsTable from "./pages/Forms/Forms";

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Navbar with Sidebar (static part) */}
        <Navbar />

        {/* Main content */}
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/statistics-1" element={<EmployeeTable />} /> {/* Route for EmployeeTable */}
            <Route path="/area" element={<AreaTable />} />
            <Route path="/teacher" element={<TeacherTable />} />
            <Route path="/forms" element={<FormsTable/>} />
            {/* Add more routes for other components as needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
