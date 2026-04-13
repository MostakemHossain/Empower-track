"use client";

import { Building2, Users, Shield, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

const words = ["Workforce", "Employees", "Teams", "Organization"];

const LoginLeftSide = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const speed = isDeleting ? 80 : 120; 

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // typing
        setText(currentWord.substring(0, text.length + 1));

        if (text === currentWord) {
          // pause before deleting
          setTimeout(() => setIsDeleting(true), 1200);
        }
      } else {
        // deleting
        setText(currentWord.substring(0, text.length - 1));

        if (text === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex]);

  return (
    <div className="hidden w-[50%] lg:flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-12 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[420px] h-[420px] bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Top */}
      <div className="relative z-10 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-14">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Empower Track
            </h1>
            <p className="text-slate-400 text-xs">Smart Workforce Management</p>
          </div>
        </div>

        {/* Hero */}
        <div className="mb-10">
          <h2 className="text-5xl font-extrabold text-white leading-tight mb-5">
            Empower Your <br />
            {/* TYPEWRITER EFFECT */}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {text}
              <span className="animate-pulse">|</span>
            </span>
          </h2>

          <p className="text-slate-400 text-lg max-w-md">
            Optimize employee management, monitor performance, and scale your
            organization with intelligent tools.
          </p>
        </div>
      </div>

      {/* Features */}
      {/* Features */}
      <div className="relative z-10 grid grid-cols-2 gap-6 mb-12">
        {/* Team Collaboration */}
        <div className="flex gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-blue-500/10 transition">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-500/20">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">
              Team Collaboration
            </h3>
            <p className="text-slate-400 text-xs">Seamless teamwork</p>
          </div>
        </div>

        {/* Secure Access */}
        <div className="flex gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-indigo-500/10 transition">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-indigo-500/20">
            <Shield className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Secure Access</h3>
            <p className="text-slate-400 text-xs">Enterprise security</p>
          </div>
        </div>

        {/* Analytics */}
        <div className="flex gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-cyan-500/10 transition">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-cyan-500/20">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Analytics</h3>
            <p className="text-slate-400 text-xs">Smart insights</p>
          </div>
        </div>

        {/* Scalable */}
        <div className="flex gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-emerald-500/10 transition">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-emerald-500/20">
            <Building2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">
              Scalable System
            </h3>
            <p className="text-slate-400 text-xs">Grow effortlessly</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <p className="text-slate-500 text-sm">
          Trusted by modern teams worldwide
        </p>
      </div>
    </div>
  );
};

export default LoginLeftSide;
