import { useState, useEffect, useCallback } from 'react';
import apiFetch from '../utils/api';

const usePaginatedFetch = (initialUrl, initialParams = {}) => {
  const [url] = useState(initialUrl);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState(initialParams);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page + 1);
      queryParams.append('per_page', rowsPerPage);

      for (const key in filters) {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== 'all') {
          queryParams.append(key, filters[key]);
        }
      }

      const response = await apiFetch(`${url}?${queryParams.toString()}`);
      setData(Array.isArray(response.data.data) ? response.data.data : []);
      setTotalItems(response.data.meta.total);
    } catch (error) {
      console.error(`Failed to fetch data from ${url}:`, error);
    } finally {
      setLoading(false);
    }
  }, [url, page, rowsPerPage, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    data,
    loading,
    page,
    rowsPerPage,
    totalItems,
    filters,
    handleFilterChange,
    handlePageChange,
    handleRowsPerPageChange,
    refetch: fetchData,
  };
};

export default usePaginatedFetch;