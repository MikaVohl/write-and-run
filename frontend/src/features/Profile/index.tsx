import React, { useRef, useState } from "react";
import { Card } from "../../components/ui/card";
const Profile = () => {
  return (
    <div>
      <Card className="bg-blue-100 w-1/2 h-1/2 p-4 rounded-lg hoverL:shadow-lg shadow-lg">
        <h1 className="text-xl font-bold text-blue-900">Profile</h1>
        <p className="text-blue-700">Info</p>
      </Card>
    </div>
  );
};

export default Profile;
