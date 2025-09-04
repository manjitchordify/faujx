'use client';
// import { Check, CreditCard } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutSuccess() {
  return (
    <div className=" bg-white w-full py-16 lg:py-24 px-4">
      <div className="flex justify-center">
        <div className="bg-white  rounded-2xl shadow-[0px_7.33px_50.76px_14.66px_#00000040] w-full max-w-sm p-8 md:p-10 lg:w-4/5">
          <div className="bg-[#15A958] w-fit p-4 rounded-full mx-auto">
            <Image
              src={'/images/circle-tick.png'}
              width={40}
              height={40}
              alt=""
            />
          </div>
          <div className="text-center my-14 space-y-1">
            <h1 className="text-xl text-[#15A958]">Payment Successful!</h1>
            <p className="text-[#585858]">
              Your payment has been processed successfully.
            </p>
          </div>
          <div className="mt-10 flex justify-center text-center ">
            <Link href={'/pricing'}>
              <button className="flex items-center gap-2 bg-[#15A958] justify-center  text-white min-w-[12rem] px-6 py-3 rounded-2xl font-semibold hover:bg-[#17403c] transition">
                Proceed
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
