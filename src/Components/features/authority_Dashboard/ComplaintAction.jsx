import React, { forwardRef, useState } from "react";
import { updateComplaintStatus } from "../../services/complaintsService";
import { toast } from "react-toastify";

const ComplainAction = forwardRef(({ complaint, onStatusChange }, ref) => {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!complaint) return null;

  const handleStatusChange = async (newStatus) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      console.log(`Updating status to: ${newStatus}`);
      const result = await updateComplaintStatus(complaint.id, newStatus);
      console.log("Update result:", result);

      if (result.success) {
        toast.success(`تم تحديث حالة الشكوى إلى: ${newStatus}`);
        onStatusChange(complaint.id, newStatus);
        ref.current.close();
      } else {
        throw new Error(result.error || "فشل تحديث حالة الشكوى");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error(`خطأ في تحديث الحالة: ${err.message}`);
    } finally {
      setIsUpdating(false);
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

        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => handleStatusChange("قيد المعالجة")}
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
