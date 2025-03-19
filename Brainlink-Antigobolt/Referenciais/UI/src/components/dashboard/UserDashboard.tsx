import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  BarChart, Clock, Code, FileText, 
  GitBranch, HardDrive, Settings, Users 
} from 'lucide-react';

interface DashboardStats {
  totalProjects: number;
  totalStorage: number;
  activeCollaborators: number;
  lastActivity: string;
}

export const UserDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalStorage: 0,
    activeCollaborators: 0,
    lastActivity: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Load user's projects
        const { data: projects } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id);

        // Load storage usage
        const { data: storage } = await supabase
          .from('storage_items')
          .select('size')
          .eq('user_id', user.id);

        // Load collaborators
        const { data: collaborators } = await supabase
          .from('project_collaborators')
          .select('distinct user_id')
          .eq('project_id', projects?.[0]?.id);

        setStats({
          totalProjects: projects?.length || 0,
          totalStorage: storage?.reduce((acc, item) => acc + (item.size || 0), 0) || 0,
          activeCollaborators: collaborators?.length || 0,
          lastActivity: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-200">Welcome to BrainLink</h1>
        <p className="text-gray-400 mt-2">Here's an overview of your workspace</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-6 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400">Projects</h3>
                <Code className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-gray-200">{stats.totalProjects}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400">Storage Used</h3>
                <HardDrive className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-gray-200">{formatBytes(stats.totalStorage)}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400">Collaborators</h3>
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-gray-200">{stats.activeCollaborators}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400">Last Activity</h3>
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-sm text-gray-300">
                {new Date(stats.lastActivity).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-200">Recent Projects</h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm">View all</button>
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                    <div className="flex items-center gap-3">
                      <GitBranch className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-gray-200">Project {i + 1}</p>
                        <p className="text-sm text-gray-400">Last updated 2h ago</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-700 rounded-md">
                      <Settings className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-200">Activity</h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm">View all</button>
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-gray-750 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-200">Document updated</p>
                      <p className="text-sm text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};