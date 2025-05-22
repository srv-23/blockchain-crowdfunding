import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

const Home: React.FC = () => {
  const { contract } = useWeb3();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!contract) return;

      try {
        const campaignCount = await contract.campaignCount();
        const fetchedCampaigns: Campaign[] = [];

        for (let i = 1; i <= campaignCount; i++) {
          const campaign = await contract.getCampaign(i);
          fetchedCampaigns.push({
            id: campaign.id.toNumber(),
            creator: campaign.creator,
            title: campaign.title,
            description: campaign.description,
            goal: ethers.utils.formatEther(campaign.goal),
            raised: ethers.utils.formatEther(campaign.raised),
            deadline: campaign.deadline.toNumber(),
            claimed: campaign.claimed,
          });
        }

        setCampaigns(fetchedCampaigns);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [contract]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Active Campaigns</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Link
            key={campaign.id}
            to={`/campaign/${campaign.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{campaign.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {campaign.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Goal:</span>
                  <span className="font-medium">{campaign.goal} ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Raised:</span>
                  <span className="font-medium">{campaign.raised} ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Deadline:</span>
                  <span className="font-medium">
                    {new Date(campaign.deadline * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home; 