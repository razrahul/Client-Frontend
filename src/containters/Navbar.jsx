import { MoreVertical, ChevronLast, ChevronFirst, LogOut, LayoutDashboard, BarChart, UserCircle, Boxes, Package, Receipt, Settings, LifeBuoy } from "lucide-react"; // Add all necessary imports
import { useState, useContext, createContext } from "react";
import { Link } from "react-router-dom"; // Import Link for routing

// Create SidebarContext
const SidebarContext = createContext();

export default function Navbar() {
  const [expanded, setExpanded] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null); // Track which dropdown is open
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Function to toggle the sidebar dropdown 
  const toggleDropdown = (section) => {
    setActiveDropdown((prev) => (prev === section ? null : section));
  };

  // Logout function 
  const handleLogout = () => {
    console.log("Logged out!");
    // Add your logout functionality here
    window.location.reload();
  };

  return (
    <aside className={`h-screen ${expanded ? "w-64" : "w-20"}`}>
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src=""
            className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
            alt="Techtime.ai"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Provide expanded state and setter to the context */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            <SidebarItem
              icon={<LayoutDashboard size={20} />} // LayoutDashboard icon
              text="Dashboard"
              to="/"
            />
            <SidebarItem
              icon={<BarChart size={20} />}
              text="Statistics"
              section="statistics"
              toggleDropdown={toggleDropdown} // ✅ Only pass it here
              isActive={activeDropdown === "statistics"}
            >
              <SidebarItem
                icon={<UserCircle size={18} />}
                text="Statistics 1"
                to="/statistics-1" // Link to /statistics-1
              />
              <SidebarItem
                icon={<UserCircle size={18} />}
                text="Statistics 2"
              />
            </SidebarItem>
            <SidebarItem icon={<Boxes size={20} />} text="Inventory" to="/area" />
            <SidebarItem icon={<Package size={20} />} text="Orders" />
            <SidebarItem icon={<Receipt size={20} />} text="Billing" />
            <hr className="my-3" />
            <SidebarItem icon={<Settings size={20} />} text="Settings" />
            <SidebarItem icon={<LifeBuoy size={20} />} text="Help" />
          </ul>
        </SidebarContext.Provider>

        {/* User Profile Section */}
        <div className="border-t flex p-3 relative">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt="User Avatar"
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">Abhyudya</h4>
              <span className="text-xs text-gray-600">abhyudya@gmail.com</span>
            </div>
            <MoreVertical
              size={20}
              onClick={() => setShowProfileMenu((prev) => !prev)} // Toggle profile menu visibility
              className="cursor-pointer"
            />
          </div>

          {/* Profile Menu  */}
          {showProfileMenu && (
            <div className="absolute top-0 right-0 bg-white shadow-lg rounded-md w-40">
              <button
                className="w-full text-left py-2 px-3 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md flex items-center justify-start space-x-2"
                onClick={handleLogout}
              >
                <LogOut size={16} /> {/* Add logout icon */}
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

// SidebarItem Component 
export function SidebarItem({ icon, text, active, alert, section, children, toggleDropdown, isActive, to }) {
  const { expanded } = useContext(SidebarContext);

  const Content = (
    <div className="flex items-center" onClick={() => section && toggleDropdown(section)}>
      {icon}
      <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
        {text}
      </span>
    </div>
  );

  // If "to" prop exists, wrap with a Link component for routing
  return (
    <li className="relative flex flex-col items-start py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group">
      {to ? (
        <Link to={to} className="w-full block">{Content}</Link> // Wrap with Link if "to" is passed
      ) : (
        Content // Otherwise just render the content normally
      )}

      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`}
        />
      )}

      {/* Show dropdown items if section is active */}
      {isActive && expanded && (
        <ul className="pl-6 mt-2 space-y-1">{children}</ul>
      )}

      {!expanded && (
        <div
          className="absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
        >
          {text}
        </div>
      )}
    </li>
  );
}