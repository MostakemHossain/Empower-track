const Loading = ({ text = "Loading..." }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
  
        <div className="flex flex-col items-center space-y-6">
  
          {/* Animated Rings */}
          <div className="relative w-16 h-16">
            <span className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></span>
            <span className="absolute inset-2 rounded-full border-4 border-green-400 border-b-transparent animate-spin-slow"></span>
          </div>
  
          {/* Text */}
          <p className="text-sm text-gray-600 tracking-wide animate-pulse">
            {text}
          </p>
  
        </div>
      </div>
    );
  };
  
  export default Loading;