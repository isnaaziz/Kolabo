import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';

const SprintProgress = ({ sprintData, onViewDetails }) => {
  const { currentSprint, velocityData } = sprintData;
  
  const completionPercentage = Math.round((currentSprint.completedPoints / currentSprint.totalPoints) * 100);
  
  const formatTooltip = (value, name) => {
    if (name === 'ideal') return [`${value} points`, 'Ideal Burndown'];
    if (name === 'actual') return [`${value} points`, 'Actual Progress'];
    return [value, name];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-primary mb-2">{`Day ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {formatTooltip(entry.value, entry.dataKey)[1]}: {formatTooltip(entry.value, entry.dataKey)[0]}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Sprint Progress</h3>
          <button
            onClick={onViewDetails}
            className="text-primary hover:text-primary-700 transition-colors duration-200 flex items-center space-x-1"
          >
            <span className="text-sm">View Details</span>
            <Icon name="ExternalLink" size={14} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Current Sprint Overview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-text-primary">{currentSprint.name}</h4>
            <span className="text-sm text-text-secondary">
              {currentSprint.remainingDays} days remaining
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">
                {currentSprint.completedPoints} / {currentSprint.totalPoints} points
              </span>
              <span className="text-sm font-medium text-text-primary">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Sprint Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 bg-primary-50 rounded-lg">
              <Icon name="Target" size={20} color="var(--color-primary)" className="mx-auto mb-1" />
              <p className="text-xs text-text-secondary">Target</p>
              <p className="text-sm font-semibold text-primary">{currentSprint.totalPoints}pts</p>
            </div>
            <div className="text-center p-3 bg-success-50 rounded-lg">
              <Icon name="CheckCircle" size={20} color="var(--color-success)" className="mx-auto mb-1" />
              <p className="text-xs text-text-secondary">Done</p>
              <p className="text-sm font-semibold text-success">{currentSprint.completedPoints}pts</p>
            </div>
            <div className="text-center p-3 bg-warning-50 rounded-lg">
              <Icon name="Clock" size={20} color="var(--color-warning)" className="mx-auto mb-1" />
              <p className="text-xs text-text-secondary">Remaining</p>
              <p className="text-sm font-semibold text-warning-600">
                {currentSprint.totalPoints - currentSprint.completedPoints}pts
              </p>
            </div>
          </div>
        </div>

        {/* Burndown Chart */}
        <div className="mb-6">
          <h4 className="font-medium text-text-primary mb-3">Burndown Chart</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentSprint.burndownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="day" 
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="ideal" 
                  stroke="#CBD5E1" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="var(--color-primary)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Velocity Trend */}
        <div>
          <h4 className="font-medium text-text-primary mb-3">Velocity Trend</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="sprint" 
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="velocity" 
                  fill="var(--color-accent)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintProgress;