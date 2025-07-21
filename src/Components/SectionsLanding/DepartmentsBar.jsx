import React from "react";
import department1 from "../../assets/images/education.jpeg";
import department2 from "../../assets/images/electricity.jpeg";
import department3 from "../../assets/images/health.jpeg";
import department4 from "../../assets/images/higher_education.jpeg";
import department5 from "../../assets/images/housing.jpeg";
import department6 from "../../assets/images/Interior.jpeg";
import department7 from "../../assets/images/justice.jpeg";
import department8 from "../../assets/images/supply.jpeg";
import department9 from "../../assets/images/transport.jpeg";
import department10 from "../../assets/images/water.png";

export default function DepartmentsBar() {
  const departments = [
    department1, department2, department3, department4, department5,
    department6, department7, department8, department9, department10,
    department1, department2, department3, department7, department8,
  ];

  return (
    <section className="bottom-bar-wrapper position-relative py-10">
      <h2 className="text-4xl font-bold text-center pb-5 italic">
        الجهات المشاركة في المنصة
      </h2>
      <div className="bottom-bar d-flex mt-5">
        {departments.map((img, i) => (
          <img key={i} src={img} alt="department" />
        ))}
      </div>
    </section>
  );
}
