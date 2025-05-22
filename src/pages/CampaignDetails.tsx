import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';

interface Campaign {
  id: number;
  creator: string;
  title: string;
  description: string;
  goal: string;
  raised: string;
  deadline: number;
  claimed: boolean;
}

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { contract, account, isConnected } = useWeb3();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [contribution, setContribution] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userContribution, setUserContribution] = useState('0');

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!contract || !id) return;

      try {
        const campaignData = await contract.getCampaign(id);
        setCampaign({
          id: campaignData.id.toNumber(),
          creator: campaignData.creator,
          title: campaignData.title,
          description: campaignData.description,
          goal: ethers.utils.formatEther(campaignData.goal),
          raised: ethers.utils.formatEther(campaignData.raised),
          deadline: campaignData.deadline.toNumber(),
          claimed: campaignData.claimed,
        });

        if (account) {
          const contribution = await contract.getContribution(id, account);
          setUserContribution(ethers.utils.formatEther(contribution));
        }
      } catch (error) {
        console.error('Error fetching campaign:', error);
        setError('Failed to load campaign details');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [contract, id, account]);

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !contract || !id) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const amountInWei = ethers.utils.parseEther(contribution);
      const tx = await contract.contribute(id, { value: amountInWei });
      await tx.wait();

      // Refresh campaign data
      const campaignData = await contract.getCampaign(id);
      setCampaign((prev) => ({
        ...prev!,
        raised: ethers.utils.formatEther(campaignData.raised),
      }));

      const userContributionData = await contract.getContribution(id, account);
      setUserContribution(ethers.utils.formatEther(userContributionData));
      setContribution('');
    } catch (error) {
      console.error('Error contributing:', error);
      setError('Failed to contribute. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimFunds = async () => {
    if (!isConnected || !contract || !id) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const tx = await contract.claimFunds(id);
      await tx.wait();

      // Refresh campaign data
      const campaignData = await contract.getCampaign(id);
      setCampaign((prev) => ({
        ...prev!,
        claimed: campaignData.claimed,
      }));
    } catch (error) {
      console.error('Error claiming funds:', error);
      setError('Failed to claim funds. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center text-red-600">
        Campaign not found
      </div>
    );
  }

  const isCreator = account?.toLowerCase() === campaign.creator.toLowerCase();
  const isExpired = Date.now() / 1000 > campaign.deadline;
  const canClaim = isCreator && isExpired && !campaign.claimed && parseFloat(campaign.raised) >= parseFloat(campaign.goal);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
        <p className="text-gray-600 mb-6">{campaign.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Campaign Details</h2>
            <div className="space-y-2">
              <p>
                <span className="text-gray-500">Creator:</span>{' '}
                <span className="font-medium">{campaign.creator}</span>
              </p>
              <p>
                <span className="text-gray-500">Goal:</span>{' '}
                <span className="font-medium">{campaign.goal} ETH</span>
              </p>
              <p>
                <span className="text-gray-500">Raised:</span>{' '}
                <span className="font-medium">{campaign.raised} ETH</span>
              </p>
              <p>
                <span className="text-gray-500">Deadline:</span>{' '}
                <span className="font-medium">
                  {new Date(campaign.deadline * 1000).toLocaleDateString()}
                </span>
              </p>
              <p>
                <span className="text-gray-500">Your Contribution:</span>{' '}
                <span className="font-medium">{userContribution} ETH</span>
              </p>
            </div>
          </div>

          {!isExpired && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Contribute</h2>
              <form onSubmit={handleContribute} className="space-y-4">
                <div>
                  <label htmlFor="contribution" className="block text-sm font-medium text-gray-700">
                    Amount (ETH)
                  </label>
                  <input
                    type="number"
                    id="contribution"
                    value={contribution}
                    onChange={(e) => setContribution(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Contributing...' : 'Contribute'}
                </button>
              </form>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {canClaim && (
          <button
            onClick={handleClaimFunds}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Claiming...' : 'Claim Funds'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CampaignDetails; 