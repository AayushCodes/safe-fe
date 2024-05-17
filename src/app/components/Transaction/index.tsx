"use client";

import {
  MetaTransactionData,
  SafeMultisigTransactionResponse,
} from "@safe-global/safe-core-sdk-types";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { Input } from "../Input";
import { useAccount } from "wagmi";
import { getOwners, getTransactions, useSafeInit } from "@/app/utils";

const safeAddress = process.env.NEXT_PUBLIC_SAFE_ADDRESS || "";

export const Transaction: React.FC = () => {
  const [recipient, setRecipient] = useState<string>("");
  const [txn, setTxn] = useState<string>("");
  const [amount, setAmount] = useState<string>("0");
  const { address } = useAccount();
  const [owners, setOwners] = useState<string[]>([]);
  const [pendingTxs, setPendingTxs] = useState<
    SafeMultisigTransactionResponse[] | null
  >(null);
  const { safeSdk, safeService, error, loading } = useSafeInit();

  useEffect(() => {
    if (!safeSdk || !safeService) return;
    getOwners(safeSdk, setOwners);
    getTransactions(safeService, setPendingTxs);
  }, [safeSdk, safeService]);

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.match(/^[0-9]*$/) || e.target.value === "") return;
    setAmount(ethers.parseUnits(e.target.value, "ether").toString());
  };

  const handleTxnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTxn(e.target.value);
  };

  const handlePropose = async () => {
    if (!safeSdk || !safeService) return;

    const safeTransactionData: MetaTransactionData = {
      to: recipient,
      data: "0x",
      value: amount,
    };
    const safeTransaction = await safeSdk.createTransaction({
      transactions: [safeTransactionData],
    });
    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
    const senderSignature = await safeSdk.signHash(safeTxHash);
    await safeService.proposeTransaction({
      safeAddress,
      safeTransactionData: safeTransaction.data,
      safeTxHash,
      senderAddress: address || "",
      senderSignature: senderSignature.data,
      origin,
    });
  };

  const handleConfirm = async () => {
    if (!safeSdk || !safeService) return;
    let signature = await safeSdk.signHash(txn);
    await safeService.confirmTransaction(txn, signature.data);
  };

  const handleExecute = async () => {
    if (!safeSdk || !safeService) return;
    const safeTransaction = await safeService.getTransaction(txn);
    const executeTxResponse = await safeSdk.executeTransaction(safeTransaction);
    const receipt =
      executeTxResponse.transactionResponse &&
      (await executeTxResponse.transactionResponse.wait());
  };

  return (
    <div className="flex flex-col gap-40 items-center justify-center flex-1 w-full py-20 px-20">
      <div className="flex w-full px-10 justify-between">
        <div className="flex flex-col items-center gap-5">
          <span>Safe Address: {safeAddress}</span>
          {!loading && (
            <div className="flex">
              <div className="flex flex-col gap-2 items-center">
                <span>Owners</span>
                {owners &&
                  owners.map((owner) => <span key={owner}>{owner}</span>)}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-col gap-2 items-center">
            <span>Pending Transaction</span>
            {pendingTxs &&
              pendingTxs.map((txn) => (
                <div key={txn.safeTxHash} className="flex gap-4">
                  <span>{txn.safeTxHash}</span>
                  <span>
                    {txn.confirmations?.length} / {txn.confirmationsRequired}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="flex w-full px-10 justify-center gap-20">
        <div className="flex flex-col gap-5 w-1/4 justify-center items-center">
          <Input placeholder="Recipient" onChange={handleRecipientChange} />
          <Input placeholder="Amount" onChange={handleAmountChange} />
          <button
            className="bg-blue-500 text-white px-4 w-full py-2 rounded-lg"
            onClick={async () => {
              await handlePropose();
            }}
          >
            Propose
          </button>
        </div>
        <div className="flex flex-col gap-5 w-1/4 justify-center items-center">
          <Input placeholder="Transaction Hash" onChange={handleTxnChange} />
          <div className="flex gap-4">
            <button
              className="bg-blue-500 text-white px-4 w-full py-2 rounded-lg"
              onClick={async () => {
                await handleConfirm();
              }}
            >
              Confirm
            </button>
            <button
              className="bg-blue-500 text-white px-4 w-full py-2 rounded-lg"
              onClick={async () => {
                await handleExecute();
              }}
            >
              Execute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
