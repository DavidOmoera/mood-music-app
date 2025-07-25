import {
  MagnifyingGlassIcon,
  ClockIcon,
  BookmarkIcon,
  ArrowDownTrayIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  ArrowPathIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/outline';

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 bottom-0 w-64 bg-gray-900 p-6 hidden lg:flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-10">Moodify</h1>
          <nav className="space-y-4">
            <div className="text-sm font-medium text-gray-400">Welcome to</div>
            <ul className="space-y-2 mt-2">
              <li className="flex items-center space-x-3 text-white font-semibold">
                <span>😊</span>
                <span>Welcome to</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300 hover:text-white">
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span>Find content</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300 hover:text-white">
                <ClockIcon className="h-5 w-5" />
                <span>Previously enjoyed</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300 hover:text-white">
                <BookmarkIcon className="h-5 w-5" />
                <span>Saved items</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300 hover:text-white">
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Downloads</span>
              </li>
            </ul>
          </nav>

          <div className="mt-10 p-4 bg-gray-800 rounded-lg">
            <p className="text-sm font-semibold mb-2">Upgrade to Premium for extra perks!</p>
            <button className="bg-white text-black px-4 py-2 rounded-lg font-medium text-sm">Upgrade now</button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-gray-300 hover:text-white">
            <CogIcon className="h-5 w-5" />
            <span>Settings</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-300 hover:text-white">
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Sign out</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 p-6 space-y-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Search for content"
            className="w-full max-w-lg bg-gray-800 px-4 py-2 rounded-lg text-white placeholder-gray-400"
          />
          <div className="flex items-center space-x-4">
            <BellIcon className="h-6 w-6 text-white" />
            <div className="h-10 w-10 bg-gray-400 rounded-full" />
          </div>
        </div>

        {/* Discover Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">Discover new content from your favorite creators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="h-32 bg-gray-500 rounded mb-2" />
                <h3 className="font-semibold text-sm">Placeholder Title</h3>
                <p className="text-xs text-gray-400">Description here</p>
              </div>
            ))}
          </div>
        </section>

        {/* Continue Listening */}
        <section>
          <h2 className="text-xl font-bold mb-4">Continue listening</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["Daily News", "Latest Daily News"].map((title, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4">
                <div className="h-14 w-14 bg-gray-500 rounded" />
                <div>
                  <h4 className="font-medium text-white">{title}</h4>
                  <p className="text-xs text-gray-400">{i === 0 ? "12 mins left" : "22 mins left"}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Shows */}
        <section>
          <h2 className="text-xl font-bold mb-4">Trending shows</h2>
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="min-w-[160px] bg-gray-800 rounded-lg p-3">
                <div className="h-28 bg-gray-600 rounded mb-2" />
                <h4 className="font-medium text-sm">Trending {i + 1}</h4>
                <p className="text-xs text-gray-400">Subtitle here</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Friend Interactions Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-64 bg-gray-900 p-4 hidden xl:block">
        <h3 className="text-lg font-bold mb-4">Friend interactions</h3>
        <ul className="space-y-3 text-sm">
          {[...Array(8)].map((_, i) => (
            <li key={i} className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gray-500 rounded-full" />
              <div>
                <p className="font-semibold text-white">Friend's recent activity</p>
                <p className="text-gray-400 text-xs">Listening to a podcast</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 lg:ml-64 xl:mr-64">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-500 rounded" />
            <div>
              <p className="text-sm font-medium">Learn about sustainable practices</p>
              <p className="text-xs text-gray-400">Our planet’s</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-xs">16:48</p>
            <p className="text-xs text-gray-400">/ 8:25</p>
            <button className="p-2 rounded-full bg-blue-500">
              <SpeakerWaveIcon className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around py-2 lg:hidden">
        <MagnifyingGlassIcon className="h-6 w-6 text-white" />
        <BookmarkIcon className="h-6 w-6 text-white" />
        <CogIcon className="h-6 w-6 text-white" />
        <ArrowRightOnRectangleIcon className="h-6 w-6 text-white" />
      </div>
    </div>
  );
};

export default Home;
