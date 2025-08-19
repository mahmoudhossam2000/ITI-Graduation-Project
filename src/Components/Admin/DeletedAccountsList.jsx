import React from "react";

const DeletedAccountsList = ({ 
  deletedAccounts, 
  isFetching, 
  onRestoreAccount 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">الحسابات المحذوفة</h2>
        <div className="text-sm text-gray-500">
          إجمالي الحسابات المحذوفة: {deletedAccounts.length}
        </div>
      </div>

      {isFetching ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">جاري التحميل...</p>
        </div>
      ) : deletedAccounts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">لا توجد حسابات محذوفة</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  البريد الإلكتروني
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  نوع الحساب
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  تاريخ الحذف
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deletedAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 border-b">
                    {account.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {account.accountType === "department" && "إدارة"}
                      {account.accountType === "governorate" && "محافظة"}
                      {account.accountType === "ministry" && "وزارة"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b">
                    {account.deletedAt?.toDate
                      ? account.deletedAt.toDate().toLocaleDateString("ar-EG")
                      : "غير محدد"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b">
                    <button
                      onClick={() => onRestoreAccount(account)}
                      className="text-green-600 hover:text-green-900 font-medium"
                      title="استعادة الحساب"
                    >
                      استعادة
                    </button>
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

export default DeletedAccountsList;
