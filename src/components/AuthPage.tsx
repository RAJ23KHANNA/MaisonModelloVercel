import { useState } from "react";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { supabase } from "../lib/supabaseClient";

interface AuthPageProps {
  onLogin: () => void;
  onBack: () => void;
}

export function AuthPage({ onLogin, onBack }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);

  // 🔹 Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("model");
  const [location, setLocation] = useState("");

  // 🔹 Loading & errors
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --------------------------------------------------
  // 🔐 AUTH HANDLER (LOGIN + SIGNUP)
  // --------------------------------------------------
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
  
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}`, // or /auth/callback if you have one
      },
    });
  
    if (error) {
      setErrorMsg(error.message);
    }
  
    setLoading(false);
  };
  

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isLogin) {
        // ------------------ LOGIN ------------------
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        onLogin();
      } else {
        // ------------------ SIGNUP ------------------
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        // Insert profile row in DB
        if (data.user) {
          await supabase.from("profiles").insert([
            {
              id: data.user.id,
              full_name: fullName,
              role,
              location,
              connections: 0,
            },
          ]);
        }

        onLogin();
      }
    } catch (err) {
      setErrorMsg("Something went wrong. Try again.");
    }

    setLoading(false);
  };

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
              {isLogin ? "Welcome Back" : "Join Runway"}
            </h1>
            <p className="text-neutral-600">
              {isLogin
                ? "Sign in to your account to continue"
                : "Create your professional fashion profile"}
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {errorMsg && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {errorMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleAuth}>
            {/* SIGNUP FIELDS */}
            {!isLogin && (
              <>
                <div>
                  <label className="block text-neutral-700 mb-2 text-sm">
                    Joining as:
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none bg-white"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="model">Model</option>
                    <option value="designer">Designer / Organizer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 mb-2 text-sm">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* EMAIL */}
            <div>
              <label className="block text-neutral-700 mb-2 text-sm">
                Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-neutral-700 mb-2 text-sm">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* SIGNUP: LOCATION */}
            {!isLogin && (
              <div>
                <label className="block text-neutral-700 mb-2 text-sm">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City, Country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            {/* LOGIN: REMEMBER ME */}
            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-neutral-600">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>
                <button type="button" className="text-amber-600">
                  Forgot password?
                </button>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 flex justify-center"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>

            {/* SWITCH LOGIN/SIGNUP */}
            <div className="text-center text-sm text-neutral-600">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-amber-600 hover:text-amber-700"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>

            {!isLogin && (
              <p className="text-xs text-neutral-500 text-center">
                By creating an account, you agree to our Terms of Service and
                Privacy Policy
              </p>
            )}
          </form>

          {/* Social Login UI (not wired yet) */}
          <div className="mt-8 pt-8 border-t border-neutral-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px bg-neutral-200"></div>
              <span className="text-neutral-500 text-sm">or continue with</span>
              <div className="flex-1 h-px bg-neutral-200"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-neutral-300 rounded-lg py-3 hover:bg-neutral-50 transition"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" className="w-5 h-5" />
              <span className="text-sm font-medium text-neutral-700">
                Continue with Google
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block flex-1 relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1622079400278-b96fa6002733?auto=format&fit=crop&w=1200&q=80"
          alt="Fashion Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/60 to-neutral-900/30"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white text-center max-w-lg">
            <h2 className="text-white mb-4">
              Join the Future of Fashion Networking
            </h2>
            <p className="text-neutral-200">
              Connect with top models, designers, and agencies. Build your
              career on the platform trusted by industry professionals
              worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}