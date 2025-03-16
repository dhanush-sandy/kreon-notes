import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-6 py-20">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/grid-pattern-white.svg')] bg-center opacity-10"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-400 rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-amber-400 rounded-full opacity-20 transform translate-x-1/3 translate-y-1/3"></div>

        <div className="relative px-8 py-16 md:p-16 text-center">
          <div className="inline-block px-4 py-1.5 bg-blue-500 bg-opacity-30 text-white rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            Start organizing your ideas today
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight">
            Ready to transform how you capture and organize your thoughts?
          </h2>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of users who have already improved their productivity with Kreon Notes. Start for free, no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate("/sign-up")}
              className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium text-lg transition-colors flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              Get Started Free <ArrowRight size={18} className="ml-2" />
            </button>
            <button
              onClick={() => navigate("/sign-in")}
              className="bg-blue-700 bg-opacity-30 hover:bg-opacity-40 text-white border border-blue-400 px-8 py-4 rounded-lg font-medium text-lg transition-colors backdrop-blur-sm"
            >
              Sign In
            </button>
          </div>

          <p className="text-blue-200 mt-8 text-sm">
            No credit card required • Free forever plan • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;