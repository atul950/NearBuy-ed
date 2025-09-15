"use client"

import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import axios from "axios"
import { Search, MapPin, Star, Grid, List, SlidersHorizontal } from "lucide-react"

const ProductSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    query: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    city: searchParams.get("city") || "",
    minPrice: searchParams.get("min_price") || "",
    maxPrice: searchParams.get("max_price") || "",
    sortBy: searchParams.get("sort") || "relevance",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    searchProducts()
  }, [searchParams])

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories")
      setCategories(response.data.categories)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const searchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.query) params.append("q", filters.query)
      if (filters.category) params.append("category", filters.category)
      if (filters.city) params.append("city", filters.city)
      if (filters.minPrice) params.append("min_price", filters.minPrice)
      if (filters.maxPrice) params.append("max_price", filters.maxPrice)

      const response = await axios.get(`/api/products/search?${params.toString()}`)
      setProducts(response.data.products || [])
    } catch (error) {
      console.error("Error searching products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Update URL params
    const newParams = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newParams.set(k === "query" ? "q" : k, v)
    })
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "",
      city: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "relevance",
    })
    setSearchParams({})
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {filters.query ? `Search results for "${filters.query}"` : "Browse Products"}
          </h1>
          <p className="text-muted-foreground mt-1">{products.length} products found</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-card-foreground mb-4">Filters</h3>

            {/* Search Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.query}
                    onChange={(e) => handleFilterChange("query", e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-input text-sm"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-input text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.category_id} value={category.category_name}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">City</label>
                <input
                  type="text"
                  placeholder="Enter city name"
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-input text-sm"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-input text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-input text-sm"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or browse different categories</p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {products.map((product) => (
                <ProductCard key={product.product_id} product={product} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ProductCard = ({ product, viewMode }) => {
  if (viewMode === "list") {
    return (
      <Link
        to={`/product/${product.product_id}`}
        className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-primary/20 flex"
      >
        <div className="w-32 h-32 bg-muted flex items-center justify-center flex-shrink-0">
          <img
            src={`/abstract-geometric-shapes.png?height=128&width=128&query=${encodeURIComponent(product.product_name)}`}
            alt={product.product_name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex-1">
          <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.product_name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{product.brand}</p>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{product.city}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-muted-foreground">4.5</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground">{product.shop_name}</span>
            <span className="text-xs text-accent font-medium">{product.stock} in stock</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
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

        <div className="mt-2">
          <span className="text-xs text-accent font-medium">{product.stock} in stock</span>
        </div>
      </div>
    </Link>
  )
}

export default ProductSearch
