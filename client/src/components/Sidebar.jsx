import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { FaUsers, FaChair, FaExchangeAlt, FaCogs, FaEllipsisH } from "react-icons/fa";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sidebar for Large Screens (Hover to Expand) */}
      <div
        className="
          hidden
          lg:flex
          flex-col
          bg-gray-900
          text-white
          w-16
          hover:w-64
          transition-all
          duration-300
          fixed
          top-16
          left-0
          h-[calc(100%-4rem)]
          p-4
          z-40
          group
        "
      >
        <div className="space-y-4 mt-4">
          <SidebarLink to="/students" icon={<FaUsers />} label="All Students" />
          <SidebarLink to="/seats" icon={<FaChair />} label="All Seats" />
          <SidebarLink to="/transactions" icon={<FaExchangeAlt />} label="All Transactions" />
          <SidebarLink to="/updateConfig" icon={<FaCogs />} label="Seat Config Update" />
          <SidebarLink to="/logout" icon={<FaEllipsisH />} label="Logout" />
        </div>
      </div>

      {/* Mobile Sidebar Toggle (Hamburger) */}      
      <div className="lg:hidden absolute top-4 left-4 z-50">
        <FiMenu
          size={24}
          className="text-white cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {/* Mobile Sidebar Drawer */}      
      {isOpen && (
        <div className="lg:hidden fixed top-0 left-0 w-64 bg-gray-900 text-white h-full p-4 shadow-lg z-50">
          <button className="text-white text-2xl" onClick={() => setIsOpen(false)}>✖</button>
          <div className="space-y-4 mt-6">
            <SidebarLinkMobile to="/students" icon={<FaUsers />} label="All Students" />
            <SidebarLinkMobile to="/seats" icon={<FaChair />} label="All Seats" />
            <SidebarLinkMobile to="/transactions" icon={<FaExchangeAlt />} label="All Transactions" />
            <SidebarLinkMobile to="/updateConfig" icon={<FaCogs />} label="Seat Config Update" />
            <SidebarLinkMobile to="/logout" icon={<FaEllipsisH />} label="Logout" />
          </div>
        </div>
      )}
    </>
  );
};

// Desktop version - labels only show on hover
const SidebarLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-700 transition-all"
  >
    <span className="text-xl">{icon}</span>
    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 truncate">
      {label}
    </span>
  </Link>
);

// Mobile version - labels always visible
const SidebarLinkMobile = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-700 transition-all"
  >
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </Link>
);