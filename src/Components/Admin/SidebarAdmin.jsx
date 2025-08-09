import React from "react";

const sidebarItems = [
  { key: "create", label: "إضافة حساب جديد", icon: "➕" },
  { key: "list", label: "الحسابات المسجلة", icon: "📋" },
];

export default function SidebarAdmin({ activeTab, onSelect, email }) {
  return (
    <aside className="h-screen w-80 bg-blue text-white shadow-lg border-r rounded-xl p-5">
      <div className="text-center text-2xl font-bold mb-6">لوحة التحكم</div>
      <nav className="flex flex-col space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`flex items-center gap-3 px-4 py-2 rounded text-right transition-colors
              ${
                activeTab === item.key
                  ? "bg-blue-200 text-blue font-semibold"
                  : "hover:bg-blue-100/20"
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
