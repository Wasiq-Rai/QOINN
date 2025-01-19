import React from 'react';
import Image from 'next/image'

const Header = () => {
  return (
    <section className="relative pt-10 pb-40" >
      <div className="container mx-auto px-4 relative">
        {/* First Image */}
        <Image unoptimized  quality={100}width={0} height={0} src="/img/banner/banner_shape01.png" alt="Banner Shape 01" className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2" style={{ width: "200px" }} />
        
        {/* Second Image */}
        <Image unoptimized  quality={100}width={0} height={0} src="/img/banner/banner_shape02.png" alt="Banner Shape 02" className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2" style={{ width: "200px" }} />
        
        {/* Third Image */}
        <Image unoptimized  quality={100}width={0} height={0} src="/img/banner/banner_shape03.png" alt="Banner Shape 03" className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2" style={{ width: "200px" }} />
        
        <div className="flex justify-center">
          <div className="lg:col-span-10">
            <div className="text-center mx-5 relative z-10">
              <h1 className="text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                <br />We Keep Trading<br />
              </h1>
              <h1 className="text-2xl p-6 font-bold leading-none tracking-tight text-gray-900  dark:text-white">
              The industry{"'"}s leading tool at a priiiice to suit everyone.
              </h1>
              <h1 className="text-2xl my-10 p-6 font-bold leading-none tracking-tight text-gray-900  dark:text-white">
              <br />Select the Plan that Fits Your Trading Goals              </h1>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
