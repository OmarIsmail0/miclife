/**
 * Custom React Hook for API calls
 * Provides loading, error, and data states
 */

import { useState, useEffect, useCallback } from "react";

/**
 * Generic hook for API calls with loading and error states
 * @param {Function} apiFunction - The API function to call
 * @param {boolean} immediate - Whether to call immediately on mount
 * @returns {Object} - { data, loading, error, execute, reset }
 */
export const useApi = (apiFunction, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...params) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunction(...params);
        setData(response);
        return response;
      } catch (err) {
        setError(err.message || "An error occurred");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, reset };
};

/**
 * Hook for paginated API calls
 * @param {Function} apiFunction - The API function to call
 * @param {Object} initialParams - Initial pagination parameters
 * @returns {Object} - { data, loading, error, page, pageSize, setPage, setPageSize, refresh }
 */
export const usePaginatedApi = (apiFunction, initialParams = { PageNumber: 1, PageSize: 10 }) => {
  const [page, setPage] = useState(initialParams.PageNumber);
  const [pageSize, setPageSize] = useState(initialParams.PageSize);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction({
        ...initialParams,
        PageNumber: page,
        PageSize: pageSize,
      });
      setData(response);
      return response;
    } catch (err) {
      setError(err.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, page, pageSize, initialParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    refresh,
  };
};

/**
 * Hook for mutations (POST, PUT, DELETE)
 * @param {Function} apiFunction - The API function to call
 * @returns {Object} - { loading, error, execute, reset }
 */
export const useMutation = (apiFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...params) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunction(...params);
        return response;
      } catch (err) {
        setError(err.message || "An error occurred");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { loading, error, execute, reset };
};

export default useApi;
