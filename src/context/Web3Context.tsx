import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Crowdfunding from '../artifacts/contracts/Crowdfunding.sol/Crowdfunding.json';

interface Web3ContextType {
  account: string | null;
  contract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  contract: null,
  connectWallet: async () => {},
  isConnected: false,
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const account = accounts[0];
        setAccount(account);
        setIsConnected(true);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        
        const contract = new ethers.Contract(
          contractAddress,
          Crowdfunding.abi,
          signer
        );
        setContract(contract);
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0]);
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <Web3Context.Provider value={{ account, contract, connectWallet, isConnected }}>
      {children}
    </Web3Context.Provider>
  );
}; 