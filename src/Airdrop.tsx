import React, { useState } from "react";
import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import "./App.css";
import { rabbitPhoto } from "./images";
import { useUser } from "./UserContext";
import Modal from "./Modal";

interface AirdropProps {
  address: string;
}

const Airdrop: React.FC<AirdropProps> = ({ address }) => {
  const [tonConnectUI] = useTonConnectUI();
  const { userID, points } = useUser();
  const userAddress = useTonAddress();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleWithdraw = async () => {
    if (!address) {
      setMessage("Please connect your TON wallet first");
      return;
    }

    if (points <= 0) {
      setMessage("No tokens available to withdraw");
      return;
    }

    try {
      setIsWithdrawing(true);
      const initData = window.Telegram.WebApp.initData || "";

      const response = await fetch('https://backend.hyenatongame.com/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Init-Data': initData
        },
        body: JSON.stringify({
          UserId: userID,
          WalletAddress: address,
          Amount: points
        })
      });

      if (!response.ok) {
        throw new Error('Withdrawal failed');
      }

      setMessage("Withdrawal successful! Tokens will appear in your wallet shortly.");
    } catch (error) {
      setMessage("Withdrawal failed. Please try again later.");
      console.error('Withdrawal error:', error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div
      className="w-full px-4 text-white md:h-[93.7vh] font-bold flex flex-col max-w-xl"
      style={{
        background: "linear-gradient(135deg, #A07747, #664D2B)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "white",
        textAlign: "center",
        padding: "0 5px",
        zIndex: 99999999999,
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="w-full text-white font-bold flex flex-col max-w-xl mt-6 gap-3">
        <div className="text-white flex flex-col text-center px-2 ">
          <h1 className="font-robotoCondensed tracking-wide font-bold text-3xl text-start uppercase z-50">
            Connect Your TON wallet
          </h1>
          <h1 className="text-xl font-[400] text-white/80 text-start font-robotoCondensed uppercase z-50">
            and
            <span className="text-white font-[500]"> Explore more</span>
          </h1>
        </div>
        <div className="relative flex items-center justify-center flex-col mx-auto  gap-4 w-full ">
          <div className="flex items-center justify-center relative w-[90%] mt-4 mb-10">
            {/* <LiaWolfPackBattalion className="text-[170px] text-black" /> */}
            <img
              src={rabbitPhoto}
              alt="ELIYIN image "
              className="h-[120px] w-[120px] rounded-3xl -ml-32 animate-pulse"
              style={{ transform: "rotate(-10deg)" }}
            />

            <div className="absolute top-3 z-30 right-7">
              <img
                src={rabbitPhoto}
                alt="Ghost"
                className="h-[120px] w-[120px] rounded-xl rotate-12 animate-pulse opacity-80"
                style={{ transform: "rotate(10deg)" }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center flex-col mx-auto gap-4 w-full px-2">
        <div
          onClick={() => {
            if (address) {
              tonConnectUI.disconnect(); // Disconnect wallet if address exists
            } else {
              tonConnectUI.connectWallet(); // Prompt to connect if no address
            }
          }}
          className="flex cursor-pointer justify-around items-center gap-4 w-full  py-3 text-white rounded-full z-50"
          style={{
            backgroundImage: "linear-gradient(to right, #A07747, #664D2B)"
          }}
        >
          {address ? (
            "Disconnect Wallet"
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="inline-block w-4 mr-3 mb-1">
                <svg
                  fill="white"
                  height="20px"
                  width="20px"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512 512"
                  xmlSpace="preserve"
                >
                  {/* SVG Path Data */}
                  <g>
                    <g>
                      <path
                        d="M361.739,278.261c-27.664,0-50.087,22.423-50.087,50.087s22.423,50.087,50.087,50.087H512V278.261H361.739z
                           M361.739,345.043c-9.22,0-16.696-7.475-16.696-16.696s7.475-16.696,16.696-16.696s16.696,7.475,16.696,16.696
                          S370.96,345.043,361.739,345.043z"
                      />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M361.739,244.87h83.478v-50.087c0-27.619-22.468-50.087-50.087-50.087H16.696C7.479,144.696,0,152.174,0,161.391v333.913
                          C0,504.521,7.479,512,16.696,512H395.13c27.619,0,50.087-22.468,50.087-50.087v-50.087h-83.478
                          c-46.032,0-83.478-37.446-83.478-83.478C278.261,282.316,315.707,244.87,361.739,244.87z"
                      />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M461.913,144.696h-0.158c10.529,13.973,16.854,31.282,16.854,50.087v50.087H512v-50.087
                          C512,167.164,489.532,144.696,461.913,144.696z"
                      />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M478.609,411.826v50.087c0,18.805-6.323,36.114-16.854,50.087h0.158C489.532,512,512,489.532,512,461.913v-50.087H478.609
                          z"
                      />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M273.369,4.892c-6.521-6.521-17.087-6.521-23.609,0l-14.674,14.674l91.74,91.738h52.956L273.369,4.892z" />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path d="M173.195,4.892c-6.521-6.522-17.086-6.522-23.608,0L43.174,111.304h236.435L173.195,4.892z" />
                    </g>
                  </g>
                </svg>
              </span>
              <h3 className="text-[14px]">Connect Wallet</h3>
            </div>
          )}
        </div>
        </div>

        {address && (
          <div className="flex items-center justify-center flex-col mx-auto gap-4 w-full px-2">
            <button
              onClick={handleWithdraw}
              disabled={isWithdrawing || points <= 0}
              className={`w-full py-3 rounded-lg font-bold ${
                isWithdrawing || points <= 0
                  ? 'bg-gray-500'
                  : 'bg-[#0075d9] hover:bg-[#0066cc]'
              }`}
            >
              {isWithdrawing ? 'Processing...' : 'Withdraw Tokens'}
            </button>
          </div>
        )}

        <div className="mt-2 flex items-center justify-center text-center flex-col gap-2">
          <h1 className="font-extrabold not-italic font-robotoCondensed text-lg z-50">
            More Coming Soon....
          </h1>
        </div>
      </div>

      {message && <Modal message={message} onClose={() => setMessage(null)} />}
    </div>
  );
};

export default Airdrop;
