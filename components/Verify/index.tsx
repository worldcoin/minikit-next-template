"use client";
import {
  MiniKit,
  ResponseEvent,
  VerificationLevel,
  MiniAppVerifyActionPayload,
  ISuccessResult,
} from "@worldcoin/minikit-js";
import { useEffect } from "react";

export type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel; // Default: Orb
};

const verifyPayload: VerifyCommandInput = {
  action: "test-action", // This is your action ID from the Developer Portal
  signal: "",
  verification_level: VerificationLevel.Orb, // Orb | Device
};

const triggerVerify = () => {
  MiniKit.commands.verify(verifyPayload);
};

export const VerifyBlock = () => {
  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      return;
    }

    MiniKit.subscribe(
      ResponseEvent.MiniAppVerifyAction,
      async (response: MiniAppVerifyActionPayload) => {
        if (response.status === "error") {
          return console.log("Error payload", response);
        }

        // Verify the proof in the backend
        const verifyResponse = await fetch("/api/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: response as ISuccessResult, // Parses only the fields we need to verify
            action: verifyPayload.action,
            signal: verifyPayload.signal, // Optional
          }),
        });

        // TODO: Handle Success!
        const verifyResponseJson = await verifyResponse.json();
        if (verifyResponseJson.status === 200) {
          console.log("Verification success!");
        }
      }
    );

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction);
    };
  }, []);

  return (
    <div>
      <h1>Verify Block</h1>
      <button className="bg-green-500 p-4" onClick={triggerVerify}>
        Test Verify
      </button>
    </div>
  );
};
