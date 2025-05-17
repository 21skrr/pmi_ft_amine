// frontend/src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { getCurrentUser, updateUser } from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Calendar,
  Briefcase,
  Building,
  UserCheck,
} from "lucide-react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";
import Loading from "../components/common/Loading";

const Profile = () => {
  const { user, updateUserContext } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getCurrentUser();
        setProfileData(data);
        updateUserContext(data);
        setError(null);
      } catch (err) {
        setError("Failed to load profile. Please try again later.");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [updateUserContext]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Only send allowed fields to update
      const updateData = {
        name: profileData.name,
        // Add more editable fields as needed
      };

      const updatedUser = await updateUser(user.id, updateData);
      setProfileData(updatedUser);
      updateUserContext(updatedUser);

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData) return <Loading message="Loading profile..." />;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-2">
          <User className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        </div>
        <p className="text-gray-600">
          View and manage your personal information.
        </p>
      </div>

      {error && <Alert type="error" title="Error" message={error} />}

      {success && <Alert type="success" title="Success" message={success} />}

      {profileData && (
        <Card>
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-medium">
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {profileData.name}
                </h2>
                <div className="flex items-center mt-1 text-gray-500">
                  <UserCheck className="h-4 w-4 mr-1" />
                  <span className="capitalize">{profileData.role}</span>
                </div>
                <div className="flex items-center mt-1 text-gray-500">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{profileData.email}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={profileData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    {/* Read-only fields */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        value={profileData.email}
                        disabled
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setIsEditing(false)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Personal Information
                  </h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Start Date
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDate(profileData.startDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        Program
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {profileData.programType ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {profileData.programType === "inkompass"
                              ? "Inkompass"
                              : profileData.programType === "earlyTalent"
                              ? "Early Talent"
                              : profileData.programType === "apprenticeship"
                              ? "Apprenticeship"
                              : profileData.programType === "academicPlacement"
                              ? "Academic Placement"
                              : profileData.programType === "workExperience"
                              ? "Work Experience"
                              : profileData.programType}
                          </span>
                        ) : (
                          "Not assigned"
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        Department
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {profileData.department || "Not assigned"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <UserCheck className="h-4 w-4 mr-1" />
                        Onboarding Status
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {profileData.onboardingProgress === 100 ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            In Progress - {profileData.onboardingProgress || 0}%
                          </span>
                        )}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Profile;
