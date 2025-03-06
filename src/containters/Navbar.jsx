import {
  LayoutDashboard,
  Boxes,
  Package,
  Settings,
  LifeBuoy,
  BookText,
  BookPlus,
  LandPlot,
  BookCopy,
  TableOfContents,
  MessagesSquare,
  Users,
} from "lucide-react"; // Add all necessary imports
import { Link } from "react-router-dom"; // Import Link for routing

import logo from "../../public/pringlelogosvg.svg"

export default function Navbar() {
  return (
    <aside className="h-screen w-64">
      <nav className="h-full flex flex-col bg-white border-r ">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img className="w-8" src={logo} alt="logo" />
          <div className="text-lg font-bold">Pringle Home Tuition</div>
        </div>
        <ul className="flex-1 px-3">
          <SidebarItem
            icon={<Boxes size={20} />}
            text="Student"
            to="/Student"
          />
          <SidebarItem
            icon={<Package size={20} />}
            text="Teacher"
            to="/teacher"
          />

          <SidebarItem icon={<BookText size={20} />} text="Form" to="/forms" />
          <SidebarItem icon={<LandPlot size={20} />} text="Area" to="/area" />
          <SidebarItem
            icon={<BookCopy size={20} />}
            text="Subject"
            to="/subject"
          />
          <SidebarItem
            icon={<TableOfContents size={20} />}
            text="FAQ's"
            to="/faq"
          />
          <SidebarItem
            icon={<MessagesSquare size={20} />}
            text="Student Feedback"
            to="/StudentFeedback"
          />
          <SidebarItem
            icon={<MessagesSquare size={20} />}
            text="Teacher Feedback"
            to="/TeacherFeedback"
          />
          <SidebarItem
            icon={<Users size={20} />}
            text="Vacancy"
            to="/Vacancy"
          />
          <hr className="my-3" />
        </ul>
      </nav>
    </aside>
  );
}

// SidebarItem Component
export function SidebarItem({ icon, text, to }) {
  return (
    <li className="relative flex flex-col items-start py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group">
      {to ? (
        <Link to={to} className="w-full block">
          <div className="flex items-center">
            {icon}
            <span className="ml-3">{text}</span>
          </div>
        </Link> // Wrap with Link if "to" is passed
      ) : (
        <div className="flex items-center">
          {icon}
          <span className="ml-3">{text}</span>
        </div> // Otherwise just render the content normally
      )}
    </li>
  );
}
