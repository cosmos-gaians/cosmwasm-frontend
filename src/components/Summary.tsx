import * as React from "react";
import styled from "styled-components";
import { SColumnRowTitle, SColumnRow } from "../components/common";
import { formatDisplayAmount } from "../helpers/utilities";
import { fonts } from "../styles";

const SSummaryRow = styled(SColumnRow)`
  font-size: ${fonts.size.smallMedium};
`;

const Summary = (props: any) => {
  const { checkout, settings } = props;
  return (
    <React.Fragment>
      <SSummaryRow>
        <SColumnRowTitle>{`Summary`}</SColumnRowTitle>
      </SSummaryRow>
      {settings.taxDisplay ? (
        <React.Fragment>
          <SSummaryRow>
            <div>{`Sub Total`}</div>
            <div>{formatDisplayAmount(checkout.subtotal, "WASM")}</div>
          </SSummaryRow>
          <SSummaryRow>
            <div>{`Tax`}</div>
            <div>{formatDisplayAmount(checkout.tax, "WASM")}</div>
          </SSummaryRow>
          <SSummaryRow>
            <div>{`Net Total`}</div>
            <div>{formatDisplayAmount(checkout.nettotal, "WASM")}</div>
          </SSummaryRow>
        </React.Fragment>
      ) : (
        <SSummaryRow>
          <div>{`Total`}</div>
          <div>{formatDisplayAmount(checkout.rawtotal, "WASM")}</div>
        </SSummaryRow>
      )}
    </React.Fragment>
  );
};

export default Summary;
