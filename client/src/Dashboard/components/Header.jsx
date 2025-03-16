import React, { useState } from "react";
import { Search, RefreshCw, Calendar, MoreHorizontal, Plus, FileText, PenLine, Bell, ChevronDown } from "lucide-react";
import { SignedIn, SignedOut, UserButton, SignInButton, useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast';

const Header = ({ onCreateNote, onSearch, onRefresh }) => {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCreateNote = (type) => {
    setDropdownOpen(false);
    if (onCreateNote) {
      onCreateNote(type);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
        toast.success("Notes refreshed successfully");
      }
    } catch (error) {
      toast.error("Failed to refresh notes");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="sticky top-0 bg-white h-16 px-6 flex items-center justify-between border-b border-gray-100 shadow-sm z-10">
      <div className="flex-1 max-w-2xl mx-4">
        <form onSubmit={handleSearch} className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full py-2 pl-10 pr-4 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 border border-gray-200 hover:border-gray-300 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="hidden">Search</button>
        </form>
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center space-x-4">
          <button
            className={`w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all ${isRefreshing ? 'animate-spin text-amber-500' : 'text-gray-500'}`}
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh notes"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 hidden md:inline-block">
                {user?.firstName} {user?.lastName}
              </span>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 border-2 border-amber-100"
                  }
                }}
              />
            </div>
          </SignedIn>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center text-sm gap-2 px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
            >
              <Plus size={16} />
              <span>New Note</span>
              <ChevronDown size={16} />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                ></div>
                <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
                  <div className="py-2 px-3 bg-gray-50 border-b border-gray-100">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Create New</h3>
                  </div>
                  <ul className="py-2">
                    <li>
                      <button
                        onClick={() => handleCreateNote('text')}
                        className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <FileText size={16} className="text-amber-500" />
                        </div>
                        <div>
                          <span className="font-medium">Text Note</span>
                          <p className="text-xs text-gray-500">Create a simple text note</p>
                        </div>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleCreateNote('drawing')}
                        className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <PenLine size={16} className="text-blue-500" />
                        </div>
                        <div>
                          <span className="font-medium">Drawing Note</span>
                          <p className="text-xs text-gray-500">Create a drawing or sketch</p>
                        </div>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleCreateNote('reminder')}
                        className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Bell size={16} className="text-green-500" />
                        </div>
                        <div>
                          <span className="font-medium">Reminder Note</span>
                          <p className="text-xs text-gray-500">Set a reminder with notification</p>
                        </div>
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
