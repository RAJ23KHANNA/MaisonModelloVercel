"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, MapPin, Star, Grid, List, Users } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function SearchDiscoverActual() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"models" | "designers" | "jobs">(
    "models"
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [models, setModels] = useState<any[]>([]);
  const [designers, setDesigners] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      setCurrentUser(userData.user);
    })();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "models") {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "model");
        if (error) throw error;
        setModels(data || []);
      }

      if (activeTab === "designers") {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "designer");
        if (error) throw error;
        setDesigners(data || []);
      }

      if (activeTab === "jobs") {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setJobs(data || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filtering Logic
  const filteredModels = models.filter(
    (m) =>
      m.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDesigners = designers.filter(
    (d) =>
      d.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredJobs = jobs.filter(
    (j) =>
      j.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔹 Click Handlers (use Router instead of onNavigate)
  const handleModelClick = (id: string) => {
    if (currentUser && id === currentUser.id) navigate("/profile");
    else navigate(`/model/${id}`);
  };

  const handleDesignerClick = (id: string) => {
    if (currentUser && id === currentUser.id) navigate("/profile");
    else navigate(`/designer/${id}`);
  };

  const handleJobClick = (id: string) => navigate(`/job/${id}`);

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-neutral-900 mb-6">Discover</h1>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search models, designers, or jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
              />
            </div>
            <button className="px-6 py-4 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition flex items-center gap-2 shadow-sm">
              <Filter className="w-5 h-5 text-neutral-600" />
              <span className="text-neutral-700">Filters</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm">
              {["models", "designers", "jobs"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-3 rounded-lg transition ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === "models" && (
              <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-neutral-100 text-neutral-800"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-lg transition ${
                    viewMode === "list"
                      ? "bg-neutral-100 text-neutral-800"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-neutral-500">Loading...</div>
        ) : (
          <>
            {/* MODELS */}
            {activeTab === "models" && (
              <>
                <p className="mb-6 text-neutral-600">
                  {filteredModels.length} models found
                </p>
                {filteredModels.length === 0 ? (
                  <div className="text-neutral-500 text-center py-10">
                    No models found.
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredModels.map((model) => (
                      <div
                        key={model.id}
                        onClick={() => handleModelClick(model.id)}
                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group"
                      >
                        <div className="relative h-80">
                          <ImageWithFallback
                            src={
                              model.profile_image ||
                              "https://via.placeholder.com/200x200?text=Model"
                            }
                            alt={model.full_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="text-sm text-neutral-800">
                              {model.experience || "New"}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-neutral-900 mb-1">
                            {model.full_name}
                          </h3>
                          <div className="flex items-center gap-1 text-neutral-600 text-sm mb-2">
                            <MapPin className="w-4 h-4" />
                            <span>{model.location || "Unknown"}</span>
                          </div>
                          <p className="text-sm text-neutral-500">
                            {model.instagram_followers
                              ? `${model.instagram_followers} followers`
                              : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredModels.map((model) => (
                      <div
                        key={model.id}
                        onClick={() => handleModelClick(model.id)}
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-6"
                      >
                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={
                              model.profile_image ||
                              "https://via.placeholder.com/200x200?text=Model"
                            }
                            alt={model.full_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-neutral-900 mb-1">
                            {model.full_name}
                          </h3>
                          <div className="flex items-center gap-3 text-neutral-600 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{model.location || "Unknown"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* DESIGNERS */}
            {activeTab === "designers" && (
              <>
                <p className="mb-6 text-neutral-600">
                  {filteredDesigners.length} designers found
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDesigners.map((designer) => (
                    <div
                      key={designer.id}
                      onClick={() => handleDesignerClick(designer.id)}
                      className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition cursor-pointer"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-600 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-amber-400 text-2xl">
                          {designer.full_name?.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-neutral-900 mb-2">
                        {designer.full_name}
                      </h3>
                      <p className="text-neutral-600 text-sm mb-1">
                        {designer.company_name || "Fashion Designer"}
                      </p>
                      <div className="flex items-center gap-1 text-neutral-500 text-sm mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{designer.location || "Unknown"}</span>
                      </div>
                      <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                        <div className="text-neutral-800">
                          {(designer.experience || "0") + " Years"}
                        </div>
                        <button className="text-amber-600 hover:text-amber-700 text-sm">
                          View →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* JOBS */}
            {activeTab === "jobs" && (
              <>
                <p className="mb-6 text-neutral-600">
                  {filteredJobs.length} jobs found
                </p>
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => handleJobClick(job.id)}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-neutral-900 mb-2">{job.title}</h3>
                          <div className="text-amber-600 mb-3">
                            {job.company}
                          </div>
                          <div className="flex flex-wrap gap-4 text-neutral-600 text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            {job.budget && <div>Budget: {job.budget}</div>}
                            {job.applicants !== undefined && (
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{job.applicants} applicants</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition whitespace-nowrap">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
