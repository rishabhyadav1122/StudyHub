import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import {Sidebar} from "./Sidebar";

export const Layout = ({children}) => {
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen  flex flex-col">
      {/* Navbar remains on top */}
      <Navbar />

      {/* Main content area with Sidebar and page content */}
      <div className="flex flex-1 pt-1">
        {/* Sidebar (fixed on desktop, toggled on mobile) */}
        <Sidebar />

        {/* Page Content with left margin to avoid overlap on desktop */}
        <div className="flex-1  lg:ml-16">
        {children}
        </div>
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};
