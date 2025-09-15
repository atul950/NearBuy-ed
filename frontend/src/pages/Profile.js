"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { User, Mail, Phone, MapPin, Clock, Star } from "lucide-react"

const Profile = () => {
  const { user, logout } = useAuth()
  const [searchHistory, setSearchHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // In a real app, you'd fetch user's search history, reviews, etc.
        // For now, we'll use mock data
        setSearchHistory([
          { search_item: "iPhone 15", timestamp: new Date().toISOString() },
          { search_item: "Samsung Galaxy", timestamp: new Date(Date.now() - 86400000).toISOString() },
          { search_item: "Gold Chain", timestamp: new Date(Date.now() - 172800000).toISOString() },
        ])
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user])

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Please Login</h2>
        <p className="text-muted-foreground">You need to be logged in to view your profile.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">{user.name}</h1>
              <p className="text-muted-foreground">NEARBUY Member</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive rounded-lg hover:bg-destructive/90 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center space-x-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-card-foreground">{user.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-card-foreground">{user.phone || "Not provided"}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-card-foreground">{searchHistory.length}</h3>
          <p className="text-muted-foreground">Recent Searches</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 text-center">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-card-foreground">0</h3>
          <p className="text-muted-foreground">Reviews Written</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 text-center">
          <div className="w-12 h-12 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-chart-3" />
          </div>
          <h3 className="text-2xl font-bold text-card-foreground">0</h3>
          <p className="text-muted-foreground">Favorite Stores</p>
        </div>
      </div>

      {/* Recent Search History */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-bold text-card-foreground mb-6">Recent Searches</h2>
        {searchHistory.length > 0 ? (
          <div className="space-y-4">
            {searchHistory.map((search, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-card-foreground font-medium">{search.search_item}</span>
                </div>
                <span className="text-sm text-muted-foreground">{new Date(search.timestamp).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No search history yet. Start exploring products to see your searches here!
          </p>
        )}
      </div>

      {/* Account Settings */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-bold text-card-foreground mb-6">Account Settings</h2>
        <div className="space-y-4">
          <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-card-foreground">Edit Profile</span>
              <span className="text-muted-foreground">→</span>
            </div>
          </button>

          <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-card-foreground">Notification Preferences</span>
              <span className="text-muted-foreground">→</span>
            </div>
          </button>

          <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-card-foreground">Privacy Settings</span>
              <span className="text-muted-foreground">→</span>
            </div>
          </button>

          <button className="w-full text-left px-4 py-3 rounded-lg border border-destructive/20 text-destructive hover:bg-destructive/5 transition-colors">
            <div className="flex items-center justify-between">
              <span>Delete Account</span>
              <span>→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
