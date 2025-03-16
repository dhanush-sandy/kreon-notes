import React from "react";
import {
  Check,
  PenLine,
  Bell,
  Calendar,
  Palette,
  Cloud,
  Share2,
  Search,
  Smartphone,
  Shield,
} from "lucide-react";

const Features = () => {
  return (
    <section id="features" className="container mx-auto px-4 sm:px-6 py-16 md:py-20">
      <div className="text-center mb-12 md:mb-16">
        <div className="inline-block px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-sm font-medium mb-4">
          Powerful Features
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Everything you need in one place
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Kreon Notes combines note-taking, drawing tools, and smart reminders in one
          beautiful, intuitive interface designed for productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow hover:border-amber-200 group">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-200 transition-colors">
            <PenLine className="text-amber-600" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
            Rich Text Notes
          </h3>
          <p className="text-gray-600">
            Create beautiful notes with rich formatting. Organize them with colors and categories for easy access.
          </p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center text-sm text-gray-500">
              <Check size={16} className="text-amber-500 mr-2 flex-shrink-0" />
              <span>Color-coded organization</span>
            </li>
            <li className="flex items-center text-sm text-gray-500">
              <Check size={16} className="text-amber-500 mr-2 flex-shrink-0" />
              <span>Rich text formatting</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow hover:border-amber-200 group">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-200 transition-colors">
            <Bell className="text-amber-600" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
            Smart Reminders
          </h3>
          <p className="text-gray-600">
            Never miss a deadline with customizable reminders via email, SMS, or browser notifications.
          </p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center text-sm text-gray-500">
              <Check size={16} className="text-amber-500 mr-2 flex-shrink-0" />
              <span>Multiple notification channels</span>
            </li>
            <li className="flex items-center text-sm text-gray-500">
              <Check size={16} className="text-amber-500 mr-2 flex-shrink-0" />
              <span>Auto-completion tracking</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow hover:border-amber-200 group">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-200 transition-colors">
            <Palette className="text-amber-600" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
            Drawing Canvas
          </h3>
          <p className="text-gray-600">
            Express your creativity with our digital canvas. Sketch ideas, create diagrams, or just doodle.
          </p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center text-sm text-gray-500">
              <Check size={16} className="text-amber-500 mr-2 flex-shrink-0" />
              <span>Multiple brush sizes and colors</span>
            </li>
            <li className="flex items-center text-sm text-gray-500">
              <Check size={16} className="text-amber-500 mr-2 flex-shrink-0" />
              <span>Save and edit drawings</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-16 md:mt-20">
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-6 md:p-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <div className="inline-block px-3 py-1 bg-amber-200 text-amber-700 rounded-full text-sm font-medium mb-4">
                Seamless Experience
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Your notes, your way, anywhere you go
              </h3>
              <p className="text-gray-700 mb-6">
                Kreon Notes adapts to your workflow, not the other way around. With cloud sync, your notes are always available on any device.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: <Cloud size={18} className="text-amber-500" />, text: "Automatic cloud synchronization" },
                  { icon: <Search size={18} className="text-amber-500" />, text: "Powerful search across all notes" },
                  { icon: <Share2 size={18} className="text-amber-500" />, text: "Easy sharing options" },
                  { icon: <Smartphone size={18} className="text-amber-500" />, text: "Responsive design for all devices" },
                  { icon: <Shield size={18} className="text-amber-500" />, text: "Secure and private" },
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="mr-3 bg-white p-2 rounded-full shadow-sm">
                      {feature.icon}
                    </div>
                    <span className="text-gray-700">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:w-1/2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transform transition-transform hover:scale-[1.02] duration-500">
                <div className="relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
                  <img
                    src="/app-features.png"
                    alt="Kreon Notes Features"
                    className="w-full h-auto"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
