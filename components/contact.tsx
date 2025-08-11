'use client'
import { useTheme } from '@/context/ThemeContext'
import Link from 'next/link'
import React from 'react'

const Contact = () => {
    const { theme } =  useTheme();
  return (
    <section className="py-12 bg-white" id="contact">
          <div className="flex container px-4 md:px-6">

            <div className="flex flex-wrap justify-center mb-8 flex-col w-full h-full">
              <h2 className="text-3xl font-bold text-center md:text-left md:ml-4 mb-4 md:mb-0">
                {theme.strings.investWithQoinn}
              </h2>
              <p className="text-[20px] text-gray-600 text-center md:text-left md:ml-4 mb-4 md:mb-0">
                {theme.strings.investDescription}
              </p>
              <p className="text-[20px] text-gray-600 text-center md:text-left md:ml-4 mb-4 md:mb-0">
                {"Schedule a meeting for the best use of your investment options"}
              </p>
              <Link href="/invest">
                <button className="bg-[#3498db] hover:bg-[#2980b9] text-white font-bold py-2 px-4 rounded transition duration-300 md:ml-4 mt-6">
                  {theme.strings.learnMore}
                </button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-end mb-8 w-full">
              <img
                src="/img/logo/logo-with-name.png"
                alt="QOINN Logo"
                className=" h-[14rem] mb-4 md:mb-0 opacity-50"
              />
            </div>
          </div>
        </section>
  )
}

export default Contact