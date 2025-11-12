import { Search, Filter, MapPin, Star, Grid, List, Users } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SearchDiscoverProps {
  onNavigate: (page: string) => void;
}

export function SearchDiscover({ onNavigate }: SearchDiscoverProps) {
  const [activeTab, setActiveTab] = useState<'models' | 'designers' | 'jobs'>('models');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const models = [
    {
      name: 'Sophia Laurent',
      location: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1721003080966-423d4017d09d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc2MjY3NjM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5.0,
      followers: '245K',
      shows: 127,
      available: true,
    },
    {
      name: 'Marcus Chen',
      location: 'New York, USA',
      image: 'https://images.unsplash.com/photo-1675387117695-85ca09fe6b26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtb2RlbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjYzODUwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      followers: '189K',
      shows: 94,
      available: true,
    },
    {
      name: 'Isabella Martinez',
      location: 'Milan, Italy',
      image: 'https://images.unsplash.com/photo-1627661364735-eab249361d46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBtb2RlbHxlbnwxfHx8fDE3NjI2NjI3Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5.0,
      followers: '312K',
      shows: 156,
      available: false,
    },
    {
      name: 'Emma Rodriguez',
      location: 'Barcelona, Spain',
      image: 'https://images.unsplash.com/photo-1583981399285-7e22c78c9b2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcnVud2F5JTIwbW9kZWx8ZW58MXx8fHwxNzYyNjc2Mzg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      followers: '156K',
      shows: 78,
      available: true,
    },
    {
      name: 'Aisha Patel',
      location: 'Mumbai, India',
      image: 'https://images.unsplash.com/photo-1704775986777-b903cf6b9802?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZmFzaGlvbiUyMGRlc2lnbmVyfGVufDF8fHx8MTc2MjYzMzg3OHww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      followers: '203K',
      shows: 112,
      available: true,
    },
    {
      name: 'Luna Kim',
      location: 'Seoul, South Korea',
      image: 'https://images.unsplash.com/photo-1627661364735-eab249361d46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBtb2RlbHxlbnwxfHx8fDE3NjI2NjI3Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5.0,
      followers: '278K',
      shows: 134,
      available: true,
    },
  ];

  const designers = [
    { name: 'Maison Élégance', type: 'Luxury Fashion House', location: 'Paris, France', projects: 45 },
    { name: 'Urban Thread Studio', type: 'Streetwear Designer', location: 'Los Angeles, USA', projects: 32 },
    { name: 'Celestial Couture', type: 'Bridal & Evening Wear', location: 'London, UK', projects: 28 },
    { name: 'Minimalist Mode', type: 'Contemporary Fashion', location: 'Tokyo, Japan', projects: 38 },
  ];

  const jobs = [
    {
      title: 'Runway Model for Fashion Week',
      company: 'Maison Élégance',
      location: 'Mumbai, India',
      budget: '$2,500 - $4,500',
      applicants: 47,
      posted: '2 days ago',
    },
    {
      title: 'Editorial Photoshoot Model',
      company: 'Vogue Paris',
      location: 'Paris, France',
      budget: '$1,200 - $2,000',
      applicants: 32,
      posted: '4 days ago',
    },
    {
      title: 'Brand Campaign Model',
      company: 'Luxury Brand Co.',
      location: 'Milan, Italy',
      budget: '$5,000 - $10,000',
      applicants: 68,
      posted: '1 week ago',
    },
    {
      title: 'Catwalk Model',
      company: 'Fashion Week Org',
      location: 'New York, USA',
      budget: '$3,000 - $6,000',
      applicants: 54,
      posted: '3 days ago',
    },
  ];

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
              <button
                onClick={() => setActiveTab('models')}
                className={`px-6 py-3 rounded-lg transition ${
                  activeTab === 'models'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                Models
              </button>
              <button
                onClick={() => setActiveTab('designers')}
                className={`px-6 py-3 rounded-lg transition ${
                  activeTab === 'designers'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                Designers
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-6 py-3 rounded-lg transition ${
                  activeTab === 'jobs'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                Jobs
              </button>
            </div>

            {activeTab === 'models' && (
              <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition ${
                    viewMode === 'grid' ? 'bg-neutral-100 text-neutral-800' : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition ${
                    viewMode === 'list' ? 'bg-neutral-100 text-neutral-800' : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <select className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm">
              <option>All Locations</option>
              <option>Paris</option>
              <option>New York</option>
              <option>Milan</option>
              <option>London</option>
            </select>
            {activeTab === 'models' && (
              <>
                <select className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm">
                  <option>Experience Level</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
                <select className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm">
                  <option>All Genders</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Non-binary</option>
                </select>
                <select className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm">
                  <option>Availability</option>
                  <option>Available Now</option>
                  <option>Available Soon</option>
                </select>
              </>
            )}
            {activeTab === 'jobs' && (
              <select className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm">
                <option>Budget Range</option>
                <option>$0 - $1,000</option>
                <option>$1,000 - $5,000</option>
                <option>$5,000+</option>
              </select>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-neutral-600">
          {activeTab === 'models' && `${models.length} models found`}
          {activeTab === 'designers' && `${designers.length} designers found`}
          {activeTab === 'jobs' && `${jobs.length} jobs found`}
        </div>

        {/* Content */}
        {activeTab === 'models' && viewMode === 'grid' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group"
                onClick={() => onNavigate('model-profile')}
              >
                <div className="relative h-80">
                  <ImageWithFallback
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {model.available && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white rounded-full text-sm">
                      Available
                    </div>
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm text-neutral-800">{model.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-neutral-900 mb-1">{model.name}</h3>
                  <div className="flex items-center gap-1 text-neutral-600 text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{model.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <div className="text-neutral-800">{model.followers}</div>
                      <div className="text-neutral-500 text-xs">Followers</div>
                    </div>
                    <div>
                      <div className="text-neutral-800">{model.shows}</div>
                      <div className="text-neutral-500 text-xs">Shows</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'models' && viewMode === 'list' && (
          <div className="space-y-4">
            {models.map((model, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-6"
                onClick={() => onNavigate('model-profile')}
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-neutral-900 mb-1">{model.name}</h3>
                      <div className="flex items-center gap-3 text-neutral-600 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{model.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span>{model.rating}</span>
                        </div>
                      </div>
                    </div>
                    {model.available && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        Available
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-neutral-800">{model.followers}</span>
                      <span className="text-neutral-500"> Followers</span>
                    </div>
                    <div>
                      <span className="text-neutral-800">{model.shows}</span>
                      <span className="text-neutral-500"> Shows</span>
                    </div>
                  </div>
                </div>
                <button className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'designers' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {designers.map((designer, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => onNavigate('designer-profile')}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-amber-400 text-2xl">{designer.name.charAt(0)}</span>
                </div>
                <h3 className="text-neutral-900 mb-2">{designer.name}</h3>
                <p className="text-neutral-600 text-sm mb-1">{designer.type}</p>
                <div className="flex items-center gap-1 text-neutral-500 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{designer.location}</span>
                </div>
                <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                  <div className="text-neutral-800">{designer.projects} Projects</div>
                  <button className="text-amber-600 hover:text-amber-700 text-sm">
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => onNavigate('job')}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-neutral-900 mb-2">{job.title}</h3>
                    <div className="text-amber-600 mb-3">{job.company}</div>
                    <div className="flex flex-wrap gap-4 text-neutral-600 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div>Budget: {job.budget}</div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{job.applicants} applicants</span>
                      </div>
                      <div className="text-neutral-500">{job.posted}</div>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition whitespace-nowrap">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
