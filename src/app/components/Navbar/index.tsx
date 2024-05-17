import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export const Navbar: React.FC = () => {
  return (
    <div className="flex w-full p-10 justify-between">
      <div className="flex gap-4 items-center">
        <Image
          src="https://file.notion.so/f/f/5010e4ee-a4be-4f75-a21f-79bde3054f7f/5afeb460-0ce7-4083-8bd5-9fcad433845f/Safe_Logos_Symbol_White.png?id=43bdff72-73b0-4b5e-abd8-79408b64d101&table=block&spaceId=5010e4ee-a4be-4f75-a21f-79bde3054f7f&expirationTimestamp=1716012000000&signature=CQHJsqRQUbEZhXx8FHenhLL4TerxawcQDRMT7KSnvlM&downloadName=Safe_Logos_Symbol_White.png"
          alt="Safe Multisig Logo"
          width={50}
          height={50}
        />
        <span className="text-2xl font-bold">Safe Multisig</span>
      </div>
      <ConnectButton />
    </div>
  );
};
