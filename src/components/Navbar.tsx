import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import ThemeToggler from './ThemeToggler';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const { account, connectWallet, isConnected } = useWeb3();
  const { currentTheme } = useTheme();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Blockchain Crowdfunding
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggler />
            <Link
              to="/create"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Create Campaign
            </Link>
            
            {isConnected ? (
              <div className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md">
                {`${account?.slice(0, 6)}...${account?.slice(-4)}`}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 