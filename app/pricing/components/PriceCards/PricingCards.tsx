import React from 'react';
import FreeCard from './FreeCard';
import ProCard from './ProCard';
import Pluscard from './Pluscard';

const PricingCards = () => {
  return (
    <div className="flex justify-evenly mb-40">
     
      {/* Right card */}
      <div className="relative">
        <div className=" rounded-lg shadow-md p-4">
          <ProCard/>
        </div>
      </div>
    </div>
  );
};

export default PricingCards;
