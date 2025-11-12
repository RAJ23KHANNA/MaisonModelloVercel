import { MapPin, Star, Instagram, Award, MessageCircle, UserPlus, Calendar, Play, ExternalLink, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ModelProfileProps {
  onNavigate: (page: string) => void;
}

export function ModelProfile({ onNavigate }: ModelProfileProps) {
  const portfolioImages = [
    'https://images.unsplash.com/photo-1721003080966-423d4017d09d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc2MjY3NjM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1627661364735-eab249361d46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBtb2RlbHxlbnwxfHx8fDE3NjI2NjI3Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1675387117695-85ca09fe6b26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtb2RlbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjYzODUwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1583981399285-7e22c78c9b2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcnVud2F5JTIwbW9kZWx8ZW58MXx8fHwxNzYyNjc2Mzg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  const endorsements = [
    { name: 'Maison Élégance', role: 'Creative Director', text: 'Sophia is an absolute professional. Her presence on the runway is captivating and she brings every design to life.' },
    { name: 'Vogue Editorial Team', role: 'Fashion Editor', text: 'Working with Sophia was a dream. She understands the vision instantly and delivers exceptional results every time.' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Cover Banner */}
      <div className="relative h-80 bg-gradient-to-br from-neutral-200 to-neutral-300">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1622079400278-b96fa6002733?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwc2hvd3xlbnwxfHx8fDE3NjI2NzYzODh8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative -mt-32 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1721003080966-423d4017d09d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc2MjY3NjM5MHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Sophia Laurent"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center border-4 border-white">
                  <Star className="w-6 h-6 text-white fill-white" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-neutral-900 mb-2">Sophia Laurent</h1>
                    <div className="flex items-center gap-4 text-neutral-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>Paris, France</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>5.0 Rating</span>
                      </div>
                    </div>
                    <p className="text-neutral-700 max-w-2xl">
                      Professional fashion model with 8+ years of experience. Specializing in runway, editorial, and luxury brand campaigns. Featured in Vogue, Elle, and Harper's Bazaar. Available for international bookings.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => onNavigate('messaging')}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                    <button className="px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition flex items-center justify-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Connect
                    </button>
                    <button className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Invite to Show
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-neutral-200">
                  <div>
                    <div className="text-neutral-900">245K</div>
                    <div className="text-neutral-600 text-sm">Instagram Followers</div>
                  </div>
                  <div>
                    <div className="text-neutral-900">127</div>
                    <div className="text-neutral-600 text-sm">Fashion Shows</div>
                  </div>
                  <div>
                    <div className="text-neutral-900">1.2K</div>
                    <div className="text-neutral-600 text-sm">Connections</div>
                  </div>
                  <div>
                    <div className="text-neutral-900">89%</div>
                    <div className="text-neutral-600 text-sm">Response Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-neutral-900 mb-6">About</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-neutral-600 text-sm mb-1">Height</div>
                  <div className="text-neutral-900">5'10" (178 cm)</div>
                </div>
                <div>
                  <div className="text-neutral-600 text-sm mb-1">Measurements</div>
                  <div className="text-neutral-900">34-24-36</div>
                </div>
                <div>
                  <div className="text-neutral-600 text-sm mb-1">Hair</div>
                  <div className="text-neutral-900">Blonde</div>
                </div>
                <div>
                  <div className="text-neutral-600 text-sm mb-1">Eyes</div>
                  <div className="text-neutral-900">Blue</div>
                </div>
                <div>
                  <div className="text-neutral-600 text-sm mb-1">Experience</div>
                  <div className="text-neutral-900">8+ Years</div>
                </div>
                <div>
                  <div className="text-neutral-600 text-sm mb-1">Languages</div>
                  <div className="text-neutral-900">English, French, Italian</div>
                </div>
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-neutral-900">Portfolio</h2>
                <button className="text-amber-600 hover:text-amber-700 text-sm">View All</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {portfolioImages.map((image, index) => (
                  <div key={index} className="relative group cursor-pointer rounded-lg overflow-hidden aspect-[3/4]">
                    <ImageWithFallback
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-full object-cover transition group-hover:scale-105"
                    />
                    {index === 1 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-neutral-800 ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Endorsements */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-neutral-900 mb-6">Endorsements & Reviews</h2>
              <div className="space-y-6">
                {endorsements.map((endorsement, index) => (
                  <div key={index} className="border-b border-neutral-200 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-neutral-200 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-neutral-900">{endorsement.name}</div>
                            <div className="text-neutral-600 text-sm">{endorsement.role}</div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-4 h-4 text-amber-500 fill-amber-500" />
                            ))}
                          </div>
                        </div>
                        <p className="text-neutral-700">{endorsement.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Social Media Reach */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-neutral-900 mb-4">Social Media Reach</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-neutral-900">Instagram</div>
                      <div className="text-neutral-600 text-sm">245K followers</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-neutral-800 to-neutral-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-neutral-900">TikTok</div>
                      <div className="text-neutral-600 text-sm">89K followers</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-neutral-400" />
                </div>
              </div>
            </div>

            {/* Experience Highlights */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-neutral-900 mb-4">Experience Highlights</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-neutral-900">Paris Fashion Week</div>
                    <div className="text-neutral-600 text-sm">Featured model for Chanel, Dior, and Givenchy</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-neutral-900">Vogue Cover</div>
                    <div className="text-neutral-600 text-sm">Vogue Paris, March 2024</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-neutral-900">Brand Campaigns</div>
                    <div className="text-neutral-600 text-sm">Collaborated with 40+ luxury brands</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade Prompt */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
              <h3 className="text-neutral-900 mb-2">Upgrade to Pro</h3>
              <p className="text-neutral-700 text-sm mb-4">
                Unlock premium features including priority visibility, advanced analytics, and unlimited portfolio uploads.
              </p>
              <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition flex justify-center items-center">
                Upgrade Now
              </button>
            </div>

            {/* Similar Profiles */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-neutral-900 mb-4">Similar Profiles</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-3 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg -mx-2">
                    <div className="w-12 h-12 bg-neutral-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-neutral-900 truncate">Model Name</div>
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
