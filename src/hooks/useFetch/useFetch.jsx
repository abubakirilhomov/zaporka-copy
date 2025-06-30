'use client';
import axios from 'axios';
import { useState, useEffect, useCallback, useRef } from 'react';

export default function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      setLoading(true);
      setError(null); // Сброс ошибки перед новым запросом
      const response = await axios.get(url, {
        signal: controller.signal,
        ...options,
      });
      setData(response.data);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request was cancelled');
      } else {
        setError(err.response?.data || err.message || 'Unknown error');
        console.error('Fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();

  }, []);

  return { data, loading, error, refetch: fetchData };
}
