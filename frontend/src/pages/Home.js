"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Search, MapPin, Star, Smartphone, Gem, Shirt, HomeIcon, Book } from "lucide-react"

const Home = () => {
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          axios.get("/api/categories"),
          axios.get("/api/products/search?limit=8"),
        ])

        setCategories(categoriesRes.data.categories)
        setFeaturedProducts(productsRes.data.products || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase()
    if (name.includes("electronic")) return <Smartphone className="w-6 h-6" />
    if (name.includes("jewelry")) return <Gem className="w-6 h-6" />
    if (name.includes("clothing")) return <Shirt className="w-6 h-6" />
    if (name.includes("home")) return <HomeIcon className="w-6 h-6" />
    if (name.includes("book")) return <Book className="w-6 h-6" />
    return <Search className="w-6 h-6" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Find Products in Nearby Stores
          </h1>
          <p className="text-lg text-muted-foreground mb-8 text-balance">
            Discover local availability, compare prices, and shop smart in your neighborhood. Experience the best of
            offline shopping with online convenience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Search className="w-5 h-5 mr-2" />
              Start Shopping
            </Link>
            <Link
              to="/search?nearby=true"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-secondary-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Find Nearby Stores
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">Shop by Category</h2>
          <Link to="/search" className="text-primary hover:text-primary/80 font-medium transition-colors">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.category_id}
              to={`/search?category=${encodeURIComponent(category.category_name)}`}
              className="group p-6 bg-card rounded-xl border border-border hover:shadow-md transition-all duration-200 hover:border-primary/20"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {getCategoryIcon(category.category_name)}
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {category.category_name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">Featured Products</h2>
          <Link to="/search" className="text-primary hover:text-primary/80 font-medium transition-colors">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <Link
              key={product.product_id}
              to={`/product/${product.product_id}`}
              className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-primary/20"
            >
              <div className="aspect-square bg-muted flex items-center justify-center">
                <img
                  src={`/abstract-geometric-shapes.png?height=200&width=200&query=${encodeURIComponent(product.product_name)}`}
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {product.product_name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{product.brand}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{product.city}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">{product.shop_name}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-muted-foreground">4.5</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose NEARBUY?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the perfect blend of online convenience and offline shopping
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Smart Search</h3>
            <p className="text-muted-foreground text-sm">
              Find products across multiple local stores with intelligent search and filters
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Local Discovery</h3>
            <p className="text-muted-foreground text-sm">
              Discover nearby stores, check real-time availability and get directions
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Price Comparison</h3>
            <p className="text-muted-foreground text-sm">
              Compare prices across stores and read authentic reviews from local shoppers
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
