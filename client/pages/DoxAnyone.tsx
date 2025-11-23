import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";

export default function DoxAnyone() {
  const handleDoxNow = () => {
    window.open("https://discord.com", "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col animate-fadeIn">
      <Header />
      <main className="flex-1 w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          {/* Header Section */}
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 text-yellow-500">
              Dox Anyone
            </h1>
            <p className="text-base sm:text-lg text-gray-400 mb-6 max-w-2xl mx-auto">
              Expose individuals publicly on our platform
            </p>
          </div>

          {/* Pricing Section */}
          <div className="bg-slate-800 border-2 border-slate-700 rounded-lg sm:rounded-xl p-6 sm:p-8 mb-10 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-white">
              Service Pricing
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-slate-900 rounded-lg p-5 sm:p-6 border border-yellow-500">
                <p className="text-xs sm:text-sm font-semibold text-yellow-500 mb-2">
                  PAKISTAN
                </p>
                <p className="text-2xl sm:text-3xl font-black text-yellow-500">
                  299
                </p>
                <p className="text-xs sm:text-sm text-yellow-500 font-semibold">PKR</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-5 sm:p-6 border border-yellow-500">
                <p className="text-xs sm:text-sm font-semibold text-yellow-500 mb-2">
                  UNITED STATES
                </p>
                <p className="text-2xl sm:text-3xl font-black text-yellow-500">
                  1.10
                </p>
                <p className="text-xs sm:text-sm text-yellow-500 font-semibold">USD</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-5 sm:p-6 border border-yellow-500">
                <p className="text-xs sm:text-sm font-semibold text-yellow-500 mb-2">
                  INDIA
                </p>
                <p className="text-2xl sm:text-3xl font-black text-yellow-500">
                  99
                </p>
                <p className="text-xs sm:text-sm text-yellow-500 font-semibold">INR</p>
              </div>
            </div>
          </div>

          {/* Instructions Section */}
          <div className="bg-slate-800 border-2 border-slate-700 rounded-lg sm:rounded-xl p-6 sm:p-8 mb-10 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-white">
              How It Works
            </h2>
            <div className="space-y-5 sm:space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-yellow-500 text-slate-900 font-bold text-sm sm:text-base">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                    Click the Dox Button Below
                  </h3>
                  <p className="text-sm text-gray-400">
                    Click on the "Dox Now" button to proceed with creating your
                    doxing submission.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-yellow-500 text-slate-900 font-bold text-sm sm:text-base">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                    Create a Support Ticket on Discord
                  </h3>
                  <p className="text-sm text-gray-400">
                    Create a support ticket on our Discord Server with your
                    doxing request details.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-yellow-500 text-slate-900 font-bold text-sm sm:text-base">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                    Prepare Your Content
                  </h3>
                  <p className="text-sm text-gray-400">
                    Make sure to have a photo and some details for the specific
                    person you want to dox. The more information you provide,
                    the better.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-yellow-500 text-slate-900 font-bold text-sm sm:text-base">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                    Payment & Verification
                  </h3>
                  <p className="text-sm text-gray-400">
                    Complete the payment as per the pricing in your region. One
                    of our moderators will verify your submission.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-yellow-500 text-slate-900 font-bold text-sm sm:text-base">
                    5
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">
                    Publication
                  </h3>
                  <p className="text-sm text-gray-400">
                    After payment confirmation and verification, one of our
                    moderators will post your dox on our website.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-6 sm:mt-8">
            <button
              onClick={handleDoxNow}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-bold text-sm sm:text-base rounded-lg hover:shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Dox Now
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
