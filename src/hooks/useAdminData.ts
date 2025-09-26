import { useState, useEffect } from 'react';
import { AdminSyncService } from '../lib/adminSync';

// Custom hook to sync data with admin panel changes
export const useAdminData = <T>(
  dataType: 'products' | 'reviews' | 'popup_offers' | 'site_settings',
  fetchFunction: () => Promise<T>
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial data fetch
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFunction();
        setData(result);
      } catch (err) {
        console.error(`Error fetching ${dataType}:`, err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Listen for real-time updates
    const handleUpdate = (payload: any) => {
      console.log(`${dataType} updated:`, payload);
      // Refetch data when changes occur
      fetchData();
    };

    AdminSyncService.addEventListener(dataType, handleUpdate);

    return () => {
      AdminSyncService.removeEventListener(dataType, handleUpdate);
    };
  }, [dataType]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      console.error(`Error refetching ${dataType}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to refetch data');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};