import React, { useRef } from "react";
import ComplaintsTable from "../Components/features/authority_Dashboard/ComplaintsTable";
import { useEffect, useState } from "react";
import { getComplaintsByDepartment } from "../Components/services/complaintsService";
import ComplainAction from "../Components/features/authority_Dashboard/ComplaintAction";
import ComplaintDetails from "../Components/features/authority_Dashboard/ComplaintDetails";

function Complaints({ ministry }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const detailsRef = useRef(null);
  const actionRef = useRef(null);
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

  // handlers
  const handleDetails = (complaint) => {
    console.log(detailsRef.current);
    setSelectedComplaint(complaint);
    setTimeout(() => {
      if (detailsRef.current) {
        detailsRef.current.showModal();
      }
    }, 0);
  };

  const handleAction = (complaint) => {
    console.log(complaint);
    setSelectedComplaint(complaint);
    setTimeout(() => {
      if (actionRef.current) {
        actionRef.current?.showModal();
      }
    }, 0);
  };

  // update status
  const updateLocalStatus = (id, newStatus) => {
    setData((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
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
      <ComplaintDetails ref={detailsRef} complaint={selectedComplaint} />
      <ComplainAction
        ref={actionRef}
        complaint={selectedComplaint}
        onStatusChange={updateLocalStatus}
      />
      <ComplaintsTable
        complaints={data}
        onDetails={handleDetails}
        onAction={handleAction}
      />
    </>
  );
}

export default Complaints;
