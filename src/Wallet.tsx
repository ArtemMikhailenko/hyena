import React, { useState } from 'react';
import { useUser } from './UserContext';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
// import { rabbitPhoto } from './images';
import Modal from './Modal';

const Wallet: React.FC = () => {
  const { userID, points } = useUser();
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleWithdraw = async () => {
    if (!userAddress) {
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

      // Call backend to process withdrawal
      const response = await fetch('https://backend.hyenatongame.com/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Init-Data': initData
        },
        body: JSON.stringify({
          UserId: userID,
          WalletAddress: userAddress,
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
      className="relative text-white z-10"
      style={{
        background: "linear-gradient(135deg, #A07747, #664D2B)",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      
      <div className="relative z-10 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Wallet</h1>
        
        <div className="bg-white/10 rounded-lg p-6 mb-6">
          <h2 className="text-xl mb-2">Available Balance</h2>
          <p className="text-2xl font-bold">{points} HYENA</p>
        </div>

        {!userAddress ? (
          <div className="mb-6">
            <button
              onClick={() => tonConnectUI.connectWallet()}
              className="bg-[#0075d9] px-6 py-3 rounded-lg text-white w-full"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="bg-white/10 rounded-lg p-6 mb-6">
            <h2 className="text-xl mb-2">Connected Wallet</h2>
            <p className="text-sm break-all">{userAddress}</p>
          </div>
        )}

        <button
          onClick={handleWithdraw}
          disabled={isWithdrawing || !userAddress || points <= 0}
          className={`w-full py-3 rounded-lg font-bold ${
            isWithdrawing || !userAddress || points <= 0
              ? 'bg-gray-500'
              : 'bg-[#0075d9] hover:bg-[#0066cc]'
          }`}
        >
          {isWithdrawing ? 'Processing...' : 'Withdraw Tokens'}
        </button>
      </div>

      {message && <Modal message={message} onClose={() => setMessage(null)} />}
    </div>
  );
};

export default Wallet; 