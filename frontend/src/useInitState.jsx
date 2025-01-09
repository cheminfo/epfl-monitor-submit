import { useEffect } from 'react';
import getState from './getState.jsx';
import { useSignals } from '@preact/signals-react/runtime';

export default function useInitState() {
  const state = getState();
  useSignals();

  // the first time I need to load the stats from the backend
  useEffect(() => {
    fetch('http://127.0.0.1:50107/v1/stats')
      .then((res) => res.json())
      .then((data) => {
        state.data.stats.value = data;
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://127.0.0.1:50107/v1/stats')
        .then((res) => res.json())
        .then((data) => {
          state.data.stats.value = data;
        });
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // need to get the files from the backend every time the query changes
  useEffect(() => {
    // define url parameters
    const params = new URLSearchParams();
    params.append('query', state.view.query.value);
    fetch('http://127.0.0.1:50107/v1/search' + '?' + params.toString())
      .then((res) => res.json())
      .then((data) => {
        state.view.files.value = data;
      });
  }, [state.view.query.value]);
}
