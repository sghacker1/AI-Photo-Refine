
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Dropzone from './components/Dropzone';
import { editImage } from './services/geminiService';
import { ImageState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<ImageState>({
    original: null,
    edited: null,
    isLoading: false,
    error: null,
  });

  const [prompt, setPrompt] = useState('Replace the illustrated cartoon person with a real person shopping in the store. Make the lighting consistent with the environment.');

  const handleImageSelect = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setState(prev => ({
        ...prev,
        original: e.target?.result as string,
        edited: null,
        error: null
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleEdit = async () => {
    if (!state.original) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const mimeType = state.original.split(';')[0].split(':')[1];
      const result = await editImage({
        image: state.original,
        prompt: prompt,
        mimeType: mimeType
      });

      setState(prev => ({
        ...prev,
        edited: result,
        isLoading: false
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Failed to edit image. Please try again."
      }));
    }
  };

  const reset = () => {
    setState({
      original: null,
      edited: null,
      isLoading: false,
      error: null,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {!state.original ? (
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Refine Your Photos with <span className="text-indigo-600">AI Intelligence</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Upload a photo, describe the changes you want, and watch as Gemini 2.5 transforms it instantly.
              </p>
            </div>
            
            <Dropzone onImageSelect={handleImageSelect} />
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Popular Transformations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "Object Swapping", desc: "Replace people or items with photorealistic versions." },
                  { title: "Atmosphere Edit", desc: "Change the lighting, time of day, or mood of a scene." },
                  { title: "Context Refinement", desc: "Add or remove elements to make photos look professional." }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <h3 className="font-medium text-slate-900 text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Image Display */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 p-2">
                <div className="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden">
                  {state.isLoading && (
                    <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
                      <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-6"></div>
                      <h3 className="text-2xl font-bold mb-2">Analyzing Pixels...</h3>
                      <p className="text-indigo-200 animate-pulse">This might take 10-20 seconds for high-quality generation.</p>
                      
                      <div className="mt-8 max-w-xs w-full bg-white/10 rounded-full h-1.5">
                        <div className="bg-indigo-400 h-1.5 rounded-full w-2/3 animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                  )}

                  {state.edited ? (
                    <img src={state.edited} alt="AI Generated Result" className="w-full h-full object-contain" />
                  ) : (
                    <img src={state.original} alt="Original" className="w-full h-full object-contain" />
                  )}
                </div>
              </div>

              {state.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{state.error}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    {state.edited ? '✨' : '📸'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{state.edited ? 'AI Refined Output' : 'Original Photo'}</p>
                    <p className="text-xs text-slate-500">Ready for processing</p>
                  </div>
                </div>
                {state.edited && (
                   <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = state.edited!;
                      link.download = 'refined-image.png';
                      link.click();
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Controls */}
            <div className="lg:col-span-4 sticky top-24 space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Edit Instructions</h3>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., Replace the blue car with a red sportscar..."
                  className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700 resize-none"
                />
                
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleEdit}
                    disabled={state.isLoading}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3 text-lg"
                  >
                    {state.isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Apply AI Magic
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={reset}
                    disabled={state.isLoading}
                    className="w-full py-3 text-slate-500 hover:text-slate-800 font-medium transition-colors"
                  >
                    Cancel and Start Over
                  </button>
                </div>
              </div>

              <div className="bg-indigo-900 rounded-3xl p-6 text-white overflow-hidden relative">
                <div className="relative z-10">
                  <h4 className="font-bold mb-2">Pro Tip 💡</h4>
                  <p className="text-sm text-indigo-100 leading-relaxed">
                    Be specific with your prompt. Instead of saying "fix this," try "make the lighting warmer and replace the figure with a man in a green shirt."
                  </p>
                </div>
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <p className="text-slate-500 text-sm">Powered by Gemini 2.5 Flash Image & React</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
