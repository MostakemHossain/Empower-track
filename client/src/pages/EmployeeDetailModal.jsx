import { useEffect, useState, useRef } from "react";

/* ================= REUSABLE INPUT COMPONENT ================= */
const DetailField = ({ label, name, type = "text", value, onChange, disabled, placeholder, error, helpText }) => {
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
      {helpText && <p className="text-[10px] text-slate-400 mt-1.5 ml-1">{helpText}</p>}
    </div>
  );
};

const EmployeeDetailModal = ({ isOpen, onClose, employee, onSave }) => {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState("view"); 
  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (employee) {
      setForm(employee);
      setPreview(employee.image || null);
    }
  }, [employee]);

  if (!isOpen || !form) return null;

  const stepsInfo = [
    { id: 1, title: "Personal", desc: "Identity & Bio" },
    { id: 2, title: "Employment", desc: "Job & Financials" },
    { id: 3, title: "Access", desc: "Role & Security" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    setForm((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleToggleEdit = () => {
    if (mode === "edit") {
      setMode("view");
      setForm(employee); 
      setPreview(employee.image);
    } else {
      setMode("edit");
    }
  };

  const handleSave = () => {
    onSave(form);
    setMode("view");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px]">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="w-full md:w-72 bg-slate-50 border-r border-slate-100 p-8 flex flex-col">
          
          <div className="mb-10 flex flex-col items-center md:items-start group">
            <div className="w-24 h-24 rounded-2xl bg-indigo-100 mb-4 overflow-hidden border-4 border-white shadow-xl relative shrink-0">
              {preview ? (
                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-indigo-500 font-black text-3xl">
                  {form.firstName?.[0]}{form.lastName?.[0]}
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
            
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageChange} className="hidden" />

            <h3 className="text-lg font-bold text-slate-800 leading-tight">
              {form.firstName} {form.lastName}
            </h3>
            <p className="text-xs text-slate-500 font-medium">{form.position || "Employee"}</p>
          </div>

          <div className="space-y-6 relative">
            {stepsInfo.map((s) => (
              <button 
                key={s.id} 
                onClick={() => setStep(s.id)}
                className="flex gap-4 w-full text-left group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                  step === s.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-slate-400 border border-slate-200"
                }`}>
                  {s.id}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${step === s.id ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"}`}>{s.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{s.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <button 
              onClick={handleToggleEdit}
              className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                mode === "edit" ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
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
              <h2 className="text-2xl font-black text-slate-800 mt-2">{stepsInfo[step-1].title} Details</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">✕</button>
          </div>

          <div className="space-y-6">
            {/* STEP 1: PERSONAL */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <DetailField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} disabled={mode === "view"} />
                <DetailField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} disabled={mode === "view"} />
                <DetailField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} disabled={mode === "view"} />
                <DetailField label="Date of Birth" type="date" name="dob" value={form.dob} onChange={handleChange} disabled={mode === "view"} />
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Bio / Notes</label>
                  <textarea 
                    name="bio" 
                    value={form.bio} 
                    onChange={handleChange}
                    disabled={mode === "view"}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm min-h-[120px] bg-slate-50/30 disabled:bg-slate-50 disabled:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: EMPLOYMENT */}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="w-full">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Department</label>
                  <select 
                    name="department" 
                    disabled={mode === "view"} 
                    value={form.department} 
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-50 disabled:border-transparent"
                  >
                    <option>HR</option><option>IT</option><option>Finance</option><option>Marketing</option>
                  </select>
                </div>
                <DetailField label="Position" name="position" value={form.position} onChange={handleChange} disabled={mode === "view"} />
                <DetailField label="Monthly Salary" type="number" name="salary" value={form.salary} onChange={handleChange} disabled={mode === "view"} />
                <DetailField label="Joining Date" type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} disabled={mode === "view"} />
                <div className="w-full">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Status</label>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                    form.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    ● {form.status}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ACCESS */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* EMAIL FIELD - ALWAYS DISABLED */}
                <DetailField 
                  label="Work Email" 
                  name="email" 
                  value={form.email} 
                  disabled={true} 
                  helpText="Primary identifier cannot be changed."
                />
                
                <div className="w-full">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Account Role</label>
                  <select 
                    name="role" 
                    disabled={mode === "view"} 
                    value={form.role} 
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-50 disabled:border-transparent"
                  >
                    <option value="EMPLOYEE">Standard Employee</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>
              </div>
            )}

            {/* FOOTER ACTIONS */}
            <div className="flex justify-end pt-10 mt-10 border-t border-slate-100">
              {mode === "edit" && (
                <button 
                  onClick={handleSave}
                  className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-200 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Save Changes
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