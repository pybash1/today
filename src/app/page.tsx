"use client";

import { useState } from "react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Home() {
  const [menu, setMenu] = useState(false);

  return (
    <main className="flex min-h-screen flex-col bg-[#020202] px-48 py-10 text-white">
      <div className="text-5xl text-red-600">Today</div>
      <div className="text-2xl uppercase">
        {MONTHS[new Date().getMonth()]} '
        {new Date().toLocaleDateString(undefined, { year: "2-digit" })}
      </div>
      <div className="pt-24">
        <div className="text-3xl">Start working on Today</div>
        <div className="text-3xl line-through decoration-red-600 decoration-[5px]">
          Wake up in the middle of the night
        </div>
      </div>
      <div
        className={`fixed bottom-0 right-0 top-0 flex w-96 flex-col gap-4 bg-red-600 p-10 transition duration-300 ease-in-out ${
          menu ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-4xl text-white">Productivity</div>
        <div className="text-6xl text-black">6.9</div>
        <div className="text-xl text-black">
          Average tasks completed
          <br />
          over the last week
        </div>
        <div className="text-6xl text-black">69</div>
        <div className="text-xl text-black">Day streak</div>
        <div className="text-6xl text-black">4.2</div>
        <div className="text-xl text-black">
          Average tasks missed
          <br />
          over the last week
        </div>
      </div>
      <div className="absolute bottom-6 right-6 flex gap-4">
        <button
          className={`rounded-full bg-red-600 p-3 text-black outline-none`}
          onClick={() => setMenu(!menu)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
        <button
          className={`rounded-full bg-red-600 px-3.5 py-[1.125rem] outline-none`}
          onClick={() => setMenu(!menu)}
        >
          <div
            className={`h-px w-5 bg-black transition duration-300 ease-in-out ${
              menu ? "translate-y-[3.5px] -rotate-45" : ""
            }`}
          ></div>
          <div className="h-1.5"></div>
          <div
            className={`h-px w-5 bg-black transition duration-300 ease-in-out ${
              menu ? "-translate-y-[3.5px] rotate-45" : ""
            }`}
          ></div>
        </button>
      </div>
    </main>
  );
}
