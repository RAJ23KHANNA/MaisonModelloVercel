import { MapPin, Users, Calendar, Briefcase, MessageCircle, Plus, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DesignerProfileProps {
  onNavigate: (page: string) => void;
}

export function DesignerProfile({ onNavigate }: DesignerProfileProps) {
  const upcomingShows = [
    { title: 'Spring Collection 2025', location: 'Paris Fashion Week', date: 'March 15, 2025', models: 24 },
    { title: 'Resort Wear Showcase', location: 'Milan', date: 'April 8, 2025', models: 18 },
  ];

  const openJobs = [
    {
      title: 'Runway Model for Fashion Week',
      location: 'Paris, France',
      date: 'March 15, 2025',
      budget: '$2,000 - $5,000',
      applicants: 47,
    },
    {
      title: 'Editorial Photoshoot Model',
      location: 'Paris, France',
      date: 'February 20, 2025',
      budget: '$800 - $1,500',
      applicants: 32,
    },
    {
      title: 'Brand Campaign Model',
      location: 'Remote / Various',
      date: 'March 1, 2025',
      budget: '$3,000 - $8,000',
      applicants: 68,
    },
  ];

  const teamMembers = [
    { name: 'Marie Dubois', role: 'Creative Director' },
    { name: 'Jean-Paul Martin', role: 'Casting Director' },
    { name: 'Sophie Bernard', role: 'Talent Manager' },
    { name: 'Lucas Moreau', role: 'Production Lead' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Cover Banner */}
      <div className="relative h-80 bg-gradient-to-br from-neutral-800 to-neutral-600">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1758613655670-7b3cdd1e27ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R1ZGlvJTIwd29ya3NwYWNlfGVufDF8fHx8MTc2MjY3NjM4OXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Cover"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative -mt-32 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Company Logo */}
              <div className="relative">
                <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-neutral-800 to-neutral-600 flex items-center justify-center">
                  <span className="text-amber-400 text-6xl">M</span>
                </div>
              </div>

              {/* Company Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-neutral-900 mb-2">Maison Élégance</h1>
                    <div className="flex items-center gap-4 text-neutral-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>Paris, France</span>
                      </div>
                      <span>•</span>
                      <span>Luxury Fashion House</span>
                    </div>
                    <p className="text-neutral-700 max-w-2xl">
                      Premier luxury fashion house specializing in haute couture and ready-to-wear collections. Established in 1985, we've been featured in Paris Fashion Week for 30+ consecutive seasons. Known for elegant designs and exceptional craftsmanship.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => onNavigate('messaging')}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Contact
                    </button>
                    <button 
                      onClick={() => onNavigate('job')}
                      className="px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Post a Job
                    </button>
                    <button className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition">
                      Follow
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-neutral-200">
                  <div>
                    <div className="text-neutral-900">340</div>
                    <div className="text-neutral-600 text-sm">Models Hired</div>
                  </div>
                  <div>
                    <div className="text-neutral-900">45</div>
                    <div className="text-neutral-600 text-sm">Active Projects</div>
                  </div>
                  <div>
                    <div className="text-neutral-900">15K</div>
                    <div className="text-neutral-600 text-sm">Followers</div>
                  </div>
                  <div>
                    <div className="text-neutral-900">4.9</div>
                    <div className="text-neutral-600 text-sm">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Shows */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-neutral-900">Upcoming Shows</h2>
                <button className="text-amber-600 hover:text-amber-700 text-sm">View All</button>
              </div>
              <div className="space-y-4">
                {upcomingShows.map((show, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-6 hover:border-amber-300 hover:bg-amber-50/30 transition cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-neutral-900 mb-2">{show.title}</h3>
                        <div className="flex flex-wrap gap-4 text-neutral-600 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{show.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{show.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{show.models} models needed</span>
                          </div>
                        </div>
                      </div>
                      <button className="px-6 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition whitespace-nowrap">
                        Invite Models
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Job Posts */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-neutral-900">Open Positions</h2>
                <button 
                  onClick={() => onNavigate('job')}
                  className="text-amber-600 hover:text-amber-700 text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Post New Job
                </button>
              </div>
              <div className="space-y-4">
                {openJobs.map((job, index) => (
                  <div
                    key={index}
                    className="border border-neutral-200 rounded-lg p-6 hover:border-amber-300 hover:bg-amber-50/30 transition cursor-pointer"
                    onClick={() => onNavigate('job')}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-neutral-900 mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-3 text-neutral-600 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{job.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-neutral-900">{job.budget}</div>
                        <div className="text-neutral-600 text-sm">{job.applicants} applicants</div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition text-sm">
                      View Applications
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* About Company */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-neutral-900 mb-6">About Maison Élégance</h2>
              <div className="space-y-4 text-neutral-700">
                <p>
                  Founded in 1985 by renowned designer Antoine Dubois, Maison Élégance has become synonymous with timeless elegance and impeccable craftsmanship. Our designs have graced the runways of Paris, Milan, and New York Fashion Weeks.
                </p>
                <p>
                  We specialize in haute couture and ready-to-wear collections that blend traditional French tailoring with modern aesthetics. Our commitment to quality and innovation has earned us a loyal global clientele and numerous industry accolades.
                </p>
                <div className="pt-4">
                  <h3 className="text-neutral-900 mb-3">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Haute Couture', 'Ready-to-Wear', 'Evening Wear', 'Luxury Accessories', 'Bridal', 'Fashion Shows'].map((specialty) => (
                      <span key={specialty} className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Team Members */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-neutral-900 mb-4">Team</h3>
              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-neutral-200 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-neutral-900 truncate">{member.name}</div>
                      <div className="text-neutral-600 text-sm">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition text-sm">
                View All Team
              </button>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-neutral-900 mb-4">Contact Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-neutral-600 mb-1">Address</div>
                  <div className="text-neutral-900">123 Avenue des Champs-Élysées</div>
                  <div className="text-neutral-900">75008 Paris, France</div>
                </div>
                <div>
                  <div className="text-neutral-600 mb-1">Email</div>
                  <div className="text-neutral-900">contact@maisonelegance.fr</div>
                </div>
                <div>
                  <div className="text-neutral-600 mb-1">Phone</div>
                  <div className="text-neutral-900">+33 1 23 45 67 89</div>
                </div>
                <div>
                  <div className="text-neutral-600 mb-1">Website</div>
                  <a href="#" className="text-amber-600 hover:text-amber-700 flex items-center gap-1">
                    www.maisonelegance.fr
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Promote Company */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
              <h3 className="text-neutral-900 mb-2">Promote Your Company</h3>
              <p className="text-neutral-700 text-sm mb-4">
                Get featured on Runway's homepage and reach 50K+ active models. Promote your job posts to qualified candidates.
              </p>
              <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition">
                Boost Visibility
              </button>
            </div>

            {/* Similar Companies */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-neutral-900 mb-4">Similar Companies</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-3 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg -mx-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-neutral-800 to-neutral-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="text-amber-400">C</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-neutral-900 truncate">Fashion House</div>
                      <div className="text-neutral-600 text-sm">Paris, France</div>
                    </div>
                    <button className="px-3 py-1 border border-neutral-300 rounded-lg hover:bg-neutral-50 text-sm">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
