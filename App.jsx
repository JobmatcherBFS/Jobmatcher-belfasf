import React, { useState } from 'react';
import { Search, Briefcase, User, LogOut, Heart, ExternalLink } from 'lucide-react';

const BACKEND_URL = 'https://jobmatcher-backend-prod.railway.app';

export default function JobMatcherApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [screen, setScreen] = useState('landing');
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    targetRole: '',
    skills: '',
    experience: '',
    location: 'Belfast',
    salary: '',
    jobType: ''
  });

  const [searchResults, setSearchResults] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data);
        setScreen('dashboard');
        localStorage.setItem('user', JSON.stringify(data));
      } else {
        alert('Signup failed');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleSearchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/jobs/search`, {
        method: 'GET',
        headers: { 
          'uid': currentUser.uid,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.jobs || []);
        setScreen('results');
      }
    } catch (error) {
      alert('Search error: ' + error.message);
    }
    setLoading(false);
  };

  const toggleSaveJob = (job) => {
    if (savedJobs.find(j => j.id === job.id)) {
      setSavedJobs(savedJobs.filter(j => j.id !== job.id));
    } else {
      setSavedJobs([...savedJobs, job]);
    }
  };

  // LANDING PAGE
  if (screen === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-white text-center">
          <div className="mb-8">
            <Briefcase size={64} className="mx-auto mb-4" />
            <h1 className="text-5xl font-bold mb-4">JobMatcher Belfast</h1>
            <p className="text-xl text-blue-100 mb-8">
              AI-Powered Job Matching. For Belfast Professionals.
            </p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 mb-8">
            <div className="space-y-6 mb-8">
              <div>
                <User className="mx-auto mb-2" size={32} />
                <h3 className="font-bold mb-2">Your Profile</h3>
                <p className="text-sm text-blue-100">Enter your skills and what you're looking for</p>
              </div>
              <div>
                <Search className="mx-auto mb-2" size={32} />
                <h3 className="font-bold mb-2">AI Finds Jobs</h3>
                <p className="text-sm text-blue-100">AI matches you with jobs ranked by fit</p>
              </div>
              <div>
                <Heart className="mx-auto mb-2" size={32} />
                <h3 className="font-bold mb-2">Apply & Track</h3>
                <p className="text-sm text-blue-100">Save jobs and apply with one click</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setScreen('signup')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition w-full"
          >
            Get Started Free
          </button>
          
          <p className="text-blue-100 text-sm mt-4">No credit card. Takes 2 minutes.</p>
        </div>
      </div>
    );
  }

  // SIGNUP PAGE
  if (screen === 'signup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setScreen('landing')}
            className="text-white mb-8 text-lg"
          >
            ← Back
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Create Your Profile</h1>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Name *</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Email *</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Target Role *</label>
                <input
                  type="text"
                  value={profile.targetRole}
                  onChange={(e) => setProfile({...profile, targetRole: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="e.g., Software Engineer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Skills</label>
                <textarea
                  value={profile.skills}
                  onChange={(e) => setProfile({...profile, skills: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 h-20"
                  placeholder="e.g., Python, React, AWS"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Experience</label>
                <select
                  value={profile.experience}
                  onChange={(e) => setProfile({...profile, experience: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select...</option>
                  <option value="0-2">0-2 years</option>
                  <option value="2-5">2-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Salary Range</label>
                <input
                  type="text"
                  value={profile.salary}
                  onChange={(e) => setProfile({...profile, salary: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="e.g., £50k-£70k"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Start Matching →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD
  if (screen === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Welcome!</h1>
            <button
              onClick={() => {
                setCurrentUser(null);
                localStorage.removeItem('user');
                setScreen('landing');
              }}
              className="bg-gray-200 px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 text-center">
            <Search size={48} className="mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold mb-4">Find Your Perfect Job</h2>
            <button
              onClick={handleSearchJobs}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search Jobs Now'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RESULTS
  if (screen === 'results') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between">
            <h1 className="text-2xl font-bold">Job Matches</h1>
            <button
              onClick={() => setScreen('dashboard')}
              className="bg-gray-200 px-4 py-2 rounded-lg"
            >
              ← Back
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {searchResults.length === 0 ? (
            <p className="text-gray-600">No jobs found. Check back soon!</p>
          ) : (
            <div className="space-y-4">
              {searchResults.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold">{job.title}</h2>
                      <p className="text-gray-600">{job.company}</p>
                      <p className="text-sm text-gray-500">{job.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">{job.matchScore}%</div>
                      <p className="text-xs text-gray-600">Match</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-2">{job.description}</p>
                  <p className="font-semibold text-blue-600 mb-4">{job.salary}</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => toggleSaveJob(job)}
                      className={`px-4 py-2 rounded-lg ${
                        savedJobs.find(j => j.id === job.id)
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {savedJobs.find(j => j.id === job.id) ? '❤️ Saved' : '🤍 Save'}
                    </button>
                    <button
                      onClick={() => window.open(job.url, '_blank')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Apply →
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
}