"use client"
import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <header className="w-full max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-4">AI Content Generator</h1>
        <p className="text-lg opacity-80 mb-8">
          Create engaging blogs, posts, and marketing content in seconds.
        </p>
        <button onClick={() => window.location.href='/dashboard'} className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
          Generate Content
        </button>
      </header>
    </div>
  );
}
