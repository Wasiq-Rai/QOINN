import React from "react";
import IndexFundTracking from "./FundsTracking";
import StockSelectionProcess from "./StockSelectionProcess";

const QoinnExplainer: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg mx-6 mb-4">
      <IndexFundTracking/>
      <StockSelectionProcess />
    </div>
  );
};

export default QoinnExplainer;