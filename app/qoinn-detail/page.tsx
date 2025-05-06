import React from "react";
import IndexFundTracking from "./FundsTracking";
import StockSelectionProcess from "./StockSelectionProcess";

import './styles.css'

const QoinnExplainer: React.FC = () => {
  return (
    <div>
      <IndexFundTracking/>
      <StockSelectionProcess />
    </div>
  );
};

export default QoinnExplainer;