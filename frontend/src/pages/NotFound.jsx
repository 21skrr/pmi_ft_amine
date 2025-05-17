// frontend/src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <AlertTriangle className="mx-auto h-20 w-20 text-yellow-500" />
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight">
            404
          </h1>
          <h2 className="mt-2 text-xl font-bold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-2 text-base text-gray-600">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
