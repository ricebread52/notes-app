import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/top.svg";
import trashIcon from "../assets/trash-icon.svg";
import rightImage from "../assets/images/left-column.png";
import { getProfile } from "../lib/api/auth";

interface User {
  name: string;
  email: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // redirect if not logged in
      return;
    }

    getProfile(token)
      .then((data) => {
        if (data?._id) {
          setUser({ name: data.name, email: data.email });
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-gray-50">
      {/* Left Section - Dashboard Content */}
      <div className="flex-1 flex flex-col px-6 md:px-12 py-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <img src={logo} alt="App Logo" className="h-10 w-auto" />
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Sign Out
          </button>
        </div>

        {/* User Info */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Welcome, {user?.name || "User"}!</h1>
          <p className="text-gray-600">{user?.email || "user@example.com"}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + New Note
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
            <img src={trashIcon} alt="Trash" className="h-5 w-5" />
            Trash
          </button>
        </div>

        {/* Notes Section (scrollable only here) */}
        <div className="flex-1 overflow-y-auto pr-2">
          <h2 className="text-lg font-medium mb-3">Your Notes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
            <div className="p-4 bg-white rounded-lg shadow hover:shadow-md">
              <h3 className="font-medium">Meeting Notes</h3>
              <p className="text-sm text-gray-500">Today at 3 PM</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow hover:shadow-md">
              <h3 className="font-medium">Shopping List</h3>
              <p className="text-sm text-gray-500">Milk, Eggs, Bread</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow hover:shadow-md">
              <h3 className="font-medium">Ideas</h3>
              <p className="text-sm text-gray-500">Project concepts & sketches</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Illustration */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gray-100">
        <img
          src={rightImage}
          alt="Dashboard Illustration"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
