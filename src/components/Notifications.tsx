import { Bell, UserPlus, Briefcase, MessageCircle, Eye, Calendar, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';

interface NotificationsProps {
  onNavigate: (page: string) => void;
}

export function Notifications({ onNavigate }: NotificationsProps) {
  const [filter, setFilter] = useState<'all' | 'invites' | 'messages' | 'views'>('all');

  const notifications = [
    {
      id: 1,
      type: 'job_invite',
      icon: <Briefcase className="w-5 h-5" />,
      title: 'Job Invitation',
      message: 'Maison Élégance invited you to apply for "Runway Model for Fashion Week"',
      time: '5 minutes ago',
      read: false,
      action: 'View Job',
    },
    {
      id: 2,
      type: 'connection',
      icon: <UserPlus className="w-5 h-5" />,
      title: 'New Connection Request',
      message: 'Sophie Bernard wants to connect with you',
      time: '1 hour ago',
      read: false,
      action: 'Accept',
    },
    {
      id: 3,
      type: 'message',
      icon: <MessageCircle className="w-5 h-5" />,
      title: 'New Message',
      message: 'Marcus Chen sent you a message',
      time: '2 hours ago',
      read: false,
      action: 'Reply',
    },
    {
      id: 4,
      type: 'profile_view',
      icon: <Eye className="w-5 h-5" />,
      title: 'Profile Views',
      message: 'Your profile was viewed by 47 people this week',
      time: '3 hours ago',
      read: true,
      action: 'See Who',
    },
    {
      id: 5,
      type: 'event',
      icon: <Calendar className="w-5 h-5" />,
      title: 'Event Reminder',
      message: 'Paris Fashion Week casting call is in 3 days',
      time: '5 hours ago',
      read: true,
      action: 'View Details',
    },
    {
      id: 6,
      type: 'achievement',
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Milestone Reached',
      message: 'Congratulations! You\'ve reached 1,000 connections',
      time: '1 day ago',
      read: true,
      action: null,
    },
    {
      id: 7,
      type: 'job_invite',
      icon: <Briefcase className="w-5 h-5" />,
      title: 'Job Invitation',
      message: 'Urban Thread Studio invited you to apply for "Brand Campaign Model"',
      time: '1 day ago',
      read: true,
      action: 'View Job',
    },
    {
      id: 8,
      type: 'connection',
      icon: <UserPlus className="w-5 h-5" />,
      title: 'Connection Accepted',
      message: 'Isabella Martinez accepted your connection request',
      time: '2 days ago',
      read: true,
      action: 'View Profile',
    },
    {
      id: 9,
      type: 'profile_view',
      icon: <Eye className="w-5 h-5" />,
      title: 'Profile View',
      message: 'A talent scout from Elite Model Management viewed your profile',
      time: '2 days ago',
      read: true,
      action: 'See Profile',
    },
    {
      id: 10,
      type: 'message',
      icon: <MessageCircle className="w-5 h-5" />,
      title: 'New Message',
      message: 'Maison Élégance sent you a message',
      time: '3 days ago',
      read: true,
      action: 'Reply',
    },
  ];

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'all') return true;
    if (filter === 'invites') return notif.type === 'job_invite' || notif.type === 'connection';
    if (filter === 'messages') return notif.type === 'message';
    if (filter === 'views') return notif.type === 'profile_view';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-neutral-900 mb-2">Notifications</h1>
              <p className="text-neutral-600">
                {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
            <button className="text-amber-600 hover:text-amber-700 text-sm">
              Mark all as read
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-lg whitespace-nowrap transition ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50 shadow-sm'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('invites')}
              className={`px-6 py-3 rounded-lg whitespace-nowrap transition ${
                filter === 'invites'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50 shadow-sm'
              }`}
            >
              Invitations
            </button>
            <button
              onClick={() => setFilter('messages')}
              className={`px-6 py-3 rounded-lg whitespace-nowrap transition ${
                filter === 'messages'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50 shadow-sm'
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => setFilter('views')}
              className={`px-6 py-3 rounded-lg whitespace-nowrap transition ${
                filter === 'views'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50 shadow-sm'
              }`}
            >
              Profile Views
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition ${
                !notif.read ? 'border-l-4 border-amber-500' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    !notif.read ? 'bg-amber-100 text-amber-600' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {notif.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className={`${!notif.read ? 'text-neutral-900' : 'text-neutral-700'}`}>
                      {notif.title}
                    </h3>
                    <button className="text-neutral-400 hover:text-neutral-600 flex-shrink-0">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-neutral-600 mb-2">{notif.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 text-sm">{notif.time}</span>
                    {notif.action && (
                      <button
                        onClick={() => {
                          if (notif.type === 'job_invite') onNavigate('job');
                          else if (notif.type === 'message') onNavigate('messaging');
                          else if (notif.type === 'connection') onNavigate('model-profile');
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition text-sm"
                      >
                        {notif.action}
                      </button>
                    )}
                  </div>
                </div>

                {/* Unread Indicator */}
                {!notif.read && (
                  <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <Bell className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-neutral-900 mb-2">No notifications</h3>
            <p className="text-neutral-600">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        )}

        {/* Profile Insights Card */}
        <div className="mt-8 bg-gradient-to-br from-amber-50 to-neutral-50 rounded-xl p-8 border border-amber-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-neutral-900 mb-2">Weekly Profile Insights</h3>
              <div className="grid sm:grid-cols-3 gap-6 mb-4">
                <div>
                  <div className="text-neutral-900 text-2xl">234</div>
                  <div className="text-neutral-600 text-sm">Profile Views</div>
                  <div className="text-green-600 text-xs">+12% from last week</div>
                </div>
                <div>
                  <div className="text-neutral-900 text-2xl">47</div>
                  <div className="text-neutral-600 text-sm">Search Appearances</div>
                  <div className="text-green-600 text-xs">+8% from last week</div>
                </div>
                <div>
                  <div className="text-neutral-900 text-2xl">18</div>
                  <div className="text-neutral-600 text-sm">Job Invitations</div>
                  <div className="text-green-600 text-xs">+25% from last week</div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('model-profile')}
                className="text-amber-600 hover:text-amber-700 text-sm"
              >
                View Full Analytics →
              </button>
            </div>
          </div>
        </div>

        {/* Suggested Actions */}
        <div className="mt-8 bg-white rounded-xl p-8 shadow-sm">
          <h3 className="text-neutral-900 mb-4">Suggested for You</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <UserPlus className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-neutral-900 mb-1">Complete Your Profile</h4>
                <p className="text-neutral-600 text-sm mb-3">
                  Profiles with photos and videos get 5x more visibility
                </p>
                <button
                  onClick={() => onNavigate('model-profile')}
                  className="text-amber-600 hover:text-amber-700 text-sm"
                >
                  Update Profile →
                </button>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-neutral-900 mb-1">New Jobs Match Your Skills</h4>
                <p className="text-neutral-600 text-sm mb-3">
                  12 new job opportunities match your profile
                </p>
                <button
                  onClick={() => onNavigate('search')}
                  className="text-amber-600 hover:text-amber-700 text-sm"
                >
                  Browse Jobs →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
