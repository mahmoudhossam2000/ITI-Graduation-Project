export default function ComplaintModal({ complaint }) {
  if (!complaint) return null;

  console.log(complaint);

  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="flex justify-center">
          <h3 className="font-bold text-lg">تفاصيل الشكوى</h3>
        </div>
        <div className="py-4 space-y-2">
          <p className="">
            <strong>الاسم:</strong> {complaint.name}
          </p>
          <p>
            <strong>الوصف:</strong> {complaint.description}
          </p>
          <p>
            <strong>الوزارة:</strong> {complaint.ministry}
          </p>
          <p>
            <strong>المحافظة:</strong> {complaint.governorate}
          </p>
          <p>
            <strong>الرقم القومي:</strong> {complaint.nationalId}
          </p>
          <p>
            <strong>تاريخ الإنشاء:</strong>
            {"  "}
            {complaint.createdAt?.toDate
              ? complaint.createdAt.toDate().toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}{" "}
          </p>
        </div>
      </div>
    </dialog>
  );
}
