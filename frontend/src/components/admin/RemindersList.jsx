import React, { useEffect, useState } from "react";
import api from "../../api/api";

const RemindersList = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/notifications/all${type ? `?type=${type}` : ""}`)
      .then((res) => setReminders(res.data))
      .finally(() => setLoading(false));
  }, [type]);

  const handleExport = (type) => {
    let url = "";
    if (type === "feedback") url = "/api/feedback/export/csv";
    if (type === "onboarding") url = "/api/onboarding/export/csv";
    if (type === "evaluation") url = "/api/evaluations/export/csv";
    window.open(url, "_blank");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Scheduled Reminders</h2>
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by type:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">All</option>
          <option value="feedback">Feedback</option>
          <option value="trial">Trial</option>
        </select>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => handleExport("feedback")}
          className="btn btn-outline"
        >
          Export Feedback CSV
        </button>
        <button
          onClick={() => handleExport("onboarding")}
          className="btn btn-outline"
        >
          Export Onboarding CSV
        </button>
        <button
          onClick={() => handleExport("evaluation")}
          className="btn btn-outline"
        >
          Export Evaluation CSV
        </button>
      </div>
      {loading ? (
        <div>Loading reminders...</div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-2 py-1">User ID</th>
              <th className="border px-2 py-1">Type</th>
              <th className="border px-2 py-1">Message</th>
              <th className="border px-2 py-1">Date</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map((rem) => (
              <tr key={rem.id}>
                <td className="border px-2 py-1">{rem.userId}</td>
                <td className="border px-2 py-1">{rem.type}</td>
                <td className="border px-2 py-1">{rem.message}</td>
                <td className="border px-2 py-1">
                  {new Date(rem.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RemindersList;
