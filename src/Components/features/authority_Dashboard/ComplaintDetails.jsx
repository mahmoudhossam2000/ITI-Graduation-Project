import React, { forwardRef } from "react";

const ComplaintDetails = forwardRef(({ complaint }, ref) => {
  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        {complaint ? (
          <>
            <h3 className="font-bold text-lg">تفاصيل الشكوى</h3>
            <p>الاسم: {complaint.name}</p>
            <p>الوصف: {complaint.description}</p>
          </>
        ) : (
          <p>جاري تحميل البيانات...</p>
        )}
        <form method="dialog" className="modal-action">
          <button className="btn">إغلاق</button>
        </form>
      </div>
    </dialog>
  );
});

export default ComplaintDetails;
