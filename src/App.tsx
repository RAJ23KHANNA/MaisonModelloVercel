import { useEffect, useState } from "react";
import {
  Home,
  User,
  Briefcase,
  MessageSquare,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { ModelProfileActual } from "./components/ModelProfileActual";
import { DesignerProfile } from "./components/DesignerProfile";
import { ProfilePage } from "./components/ProfilePage";
import { ProfileSetup } from "./components/ProfileSetup";
import { JobPosting } from "./components/JobPosting";
import { Feed } from "./components/Feed";
import { MessagingUnified } from "./components/MessagingUnified";
import { SearchDiscoverActual } from "./components/SearchDiscoverActual";
import { ConnectionRequests } from "./components/ConnectionRequests";
import { ConnectionsNetwork } from "./components/ConnectionsNetwork";
import { Notifications } from "./components/Notifications";
import { supabase } from "./lib/supabaseClient";

// ----------------- PROFILE TYPE -----------------
type Profile = {
  id: string;
  full_name: string | null;
  role: string | null;
  location: string | null;
  profile_image: string | null;
  connections: number | null;
};

// ----------------- PROFILE ENSURE HELPER -----------------
async function ensureProfile(user: any): Promise<Profile> {
  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return existing as Profile;

  const meta = user.user_metadata || {};

  const newProfilePayload = {
    id: user.id,
    full_name:
      meta.full_name ||
      meta.name ||
      (user.email ? user.email.split("@")[0] : null),
    role: null, // force onboarding step
    location: null,
    profile_image: meta.avatar_url || null,
    connections: 0,
  };

  const { data: inserted, error } = await supabase
    .from("profiles")
    .insert(newProfilePayload)
    .select()
    .single();

  if (error) throw error;

  return inserted as Profile;
}

// ----------------- MAIN APP -----------------
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Initialize authentication & profile logic
  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (session?.user) {
        try {
          const profile = await ensureProfile(session.user);
          setCurrentProfile(profile);
          setIsLoggedIn(true);

          if (!profile.role && location.pathname !== "/profile/setup") {
            navigate("/profile/setup", { replace: true });
          } else if (
            profile.role &&
            (location.pathname === "/" || location.pathname === "/auth")
          ) {
            navigate("/feed", { replace: true });
          }
        } catch (err) {
          console.error("ensureProfile error:", err);
        }
      }

      const { data: listener } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            try {
              const profile = await ensureProfile(session.user);
              setCurrentProfile(profile);
              setIsLoggedIn(true);

              if (!profile.role && location.pathname !== "/profile/setup") {
                navigate("/profile/setup", { replace: true });
              } else if (
                profile.role &&
                (location.pathname === "/" || location.pathname === "/auth")
              ) {
                navigate("/feed", { replace: true });
              }
            } catch (err) {
              console.error("Auth listener profile error:", err);
            }
          } else {
            setCurrentProfile(null);
            setIsLoggedIn(false);
            if (location.pathname !== "/") {
              navigate("/", { replace: true });
            }
          }
        }
      );

      setAuthLoaded(true);

      return () => listener.subscription.unsubscribe();
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    navigate("/");
  };

  if (!authLoaded) {
    return <div className="p-10 text-center text-neutral-500">Loading...</div>;
  }

  const hideNav = location.pathname === "/" || location.pathname === "/auth";

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ✅ NAVIGATION BAR */}
      {!hideNav && isLoggedIn && (
        <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <button
                onClick={() => navigate("/feed")}
                className="flex items-center gap-2"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-neutral-800 to-neutral-600 rounded-lg flex items-center justify-center">
                  <span className="text-amber-400 font-bold">R</span>
                </div>
                <span className="text-neutral-800 hidden sm:block font-medium">
                  MaisonModello
                </span>
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden p-2 text-neutral-600 hover:text-neutral-800"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>

              {/* Desktop buttons */}
              <div className="hidden md:flex items-center gap-6">
                <NavButton
                  icon={<Home />}
                  label="Home"
                  path="/feed"
                  navigate={navigate}
                  active={location.pathname === "/feed"}
                />
                <NavButton
                  icon={<Search />}
                  label="Discover"
                  path="/discover"
                  navigate={navigate}
                  active={location.pathname === "/discover"}
                />
                <NavButton
                  icon={<Briefcase />}
                  label="Jobs"
                  path="/job"
                  navigate={navigate}
                  active={location.pathname === "/job"}
                />
                <NavButton
                  icon={<MessageSquare />}
                  label="Messages"
                  path="/messaging"
                  navigate={navigate}
                  active={location.pathname === "/messaging"}
                />
                <NavButton
                  icon={<Bell />}
                  label="Alerts"
                  path="/connections"
                  navigate={navigate}
                  active={location.pathname === "/connections"}
                  alert
                />
                <NavButton
                  icon={<User />}
                  label="Profile"
                  path="/profile"
                  navigate={navigate}
                  active={location.pathname.startsWith("/profile")}
                />
              </div>

              <button
                onClick={handleLogout}
                className="hidden md:block px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-100"
              >
                Logout
              </button>
            </div>

            {/* Mobile dropdown */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-neutral-200">
                <MobileMenu navigate={navigate} setOpen={setMobileMenuOpen} onLogout={handleLogout} />
              </div>
            )}
          </div>
        </nav>
      )}

      {/* ✅ ROUTES */}
      <Routes>
        {!isLoggedIn && (
          <>
            <Route
              path="/"
              element={<LandingPage onNavigate={() => navigate("/auth")} />}
            />
            <Route
              path="/auth"
              element={
                <AuthPage onLogin={() => navigate("/feed")} onBack={() => navigate("/")} />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}

        {isLoggedIn && (
          <>
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route path="/feed" element={<Feed onNavigate={navigate} />} />
            <Route path="/discover" element={<SearchDiscoverActual onNavigate={navigate} />} />
            <Route path="/job" element={<JobPosting onNavigate={navigate} />} />
            <Route path="/messaging" element={<MessagingUnified onNavigate={navigate} />} />
            <Route path="/messaging/:id" element={<MessagingUnified onNavigate={navigate} />} />
            <Route path="/notifications" element={<Notifications onNavigate={navigate} />} />
            <Route path="/profile" element={<ProfilePage onNavigate={navigate} />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/profile/setup" element={<ProfileSetup onComplete={() => navigate("/profile")} />} />
            <Route path="/model/:id" element={<ModelProfileActual onNavigate={navigate} />} />
            <Route path="/designer/:id" element={<DesignerProfile onNavigate={navigate} />} />
            <Route path="/connections" element={<ConnectionRequests onNavigate={navigate} />} />
            <Route path="/connections/network" element={<ConnectionsNetwork onNavigate={navigate} />} />
            <Route path="*" element={<Navigate to="/feed" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
}

/* ---------------------- NAV BUTTON ---------------------- */
function NavButton({ icon, label, path, active, navigate, alert = false }: any) {
  return (
    <button
      onClick={() => navigate(path)}
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition relative ${
        active ? "text-amber-600" : "text-neutral-600 hover:text-neutral-800"
      }`}
    >
      {icon}
      <span className="text-xs">{label}</span>
      {alert && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </button>
  );
}

/* ---------------------- MOBILE MENU ---------------------- */
function MobileMenu({
  navigate,
  setOpen,
  onLogout,
}: {
  navigate: any;
  setOpen: (v: boolean) => void;
  onLogout: () => Promise<void>;
}) {
  return (
    <div className="flex flex-col gap-2">
      {[
        { label: "Home", icon: <Home />, path: "/feed" },
        { label: "Discover", icon: <Search />, path: "/discover" },
        { label: "Jobs", icon: <Briefcase />, path: "/job" },
        { label: "Messages", icon: <MessageSquare />, path: "/messaging" },
        { label: "Notifications", icon: <Bell />, path: "/connections" },
        { label: "Profile", icon: <User />, path: "/profile" },
      ].map((item) => (
        <button
          key={item.path}
          onClick={() => {
            navigate(item.path);
            setOpen(false);
          }}
          className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 rounded-lg text-neutral-700"
        >
          {item.icon}
          {item.label}
        </button>
      ))}
      <button
        onClick={() => {
          onLogout();
          setOpen(false); // Close menu on logout
        }}
        className="flex items-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white mt-2 font-medium"
      >
        {/* Using Home icon again for simplicity, ideally import LogOut from 'lucide-react' */}
        {<Home className="text-white" />} 
        Logout
      </button>
    </div>
  );
}
