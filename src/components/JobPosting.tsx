import { MapPin, Calendar, DollarSign, Briefcase, Users, Clock, Bookmark, Share2, Send } from 'lucide-react';

interface JobPostingProps {
  onNavigate: (page: string) => void;
}

export function JobPosting({ onNavigate }: JobPostingProps) {
  const relatedJobs = [
    { title: 'Editorial Model - Vogue Shoot', company: 'Vogue Paris', location: 'Paris', budget: '$1,200' },
    { title: 'Brand Ambassador', company: 'Luxury Brand Co.', location: 'Milan', budget: '$5,000' },
    { title: 'Catwalk Model', company: 'Fashion Week Org', location: 'New York', budget: '$3,000' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              {/* Company Header */}
              <div className="flex items-start gap-4 pb-6 border-b border-neutral-200 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-400 text-2xl">M</span>
                </div>
                <div className="flex-1">
                  <h1 className="text-neutral-900 mb-2">Runway Model for Fashion Week Mumbai</h1>
                  <div className="flex flex-wrap items-center gap-3 text-neutral-600">
                    <button 
                      onClick={() => onNavigate('designer-profile')}
                      className="text-amber-600 hover:text-amber-700"
                    >
                      Maison Élégance
                    </button>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>Mumbai, India</span>
                    </div>
                    <span>•</span>
                    <span className="text-neutral-500">Posted 2 days ago</span>
                  </div>
                </div>
              </div>

              {/* Job Details Grid */}
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-neutral-600 text-sm mb-1">Budget Range</div>
                    <div className="text-neutral-900">$2,500 - $4,500</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-neutral-600 text-sm mb-1">Event Date</div>
                    <div className="text-neutral-900">March 15-17, 2025</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-neutral-600 text-sm mb-1">Experience Level</div>
                    <div className="text-neutral-900">Intermediate to Expert</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-neutral-600 text-sm mb-1">Duration</div>
                    <div className="text-neutral-900">3 days (includes rehearsal)</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-neutral-900 mb-4">Job Description</h2>
                <div className="text-neutral-700 space-y-4">
                  <p>
                    Maison Élégance is seeking professional runway models for our Spring/Summer 2025 collection debut at Mumbai Fashion Week. This is a premier opportunity to work with one of Europe's most prestigious fashion houses.
                  </p>
                  <p>
                    You will be part of a 3-day event including rehearsals, fittings, and two runway shows. Our collection features elegant evening wear and contemporary resort pieces that require confident, experienced models who can showcase the garments with sophistication and grace.
                  </p>
                  <p>
                    This is a paid opportunity with potential for future collaborations. Selected models will receive professional photos and videos from the show for their portfolios.
                  </p>
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-8">
                <h2 className="text-neutral-900 mb-4">Model Requirements</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <div className="text-neutral-600 text-sm mb-1">Height Range</div>
                    <div className="text-neutral-900">5'8" - 6'0" (173-183 cm)</div>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <div className="text-neutral-600 text-sm mb-1">Gender</div>
                    <div className="text-neutral-900">Female</div>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <div className="text-neutral-600 text-sm mb-1">Age Range</div>
                    <div className="text-neutral-900">18-30 years</div>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <div className="text-neutral-600 text-sm mb-1">Experience</div>
                    <div className="text-neutral-900">2+ years runway experience</div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-neutral-900 mb-3">Additional Requirements</h3>
                  <ul className="space-y-2 text-neutral-700">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Previous runway experience at fashion weeks or major events</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Professional portfolio with runway and editorial work</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Ability to wear sample sizes (US 2-4 / EU 34-36)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Available for all event dates including rehearsals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Confident walking in high heels (minimum 4 inches)</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* What We Offer */}
              <div className="mb-8">
                <h2 className="text-neutral-900 mb-4">What We Offer</h2>
                <ul className="space-y-2 text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Competitive compensation ($2,500 - $4,500 based on experience)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Professional photos and videos for your portfolio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Opportunity to work with renowned designers and industry professionals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Accommodation and meals provided during the event</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Potential for future collaborations and brand campaigns</span>
                  </li>
                </ul>
              </div>

              {/* How to Apply */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-neutral-900 mb-3">How to Apply</h3>
                <p className="text-neutral-700 mb-4">
                  Submit your application through the Runway platform. Please ensure your profile includes:
                </p>
                <ul className="space-y-1 text-neutral-700 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Recent professional photos (headshot, full body, runway shots)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Updated measurements and stats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Links to previous runway work (videos preferred)</span>
                  </li>
                </ul>
                <p className="text-neutral-600 text-sm">
                  Application deadline: February 15, 2025. Shortlisted candidates will be contacted within 5 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition mb-3 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Apply Now
              </button>
              <button className="w-full py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition mb-3 flex items-center justify-center gap-2">
                <Bookmark className="w-4 h-4" />
                Save Job
              </button>
              <button
                onClick={() => onNavigate('messaging')}
                className="w-full py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition mb-3 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Message Recruiter
              </button>
              <button className="w-full py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </button>

              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="flex items-center gap-2 text-neutral-600 text-sm mb-2">
                  <Users className="w-4 h-4" />
                  <span>47 applicants</span>
                </div>
                <div className="text-neutral-500 text-xs">
                  Be one of the first 50 applicants
                </div>
              </div>
            </div>

            {/* About Company */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-neutral-900 mb-4">About Maison Élégance</h3>
              <div className="w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-amber-400 text-2xl">M</span>
              </div>
              <p className="text-neutral-700 text-sm mb-4">
                Premier luxury fashion house specializing in haute couture and ready-to-wear collections. Established in 1985.
              </p>
              <button
                onClick={() => onNavigate('designer-profile')}
                className="text-amber-600 hover:text-amber-700 text-sm"
              >
                View Company Profile →
              </button>
            </div>

            {/* Related Jobs */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-neutral-900 mb-4">Related Opportunities</h3>
              <div className="space-y-4">
                {relatedJobs.map((job, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-4 hover:border-amber-300 hover:bg-amber-50/30 transition cursor-pointer">
                    <h4 className="text-neutral-900 text-sm mb-2">{job.title}</h4>
                    <div className="text-neutral-600 text-xs mb-2">{job.company}</div>
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>{job.location}</span>
                      <span>{job.budget}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promote Job */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
              <h3 className="text-neutral-900 mb-2">Promote This Job</h3>
              <p className="text-neutral-700 text-sm mb-4">
                Get 3x more qualified applicants by promoting this job post to targeted models.
              </p>
              <button className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition text-sm">
                Boost Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
