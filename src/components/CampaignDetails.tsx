import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { parseEther } from 'ethers/lib/utils';
import { formatEther } from 'ethers/lib/utils';

interface Campaign {
  title: string;
  description: string;
  creator: string;
  goal: bigint;
  raised: bigint;
  deadline: bigint;
  claimed: boolean;
}

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contract, account } = useWeb3();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [contribution, setContribution] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isContributing, setIsContributing] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!contract || !id) return;

      try {
        const campaignData = await contract.getCampaign(parseInt(id));
        setCampaign({
          title: campaignData.title,
          description: campaignData.description,
          creator: campaignData.creator,
          goal: campaignData.goal,
          raised: campaignData.raised,
          deadline: campaignData.deadline,
          claimed: campaignData.claimed
        });

        if (account) {
          const contribution = await contract.getContribution(parseInt(id), account);
          setContribution(formatEther(contribution));
          setIsCreator(account.toLowerCase() === campaignData.creator.toLowerCase());
        }
      } catch (err) {
        setError('Failed to load campaign details');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [contract, id, account]);

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !account || !id) return;

    try {
      setIsContributing(true);
      setError('');

      const amount = parseEther(contribution);
      const tx = await contract.contribute(parseInt(id), { value: amount });
      await tx.wait();

      // Refresh campaign data
      const campaignData = await contract.getCampaign(parseInt(id));
      setCampaign(prev => prev ? {
        ...prev,
        raised: campaignData.raised
      } : null);

      const userContribution = await contract.getContribution(parseInt(id), account);
      setContribution(formatEther(userContribution));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to contribute');
    } finally {
      setIsContributing(false);
    }
  };

  const handleClaim = async () => {
    if (!contract || !id) return;

    try {
      setIsClaiming(true);
      setError('');

      const tx = await contract.claimFunds(parseInt(id));
      await tx.wait();

      // Refresh campaign data
      const campaignData = await contract.getCampaign(parseInt(id));
      setCampaign(prev => prev ? {
        ...prev,
        claimed: campaignData.claimed
      } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim funds');
    } finally {
      setIsClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="loading-spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="alert alert-error">
        Campaign not found
      </div>
    );
  }

  const deadline = new Date(Number(campaign.deadline) * 1000);
  const isExpired = deadline < new Date();
  const progress = Number(campaign.raised) / Number(campaign.goal) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="heading-1">{campaign.title}</h1>
          {isCreator && !campaign.claimed && isExpired && (
            <button
              onClick={handleClaim}
              className="btn-primary"
              disabled={isClaiming}
            >
              {isClaiming ? (
                <div className="flex items-center">
                  <div className="loading-spinner w-5 h-5 mr-2"></div>
                  Claiming...
                </div>
              ) : (
                'Claim Funds'
              )}
            </button>
          )}
        </div>

        <p className="text-body mb-6">{campaign.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="heading-3">Campaign Details</h3>
            <div className="space-y-2">
              <p>Creator: {campaign.creator}</p>
              <p>Goal: {formatEther(campaign.goal)} ETH</p>
              <p>Raised: {formatEther(campaign.raised)} ETH</p>
              <p>Deadline: {deadline.toLocaleString()}</p>
              <p>Status: {campaign.claimed ? 'Funds Claimed' : isExpired ? 'Expired' : 'Active'}</p>
            </div>
          </div>

          <div>
            <h3 className="heading-3">Your Contribution</h3>
            <p className="text-2xl font-bold">{contribution} ETH</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span>Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        {!isExpired && !campaign.claimed && (
          <form onSubmit={handleContribute} className="space-y-4">
            <div className="form-group">
              <label htmlFor="contribution" className="form-label">Contribute (ETH)</label>
              <input
                type="number"
                id="contribution"
                value={contribution}
                onChange={(e) => setContribution(e.target.value)}
                className="input-primary"
                min="0.01"
                step="0.01"
                required
                placeholder="Enter amount in ETH"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isContributing}
            >
              {isContributing ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 mr-2"></div>
                  Contributing...
                </div>
              ) : (
                'Contribute'
              )}
            </button>
          </form>
        )}

        {error && (
          <div className="alert alert-error mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetails; 