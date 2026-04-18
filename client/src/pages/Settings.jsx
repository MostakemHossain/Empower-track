import React, { useState } from "react";
const Settings = () => {
  const [profile, setProfile] = useState({
    image: null,
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    role: "EMPLOYEE",
    bio: "Full Stack Developer",
    address: "Dhaka, Bangladesh",
    dob: "1998-05-12",
    joinDate: "2023-01-10",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfile({ ...profile, image: URL.createObjectURL(file) });
  };
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };
  return (
    <div className="p-6 lg:p-10 bg-slate-50 min-h-screen">
      {" "}
      {/* HEADER */}{" "}
      <div className="mb-10">
        {" "}
        <h1 className="text-4xl font-black text-slate-800">
          {" "}
          Account Settings{" "}
        </h1>{" "}
        <p className="text-slate-500 mt-1">
          {" "}
          Manage your personal information, security, and account preferences{" "}
        </p>{" "}
      </div>{" "}
      {/* ================= PROFILE SECTION ================= */}{" "}
      <div className="bg-white rounded-3xl shadow p-6 mb-8">
        {" "}
        {/* TITLE */}{" "}
        <div className="mb-6">
          {" "}
          <h2 className="text-xl font-bold text-slate-800">
            {" "}
            Personal Information{" "}
          </h2>{" "}
          <p className="text-sm text-slate-500">
            {" "}
            Update your profile details. This information may be visible to your
            team.{" "}
          </p>{" "}
        </div>{" "}
        {/* PROFILE HEADER CARD */}{" "}
        <div className="flex items-center gap-6 mb-8 bg-slate-50 p-5 rounded-2xl">
          {" "}
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-indigo-100 flex items-center justify-center">
            {" "}
            {profile.image ? (
              <img
                src={profile.image}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-indigo-600 text-2xl font-bold">
                {" "}
                {profile.firstName[0]}{" "}
              </span>
            )}{" "}
            <label className="absolute bottom-0 right-0 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded cursor-pointer">
              {" "}
              Edit{" "}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />{" "}
            </label>{" "}
          </div>{" "}
          <div>
            {" "}
            <h3 className="text-lg font-bold text-slate-800">
              {" "}
              {profile.firstName} {profile.lastName}{" "}
            </h3>{" "}
            <p className="text-sm text-slate-500">{profile.role}</p>{" "}
            <p className="text-xs text-slate-400 mt-1">
              {" "}
              Tip: Keep your profile updated for better communication{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* FORM GRID */}{" "}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {" "}
          <div>
            {" "}
            <input
              name="firstName"
              value={profile.firstName}
              onChange={handleProfileChange}
              placeholder="First Name"
              className="w-full p-3 rounded-xl bg-slate-100 outline-none"
            />{" "}
            <p className="text-xs text-slate-400 mt-1"> Your given name </p>{" "}
          </div>{" "}
          <div>
            {" "}
            <input
              name="lastName"
              value={profile.lastName}
              onChange={handleProfileChange}
              placeholder="Last Name"
              className="w-full p-3 rounded-xl bg-slate-100 outline-none"
            />{" "}
            <p className="text-xs text-slate-400 mt-1"> Your family name </p>{" "}
          </div>{" "}
          {/* EMAIL */}{" "}
          <div>
            {" "}
            <input
              value={profile.email}
              disabled
              className="w-full p-3 rounded-xl bg-slate-200 text-slate-500 cursor-not-allowed"
            />{" "}
            <p className="text-xs text-slate-400 mt-1">
              {" "}
              Email cannot be changed{" "}
            </p>{" "}
          </div>{" "}
          {/* ROLE */}{" "}
          <div>
            {" "}
            <input
              value={profile.role}
              disabled
              className="w-full p-3 rounded-xl bg-slate-200 text-slate-500 cursor-not-allowed"
            />{" "}
            <p className="text-xs text-slate-400 mt-1"> Your system role </p>{" "}
          </div>{" "}
          {/* DOB */}{" "}
          <div>
            {" "}
            <input
              type="date"
              name="dob"
              value={profile.dob}
              onChange={handleProfileChange}
              className="w-full p-3 rounded-xl bg-slate-100 outline-none"
            />{" "}
            <p className="text-xs text-slate-400 mt-1"> Your date of birth </p>{" "}
          </div>{" "}
          {/* JOIN DATE */}{" "}
          <div>
            {" "}
            <input
              type="date"
              value={profile.joinDate}
              disabled
              className="w-full p-3 rounded-xl bg-slate-200 text-slate-500 cursor-not-allowed"
            />{" "}
            <p className="text-xs text-slate-400 mt-1">
              {" "}
              Joining date (system generated){" "}
            </p>{" "}
          </div>{" "}
          {/* BIO */}{" "}
          <div className="md:col-span-2">
            {" "}
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleProfileChange}
              placeholder="Write something about yourself..."
              className="w-full p-3 rounded-xl bg-slate-100 outline-none"
            />{" "}
            <p className="text-xs text-slate-400 mt-1">
              {" "}
              Short professional bio{" "}
            </p>{" "}
          </div>{" "}
          {/* ADDRESS */}{" "}
          <div className="md:col-span-2">
            {" "}
            <input
              name="address"
              value={profile.address}
              onChange={handleProfileChange}
              placeholder="Address"
              className="w-full p-3 rounded-xl bg-slate-100 outline-none"
            />{" "}
            <p className="text-xs text-slate-400 mt-1">
              {" "}
              Your current location{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* BUTTON */}{" "}
        <div className="flex justify-end mt-6">
          {" "}
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700">
            {" "}
            Save Profile Changes{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* ================= SECURITY SECTION ================= */}{" "}
      <div className="bg-white rounded-3xl shadow p-6">
        {" "}
        <div className="mb-6">
          {" "}
          <h2 className="text-xl font-bold text-slate-800">
            {" "}
            Security Settings{" "}
          </h2>{" "}
          <p className="text-sm text-slate-500">
            {" "}
            Ensure your account is protected with a strong password{" "}
          </p>{" "}
        </div>{" "}
        <div className="space-y-4">
          {" "}
          <input
            type="password"
            name="currentPassword"
            onChange={handlePasswordChange}
            placeholder="Current Password"
            className="w-full p-3 rounded-xl bg-slate-100 outline-none"
          />{" "}
          <input
            type="password"
            name="newPassword"
            onChange={handlePasswordChange}
            placeholder="New Password"
            className="w-full p-3 rounded-xl bg-slate-100 outline-none"
          />{" "}
          <input
            type="password"
            name="confirmPassword"
            onChange={handlePasswordChange}
            placeholder="Confirm Password"
            className="w-full p-3 rounded-xl bg-slate-100 outline-none"
          />{" "}
        </div>{" "}
        <div className="flex justify-end mt-6">
          {" "}
          <button className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700">
            {" "}
            Update Password{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default Settings;
