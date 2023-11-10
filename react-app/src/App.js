import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from 'react-markdown';

function App() {
  const [query, setQuery] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxLen, setMaxLen] = useState(128);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    const response = await fetch(`/api/generate?query=${query}&temperature=${temperature}&max_len=${maxLen}`);
    const data = await response.json();
    setResponse(data.resp);
    setLoading(false);
  };

  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="container">
            <form>
              <div className="mb-3">
                <label htmlFor="query" className="form-label">Query</label>
                <input
                    type="text"
                    className="form-control"
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="temperature" className="form-label">Temperature</label>
                <input
                    type="range"
                    className="form-range"
                    id="temperature"
                    min={0.5}
                    max={1.0}
                    step={0.05}
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="maxLen" className="form-label">Max Length</label>
                <select
                    className="form-select"
                    id="maxLen"
                    value={maxLen}
                    onChange={(e) => setMaxLen(parseInt(e.target.value))}
                >
                  <option value="64">64</option>
                  <option value="128">128</option>
                  <option value="256">256</option>
                  <option value="512">512</option>
                  <option value="1024">1024</option>
                  <option value="2048">2048</option>
                </select>
              </div>
              <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleGenerate}
                  disabled={loading}
              >
                {loading ? 'Loading...' : 'Generate'}
              </button>
            </form>
            {response && (
                <div className="mt-3">
                  <p>Response:</p>
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
            )}
          </div>
        </header>
      </div>
  );
}

export default App;
