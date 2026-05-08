/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { DEPARTMENTS } from "../assets/assets";

/* ================= REUSABLE INPUT COMPONENT ================= */
const DetailField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled,
  placeholder,
  error,
  helpText,
}) => {
  return (
    <div className="w-full">
      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none text-sm ${
          disabled
            ? "border-transparent bg-slate-100/50 text-slate-500 cursor-not-allowed"
            : "border-slate-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
        } ${error ? "border-rose-500 ring-4 ring-rose-500/10" : ""}`}
      />
      {helpText && (
        <p className="text-[10px] text-slate-400 mt-1.5 ml-1">{helpText}</p>
      )}
    </div>
  );
};

const EmployeeDetailModal = ({ isOpen, onClose, employee, onSave }) => {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState("view");
  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (employee) {
      setForm({
        ...employee,
        workEmail: employee.user?.email || "",
        personalEmail: employee.personalEmail || "",
        dateOfBirth: employee.dateOfBirth
          ? employee.dateOfBirth.split("T")[0]
          : "",
        joiningDate: employee.joiningDate
          ? employee.joiningDate.split("T")[0]
          : "",
        allowances: employee.allowances || 0,
        deductions: employee.deductions || 0,
      });
      setPreview(employee.photo || null);
    }
  }, [employee]);

  if (!isOpen || !form) return null;

  const stepsInfo = [
    { id: 1, title: "Personal", desc: "Identity & Bio" },
    { id: 2, title: "Employment", desc: "Job & Financials" },
    { id: 3, title: "Access", desc: "Security & Credentials" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle numeric fields
    const val =
      name === "baseSalary" || name === "allowances" || name === "deductions"
        ? Number(value)
        : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    setForm((prev) => ({ ...prev, photo: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleToggleEdit = () => {
    if (mode === "edit") {
      setMode("view");
      setForm({
        ...employee,
        workEmail: employee.user?.email || "",
        personalEmail: employee.personalEmail || "",
        dateOfBirth: employee.dateOfBirth
          ? employee.dateOfBirth.split("T")[0]
          : "",
        joiningDate: employee.joiningDate
          ? employee.joiningDate.split("T")[0]
          : "",
      });
      setPreview(employee.photo);
    } else {
      setMode("edit");
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();

      // Separate the photo and user object from the form data
      const { photo, user, ...textData } = form;

      // Match Postman structure: key 'data' contains the JSON string
      formData.append("data", JSON.stringify(textData));

      // Match Postman structure: key 'file' contains the image
      if (photo instanceof File) {
        formData.append("file", photo);
      }

      const res = await api.put(
        `/employee/update-employee/${form._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        toast.success("Employee updated successfully");
        onSave(res.data.data); // Update the parent state
        setMode("view");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update employee");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px]">
        {/* SIDEBAR NAVIGATION */}
        <div className="w-full md:w-72 bg-slate-50 border-r border-slate-100 p-8 flex flex-col">
          <div className="mb-10 flex flex-col items-center md:items-start group">
            <div className="w-24 h-24 rounded-2xl bg-indigo-100 mb-4 overflow-hidden border-4 border-white shadow-xl relative shrink-0">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-indigo-500 font-black text-3xl">
                  {form.firstName?.[0]}
                  {form.lastName?.[0]}
                </div>
              )}

              {mode === "edit" && (
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase"
                >
                  Upload
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <h3 className="text-lg font-bold text-slate-800 leading-tight">
              {form.firstName} {form.lastName}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {form.position || "Employee"}
            </p>
          </div>

          <div className="space-y-6 relative">
            {stepsInfo.map((s) => (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className="flex gap-4 w-full text-left group"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                    step === s.id
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-white text-slate-400 border border-slate-200"
                  }`}
                >
                  {s.id}
                </div>
                <div>
                  <h4
                    className={`text-sm font-bold ${
                      step === s.id
                        ? "text-slate-800"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  >
                    {s.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                    {s.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <button
              onClick={handleToggleEdit}
              className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                mode === "edit"
                  ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                  : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              }`}
            >
              {mode === "edit" ? "Cancel Editing" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[85vh]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-[10px] font-black text-indigo-600 tracking-[0.2em] uppercase bg-indigo-50 px-2 py-1 rounded-md">
                Section 0{step}
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-2">
                {stepsInfo[step - 1].title} Details
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* STEP 1: PERSONAL */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <DetailField
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  disabled={mode === "view"}
                />
                <DetailField
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  disabled={mode === "view"}
                />
                <DetailField
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={mode === "view"}
                />
                <DetailField
                  label="Personal Email"
                  name="personalEmail"
                  value={form.personalEmail}
                  onChange={handleChange}
                  disabled={mode === "view"}
                  placeholder="example@gmail.com"
                />
                <DetailField
                  label="Date of Birth"
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  disabled={mode === "view"}
                />
                <DetailField
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  disabled={mode === "view"}
                />
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                    Bio / Notes
                  </label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    disabled={mode === "view"}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm min-h-[100px] bg-slate-50/30 disabled:bg-slate-50 disabled:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: EMPLOYMENT */}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <DetailField
                  label="Employee ID"
                  name="employeeId"
                  value={form.employeeId}
                  disabled={true}
                  helpText="System-generated ID."
                />
                <div className="w-full">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                    Department
                  </label>
                  <select
                    name="department"
                    disabled={mode === "view"}
                    value={form.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-50 disabled:border-transparent"
                  >
                    {DEPARTMENTS.map((dep) => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))}
                  </select>
                </div>
                <DetailField
                  label="Position"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  disabled={mode === "view"}
                />
                <DetailField
                  label="Base Salary"
                  type="number"
                  name="baseSalary"
                  value={form.baseSalary}
                  onChange={handleChange}
                  disabled={mode === "view"}
                />
                <DetailField
                  label="Allowances"
                  type="number"
                  name="allowances"
                  value={form.allowances}
                  onChange={handleChange}
                  disabled={mode === "view"}
                />
                <DetailField
                  label="Deductions"
                  type="number"
                  name="deductions"
                  value={form.deductions}
                  onChange={handleChange}
                  disabled={mode === "view"}
                />
                <DetailField
                  label="Joining Date"
                  type="date"
                  name="joiningDate"
                  value={form.joiningDate}
                  onChange={handleChange}
                  disabled={mode === "view"}
                />

                <div className="w-full">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                    Employment Status
                  </label>
                  {mode === "view" ? (
                    <div
                      className={`inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black tracking-widest border ${
                        form.employmentStatus === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-rose-50 text-rose-600 border-rose-100"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          form.employmentStatus === "ACTIVE"
                            ? "bg-emerald-500"
                            : "bg-rose-500"
                        }`}
                      ></span>
                      {form.employmentStatus}
                    </div>
                  ) : (
                    <select
                      name="employmentStatus"
                      value={form.employmentStatus}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: ACCESS */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <DetailField
                  label="Employee Email (Work)"
                  name="workEmail"
                  value={form.workEmail}
                  disabled={true}
                  helpText="This is the primary account identifier and cannot be modified."
                />
              </div>
            )}

            {/* FOOTER ACTIONS */}
            <div className="flex justify-end pt-10 mt-10 border-t border-slate-100">
              {mode === "edit" && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;
