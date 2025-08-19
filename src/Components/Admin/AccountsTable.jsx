import React from "react";
import { 
  FaTrash, 
  FaBan, 
  FaCheck, 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaLandmark, 
  FaEdit 
} from "react-icons/fa";

const AccountsTable = ({ 
  accounts, 
  accountType, 
  isFetching, 
  onEdit, 
  onToggleBan, 
  onDelete 
}) => {
  const getAccountTypeConfig = () => {
    switch (accountType) {
      case "department":
        return {
          title: "حسابات الإدارات",
          icon: <FaBuilding className="ml-2 text-blue-600" />,
          emptyIcon: <FaBuilding className="mx-auto h-12 w-12" />,
          emptyMessage: "لا توجد حسابات إدارات مسجلة",
          spinnerColor: "border-blue-500",
          columns: ["الحساب", "النوع", "اسم الإدارة", "المحافظة", "الحالة", "الإجراءات"]
        };
      case "governorate":
        return {
          title: "حسابات المحافظات",
          icon: <FaMapMarkerAlt className="ml-2 text-green-600" />,
          emptyIcon: <FaMapMarkerAlt className="mx-auto h-12 w-12" />,
          emptyMessage: "لا توجد حسابات محافظات مسجلة",
          spinnerColor: "border-green-500",
          columns: ["الحساب", "النوع", "اسم المحافظة", "الحالة", "الإجراءات"]
        };
      case "ministry":
        return {
          title: "حسابات الوزارات",
          icon: <FaLandmark className="ml-2 text-purple-600" />,
          emptyIcon: <FaLandmark className="mx-auto h-12 w-12" />,
          emptyMessage: "لا توجد حسابات وزارات مسجلة",
          spinnerColor: "border-purple-500",
          columns: ["الحساب", "النوع", "اسم الوزارة", "الحالة", "الإجراءات"]
        };
      default:
        return {
          title: "الحسابات",
          icon: <FaBuilding className="ml-2 text-gray-600" />,
          emptyIcon: <FaBuilding className="mx-auto h-12 w-12" />,
          emptyMessage: "لا توجد حسابات مسجلة",
          spinnerColor: "border-gray-500",
          columns: ["الحساب", "النوع", "التفاصيل", "الحالة", "الإجراءات"]
        };
    }
  };

  const config = getAccountTypeConfig();

  const renderAccountTypeIcon = (account) => {
    if (account.collection === "departmentAccounts") {
      return <FaBuilding className="ml-2 text-blue-500" />;
    } else if (account.collection === "governorateAccounts") {
      return <FaMapMarkerAlt className="ml-2 text-green-500" />;
    } else if (account.collection === "ministryAccounts") {
      return <FaLandmark className="ml-2 text-purple-500" />;
    }
    return <FaBuilding className="ml-2 text-gray-500" />;
  };

  const renderAccountTypeName = (account) => {
    if (account.collection === "departmentAccounts") {
      return "إدارة";
    } else if (account.collection === "governorateAccounts") {
      return "محافظة";
    } else if (account.collection === "ministryAccounts") {
      return "وزارة";
    }
    return "غير محدد";
  };

  const renderAccountDetails = (account) => {
    if (accountType === "department") {
      return (
        <>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">
              {account.department}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">
              {account.governorate}
            </div>
          </td>
        </>
      );
    } else if (accountType === "governorate") {
      return (
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {account.governorate}
          </div>
        </td>
      );
    } else if (accountType === "ministry") {
      return (
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {account.ministry}
          </div>
        </td>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          {config.icon}
          {config.title}
        </h2>
        <div className="text-sm text-gray-500">
          إجمالي الحسابات:{" "}
          <span className="font-medium">{accounts.length}</span>
        </div>
      </div>

      {isFetching ? (
        <div className="flex justify-center items-center h-40">
          <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${config.spinnerColor}`}></div>
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-gray-400 mb-2">
            {config.emptyIcon}
          </div>
          <p className="text-gray-500">{config.emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {config.columns.map((column, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.map((account) => (
                <tr
                  key={account.id}
                  className={account.banned ? "bg-red-50" : "hover:bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {account.email}
                    </div>
                    <div className="text-xs text-gray-500">
                      {account.createdAt?.toDate
                        ? new Date(
                            account.createdAt.toDate()
                          ).toLocaleDateString("ar-EG")
                        : "غير معروف"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {renderAccountTypeIcon(account)}
                      <span>{renderAccountTypeName(account)}</span>
                    </div>
                  </td>
                  {renderAccountDetails(account)}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {account.banned ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        محظور
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        نشط
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() => onEdit(account)}
                        className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        title="تعديل"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() =>
                          onToggleBan(
                            account.id,
                            account.uid,
                            !account.banned,
                            account.collection
                          )
                        }
                        className={`p-2 rounded-md ${
                          account.banned
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        } transition-colors`}
                        title={account.banned ? "فك الحظر" : "حظر"}
                      >
                        {account.banned ? <FaCheck /> : <FaBan />}
                      </button>
                      <button
                        onClick={() =>
                          onDelete(
                            account.id,
                            account.uid,
                            account.collection
                          )
                        }
                        className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                        title="حذف"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccountsTable;
