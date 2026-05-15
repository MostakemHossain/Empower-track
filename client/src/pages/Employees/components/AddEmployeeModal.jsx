import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { DEPARTMENTS } from "../../../assets/assets";

const InputField = ({ label, name, type = "text", value, onChange, required, error, placeholder }) => {
  return (
    <div className="w-full">
      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
        className={`w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none text-sm ${
          error 
            ? "border-rose-500 bg-rose-50/30 focus:ring-4 focus:ring-rose-500/10" 
            : "border-slate-200 bg-slate-50/30 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white"
        }`}
      />
      {error && <p className="text-[10px] text-rose-500 font-medium mt-1.5 flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-rose-500" /> {error}
      </p>}
    </div>
  );
};

const AddEmployeeModal = ({ isOpen, onClose, onAdd,fetchEmployees }) => {
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    firstName: "", lastName: "", dob: "", phone: "", personalEmail: "", 
    joiningDate: "", address: "", bio: "", image: null,
    department: DEPARTMENTS[0] || "Design", position: "", salary: "", 
    allowances: "", deductions: "", employmentStatus: "ACTIVE",
  };

  const [form, setForm] = useState(initialFormState);

  if (!isOpen) return null;

  const resetForm = () => {
    setForm(initialFormState);
    setPreview(null);
    setErrors({});
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = (name === "salary" || name === "allowances" || name === "deductions") ? Number(value) : value;
    setForm((prev) => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const validateStep = (currentStep) => {
    let newErrors = {};
    if (currentStep === 1) {
      if (!form.firstName) newErrors.firstName = "First name is required";
      if (!form.lastName) newErrors.lastName = "Last name is required";
      if (!form.phone) newErrors.phone = "Phone number is required";
      if (!form.personalEmail) newErrors.personalEmail = "Personal email is required";
    } else if (currentStep === 2) {
      if (!form.position) newErrors.position = "Position is required";
      if (!form.salary) newErrors.salary = "Salary amount is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = (e) => {
    e.preventDefault(); 
    if (validateStep(1)) setStep(2);
  };

  const prevStep = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (step !== 2) return; 

    if (!validateStep(2)) return;

    try {
      setLoading(true);
      const formData = new FormData();
      const { image, ...textData } = form;

      formData.append("data", JSON.stringify({
        ...textData,
        baseSalary: textData.salary 
      }));

      if (image) formData.append("file", image);

      const res = await api.post("/employee/create-employee", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        toast.success("Employee onboarded successfully!");
        fetchEmployees();
        onAdd(res.data.data);
        handleClose(); 
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={handleClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-137.5">
        
        {/* SIDEBAR */}
        <div className="w-full md:w-72 bg-slate-50 border-r border-slate-100 p-8 flex flex-col">
          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-800">New Hire</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">EmpowerTrack</p>
          </div>

          <div className="space-y-8 relative">
            {[
              { id: 1, title: "Personal", desc: "Identity & Contact" },
              { id: 2, title: "Financial", desc: "Job & Salary" }
            ].map((s) => (
              <div key={s.id} className="flex gap-4 relative z-10">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                  step >= s.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-slate-400 border border-slate-200"
                }`}>
                  {s.id}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${step >= s.id ? "text-slate-800" : "text-slate-400"}`}>{s.title}</h4>
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">{s.desc}</p>
                </div>
              </div>
            ))}
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200 z-0" />
          </div>
        </div>

        {/* MAIN FORM */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-2xl font-black text-slate-800">{step === 1 ? 'Personal' : 'Financial'} Information</h2>
            <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <InputField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required error={errors.firstName} />
                <InputField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required error={errors.lastName} />
                <InputField label="Personal Email" name="personalEmail" type="email" value={form.personalEmail} onChange={handleChange} required error={errors.personalEmail} />
                <InputField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} required error={errors.phone} />
                <InputField label="Date of Birth" type="date" name="dob" value={form.dob} onChange={handleChange} />
                <InputField label="Joining Date" type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} />
                <div className="md:col-span-2 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                  <input type="file" accept="image/*" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {preview ? <img src={preview} className="w-20 h-20 rounded-2xl object-cover shadow-xl border-4 border-white" /> : <p className="text-sm font-bold text-indigo-600">Upload Photo</p>}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-full">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Department</label>
                  <select name="department" value={form.department} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50/30 outline-none">
                    {DEPARTMENTS.map((dep) => <option key={dep} value={dep}>{dep}</option>)}
                  </select>
                </div>
                <InputField label="Position" name="position" value={form.position} onChange={handleChange} required error={errors.position} />
                <InputField label="Base Salary" type="number" name="salary" value={form.salary} onChange={handleChange} required error={errors.salary} />
                <InputField label="Allowances" type="number" name="allowances" value={form.allowances} onChange={handleChange} />
                <InputField label="Deductions" type="number" name="deductions" value={form.deductions} onChange={handleChange} />
                <div className="w-full">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Status</label>
                  <select name="employmentStatus" value={form.employmentStatus} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50/30 outline-none">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-10 mt-10 border-t border-slate-100">
              <button type="button" onClick={step === 1 ? handleClose : prevStep} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                {step === 1 ? "Cancel" : "Back"}
              </button>

              {step === 1 ? (
                <button 
                  type="button" // This MUST be type="button" to prevent submission
                  onClick={nextStep}
                  className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-200 transition-all hover:-translate-y-0.5"
                >
                  Continue to Financial
                </button>
              ) : (
                <button 
                  type="submit" // Final submission
                  disabled={loading}
                  className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-200 transition-all hover:-translate-y-0.5"
                >
                  {loading ? "Onboarding..." : "Complete Onboarding"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;