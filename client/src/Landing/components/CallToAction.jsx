import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CallToAction = () => {
    return (
        <section className="relative py-16 md:py-24 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-amber-50 opacity-70"></div>
            <div className="absolute inset-0" style={{ backgroundImage: "url('/grid-pattern-amber.svg')", backgroundSize: "30px 30px" }}></div>

            <div className="relative container mx-auto px-4 sm:px-6">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                            <div className="h-full flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                        Start organizing your thoughts today
                                    </h3>
                                    <p className="text-amber-100 mb-6">
                                        Join thousands of users who have transformed their productivity with Kreon Notes. Your journey to better organization starts here.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3 mt-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-400 bg-opacity-20 text-white text-sm">
                                        Free to start
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-400 bg-opacity-20 text-white text-sm">
                                        No credit card
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-400 bg-opacity-20 text-white text-sm">
                                        Cancel anytime
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 p-8 md:p-12 bg-white">
                            <div className="h-full flex flex-col justify-center">
                                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                                    Ready to get started?
                                </h4>
                                <p className="text-gray-600 mb-8">
                                    Create your free account in seconds and experience the power of Kreon Notes. No commitments, no hassle.
                                </p>
                                <div className="space-y-3 sm:space-y-0 sm:flex sm:space-x-4">
                                    <Link
                                        to="/signup"
                                        className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                                    >
                                        Sign up for free
                                        <ArrowRight size={18} className="ml-2" />
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                                    >
                                        Log in
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction; 