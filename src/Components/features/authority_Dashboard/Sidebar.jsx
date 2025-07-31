import { NavLink } from "react-router-dom";

const sidebarItems = [
  { label: "الرئيسية", icon: "🏠", href: "/dashboard" },
  { label: "الشكاوى", icon: "📝", href: "complaints" },
  { label: "التقارير", icon: "📈", href: "complaint-reports" },
];

export default function Sidebar() {
  return (
    <aside className="h-screen w-full bg-blue text-white shadow-lg border-r">
      <div className="p-4 text-center text-xl font-bold ">لوحة التحكم</div>
      <nav className="flex flex-col p-4 space-y-2">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-100 ${
                isActive ? "bg-blue-200 font-semibold" : ""
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
