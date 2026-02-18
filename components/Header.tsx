
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">AI Image Refiner</span>
        </div>
        <nav className="hidden sm:flex space-x-8">
          <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Features</a>
          <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">How it works</a>
          <a href="#" className="text-indigo-600 font-medium">Try Editor</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
