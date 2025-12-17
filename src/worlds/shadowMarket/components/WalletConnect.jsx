import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WalletConnect({ connected, address, onConnect, onDisconnect }) {
  const [showModal, setShowModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const wallets = [
    { name: "MetaMask", icon: "🦊", color: "from-orange-600 to-orange-500" },
    { name: "WalletConnect", icon: "🔗", color: "from-blue-600 to-blue-500" },
    { name: "Coinbase Wallet", icon: "💼", color: "from-indigo-600 to-indigo-500" },
    { name: "Trust Wallet", icon: "🛡️", color: "from-cyan-600 to-cyan-500" },
  ];

  const handleConnect = async (walletName) => {
    setIsConnecting(true);
    
    // Mock wallet connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockAddress = "0x" + Math.random().toString(16).slice(2, 42).padEnd(40, "0");
    onConnect(mockAddress);
    setShowModal(false);
    setIsConnecting(false);
  };

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (connected) {
    return (
      <div className="flex items-center gap-4">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white font-mono text-sm">{formatAddress(address)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Balance:</span>
            <span className="text-white font-semibold">1,234.56 USDT</span>
          </div>
        </div>
        <button
          onClick={onDisconnect}
          className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-[0_0_30px_rgba(14,165,233,0.4)] transition-all"
      >
        Connect Wallet
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isConnecting && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl p-8 max-w-md w-full shadow-[0_0_60px_rgba(14,165,233,0.2)]"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Connect Wallet</h2>
              <p className="text-purple-300/70 text-sm mb-6">
                Choose your preferred wallet to connect to Shadow Market
              </p>

              <div className="space-y-3">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => handleConnect(wallet.name)}
                    disabled={isConnecting}
                    className={`w-full p-4 bg-gradient-to-r ${wallet.color} hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] text-white font-semibold rounded-xl transition-all flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <span className="text-3xl">{wallet.icon}</span>
                    <span className="flex-1 text-left">{wallet.name}</span>
                    {isConnecting && (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-purple-500/20">
                <p className="text-purple-300/50 text-xs text-center">
                  By connecting, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
