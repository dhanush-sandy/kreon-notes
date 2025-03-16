import React from "react";
import { ArrowRight, Check, PenLine, Bell, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 md:py-20">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <div className="inline-block px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-sm font-medium mb-6">
            Organize your thoughts, simplify your life
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Kreon <span className="text-amber-600">Notes</span>
            <span className="block text-3xl md:text-4xl mt-2 text-amber-500">
              Your digital notebook, reimagined
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            Capture ideas, create drawings, set reminders, and organize your
            life with Kreon Notes - the all-in-one productivity app designed for
            the way you think.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium text-lg transition-colors flex items-center justify-center"
            >
              Get Started Free <ArrowRight size={18} className="ml-2" />
              <SignUpButton />
            </button>
            <button className="border border-gray-300 hover:border-amber-400 text-gray-700 px-6 py-3 rounded-lg font-medium text-lg transition-colors">
              <SignInButton />
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center text-sm text-gray-500">
            <div className="flex items-center mr-6 mb-2">
              <Check size={16} className="text-amber-500 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center mr-6 mb-2">
              <Check size={16} className="text-amber-500 mr-2" />
              Free forever plan
            </div>
            <div className="flex items-center mb-2">
              <Check size={16} className="text-amber-500 mr-2" />
              Secure cloud storage
            </div>
          </div>
        </div>

        <div className="md:w-1/2">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-amber-200 rounded-full opacity-50 animate-pulse"></div>
            <div
              className="absolute -bottom-8 -right-8 w-32 h-32 bg-amber-200 rounded-full opacity-50 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>

            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-transform hover:scale-[1.02] duration-500">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
              <img
                src="/app-screenshot.png"
                alt="Kreon Notes App Interface"
                className="w-full h-auto"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80";
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center mt-8 gap-3">
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
              <PenLine size={18} className="text-amber-500 mr-2" />
              <span className="text-sm font-medium">Text Notes</span>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
              <Bell size={18} className="text-amber-500 mr-2" />
              <span className="text-sm font-medium">Reminders</span>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
              <Calendar size={18} className="text-amber-500 mr-2" />
              <span className="text-sm font-medium">Drawings</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
