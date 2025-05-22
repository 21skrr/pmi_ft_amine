import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, ChevronLeft } from "lucide-react";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import Alert from "../components/common/Alert";

const ProgramDetail = () => {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/programs/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Program not found");
          }
          throw new Error("Failed to fetch program");
        }

        const data = await response.json();
        setProgram(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching program:", err);
        setError(err.message || "Failed to load program details");
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  if (loading) {
    return <Loading message="Loading program details..." />;
  }

  if (error) {
    return <Alert type="error" title="Error" message={error} />;
  }

  if (!program) {
    return (
      <Alert type="warning" title="Not Found" message="Program not found" />
    );
  }

  // Parse JSON fields if they're stored as strings
  const parseJsonField = (field) => {
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch (e) {
        return [];
      }
    }
    return field || [];
  };

  const components = parseJsonField(program.components);
  const features = parseJsonField(program.features);
  const benefits = parseJsonField(program.benefits);
  const support = parseJsonField(program.support);
  const objective = parseJsonField(program.objective);

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Link
          to="/programs"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back to Programs</span>
        </Link>
      </div>

      <Card>
        <div className="flex items-center mb-4">
          <Calendar className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">{program.title}</h1>
        </div>

        {program.duration && (
          <div className="mb-4 text-sm text-gray-600">
            <span className="font-medium">Duration:</span> {program.duration}
            {program.programType && (
              <span className="ml-3">
                <span className="font-medium">Type:</span> {program.programType}
              </span>
            )}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Overview</h2>
          <p className="text-gray-700">{program.overview}</p>
        </div>

        {components && components.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Program Components
            </h2>
            <ul className="space-y-2 text-gray-700">
              {components.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {objective && objective.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Program Objectives
            </h2>
            <ul className="space-y-2 text-gray-700">
              {objective.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {features && features.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Key Features
            </h2>
            <ul className="space-y-2 text-gray-700">
              {features.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {support && support.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Support Structure
            </h2>
            <ul className="space-y-2 text-gray-700">
              {support.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {benefits && benefits.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Benefits</h2>
            <ul className="space-y-2 text-gray-700">
              {benefits.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProgramDetail;
