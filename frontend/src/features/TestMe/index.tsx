import React, { useRef, useState } from "react";
import UploadComponent from "../Home/components/Upload";
const Tester = () => {
  return (
    <>
      <div>
        <h1 className="text-5xl py-10 font-bold text-center font-mono text-gray-700">
          Socket Programming
        </h1>
        <p className="text-lg text-center text-gray-500 pt-4">
        <span className="font-bold text-blue-600"> Task:</span> Create a simple client-server chat application using C sockets. 
        The server should be able to handle multiple clients concurrently using threads.
        </p>
        <UploadComponent />
      </div>
    </>
  );
};

export default Tester;
