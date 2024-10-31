"use client";
import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
  ResponseEvent,
  MiniAppPaymentPayload,
} from "@worldcoin/minikit-js";
import { useEffect } from "react";
// ...
const sendPayment = async () => {
  const res = await fetch("/api/initiate-payment", {
    method: "POST",
  });

  const { id } = await res.json();

  console.log(id);

  const payload: PayCommandInput = {
    reference: id,
    to: "0x0c892815f0B058E69987920A23FBb33c834289cf", // Test address
    tokens: [
      {
        symbol: Tokens.WLD,
        token_amount: tokenToDecimals(0.5, Tokens.WLD).toString(),
      },
      {
        symbol: Tokens.USDCE,
        token_amount: tokenToDecimals(0.1, Tokens.USDCE).toString(),
      },
    ],
    description: "Watch this is a test",
  };

  if (MiniKit.isInstalled()) {
    MiniKit.commands.pay(payload);
  }
};

export const PayBlock = () => {
  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      console.error("MiniKit is not installed");
      return;
    }

    MiniKit.subscribe(
      ResponseEvent.MiniAppPayment,
      async (response: MiniAppPaymentPayload) => {
        if (response.status == "success") {
          const res = await fetch(`/api/confirm-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ payload: response }),
          });
          const payment = await res.json();
          if (payment.success) {
            // Congrats your payment was successful!
            console.log("SUCESS!");
          } else {
            // Payment failed
            console.log("FAILED!");
          }
        }
      }
    );

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppPayment);
    };
  }, []);

  return (
    <button className="bg-blue-500 p-4" onClick={sendPayment}>
      Pay
    </button>
  );
};
