import React from "react";

export default function Unauthorized() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold text-red-600">
        🚫 غير مصرح لك بالدخول
      </h1>
      <p className="mt-4">ليس لديك صلاحية للوصول إلى هذه الصفحة.</p>
    </div>
  );
}
