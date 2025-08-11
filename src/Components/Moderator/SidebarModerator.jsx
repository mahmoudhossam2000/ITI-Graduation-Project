import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, Users } from "lucide-react";

const SidebarModerator = () => {
  return (
    <aside className="w-64 h-screen bg-darkTeal text-white p-6 flex flex-col fixed shadow-xl">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-mustard">لوحة التحكم</h2>
      </div>
      
      <nav className="space-y-3 flex-1">
        <SidebarLink to="/moderator/dashboard" icon={<Home size={20} />} label="الرئيسية" />
        <SidebarLink to="/moderator/complaints" icon={<FileText size={20} />} label="الشكاوى" />
        <SidebarLink to="/moderator/users" icon={<Users size={20} />} label="المواطنين" />
      </nav>
      
      <div className="pt-4 border-t border-blue/30">
        <div className="flex items-center gap-3 text-cream/80 hover:text-white transition">
          <div className="w-8 h-8 rounded-full bg-mustard flex items-center justify-center text-darkTeal font-bold">م</div>
          <span className="text-sm">حساب المشرف</span>
        </div>
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 p-3 rounded-lg transition-all
        ${isActive 
          ? 'bg-blue text-white shadow-md' 
          : 'text-cream/80 hover:bg-blue/30 hover:text-white'}
      `}
    >
      <div className={`p-1.5 rounded-md ${isActive ? 'bg-mustard text-darkTeal' : 'bg-blue/20'}`}>
        {icon}
      </div>
      <span className="font-medium">{label}</span>
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-mustard"></div>
      )}
    </Link>
  );
};

export default SidebarModerator;