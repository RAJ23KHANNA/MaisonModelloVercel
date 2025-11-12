import { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, Building } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AuthPageProps {
  onLogin: () => void;
  onBack: () => void;
}

export function AuthPage({ onLogin, onBack }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-neutral-800 to-neutral-600 rounded-lg flex items-center justify-center">
                <span className="text-amber-400">R</span>
              </div>
              <span className="text-neutral-800 text-xl">MaisonModello</span>
            </div>
            <h1 className="text-neutral-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Join Runway'}
            </h1>
            <p className="text-neutral-600">
              {isLogin 
                ? 'Sign in to your account to continue' 
                : 'Create your professional fashion profile'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            {!isLogin && (
              <>
                <div>
                  <label className="block text-neutral-700 mb-2 text-sm">Joining as:</label>
                  <select
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
                    defaultValue="model"
                  >
                    <option value="model">Model</option>
                    <option value="designer">Designer / Organizer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 mb-2 text-sm">Full Name</label>
                  <div className="relative">
                    <User className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-neutral-700 mb-2 text-sm">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 mb-2 text-sm">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-neutral-700 mb-2 text-sm">Location</label>
                <input
                  type="text"
                  placeholder="City, Country"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-neutral-600">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>
                <a href="#" className="text-amber-600 hover:text-amber-700">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition px-[0px] py-[12px] flex justify-center items-center"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>

            <div className="text-center text-sm text-neutral-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-amber-600 hover:text-amber-700"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>

            {!isLogin && (
              <p className="text-xs text-neutral-500 text-center">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            )}
          </form>

          <div className="mt-8 pt-8 border-t border-neutral-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-neutral-200"></div>
              <span className="text-neutral-500 text-sm">or continue with</span>
              <div className="flex-1 h-px bg-neutral-200"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition text-sm">
                Google
              </button>
              <button className="px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition text-sm">
                LinkedIn
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block flex-1 relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1622079400278-b96fa6002733?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwc2hvd3xlbnwxfHx8fDE3NjI2NzYzODh8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Fashion Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/60 to-neutral-900/30"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white text-center max-w-lg">
            <h2 className="text-white mb-4">Join the Future of Fashion Networking</h2>
            <p className="text-neutral-200">
              Connect with top models, designers, and agencies. Build your career on the platform trusted by industry professionals worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}