import React, { useRef, useState } from "react";
import UploadComponent from "../Home/components/Upload";
import { Button } from "@/components/ui/button";

interface TesterProp {
  concept: string;
  task: string;
}
const Tester: React.FC<TesterProp> = ({ concept, task }) => {
  return (
    <>
      <div className="flex flex-col">
        <div>
          <h1 className="text-5xl py-16 font-bold text-center font-mono text-gray-700">
            Learn: {concept}
          </h1>
          <p className="text-lg text-center text-gray-500 pt-4">
            <span className="font-bold text-blue-600"> Task:</span> {task}
          </p>
          <div className="mx-auto w-1/2">
            <UploadComponent />
          </div>
        </div>
        <div className="py-[5em] text-center">
          <a
            href="link"
            className="font-mono text-4xl text-gray-500 hover:text-blue-500"
          >
            Use Editor
          </a>
        </div>
      </div>
    </>
  );
};

export default Tester;
