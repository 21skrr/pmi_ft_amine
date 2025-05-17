// frontend/src/pages/admin/ManagePrograms.jsx
import React, { useState, useEffect } from "react";
import { Briefcase, Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import Loading from "../../components/common/Loading";
import Modal from "../../components/common/Modal";

// This is a mock since we don't have actual program management API yet
const mockPrograms = [
  {
    id: "1",
    name: "Inkompass",
    description:
      "A 3-month global internship program designed for top-performing university students.",
    programType: "inkompass",
    duration: "3 months",
    isActive: true,
  },
  {
    id: "2",
    name: "Early Talent",
    description:
      "A program for recent graduates to accelerate their career and develop professional skills.",
    programType: "earlyTalent",
    duration: "12 months",
    isActive: true,
  },
  {
    id: "3",
    name: "Apprenticeship",
    description:
      "Learn on the job with experienced professionals providing guidance and mentorship.",
    programType: "apprenticeship",
    duration: "24 months",
    isActive: true,
  },
  {
    id: "4",
    name: "Academic Placement",
    description:
      "A program for students pursuing academic projects or research in collaboration with PMI.",
    programType: "academicPlacement",
    duration: "6 months",
    isActive: true,
  },
  {
    id: "5",
    name: "Work Experience",
    description:
      "Short-term placements for students to experience the professional environment.",
    programType: "workExperience",
    duration: "1 month",
    isActive: true,
  },
];

const ManagePrograms = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    programType: "",
    duration: "",
    isActive: true,
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Check if user is HR
  if (user.role !== "hr") {
    return (
      <Alert
        type="error"
        title="Access Denied"
        message="You don't have permission to access this page."
      />
    );
  }

  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    setTimeout(() => {
      setPrograms(mockPrograms);
      setLoading(false);
    }, 500);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddClick = () => {
    setFormData({
      name: "",
      description: "",
      programType: "",
      duration: "",
      isActive: true,
    });
    setIsAddModalOpen(true);
  };

  const handleEditClick = (program) => {
    setCurrentProgram(program);
    setFormData({
      name: program.name,
      description: program.description,
      programType: program.programType,
      duration: program.duration,
      isActive: program.isActive,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (program) => {
    setCurrentProgram(program);
    setIsDeleteModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveError(null);

    // Validate form
    if (!formData.name || !formData.programType || !formData.duration) {
      setSaveError("Please fill in all required fields.");
      setSaveLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const newProgram = {
        id: Date.now().toString(),
        ...formData,
      };
      setPrograms([...programs, newProgram]);
      setSaveLoading(false);
      setIsAddModalOpen(false);
    }, 500);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveError(null);

    // Validate form
    if (!formData.name || !formData.programType || !formData.duration) {
      setSaveError("Please fill in all required fields.");
      setSaveLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const updatedPrograms = programs.map((p) =>
        p.id === currentProgram.id ? { ...p, ...formData } : p
      );
      setPrograms(updatedPrograms);
      setSaveLoading(false);
      setIsEditModalOpen(false);
    }, 500);
  };

  const handleDeleteConfirm = () => {
    setSaveLoading(true);
    setSaveError(null);

    // Simulate API call
    setTimeout(() => {
      const updatedPrograms = programs.filter(
        (p) => p.id !== currentProgram.id
      );
      setPrograms(updatedPrograms);
      setSaveLoading(false);
      setIsDeleteModalOpen(false);
    }, 500);
  };

  const programForm = (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Program Name*
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description*
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="programType"
            className="block text-sm font-medium text-gray-700"
          >
            Program Type*
          </label>
          <select
            id="programType"
            name="programType"
            value={formData.programType}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="">Select a program type</option>
            <option value="inkompass">Inkompass</option>
            <option value="earlyTalent">Early Talent</option>
            <option value="apprenticeship">Apprenticeship</option>
            <option value="academicPlacement">Academic Placement</option>
            <option value="workExperience">Work Experience</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700"
          >
            Duration*
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., 3 months, 1 year"
            required
          />
        </div>
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="isActive" className="font-medium text-gray-700">
            Active
          </label>
          <p className="text-gray-500">
            Inactive programs won't be shown in the programs list.
          </p>
        </div>
      </div>

      {saveError && <Alert type="error" title="Error" message={saveError} />}
    </div>
  );

  if (loading) return <Loading message="Loading programs..." />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-2">
          <Briefcase className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Manage Programs</h1>
        </div>
        <p className="text-gray-600">
          Create and manage onboarding programs and templates.
        </p>
      </div>

      {error && (
        <Alert type="error" title="Error Loading Programs" message={error} />
      )}

      <div className="flex justify-end mb-4">
        <Button
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={handleAddClick}
        >
          Add Program
        </Button>
      </div>

      <div className="space-y-4">
        {programs.length === 0 ? (
          <Card>
            <div className="py-8 text-center">
              <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No programs found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleAddClick}
              >
                Add Your First Program
              </Button>
            </div>
          </Card>
        ) : (
          programs.map((program) => (
            <Card key={program.id}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {program.name}
                    </h3>
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        program.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {program.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {program.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">
                      <span className="font-medium">Type:</span>{" "}
                      {program.programType === "inkompass"
                        ? "Inkompass"
                        : program.programType === "earlyTalent"
                        ? "Early Talent"
                        : program.programType === "apprenticeship"
                        ? "Apprenticeship"
                        : program.programType === "academicPlacement"
                        ? "Academic Placement"
                        : program.programType === "workExperience"
                        ? "Work Experience"
                        : program.programType}
                    </span>
                    <span>
                      <span className="font-medium">Duration:</span>{" "}
                      {program.duration}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Edit2 className="h-4 w-4" />}
                    onClick={() => handleEditClick(program)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Trash2 className="h-4 w-4" />}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => handleDeleteClick(program)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add Program Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Program"
        size="lg"
      >
        <form onSubmit={handleAddSubmit}>
          {programForm}

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              disabled={saveLoading}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saveLoading}>
              {saveLoading ? "Saving..." : "Add Program"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Program Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Program"
        size="lg"
      >
        <form onSubmit={handleEditSubmit}>
          {programForm}

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={saveLoading}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saveLoading}>
              {saveLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Program Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Program"
        size="sm"
      >
        <div className="py-3">
          {currentProgram && (
            <p className="text-gray-700">
              Are you sure you want to delete the program{" "}
              <span className="font-medium">{currentProgram.name}</span>? This
              action cannot be undone.
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={saveLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={saveLoading}
          >
            {saveLoading ? "Deleting..." : "Delete Program"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ManagePrograms;
