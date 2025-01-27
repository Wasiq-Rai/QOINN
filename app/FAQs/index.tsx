"use client";

import React, { useState } from "react";
import SingleFaq from "./faq";
import GetInTouch from "./getInTouch";
import { Faqs } from "./faqs";
import Image from "next/image";

const Faq = () => {
  const [faqs, setFaqs] = useState(Faqs);

  return (
    <div className="flex items-start gap-8 w-full h-[100%] overflow-y-auto relative overflow-x-hidden bg-black text-white my-10 px-4 md:px-24 lg:px-40 md:py-0 py-12">
      <div
        className="flex items-center lg:justify-between gap-4 w-full lg:flex-row flex-col m-auto"
        id="faqs"
      >
        <div className="flex flex-col items-start gap-3 w-2/5 ">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-semibold capitalize">
            Frequently asked{" "}
            <span className="bg-gradient-to-r from-gray-700 via-gray-900 to-black">
              questions
            </span>{" "}
          </h1>
          <p className="text-[13px] md:text-md leading-normal font-light w-[95%] md:w-[100%] opacity-80">
            Here are some of the most frequently asked questions <br /> about
            our QOINN Model.
          </p>
          <GetInTouch />
          <div className="relative w-full  h-auto flex justify-center items-center">
            <Image
              unoptimized
              quality={100}
              width={100}
              height={100}
              src="/logo-name.png"
              alt=""
              className="w-full h-auto rounded-lg shadow-lg mt-4 "
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full lg:w-[36rem]">
          {faqs.map((faq, index) => (
            <SingleFaq
              key={index}
              {...faq}
              onClick={(id) => {
                setFaqs((prev) =>
                  prev.map((faq) => {
                    if (faq.id === id) {
                      return {
                        ...faq,
                        active: !faq.active,
                      };
                    } else {
                      return {
                        ...faq,
                        active: false,
                      };
                    }
                  })
                );
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
