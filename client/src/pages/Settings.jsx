import React, { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const {  logout } = useAuth();
  const [passwordLoading, setPasswordLoading] = useState(false);
  const navigate = useNavigate();


  // ================= PASSWORD VISIBILITY =================
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // ================= PROFILE STATE =================
  const [profile, setProfile] = useState({
    image: "",
    imageFile: null,

    firstName: "",
    lastName: "",
    email: "",
    role: "",

    employeeId: "",
    phone: "",
    address: "",
    bio: "",

    dob: "",
    joinDate: "",

    department: "",
    position: "",
    employmentStatus: "",

    baseSalary: "",
    allowances: "",
    deductions: "",
  });

  // ================= PASSWORD STATE =================
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ================= FETCH PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/me");

        const data = res?.data?.data;

        setProfile({
          image: data?.profile?.photo || "",
          imageFile: null,

          firstName: data?.profile?.firstName || "",
          lastName: data?.profile?.lastName || "",

          email: data?.user?.email || "",
          role: data?.user?.role || "",

          employeeId: data?.profile?.employeeId || "",
          phone: data?.profile?.phone || "",
          address: data?.profile?.address || "",
          bio: data?.profile?.bio || "",

          dob: data?.profile?.dateOfBirth?.split("T")[0] || "",
          joinDate: data?.profile?.joiningDate?.split("T")[0] || "",

          department: data?.profile?.department || "",
          position: data?.profile?.position || "",
          employmentStatus: data?.profile?.employmentStatus || "",

          baseSalary: data?.profile?.baseSalary || "",
          allowances: data?.profile?.allowances || "",
          deductions: data?.profile?.deductions || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  // ================= HANDLE PROFILE CHANGE =================
  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ================= HANDLE IMAGE =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setProfile({
      ...profile,
      imageFile: file,
      image: URL.createObjectURL(file),
    });
  };

  // ================= UPDATE PROFILE =================
  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      const data = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        address: profile.address,
        bio: profile.bio,
        dateOfBirth: profile.dob,
      };

      formData.append("data", JSON.stringify(data));

      if (profile.imageFile) {
        formData.append("file", profile.imageFile);
      }

      await api.put("/profile/update-my-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLE PASSWORD CHANGE =================
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= UPDATE PASSWORD =================
  const handleUpdatePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        return toast.error("Passwords do not match");
      }

      setPasswordLoading(true);

      await api.post("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password updated successfully!");
      logout();
      navigate("/login");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to update password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      {/* ================= HEADER ================= */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-800">Account Settings</h1>

        <p className="text-slate-500 mt-2">
          Manage your profile information and account security
        </p>
      </div>

      {/* ================= PROFILE SECTION ================= */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 lg:p-8 mb-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Personal Information
          </h2>

          <p className="text-slate-500 mt-1">
            Update your profile and personal details
          </p>
        </div>

        {/* PROFILE CARD */}
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 rounded-3xl p-6 mb-10">
          <div className="relative w-28 h-28 rounded-3xl overflow-hidden bg-indigo-100 flex items-center justify-center shadow-sm">
            {profile.image ? (
              <img
                src={profile.image}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-indigo-600">
                {profile.firstName?.charAt(0)}
              </span>
            )}

            <label className="absolute bottom-1 right-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded-lg cursor-pointer">
              Edit
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-3xl font-bold text-slate-800">
              {profile.firstName} {profile.lastName}
            </h3>

            <p className="text-slate-500 mt-1">
              {profile.role} • {profile.employeeId}
            </p>

            <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
              <span className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full font-medium">
                {profile.department}
              </span>

              <span className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full font-medium">
                {profile.position}
              </span>

              <span className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full font-medium">
                {profile.employmentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              label: "First Name",
              name: "firstName",
              value: profile.firstName,
              disabled: false,
            },
            {
              label: "Last Name",
              name: "lastName",
              value: profile.lastName,
              disabled: false,
            },
            {
              label: "Email",
              name: "email",
              value: profile.email,
              disabled: true,
            },
            {
              label: "Role",
              name: "role",
              value: profile.role,
              disabled: true,
            },
            {
              label: "Employee ID",
              name: "employeeId",
              value: profile.employeeId,
              disabled: true,
            },
            {
              label: "Phone",
              name: "phone",
              value: profile.phone,
              disabled: false,
            },
            {
              label: "Department",
              name: "department",
              value: profile.department,
              disabled: true,
            },
            {
              label: "Position",
              name: "position",
              value: profile.position,
              disabled: true,
            },
            {
              label: "Employment Status",
              name: "employmentStatus",
              value: profile.employmentStatus,
              disabled: true,
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                {field.label}
              </label>

              <input
                type="text"
                name={field.name}
                value={field.value}
                disabled={field.disabled}
                onChange={handleProfileChange}
                className={`w-full p-3 rounded-xl outline-none border border-transparent ${
                  field.disabled
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-slate-100 focus:border-indigo-500"
                }`}
              />
            </div>
          ))}

          {/* DOB */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Date of Birth
            </label>

            <input
              type="date"
              name="dob"
              value={profile.dob}
              onChange={handleProfileChange}
              className="w-full p-3 rounded-xl bg-slate-100 outline-none border border-transparent focus:border-indigo-500"
            />
          </div>

          {/* JOIN DATE */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Joining Date
            </label>

            <input
              type="date"
              value={profile.joinDate}
              disabled
              className="w-full p-3 rounded-xl bg-slate-200 text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* BASE SALARY */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Base Salary
            </label>

            <input
              type="text"
              value={`৳ ${profile.baseSalary}`}
              disabled
              className="w-full p-3 rounded-xl bg-slate-200 text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* ALLOWANCES */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Allowances
            </label>

            <input
              type="text"
              value={`৳ ${profile.allowances}`}
              disabled
              className="w-full p-3 rounded-xl bg-slate-200 text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* DEDUCTIONS */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Deductions
            </label>

            <input
              type="text"
              value={`৳ ${profile.deductions}`}
              disabled
              className="w-full p-3 rounded-xl bg-slate-200 text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* ADDRESS */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Address
            </label>

            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleProfileChange}
              placeholder="Enter address"
              className="w-full p-3 rounded-xl bg-slate-100 outline-none border border-transparent focus:border-indigo-500"
            />
          </div>

          {/* BIO */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Professional Bio
            </label>

            <textarea
              rows={4}
              name="bio"
              value={profile.bio}
              onChange={handleProfileChange}
              placeholder="Write something about yourself..."
              className="w-full p-3 rounded-xl bg-slate-100 outline-none border border-transparent focus:border-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleUpdateProfile}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Save Profile Changes"}
          </button>
        </div>
      </div>

      {/* ================= SECURITY SECTION ================= */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 lg:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Security Settings
          </h2>

          <p className="text-slate-500 mt-1">
            Change your account password securely
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {/* CURRENT PASSWORD */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Current Password
            </label>

            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className="w-full p-3 pr-12 rounded-xl bg-slate-100 outline-none border border-transparent focus:border-emerald-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    current: !showPassword.current,
                  })
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword.current ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className="w-full p-3 pr-12 rounded-xl bg-slate-100 outline-none border border-transparent focus:border-emerald-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    new: !showPassword.new,
                  })
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                className="w-full p-3 pr-12 rounded-xl bg-slate-100 outline-none border border-transparent focus:border-emerald-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    confirm: !showPassword.confirm,
                  })
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword.confirm ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleUpdatePassword}
            disabled={passwordLoading}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition disabled:opacity-50"
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
