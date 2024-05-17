import { useState, useEffect, Dispatch, SetStateAction } from "react";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { ethers } from "ethers";
import SafeApiKit from "@safe-global/api-kit";
import { sepolia } from "viem/chains";
import { SafeMultisigTransactionResponse } from "@safe-global/safe-core-sdk-types";

const safeAddress = process.env.NEXT_PUBLIC_SAFE_ADDRESS || "";

export const useSafeInit = () => {
  const [safeSdk, setSafeSdk] = useState<Safe | null>(null);
  const [safeService, setSafeService] = useState<SafeApiKit | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSafe = async () => {
      try {
        const safeAddress = process.env.NEXT_PUBLIC_SAFE_ADDRESS || "";
        const provider = new ethers.BrowserProvider(window.ethereum);
        const safeOwner = await provider.getSigner(0);
        const ethAdapter = new EthersAdapter({
          ethers,
          signerOrProvider: safeOwner,
        });
        const safeService = new SafeApiKit({ chainId: BigInt(sepolia.id) });
        setSafeService(safeService);
        const safeSdkInstance = await Safe.create({ ethAdapter, safeAddress });
        setSafeSdk(safeSdkInstance);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    initSafe();
  }, []);

  return { safeSdk, safeService, error, loading };
};

export const getOwners = async (
  safeSdk: Safe,
  setOwners: Dispatch<SetStateAction<string[]>>
) => {
  if (!safeSdk) return;
  const owners = await safeSdk.getOwners();
  setOwners(owners);
};

export const getTransactions = async (
  safeService: SafeApiKit,
  setTransactions: Dispatch<
    SetStateAction<SafeMultisigTransactionResponse[] | null>
  >
) => {
  if (!safeService) return;
  const pendingTxs = await safeService.getPendingTransactions(safeAddress);
  setTransactions(pendingTxs.results);
};
