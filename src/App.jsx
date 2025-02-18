import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import Navbar from "./containters/Navbar"; 
import Home from "./containters/Home"; 
import EmployeeTable from "./containters/EmployeeTable";
import StudentTable from "./pages/student/studentTable.jsx";
import TeacherTable from "./pages/Teacher/TeacherTable.jsx"
import FormsTable from "./pages/Forms/Forms";
import AreaTable from "./pages/Area/area"; 
import Subject from "./pages/Subject/Subject.jsx";
import FAQS from "./pages/Faq/faq";
import StudentFeedback from "./pages/student/studentFeedback.jsx";
import TeacherFeedback from "./pages/Teacher/teacherFeedback.jsx";

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
            <Route path="/student" element={<StudentTable />} />
            <Route path="/teacher" element={<TeacherTable />} />
            <Route path="/forms" element={<FormsTable/>} />
            <Route path="/area" element={<AreaTable />} />
            <Route path="/subject" element={<Subject/>}/>
            <Route path="/faq" element={<FAQS/>}/>
            <Route path="/StudentFeedback" element={<StudentFeedback/>}/>
            <Route path="/TeacherFeedback" element={<TeacherFeedback/>}/>
            {/* Add more routes for other components as needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
