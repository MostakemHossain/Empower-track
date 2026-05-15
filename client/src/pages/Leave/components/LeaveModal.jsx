const LeaveModal = ({
    open,
    onClose,
    form,
    setForm,
    handleSubmit,
    submitLoading,
  }) => {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl">
          <h2 className="font-bold text-xl mb-4">
            Apply Leave
          </h2>
  
          <div className="space-y-3">
            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl"
            >
              <option value="ANNUAL">
                Annual
              </option>
  
              <option value="SICK">
                Sick
              </option>
  
              <option value="CASUAL">
                Casual
              </option>
            </select>
  
            <input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  startDate: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl"
            />
  
            <input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  endDate: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl"
            />
  
            <textarea
              placeholder="Reason"
              value={form.reason}
              onChange={(e) =>
                setForm({
                  ...form,
                  reason: e.target.value,
                })
              }
              className="w-full border p-3 rounded-xl"
            />
          </div>
  
          <div className="flex justify-end gap-3 mt-5">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 rounded-xl font-semibold"
            >
              Cancel
            </button>
  
            <button
              onClick={handleSubmit}
              disabled={submitLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default LeaveModal;