import { useState, useEffect } from 'react';

export default function useFilesState() {
  const [data, setData] = useState(null);

  function fetchData() {
    fetch('http://127.0.0.1:50107/v1/search')
      .then((res) => res.json())
      .then(setData);
  }

  // fetch the data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // need to update the data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return data;
}
