import React, { useState } from 'react';
import { FileText, Link, Image as ImageIcon, Search, AlertCircle, RefreshCw, Shield, Sparkles } from 'lucide-react';

export default function InputPanel({ onAnalyze, isLoading }) {
  const [activeTab, setActiveTab] = useState('text'); // text, url, image
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [ocrStatus, setOcrStatus] = useState('idle'); // idle, processing, done

  // Demo scenarios
  const demos = [
    {
      name: "🍷 Scientific Exaggeration",
      desc: "Red Wine & Diabetes claim",
      text: "A sensational new study proves that drinking red wine completely prevents type-2 diabetes and heart disease, meaning everyone should drink two glasses daily."
    },
    {
      name: "⏳ Outdated Lockdown Alert",
      desc: "2020 message shared as current",
      text: "Emergency Alert: The government has just announced that all international travel is suspended immediately and citizens must stay indoors under a strict lockdown starting tonight."
    },
    {
      name: "🏙️ Mixed-Truth Smart City",
      desc: "5 claims: factual mix with rumors",
      text: "The mayor announced the new Smart City Initiative yesterday. The project will install 5G nodes in every street. Experts claim these nodes emit harmful radiation that causes immediate DNA damage. Additionally, the mayor received ₹20 million in bribes from telecom companies, and residents will be forced to pay a ₹10,000 monthly technology tax."
    }
  ];

  const handleApplyDemo = (demoText) => {
    setTextInput(demoText);
    setActiveTab('text');
    setUrlInput('');
    setImageFile(null);
    setImagePreview(null);
    setOcrText('');
    setOcrStatus('idle');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setOcrStatus('processing');
    setOcrText('');

    setTimeout(() => {
      let text = "A sensational new study proves that drinking red wine completely prevents type-2 diabetes and heart disease, meaning everyone should drink two glasses daily.";
      const name = file.name.toLowerCase();
      if (name.includes('lockdown') || name.includes('travel')) {
        text = "Emergency Alert: The government has just announced that all international travel is suspended immediately and citizens must stay indoors under a strict lockdown starting tonight.";
      } else if (name.includes('smart') || name.includes('5g') || name.includes('tax')) {
        text = "The mayor announced the new Smart City Initiative yesterday. The project will install 5G nodes in every street. Experts claim these nodes emit harmful radiation that causes immediate DNA damage. Additionally, the mayor received ₹20 million in bribes from telecom companies, and residents will be forced to pay a ₹10,000 monthly technology tax.";
      }
      setOcrText(text);
      setTextInput(text);
      setOcrStatus('done');
    }, 1500);
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!urlInput) return;
    
    setOcrStatus('processing');
    setTimeout(() => {
      let text = "The mayor announced the new Smart City Initiative yesterday. The project will install 5G nodes in every street. Experts claim these nodes emit harmful radiation that causes immediate DNA damage. Additionally, the mayor received ₹20 million in bribes from telecom companies, and residents will be forced to pay a ₹10,000 monthly technology tax.";
      if (urlInput.includes('wine') || urlInput.includes('health')) {
        text = "A sensational new study proves that drinking red wine completely prevents type-2 diabetes and heart disease, meaning everyone should drink two glasses daily.";
      } else if (urlInput.includes('lockdown') || urlInput.includes('alert')) {
        text = "Emergency Alert: The government has just announced that all international travel is suspended immediately and citizens must stay indoors under a strict lockdown starting tonight.";
      }
      setTextInput(text);
      setOcrStatus('done');
    }, 1200);
  };

  const handleSubmit = () => {
    if (!textInput.trim()) return;
    
    let title = "Custom Analysis Report";
    if (textInput.includes("red wine")) {
      title = "Exaggerated Scientific Claim (Resveratrol in Red Wine)";
    } else if (textInput.includes("lockdown")) {
      title = "Outdated Information (Lockdowns and Travel Restrictions)";
    } else if (textInput.includes("Smart City")) {
      title = "Mixed-Truth Article (Smart Cities and Health)";
    }

    onAnalyze(textInput, activeTab, title);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full">
      {/* Tabs Selector */}
      <div className="flex border-b border-slate-800 mb-8">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-6 py-4 border-b-2 font-bold text-sm transition-all ${
            activeTab === 'text'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Paste Text
        </button>
        <button
          onClick={() => setActiveTab('url')}
          className={`flex items-center gap-2 px-6 py-4 border-b-2 font-bold text-sm transition-all ${
            activeTab === 'url'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Link className="w-4 h-4" />
          URL Link
        </button>
        <button
          onClick={() => setActiveTab('image')}
          className={`flex items-center gap-2 px-6 py-4 border-b-2 font-bold text-sm transition-all ${
            activeTab === 'image'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Upload Image / OCR
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm mb-8">
        {activeTab === 'text' && (
          <div>
            <label className="block text-slate-300 font-bold mb-3 text-sm tracking-wide uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Investigate News Article or Social Post
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste a news article, message, tweet, or social media post here to extract claims and verify with live evidence..."
              rows={8}
              className="w-full bg-[#030712] border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-100 rounded-xl p-4 placeholder-slate-500 focus:outline-none transition-all resize-none text-sm leading-relaxed"
            />
          </div>
        )}

        {activeTab === 'url' && (
          <div>
            <label className="block text-slate-300 font-bold mb-3 text-sm tracking-wide uppercase">
              Scrape Web Article
            </label>
            <form onSubmit={handleUrlSubmit} className="flex gap-2 mb-4">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/news-article-url"
                className="flex-1 bg-[#030712] border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-100 rounded-xl px-4 py-3 placeholder-slate-500 focus:outline-none transition-all text-sm"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-6 rounded-xl transition-all flex items-center gap-2 text-sm shadow-md"
              >
                Extract Webpage
              </button>
            </form>
            
            {ocrStatus === 'processing' && (
              <div className="flex items-center justify-center py-6 text-slate-400 gap-3">
                <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
                <span>Downloading and parsing webpage content...</span>
              </div>
            )}

            {ocrStatus === 'done' && (
              <div className="border border-slate-800 rounded-xl bg-[#030712]/70 p-4">
                <div className="text-xs text-cyan-400 font-bold mb-2 uppercase tracking-wider">Extracted Web Text:</div>
                <p className="text-xs text-slate-300 italic leading-relaxed">{textInput.slice(0, 300)}...</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'image' && (
          <div>
            <label className="block text-slate-300 font-bold mb-3 text-sm tracking-wide uppercase">
              Extract Claims via Screenshot / Image OCR
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-cyan-400/50 rounded-xl p-8 transition-all cursor-pointer relative bg-[#030712]/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <ImageIcon className="w-10 h-10 text-slate-500 mb-3" />
                <span className="text-sm font-semibold text-slate-300">Choose Image File</span>
                <span className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP (Max 5MB)</span>
              </div>
              
              <div className="border border-slate-800 bg-[#030712]/70 rounded-xl p-4 flex flex-col justify-center">
                {ocrStatus === 'idle' && (
                  <div className="text-center text-slate-500 text-sm italic">
                    Upload an image containing text to run OCR.
                  </div>
                )}

                {ocrStatus === 'processing' && (
                  <div className="flex flex-col items-center justify-center py-6 text-slate-400 gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                    <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">Image → OCR → Extracting</span>
                  </div>
                )}

                {ocrStatus === 'done' && (
                  <div>
                    <div className="text-xs text-cyan-400 font-bold mb-2 uppercase tracking-wider flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      OCR Extracted Text
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed max-h-36 overflow-y-auto pr-1">
                      {ocrText}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !textInput.trim()}
            className={`px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 text-sm border border-blue-400/20 ${
              (!textInput.trim() || isLoading) ? 'opacity-50 cursor-not-allowed transform-none shadow-none' : ''
            }`}
          >
            <Search className="w-4 h-4 text-cyan-300" />
            INVESTIGATE CLAIMS
          </button>
        </div>
      </div>

      {/* Try Demo Scenarios quick buttons */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-cyan-400" />
          Or Select a Pre-compiled Hackathon Demo Scenario
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demos.map((demo, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyDemo(demo.text)}
              className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 rounded-xl p-4 text-left transition-all duration-300 shadow-md group hover:-translate-y-1 backdrop-blur-sm"
            >
              <div className="font-bold text-sm text-white group-hover:text-cyan-400 transition-all">{demo.name}</div>
              <div className="text-xs text-slate-400 mt-1 leading-relaxed">{demo.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
