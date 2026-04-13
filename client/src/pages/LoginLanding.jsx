import LoginLeftSide from "../components/LoginLeftSide"
import { useNavigate } from "react-router-dom"

const LoginLanding = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100">

      <LoginLeftSide />

      <div className="flex flex-1 items-center justify-center px-6 py-12">

        <div className="w-full max-w-lg">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
              Choose Your Portal
            </h1>
            <p className="text-gray-500 mt-3 text-sm">
              Select how you want to access the system
            </p>
          </div>

          <div className="space-y-8">

            {/* Admin Portal */}
            <div
              onClick={() => navigate("/login/admin")}
              className="relative group rounded-2xl p-[1.5px] overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 animate-spin-slow bg-[conic-gradient(at_top_left,_#3b82f6,_#60a5fa,_#3b82f6)]" />

              <div className="relative bg-white rounded-2xl p-6 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">

                <div className="flex items-center gap-5">

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 text-xl font-semibold">
                    A
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                      Admin Portal
                    </h2>
                    <p className="text-sm text-gray-500">
                      Manage users, monitor system and configure settings
                    </p>
                  </div>

                  <span className="text-gray-400 group-hover:text-blue-500 transition">
                    →
                  </span>

                </div>
              </div>
            </div>

            {/* Employee Portal */}
            <div
              onClick={() => navigate("/login/employee")}
              className="relative group rounded-2xl p-[1.5px] overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 animate-spin-slow bg-[conic-gradient(at_top_left,_#22c55e,_#4ade80,_#22c55e)]" />

              <div className="relative bg-white rounded-2xl p-6 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">

                <div className="flex items-center gap-5">

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-600 text-xl font-semibold">
                    E
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition">
                      Employee Portal
                    </h2>
                    <p className="text-sm text-gray-500">
                      Access dashboard, tasks and daily workflow
                    </p>
                  </div>

                  <span className="text-gray-400 group-hover:text-green-500 transition">
                    →
                  </span>

                </div>
              </div>
            </div>

          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-gray-400">
              Authorized access only • Secure system
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default LoginLanding