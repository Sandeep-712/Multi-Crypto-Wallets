"use client"

import React from "react";
import { Toaster } from "react-hot-toast";

const ToasterProvider: React.FC = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: "#363636",
          color: "#fff",
        },
      }}
    />
  );
};

export default ToasterProvider;
