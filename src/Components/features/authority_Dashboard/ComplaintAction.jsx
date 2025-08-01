import React, { forwardRef } from "react";
import { updateComplaintStatus } from "../../services/complaintsService";

const ComplainAction = forwardRef(({ complaint, onStatusChange }, ref) => {
  if (!complaint) return null;

  const handleStatusChange = async (newStatus) => {
    try {
      await updateComplaintStatus(complaint.id, newStatus);
      onStatusChange(complaint.id, newStatus); // تحديث الـ state في الجدول
      ref.current.close();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">إدارة حالة الشكوى</h3>

        {/* ✅ الخطوات */}
        <ul className="steps steps-vertical mb-4">
          <li
            className={`step ${
              complaint.status === "قيد المراجعة" ||
              complaint.status === "جارى الحل" ||
              complaint.status === "تم الحل"
                ? "step-primary"
                : ""
            }`}
          >
            قيد المعالجة
          </li>
          <li
            className={`step ${
              complaint.status === "جارى الحل" || complaint.status === "تم الحل"
                ? "step-primary"
                : ""
            }`}
          >
            جاري حل المشكلة
          </li>
          <li
            className={`step ${
              complaint.status === "تم الحل" || complaint.status === "مرفوضة"
                ? "step-primary"
                : ""
            }`}
          >
            تم حل المشكلة / مرفوضة
          </li>
        </ul>

        {/* ✅ أزرار التحكم */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => handleStatusChange("قيد المراجعة")}
            className="btn btn-sm"
          >
            قيد المعالجة
          </button>
          <button
            onClick={() => handleStatusChange("جارى الحل")}
            className="btn btn-sm btn-warning"
          >
            جاري الحل
          </button>
          <button
            onClick={() => handleStatusChange("تم الحل")}
            className="btn btn-sm btn-success"
          >
            تم الحل
          </button>
          <button
            onClick={() => handleStatusChange("مرفوضة")}
            className="btn btn-sm btn-error"
          >
            رفض
          </button>
        </div>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn">إغلاق</button>
          </form>
        </div>
      </div>
    </dialog>
  );
});

export default ComplainAction;
