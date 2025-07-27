import React from "react";
import ComplaintsTable from "../Components/features/authority_Dashboard/ComplaintsTable";
import { useEffect, useState } from "react";
import { getComplaintsByDepartment } from "../Components/services/complaintsService";
import ComplaintModal from "../Components/features/authority_Dashboard/ComplaintModal";

function Complaints({ ministry }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    setLoading(true);
    getComplaintsByDepartment("وزارة الثقافة")
      .then((complaints) => {
        setData(complaints);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("فشل تحميل البيانات");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDetails = (complaint) => {
    console.log(complaint);

    setSelectedComplaint(complaint);
    document.getElementById("my_modal_3").showModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-40">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ComplaintsTable complaints={data} onDetails={handleDetails} />
      <ComplaintModal complaint={selectedComplaint} />
    </>
  );
}

export default Complaints;
