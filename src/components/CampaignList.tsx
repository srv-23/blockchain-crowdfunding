import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { formatEther } from 'ethers/lib/utils';

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

const CampaignList: React.FC = () => {
  const { contract, account } = useWeb3();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!contract) return;
      try {
        const count = await contract.campaignCount();
        const campaignPromises = [];
        for (let i = 1; i <= count; i++) {
          campaignPromises.push(contract.getCampaign(i));
        }
        const campaignData = await Promise.all(campaignPromises);
        setCampaigns(campaignData.map((campaign, index) => ({
          id: index + 1,
          creator: campaign.creator,
          title: campaign.title,
          description: campaign.description,
          goal: formatEther(campaign.goal),
          raised: formatEther(campaign.raised),
          deadline: Number(campaign.deadline),
          claimed: campaign.claimed
        })));
      } catch (err) {
        setError('Failed to fetch campaigns');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [contract]);

  const getCampaignTheme = (campaign: Campaign) => {
    const now = Math.floor(Date.now() / 1000);
    const progress = (Number(campaign.raised) / Number(campaign.goal)) * 100;
    
    if (campaign.claimed) {
      return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
    }
    
    if (now > campaign.deadline) {
      return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200';
    }
    
    if (progress >= 100) {
      return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
    }
    
    if (progress >= 75) {
      return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200';
    }
    
    if (progress >= 50) {
      return 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200';
    }
    
    if (progress >= 25) {
      return 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200';
    }
    
    return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200';
  };

  const getStatusBadge = (campaign: Campaign) => {
    const now = Math.floor(Date.now() / 1000);
    const progress = (Number(campaign.raised) / Number(campaign.goal)) * 100;
    
    if (campaign.claimed) {
      return { text: 'Funds Claimed', color: 'badge-success' };
    }
    
    if (now > campaign.deadline) {
      return { text: 'Expired', color: 'badge-error' };
    }
    
    if (progress >= 100) {
      return { text: 'Goal Reached', color: 'badge-info' };
    }
    
    return { text: 'Active', color: 'badge-primary' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="loading-spinner h-12 w-12"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <p>{error}</p>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="heading-2">No Campaigns Found</h2>
        <p className="text-body mb-6">Be the first to create a campaign!</p>
        <Link
          to="/create"
          className="btn-primary"
        >
          Create Campaign
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom">
      <div className="grid-custom">
        {campaigns.map((campaign) => {
          const theme = getCampaignTheme(campaign);
          const status = getStatusBadge(campaign);
          const progress = (Number(campaign.raised) / Number(campaign.goal)) * 100;
          
          return (
            <div
              key={campaign.id}
              className={`card group hover:scale-105 transition-all duration-300 ${theme}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="heading-3 line-clamp-2">{campaign.title}</h3>
                  <div className="flex flex-col items-end gap-2">
                    {campaign.creator.toLowerCase() === account?.toLowerCase() && (
                      <span className="badge badge-primary">Your Campaign</span>
                    )}
                    <span className={`badge ${status.color}`}>{status.text}</span>
                  </div>
                </div>
                
                <p className="text-body mb-6 line-clamp-3">{campaign.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Goal</span>
                    <span className="text-sm font-semibold text-gray-900">{campaign.goal} ETH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Raised</span>
                    <span className="text-sm font-semibold text-gray-900">{campaign.raised} ETH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Deadline</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {new Date(campaign.deadline * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="progress-bar mb-6">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: progress >= 100 ? '#10B981' : progress >= 75 ? '#6366F1' : '#3B82F6'
                    }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <Link
                    to={`/campaign/${campaign.id}`}
                    className="btn-primary"
                  >
                    View Details
                  </Link>
                  <span className="text-sm font-medium text-gray-500">
                    {progress.toFixed(1)}% Funded
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignList; 