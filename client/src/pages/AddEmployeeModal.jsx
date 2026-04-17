import { useState } from "react";

/* ================= REUSABLE INPUT COMPONENT ================= */
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

const AddEmployeeModal = ({ isOpen, onClose, onAdd }) => {
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    firstName: "", lastName: "", dob: "", phone: "", joiningDate: "", address: "", bio: "", image: null,
    department: "HR", position: "", salary: "", allowances: "", deductions: "", status: "ACTIVE",
    email: "",  role: "EMPLOYEE",
  });

  if (!isOpen) return null;

  const stepsInfo = [
    { id: 1, title: "Personal", desc: "Identity & Contact" },
    { id: 2, title: "Financial", desc: "Job & Salary" },
    { id: 3, title: "Security", desc: "Login Details" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    } else if (currentStep === 2) {
      if (!form.position) newErrors.position = "Position is required";
      if (!form.salary) newErrors.salary = "Salary amount is required";
    } else if (currentStep === 3) {
      if (!form.email) newErrors.email = "Work email is required";
      
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => validateStep(step) && setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    onAdd({ 
      ...form, 
      _id: Date.now().toString(), 
      salary: Number(form.salary),
      image: preview 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* SIDEBAR NAVIGATION (Desktop) */}
        <div className="w-full md:w-72 bg-slate-50 border-r border-slate-100 p-8 flex flex-col">
          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-800">New Hire</h3>
            <p className="text-xs text-slate-500">Employee Onboarding</p>
          </div>

          <div className="space-y-8 relative">
            {stepsInfo.map((s, idx) => (
              <div key={s.id} className="flex gap-4 relative z-10">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                  step >= s.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-slate-400 border border-slate-200"
                }`}>
                  {s.id}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${step >= s.id ? "text-slate-800" : "text-slate-400"}`}>{s.title}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">{s.desc}</p>
                </div>
              </div>
            ))}
            {/* Vertical Line Connector */}
            <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-slate-200 -z-0" />
          </div>

          <div className="mt-auto pt-10">
            <div className="bg-indigo-50 p-4 rounded-2xl">
              <p className="text-[11px] text-indigo-700 font-semibold leading-relaxed">
                Step {step} of 3 complete. Please fill all required fields marked with (*).
              </p>
            </div>
          </div>
        </div>

        {/* MAIN FORM AREA */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase">Step 0{step}</span>
              <h2 className="text-2xl font-black text-slate-800">{stepsInfo[step-1].title} Information</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">✕</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* STEP 1: PERSONAL */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <InputField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required error={errors.firstName} placeholder="John" />
                <InputField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required error={errors.lastName} placeholder="Doe" />
                <InputField label="Date of Birth" type="date" name="dob" value={form.dob} onChange={handleChange} />
                <InputField label="Joining Date" type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} />
                <InputField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} required error={errors.phone} placeholder="+1 234..." />
                <InputField label="Home Address" name="address" value={form.address} onChange={handleChange} placeholder="Street, City, Zip" />
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Brief Bio</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm min-h-[100px] bg-slate-50/30" placeholder="Tell us about the candidate..." />
                </div>
                <div className="md:col-span-2 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                  <input type="file" accept="image/*" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {preview ? (
                    <img src={preview} className="w-20 h-20 rounded-2xl object-cover shadow-xl border-4 border-white" />
                  ) : (
                    <div className="text-center">
                      <div className="text-indigo-600 font-bold text-sm mb-1">Click to upload photo</div>
                      <p className="text-[10px] text-slate-400 font-medium">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: FINANCIAL */}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-full">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Department</label>
                  <select name="department" value={form.department} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50/30 outline-none focus:ring-4 focus:ring-indigo-500/10">
                    <option>HR</option><option>IT</option><option>Finance</option><option>Marketing</option><option>Operations</option>
                  </select>
                </div>
                <InputField label="Position" name="position" value={form.position} onChange={handleChange} required error={errors.position} placeholder="Senior Developer" />
                <InputField label="Base Salary" type="number" name="salary" value={form.salary} onChange={handleChange} required error={errors.salary} placeholder="0.00" />
                <InputField label="Allowances" type="number" name="allowances" value={form.allowances} onChange={handleChange} placeholder="0.00" />
                <InputField label="Deductions" type="number" name="deductions" value={form.deductions} onChange={handleChange} placeholder="0.00" />
                <div className="w-full">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Employment Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50/30 outline-none focus:ring-4 focus:ring-indigo-500/10">
                    <option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 3: SECURITY */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <InputField label="Work Email" name="email" type="email" value={form.email} onChange={handleChange} required error={errors.email} placeholder="john.doe@company.com" />
                 
                </div>
                <div className="w-full">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">System Role</label>
                  <select name="role" value={form.role} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50/30 outline-none focus:ring-4 focus:ring-indigo-500/10">
                    <option value="EMPLOYEE">Standard Employee</option><option value="ADMIN">System Administrator</option>
                  </select>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">!</div>
                  <p className="text-[11px] text-amber-800 leading-normal font-medium">
                    The credentials provided here will allow the employee to access the dashboard. A password reset will be required on their first login.
                  </p>
                </div>
              </div>
            )}

            {/* FOOTER ACTIONS */}
            <div className="flex items-center justify-between pt-10 mt-10 border-t border-slate-100">
              <button type="button" onClick={step === 1 ? onClose : prevStep} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                {step === 1 ? "Cancel" : "Back to previous"}
              </button>

              <button 
                type={step === 3 ? "submit" : "button"}
                onClick={step === 3 ? undefined : nextStep}
                className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                {step === 3 ? "Complete Registration" : "Continue to Next Step"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;