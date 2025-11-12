import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Play, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FeedProps {
  onNavigate: (page: string) => void;
}

export function Feed({ onNavigate }: FeedProps) {
  const posts = [
    {
      id: 1,
      author: 'Sophia Laurent',
      authorType: 'Model',
      authorImage: 'https://images.unsplash.com/photo-1721003080966-423d4017d09d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBwb3J0cmFpdCUyMHdvbWFufGVufDF8fHx8MTc2MjY3NjM5MHww&ixlib=rb-4.1.0&q=80&w=1080',
      time: '2h ago',
      content: 'What an incredible experience walking for Maison Élégance at Paris Fashion Week! Grateful for this opportunity and the amazing team. The energy backstage was electric! ✨',
      image: 'https://images.unsplash.com/photo-1583981399285-7e22c78c9b2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcnVud2F5JTIwbW9kZWx8ZW58MXx8fHwxNzYyNjc2Mzg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 1243,
      comments: 87,
      shares: 34,
      isVideo: false,
    },
    {
      id: 2,
      author: 'Maison Élégance',
      authorType: 'Designer',
      authorImage: null,
      time: '5h ago',
      content: '🎯 We\'re hiring! Looking for experienced runway models for Mumbai Fashion Week (March 15-17). Click the link below to apply. Budget: $2,500-$4,500.',
      image: 'https://images.unsplash.com/photo-1622079400278-b96fa6002733?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwc2hvd3xlbnwxfHx8fDE3NjI2NzYzODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 456,
      comments: 52,
      shares: 89,
      isVideo: false,
      hasJobLink: true,
    },
    {
      id: 3,
      author: 'Marcus Chen',
      authorType: 'Model',
      authorImage: 'https://images.unsplash.com/photo-1675387117695-85ca09fe6b26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtb2RlbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MjYzODUwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      time: '1d ago',
      content: 'Behind the scenes from yesterday\'s editorial shoot. Such a talented crew! 📸 Shot by @photographer',
      image: 'https://images.unsplash.com/photo-1758613655670-7b3cdd1e27ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R1ZGlvJTIwd29ya3NwYWNlfGVufDF8fHx8MTc2MjY3NjM4OXww&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 789,
      comments: 43,
      shares: 12,
      isVideo: true,
    },
    {
      id: 4,
      author: 'Isabella Martinez',
      authorType: 'Model',
      authorImage: 'https://images.unsplash.com/photo-1627661364735-eab249361d46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBtb2RlbHxlbnwxfHx8fDE3NjI2NjI3Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      time: '2d ago',
      content: 'New headshots just dropped! Excited to share these with you all. Thank you to the incredible team who made this happen. 💫',
      image: 'https://images.unsplash.com/photo-1627661364735-eab249361d46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBtb2RlbHxlbnwxfHx8fDE3NjI2NjI3Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 2341,
      comments: 134,
      shares: 56,
      isVideo: false,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="h-20 bg-gradient-to-br from-neutral-200 to-neutral-300"></div>
                <div className="px-6 pb-6">
                  <div className="relative -mt-10 mb-4">
                    <div className="w-20 h-20 bg-neutral-200 rounded-full border-4 border-white"></div>
                  </div>
                  <h3 className="text-neutral-900 mb-1">Your Profile</h3>
                  <p className="text-neutral-600 text-sm mb-4">Model • Paris, France</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Profile views</span>
                      <span className="text-amber-600">234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Connections</span>
                      <span className="text-amber-600">1.2K</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('model-profile')}
                    className="w-full mt-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition text-sm flex justify-center items-center"
                  >
                    View Profile
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-neutral-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => onNavigate('search')}
                    className="w-full text-left px-4 py-3 hover:bg-neutral-50 rounded-lg text-neutral-700 text-sm"
                  >
                    Find Models
                  </button>
                  <button
                    onClick={() => onNavigate('job')}
                    className="w-full text-left px-4 py-3 hover:bg-neutral-50 rounded-lg text-neutral-700 text-sm"
                  >
                    Browse Jobs
                  </button>
                  <button className="w-full text-left px-4 py-3 hover:bg-neutral-50 rounded-lg text-neutral-700 text-sm">
                    Events Near You
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6">
            {/* Create Post */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-200 rounded-full flex-shrink-0"></div>
                <input
                  type="text"
                  placeholder="Share your latest work or update..."
                  className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-200">
                <button className="flex items-center gap-2 text-neutral-600 hover:text-amber-600 text-sm">
                  <ImageWithFallback src="" alt="" className="w-5 h-5" />
                  <span>Photo</span>
                </button>
                <button className="flex items-center gap-2 text-neutral-600 hover:text-amber-600 text-sm">
                  <Play className="w-5 h-5" />
                  <span>Video</span>
                </button>
                <button className="flex items-center gap-2 text-neutral-600 hover:text-amber-600 text-sm">
                  <TrendingUp className="w-5 h-5" />
                  <span>Achievement</span>
                </button>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Post Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onNavigate(post.authorType === 'Model' ? 'model-profile' : 'designer-profile')}
                          className="w-12 h-12 bg-neutral-200 rounded-full flex-shrink-0 overflow-hidden"
                        >
                          {post.authorImage ? (
                            <ImageWithFallback
                              src={post.authorImage}
                              alt={post.author}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-600 flex items-center justify-center">
                              <span className="text-amber-400">{post.author.charAt(0)}</span>
                            </div>
                          )}
                        </button>
                        <div>
                          <button
                            onClick={() => onNavigate(post.authorType === 'Model' ? 'model-profile' : 'designer-profile')}
                            className="text-neutral-900 hover:text-amber-600"
                          >
                            {post.author}
                          </button>
                          <div className="text-neutral-600 text-sm">{post.authorType} • {post.time}</div>
                        </div>
                      </div>
                      <button className="text-neutral-400 hover:text-neutral-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-neutral-700">{post.content}</p>
                    {post.hasJobLink && (
                      <button
                        onClick={() => onNavigate('job')}
                        className="mt-3 inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition text-sm"
                      >
                        View Job Posting →
                      </button>
                    )}
                  </div>

                  {/* Post Image */}
                  <div className="relative">
                    <ImageWithFallback
                      src={post.image}
                      alt="Post content"
                      className="w-full h-[500px] object-cover"
                    />
                    {post.isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-neutral-800 ml-1" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="p-6 pt-4">
                    <div className="flex items-center justify-between mb-4 text-neutral-600 text-sm">
                      <span>{post.likes.toLocaleString()} likes</span>
                      <div className="flex items-center gap-4">
                        <span>{post.comments} comments</span>
                        <span>{post.shares} shares</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                      <button className="flex items-center gap-2 text-neutral-600 hover:text-amber-600 transition">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">Like</span>
                      </button>
                      <button
                        onClick={() => onNavigate('messaging')}
                        className="flex items-center gap-2 text-neutral-600 hover:text-amber-600 transition"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">Comment</span>
                      </button>
                      <button className="flex items-center gap-2 text-neutral-600 hover:text-amber-600 transition">
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm">Share</span>
                      </button>
                      <button className="flex items-center gap-2 text-neutral-600 hover:text-amber-600 transition">
                        <Bookmark className="w-5 h-5" />
                        <span className="text-sm">Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Trending */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-neutral-900 mb-4">Trending</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-neutral-600 text-xs mb-1">Fashion Events</div>
                    <div className="text-neutral-900 text-sm">Paris Fashion Week 2025</div>
                    <div className="text-neutral-500 text-xs">2.4K posts</div>
                  </div>
                  <div>
                    <div className="text-neutral-600 text-xs mb-1">Industry News</div>
                    <div className="text-neutral-900 text-sm">Sustainable Fashion Movement</div>
                    <div className="text-neutral-500 text-xs">1.8K posts</div>
                  </div>
                  <div>
                    <div className="text-neutral-600 text-xs mb-1">Opportunities</div>
                    <div className="text-neutral-900 text-sm">NYC Casting Calls</div>
                    <div className="text-neutral-500 text-xs">945 posts</div>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-neutral-900 mb-4">People to Follow</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-neutral-200 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-neutral-900 truncate text-sm">Model Name</div>
                        <div className="text-neutral-600 text-xs">Paris, France</div>
                      </div>
                      <button className="px-3 py-1 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 text-xs">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Ad */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
                <h3 className="text-neutral-900 mb-2">Upgrade to Pro</h3>
                <p className="text-neutral-700 text-sm mb-4">
                  Get priority in search results and access to exclusive opportunities.
                </p>
                <button className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition text-sm flex items-center justify-center">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
