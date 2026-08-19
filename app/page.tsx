'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Loader2, X, Copy, Check } from 'lucide-react';
import { NamasteCodeRecord } from '@/lib/supabaseClient';

interface ApiResponse {
  success: boolean;
  count: number;
  data: NamasteCodeRecord[];
  error?: string;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<NamasteCodeRecord[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ApiResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fuzzy search suggestions as user types
  const fetchSuggestions = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setSuggestions([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      const json: ApiResponse = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSuggestions(json.data);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error('Search suggestions failed', err);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle typing in search input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 200);
  };

  // When user selects a code or name from dropdown
  const handleSelect = async (item: NamasteCodeRecord) => {
    const displayName = item['Name English'] || item['TM2 Code'] || query;
    setQuery(displayName);
    setShowDropdown(false);

    // Hit the API for this specific code/term to generate JSON
    const searchTarget = item['TM2 Code'] || item['Name English'] || displayName;
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTarget)}`);
      const json: ApiResponse = await res.json();
      setSelectedResult(json);
    } catch {
      setSelectedResult({
        success: true,
        count: 1,
        data: [item],
      });
    }
  };

  // Form submit handler (Enter key)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setShowDropdown(false);

    const trimmed = query.trim();
    if (!trimmed) return;

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      const json: ApiResponse = await res.json();
      setSelectedResult(json);
    } catch (err) {
      setSelectedResult({
        success: false,
        count: 0,
        data: [],
        error: err instanceof Error ? err.message : 'Error executing query',
      });
    }
  };

  // Clear query
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedResult(null);
  };

  // Copy JSON handler
  const handleCopyJson = async () => {
    if (!selectedResult) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(selectedResult, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON', err);
    }
  };

  // Syntax highlighting for JSON
  const formatJsonToHtml = (obj: unknown): string => {
    const jsonStr = JSON.stringify(obj, null, 2);
    if (!jsonStr) return '';

    const escaped = jsonStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'color: #fbbf24;';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'color: #38bdf8; font-weight: 600;';
          } else {
            cls = 'color: #4ade80;';
          }
        } else if (/true|false/.test(match)) {
          cls = 'color: #f472b6; font-weight: 600;';
        } else if (/null/.test(match)) {
          cls = 'color: #a78bfa; font-style: italic;';
        }
        return `<span style="${cls}">${match}</span>`;
      }
    );
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <main className="search-container" ref={containerRef}>
      {/* Clean Header */}
      <header className="header">
        <h1 className="title-logo">
          <span className="logo-a">A</span>
          <span className="logo-y">Y</span>
          <span className="logo-u">U</span>
          <span className="logo-s">S</span>
          <span className="logo-h">H</span>
          <span className="logo-text">Terminology Search</span>
        </h1>
        <p className="subtitle">
          Ayurveda (NAMASTE) &bull; WHO ICD-11 TM2 &bull; Modern BioMedicine
        </p>
      </header>

      {/* Pill Search Input with Autocomplete Dropdown */}
      <div className="search-box-wrapper">
        <form onSubmit={handleFormSubmit}>
          {isSearching ? (
            <Loader2 size={19} className="spinner-icon" />
          ) : (
            <span className="search-icon-left">
              <Search size={19} />
            </span>
          )}

          <input
            type="text"
            className="search-input-pill"
            placeholder="Search by English, Devanagari, Hinglish, TM2, or Ayurveda code..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            autoComplete="off"
            spellCheck="false"
          />

          {query && (
            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
              title="Clear search"
            >
              <X size={17} />
            </button>
          )}
        </form>

        {/* Autocomplete Dropdown List */}
        {showDropdown && (
          <div className="dropdown-menu">
            {suggestions.length > 0 ? (
              suggestions.map((item, idx) => (
                <div
                  key={item['Sr No.'] || idx}
                  className="dropdown-item"
                  onClick={() => handleSelect(item)}
                >
                  <div className="item-left">
                    <div className="item-english">
                      {item['Name English'] || 'Unnamed Term'}
                    </div>
                    {(item['Namc Term Devanagari'] || item['Hinglish']) && (
                      <div className="item-sub">
                        {item['Namc Term Devanagari'] && (
                          <span>{item['Namc Term Devanagari']}</span>
                        )}
                        {item['Namc Term Devanagari'] && item['Hinglish'] && (
                          <span>&bull;</span>
                        )}
                        {item['Hinglish'] && <span>{item['Hinglish']}</span>}
                      </div>
                    )}
                  </div>

                  <div className="item-badges">
                    {item['Ayurveda Code'] && (
                      <span className="badge-ayu">{item['Ayurveda Code']}</span>
                    )}
                    {item['TM2 Code'] && (
                      <span className="badge-tm2">{item['TM2 Code']}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              !isSearching && (
                <div className="dropdown-empty">
                  No matching terms found
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Generated JSON Output upon selecting a code or submitting */}
      {selectedResult && (
        <section className="json-output-wrapper">
          <div className="json-output-header">
            <span className="json-header-title">
              Response: {selectedResult.count}{' '}
              {selectedResult.count === 1 ? 'record' : 'records'}
            </span>
            <button
              type="button"
              className={`copy-json-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopyJson}
            >
              {copied ? (
                <>
                  <Check size={13} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>
          <pre className="json-code-display">
            <code
              dangerouslySetInnerHTML={{
                __html: formatJsonToHtml(selectedResult),
              }}
            />
          </pre>
        </section>
      )}
    </main>
  );
}
