'use client';

import Link from 'next/link';
import { useAppSelector } from '@/store/store';

export default function JumpstartCareer() {
  const loggedInUser = useAppSelector(state => state.user.loggedInUser);

  const isLoggedIn = !!loggedInUser?.accessToken;

  return (
    <section className="pt-8 pb-16">
      <div className="w-11/12 md:w-3/5 mx-auto shadow-[0px_4px_44px_0px_#00000040] 2xl:p-10 p-4 md:p-6 lg:p-8 rounded-2xl">
        <div className="2xl:p-10 p-4 md:p-6 lg:p-8 rounded-2xl text-center border border-[#D9D9D9]">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center 2xl:text-5xl font-semibold text-[#1F514C] mb-2.5 md:mb-4">
            Jumpstart Your Tech Career
          </h2>
          <p className="mb-6 font-light 2xl:mb-12">
            &quot;Choose your next step and get started today.&quot;
          </p>
          <div className="mb-6 max-w-2xl mx-auto lg:mb-8 flex max-md:flex-col items-center gap-4 justify-center">
            <Link
              href={isLoggedIn ? '/engineer/dashboard' : '/engineer/signup'}
              className="flex-1 cursor-pointer bg-[#54A044] hover:bg-[#54A044]/75 text-white font-semibold py-2 px-6 2xl:py-3 rounded-2xl text-sm md:text-base 2xl:text-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Apply as Foundation Engineer
            </Link>
            <Link
              href={'/engineer/dashboard/browse-mentors'}
              className="flex-1 cursor-pointer bg-[#54A044] hover:bg-[#54A044]/75 text-white font-semibold py-2 px-6 2xl:py-3 rounded-2xl text-sm md:text-base 2xl:text-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Book a Free Mentor Call
            </Link>
          </div>

          <hr className="border-t-2 border-[#B2BBB8]" />
        </div>
      </div>
    </section>
  );
}
