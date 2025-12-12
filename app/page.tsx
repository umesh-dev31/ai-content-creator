"use client"
import React, { useState } from "react";
import { Sparkles, Zap, FileText, ArrowRight, Check, Menu, X } from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-red-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">ContentAI</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a>
              <button 
                onClick={() => window.location.href='/dashboard'} 
                className="px-6 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all hover:scale-105"
              >
                Get Started
              </button>
            </div>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-black border-t border-red-600/20">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-300 hover:text-white">Features</a>
              <a href="#how-it-works" className="block text-gray-300 hover:text-white">How It Works</a>
              <button 
                onClick={() => window.location.href='/dashboard'} 
                className="w-full px-6 py-2 bg-red-600 text-white rounded-full font-semibold"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-96 h-96 bg-red-600/10 rounded-full blur-3xl opacity-30 top-0 left-1/4"></div>
          <div className="absolute w-96 h-96 bg-red-600/5 rounded-full blur-3xl opacity-20 bottom-0 right-1/4"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600/20 border border-red-600/30 rounded-full mb-6">
              <Zap className="w-4 h-4 text-red-500" />
              <span className="text-red-400 text-sm font-medium">AI-Powered Content Generation</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Create Amazing Content in
              <span className="block text-red-600">Seconds, Not Hours</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform your ideas into high-quality blog posts, social media content, emails, and more with our advanced AI technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={() => window.location.href='/dashboard'} 
                className="group px-8 py-4 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all hover:scale-105 flex items-center justify-center space-x-2 shadow-lg shadow-red-600/50"
              >
                <span>Start Generating</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-transparent text-white rounded-full font-semibold border-2 border-white/20 hover:border-white/40 hover:bg-white/5 transition-all">
                Learn More
              </button>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Check className="w-4 h-4 text-red-600" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center space-x-1">
                <Check className="w-4 h-4 text-red-600" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center space-x-1">
                <Check className="w-4 h-4 text-red-600" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-black border-t border-red-600/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to create professional content effortlessly
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-red-600/50 transition-all group">
              <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multiple Templates</h3>
              <p className="text-gray-400">Choose from 50+ content templates for blogs, social media, emails, and more.</p>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-red-600/50 transition-all group">
              <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-gray-400">Generate high-quality content in seconds with our advanced AI technology.</p>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-red-600/50 transition-all group">
              <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered</h3>
              <p className="text-gray-400">Leverage cutting-edge AI to create engaging, SEO-optimized content every time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-black border-t border-red-600/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Get started in minutes with our simple process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold border-4 border-red-600/30">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Choose Template</h3>
              <p className="text-gray-400">Select from our library of content templates</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold border-4 border-red-600/30">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Provide Input</h3>
              <p className="text-gray-400">Enter your topic, keywords, or description</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold border-4 border-red-600/30">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Generate & Export</h3>
              <p className="text-gray-400">Get instant results and download your content</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black border-t border-red-600/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-linear-to-r from-red-600 to-red-700 rounded-3xl p-12 text-center border border-red-500/50">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Create Amazing Content?
              </h2>
              <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of creators using AI to transform their content workflow
              </p>
              <button 
                onClick={() => window.location.href='/dashboard'} 
                className="px-10 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 inline-flex items-center space-x-2 shadow-xl"
              >
                <span>Start Generating Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-red-100 text-sm mt-6">No credit card required • Free to start</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-red-600/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">ContentAI</span>
            </div>
            <p className="text-gray-500 text-sm">&copy; 2025 ContentAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
