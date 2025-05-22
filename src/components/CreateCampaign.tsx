import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { parseEther } from 'ethers/lib/utils';

const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  const { contract, account } = useWeb3();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !account) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const goalInWei = parseEther(formData.goal);
      const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000);

      const tx = await contract.createCampaign(
        formData.title,
        formData.description,
        goalInWei,
        deadlineTimestamp
      );

      await tx.wait();
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="heading-1">Create New Campaign</h1>
      
      {error && (
        <div className="alert alert-error mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Campaign Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-primary"
            required
            placeholder="Enter campaign title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-primary"
            required
            rows={4}
            placeholder="Describe your campaign"
          />
        </div>

        <div className="form-group">
          <label htmlFor="goal" className="form-label">Funding Goal (ETH)</label>
          <input
            type="number"
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className="input-primary"
            required
            min="0.01"
            step="0.01"
            placeholder="Enter amount in ETH"
          />
        </div>

        <div className="form-group">
          <label htmlFor="deadline" className="form-label">Campaign Deadline</label>
          <input
            type="datetime-local"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="input-primary"
            required
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="loading-spinner w-5 h-5 mr-2"></div>
              Creating Campaign...
            </div>
          ) : (
            'Create Campaign'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign; 