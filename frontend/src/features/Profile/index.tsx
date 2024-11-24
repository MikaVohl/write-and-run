import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/AuthContext";

const Profile = () => {
  const { user } = useAuthContext();

  const parseDate = (fulldate: string) => {
    const date = new Date(fulldate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formattedDate = user?.created_at ? parseDate(user.created_at) : '';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">Account Profile</h2>
            <p className="mt-1 text-sm text-gray-500">
              Your personal account information
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <dt className="text-sm font-medium text-gray-500 sm:w-48">
                    Full Name
                  </dt>
                  <dd className="mt-1 text-base font-semibold text-gray-900 sm:mt-0">
                    {user?.user_metadata.full_name}
                  </dd>
                </div>
              </div>

              <div className="border-b border-gray-100 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <dt className="text-sm font-medium text-gray-500 sm:w-48">
                    Email Address
                  </dt>
                  <dd className="mt-1 text-base text-gray-900 sm:mt-0">
                    {user?.email}
                  </dd>
                </div>
              </div>

              <div className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <dt className="text-sm font-medium text-gray-500 sm:w-48">
                    Member Since
                  </dt>
                  <dd className="mt-1 text-base text-gray-900 sm:mt-0">
                    {formattedDate}
                  </dd>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;