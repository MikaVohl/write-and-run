import React, { useRef, useState } from "react";
import { Card } from "../../components/ui/card";
import { useAuthContext } from "@/contexts/AuthContext";
const Profile = () => {
  const { user } = useAuthContext();
  const parseDate = (fulldate: string) => {
    const date = new Date(fulldate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return { year, month, day };
  };
  const { year, month, day } = parseDate(user!.created_at);

  return (
    <div className="px-4">
      <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
        <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
          <div>
            <h2 className="text-base/7 text-3 font-semibold text-gray-900">
              Account Profile
            </h2>

            <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm/6">
              <div className="pt-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                  Full Name
                </dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div className="text-gray-900">
                    {user?.user_metadata.full_name}
                  </div>
                </dd>
              </div>
              <div className="pt-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                  Email address
                </dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div className="text-gray-900">{user?.email}</div>
                </dd>
              </div>
              <div className="pt-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                  Date Created
                </dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div className="text-gray-900">
                    {year}-{month}-{day}
                  </div>
                  <button
                    type="button"
                    className="font-semibold px-3 text-indigo-600 hover:text-indigo-500"
                  >
                    Delete Account
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
