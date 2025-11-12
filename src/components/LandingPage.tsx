import { ArrowRight, CheckCircle, Star, TrendingUp, Users, Calendar } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const topModels = [
    {
      name: 'Sophia Laurent',
      location: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1721003080966-423d4017d09d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc2MjY3NjM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
      followers: '245K',
      shows: 127,
    },
    {
      name: 'Marcus Chen',
      location: 'New York, USA',
      image: 'https://images.unsplash.com/photo-1675387117695-85ca09fe6b26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtb2RlbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjYzODUwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      followers: '189K',
      shows: 94,
    },
    {
      name: 'Isabella Martinez',
      location: 'Milan, Italy',
      image: 'https://images.unsplash.com/photo-1627661364735-eab249361d46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBtb2RlbHxlbnwxfHx8fDE3NjI2NjI3Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      followers: '312K',
      shows: 156,
    },
  ];

  const topDesigners = [
    {
      name: 'Maison Élégance',
      type: 'Luxury Fashion House',
      location: 'Paris, France',
      projects: 45,
    },
    {
      name: 'Urban Thread Studio',
      type: 'Streetwear Designer',
      location: 'Los Angeles, USA',
      projects: 32,
    },
    {
      name: 'Celestial Couture',
      type: 'Bridal & Evening Wear',
      location: 'London, UK',
      projects: 28,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-neutral-800 to-neutral-600 rounded-lg flex items-center justify-center">
                <span className="text-amber-400">R</span>
              </div>
              <span className="text-neutral-800">MaisonModello</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('auth')}
                className="text-neutral-600 hover:text-neutral-800 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('auth')}
                className="px-6 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-neutral-50 via-amber-50/30 to-neutral-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full mb-6">
                Professional Fashion Networking
              </div>
              <h1 className="text-neutral-900 mb-6">
                Connect. Collaborate. Walk the Runway.
              </h1>
              <p className="text-neutral-600 mb-8 max-w-lg">
                The premier platform connecting fashion models with top designers, event organizers, and modeling agencies worldwide. Build your portfolio, discover opportunities, and elevate your career.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('auth')}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition flex items-center justify-center gap-2"
                >
                  Join Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-8 mt-8">
                <div>
                  <div className="text-neutral-900">50K+</div>
                  <div className="text-neutral-600 text-sm">Active Models</div>
                </div>
                <div>
                  <div className="text-neutral-900">12K+</div>
                  <div className="text-neutral-600 text-sm">Designers</div>
                </div>
                <div>
                  <div className="text-neutral-900">2.5K+</div>
                  <div className="text-neutral-600 text-sm">Shows Booked</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1583981399285-7e22c78c9b2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcnVud2F5JTIwbW9kZWx8ZW58MXx8fHwxNzYyNjc2Mzg3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Fashion Runway"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-amber-400 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-48 h-48 bg-neutral-400 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-neutral-900 mb-4">How It Works</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Three simple steps to launch your fashion career or find the perfect talent
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-neutral-900 mb-3">1. Create Your Profile</h3>
              <p className="text-neutral-600">
                Build a stunning portfolio showcasing your best work, measurements, experience, and social reach
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-neutral-900 mb-3">2. Connect & Discover</h3>
              <p className="text-neutral-600">
                Network with industry professionals, explore job opportunities, and get discovered by top agencies
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-neutral-900 mb-3">3. Book Shows & Collaborate</h3>
              <p className="text-neutral-600">
                Accept invitations, collaborate on fashion shows, and grow your professional network
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Models */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-neutral-900 mb-2">Featured Models</h2>
              <p className="text-neutral-600">Top talent on Runway this month</p>
            </div>
            <button className="text-amber-600 hover:text-amber-700 flex items-center gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {topModels.map((model, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => onNavigate('model-profile')}
              >
                <div className="relative h-80">
                  <ImageWithFallback
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm text-neutral-800">Top Rated</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-neutral-900 mb-1">{model.name}</h3>
                  <p className="text-neutral-600 text-sm mb-4">{model.location}</p>
                  <div className="flex items-center justify-between">
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
        </div>
      </section>

      {/* Top Designers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-neutral-900 mb-2">Top Designers & Agencies</h2>
              <p className="text-neutral-600">Industry leaders hiring on Runway</p>
            </div>
            <button className="text-amber-600 hover:text-amber-700 flex items-center gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {topDesigners.map((designer, index) => (
              <div
                key={index}
                className="bg-neutral-50 rounded-xl p-8 hover:shadow-md transition cursor-pointer border border-neutral-200"
                onClick={() => onNavigate('designer-profile')}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-amber-400 text-2xl">{designer.name.charAt(0)}</span>
                </div>
                <h3 className="text-neutral-900 mb-2">{designer.name}</h3>
                <p className="text-neutral-600 text-sm mb-1">{designer.type}</p>
                <p className="text-neutral-500 text-sm mb-4">{designer.location}</p>
                <div className="pt-4 border-t border-neutral-200">
                  <div className="text-neutral-800">{designer.projects} Active Projects</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-neutral-900 mb-4">Loved by the Industry</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              See what models and designers are saying about Runway
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-neutral-700 mb-6">
                "Runway transformed my modeling career. I've booked more shows in 3 months than I did in 2 years. The platform is intuitive and connects me with serious professionals."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
                <div>
                  <div className="text-neutral-900">Emma Rodriguez</div>
                  <div className="text-neutral-600 text-sm">Fashion Model</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-neutral-700 mb-6">
                "As a designer, finding the right models used to take weeks. With Runway, I can browse portfolios, check availability, and book talent in minutes. Game changer!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
                <div>
                  <div className="text-neutral-900">James Harper</div>
                  <div className="text-neutral-600 text-sm">Creative Director</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-neutral-700 mb-6">
                "The verification system and professional environment make Runway stand out. I feel confident connecting with agencies and brands knowing everyone is serious about their work."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
                <div>
                  <div className="text-neutral-900">Aisha Patel</div>
                  <div className="text-neutral-600 text-sm">Agency Representative</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-6">Ready to Launch Your Fashion Career?</h2>
          <p className="text-neutral-300 mb-8 text-lg">
            Join thousands of models and designers building their future on Runway
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('auth')}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition"
            >
              Get Started Free
            </button>
            <button className="px-8 py-4 bg-white text-neutral-900 rounded-lg hover:bg-neutral-100 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 border-t border-neutral-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-neutral-700 to-neutral-600 rounded-lg flex items-center justify-center">
                  <span className="text-amber-400 text-sm">R</span>
                </div>
                <span className="text-white">MaisonModello</span>
              </div>
              <p className="text-neutral-400 text-sm">
                The premier platform for fashion professionals worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-white mb-4">For Models</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li><a href="#" className="hover:text-amber-400">Create Portfolio</a></li>
                <li><a href="#" className="hover:text-amber-400">Find Jobs</a></li>
                <li><a href="#" className="hover:text-amber-400">Get Discovered</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">For Designers</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li><a href="#" className="hover:text-amber-400">Post Jobs</a></li>
                <li><a href="#" className="hover:text-amber-400">Find Talent</a></li>
                <li><a href="#" className="hover:text-amber-400">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Company</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li><a href="#" className="hover:text-amber-400">About Us</a></li>
                <li><a href="#" className="hover:text-amber-400">Careers</a></li>
                <li><a href="#" className="hover:text-amber-400">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-center text-neutral-400 text-sm">
            © 2025 Runway. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}