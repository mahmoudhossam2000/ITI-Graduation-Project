// import React, { useEffect, useState } from "react";
// import { ComposableMap, Geographies, Geography } from "react-simple-maps";
// import { scaleLinear } from "d3-scale";
// import { getComplaintsForMinistry } from "../../../services/complaintsService";

// const geoUrl =
//   "https://raw.githubusercontent.com/egyptmaps/geojson-egypt/master/egypt.json";

// export default function GovernoratesMap({ userData }) {
//   const [complaintsByGov, setComplaintsByGov] = useState({});
//   const [tooltip, setTooltip] = useState("");

//   useEffect(() => {
//     if (userData?.role === "ministry" && userData.ministry) {
//       getComplaintsForMinistry(userData.ministry).then((data) => {
//         const grouped = {};
//         data.forEach((c) => {
//           const gov = c.governorate || "غير محدد";
//           grouped[gov] = (grouped[gov] || 0) + 1;
//         });
//         setComplaintsByGov(grouped);
//       });
//     }  
//   }, [userData]);

//   const maxValue = Math.max(...Object.values(complaintsByGov), 0);
//   const colorScale = scaleLinear()
//     .domain([0, maxValue])
//     .range(["#e0f7fa", "#006064"]);

//   return (
//     <div className="bg-white dark:bg-black p-4 rounded-xl shadow">
//       <h3 className="mb-3 text-lg font-bold">الخريطة التفاعلية للمحافظات</h3>
//       <ComposableMap
//         projection="geoMercator"
//         projectionConfig={{ scale: 1500, center: [30.8, 26.8] }}
//       >
//         <Geographies geography={geoUrl}>
//           {({ geographies }) =>
//             geographies.map((geo) => {
//               const govName = geo.properties.NAME_AR;
//               const value = complaintsByGov[govName] || 0;
//               return (
//                 <Geography
//                   key={geo.rsmKey}
//                   geography={geo}
//                   onMouseEnter={() => setTooltip(`${govName} - ${value} شكوى`)}
//                   onMouseLeave={() => setTooltip("")}
//                   style={{
//                     default: {
//                       fill: colorScale(value),
//                       outline: "none",
//                     },
//                     hover: {
//                       fill: "#f50057",
//                       outline: "none",
//                     },
//                     pressed: {
//                       fill: "#f50057",
//                       outline: "none",
//                     },
//                   }}
//                 />
//               );
//             })
//           }
//         </Geographies>
//       </ComposableMap>
//       {tooltip && (
//         <div className="mt-3 text-center text-sm text-gray-700 dark:text-gray-300">
//           {tooltip}
//         </div>
//       )}
//     </div>
//   );
// }
