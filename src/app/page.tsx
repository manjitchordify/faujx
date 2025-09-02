import React from "react";
import Image from "next/image";

const Content = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="flex justify-center items-center pt-10">
        <Image
          src="/faujx.png"
          alt="FaujX Logo"
          width={240}
          height={60}
          className="w-60 h-[80px] md:w-72 md:h-[100px]"
        />
      </div>

      {/* Main Content */}
      <section>
        <div className="flex flex-col items-center justify-center px-2 lg:px-4 py-12 lg:py-10 max-w-7xl mx-auto">
          <div className="w-full text-center mt-11">
            <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-[#1F514C] leading-tight">
              FaujX — More Than Just for Applicants
            </h1>
            <p className="px-5 md:px-0 max-w-2xl mx-auto mt-4 text-base lg:text-lg leading-relaxed text-[#1F514C]/90 text-justify">
              FaujX is your global platform connecting{" "}
              <b>Foundation Engineers</b> with opportunities that matter —
              empowering <b>applicants</b> ready to showcase their capabilities,{" "}
              <b>clients</b> in need of top-tier vetted engineers, and{" "}
              <b>experts</b> eager to mentor, review, and guide projects to
              success.
            </p>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-[#1F514C] leading-tight mt-10 text-center">
            🚀 Stay Tuned — More Details Coming Soon!
          </h1>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 bg-white border-t border-black/5">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
          <p className="text-sm text-[#1F514C]/70 text-center">
            © {new Date().getFullYear()} FaujX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Content;
