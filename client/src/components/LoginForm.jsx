import { useState } from "react"
import LoginLeftSide from "./LoginLeftSide"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { useForm } from "react-hook-form"

const LoginForm = ({ role = "employee", subTitle }) => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = (data) => {
    const payload = {
      role,
      ...data,
    }

    console.log("LOGIN DATA:", payload)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* LEFT SIDE */}
      <LoginLeftSide />

      {/* RIGHT SIDE */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-gradient-to-br from-gray-50 to-gray-100">

        <div className="w-full max-w-md">

          {/* HEADER */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <span
                className={`text-xs px-4 py-1 rounded-full font-medium tracking-wider border ${
                  role === "admin"
                    ? "bg-blue-50 text-blue-600 border-blue-100"
                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
                }`}
              >
                {role === "admin"
                  ? "ADMIN PORTAL ACCESS"
                  : "EMPLOYEE PORTAL ACCESS"}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold">
              <span className="text-gray-900">Welcome to </span>

              <span
                className={`bg-gradient-to-r bg-clip-text text-transparent ${
                  role === "admin"
                    ? "from-blue-600 via-indigo-500 to-blue-600"
                    : "from-emerald-500 via-green-500 to-emerald-500"
                }`}
              >
                Empower Track
              </span>
            </h1>

            <p className="mt-3 text-sm text-gray-500 max-w-sm mx-auto">
              {subTitle ||
                (role === "admin"
                  ? "Secure admin access for system management"
                  : "Access your dashboard and workflow")}
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-200"
          >

            {/* ADMIN FIELD */}
            {role === "admin" && (
              <div className="mb-5">
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  placeholder="Enter admin email"
                  {...register("email", {
                    required: "Email is required",
                  })}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            )}

            {/* EMPLOYEE FIELD */}
            {role === "employee" && (
              <div className="mb-5">
                <label className="text-sm text-gray-600">Employee ID</label>
                <input
                  type="text"
                  placeholder="Enter employee ID"
                  {...register("employeeId", {
                    required: "Employee ID is required",
                  })}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                />

                {errors.employeeId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.employeeId.message}
                  </p>
                )}
              </div>
            )}

            {/* PASSWORD */}
            <div className="mb-6">
              <label className="text-sm text-gray-600">Password</label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 4,
                      message: "Minimum 4 characters required",
                    },
                  })}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl text-white font-semibold transition ${
                role === "admin"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSubmitting
                ? "Logging in..."
                : role === "admin"
                ? "Login as Admin"
                : "Login as Employee"}
            </button>

            {/* BACK */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-4 w-full py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            >
              ← Back to Portal
            </button>

          </form>

          {/* FOOTER */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Secure authentication • Empower Track System
          </p>

        </div>
      </div>
    </div>
  )
}

export default LoginForm