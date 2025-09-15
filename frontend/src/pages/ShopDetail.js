"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { MapPin, Phone, Navigation, Grid, List, Search } from "lucide-react"

const ShopDetail = () => {
  const { id } = useParams()
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchShopDetails()
  }, [id])

  const fetchShopDetails = async () => {
    try {
      const response = await axios.get(`/api/shops/${id}`)
      setShop(response.data)
    } catch (error) {
      console.error("Error fetching shop details:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts =
    shop?.products.filter(
      (product) =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Shop Not Found</h2>
        <p className="text-muted-foreground">The shop you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Shop Header */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center">
          {shop.shop_image ? (
            <img
              src={shop.shop_image || "/placeholder.svg"}
              alt={shop.shop_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-card-foreground">{shop.shop_name}</h1>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground mb-2">{shop.shop_name}</h1>
              <p className="text-muted-foreground mb-4">Owned by {shop.owner_name}</p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-card-foreground">
                    {shop.address.area}, {shop.address.city} - {shop.address.pincode}
                  </span>
                </div>

                {shop.address.landmark && (
                  <div className="flex items-center space-x-3">
                    <Navigation className="w-4 h-4 text-muted-foreground" />
                    <span className="text-card-foreground">Near {shop.address.landmark}</span>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-card-foreground">{shop.phone}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-card-foreground mb-4">Store Hours</h3>
              <div className="space-y-2">
                {shop.timings.length > 0 ? (
                  shop.timings.map((timing, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">{timing.day}</span>
                      <span className="text-card-foreground">
                        {timing.open_time && timing.close_time
                          ? `${timing.open_time} - ${timing.close_time}`
                          : "Closed"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">Store hours not available</p>
                )}
              </div>

              <div className="flex space-x-3 mt-6">
                <button className="flex-1 px-4 py-2 text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                  Get Directions
                </button>
                <button className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-card-foreground">Products ({shop.products.length})</h2>
            <p className="text-muted-foreground">Available items in this store</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-input"
              />
            </div>

            {/* View Toggle */}
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

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search" : "This store has no products listed"}
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const ProductCard = ({ product, viewMode }) => {
  if (viewMode === "list") {
    return (
      <Link
        to={`/product/${product.product_id}`}
        className="group bg-background rounded-lg border border-border overflow-hidden hover:shadow-md transition-all duration-200 hover:border-primary/20 flex"
      >
        <div className="w-24 h-24 bg-muted flex items-center justify-center flex-shrink-0">
          <img
            src={`/abstract-geometric-shapes.png?height=96&width=96&query=${encodeURIComponent(product.product_name)}`}
            alt={product.product_name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.product_name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{product.brand}</p>

          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
            <span className="text-sm text-accent">{product.stock} in stock</span>
          </div>

          <div className="mt-2">
            <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">{product.category}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/product/${product.product_id}`}
      className="group bg-background rounded-lg border border-border overflow-hidden hover:shadow-md transition-all duration-200 hover:border-primary/20"
    >
      <div className="aspect-square bg-muted flex items-center justify-center">
        <img
          src={`/abstract-geometric-shapes.png?height=200&width=200&query=${encodeURIComponent(product.product_name)}`}
          alt={product.product_name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {product.product_name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{product.brand}</p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
          <span className="text-sm text-accent">{product.stock} in stock</span>
        </div>

        <div className="mt-2">
          <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">{product.category}</span>
        </div>
      </div>
    </Link>
  )
}

export default ShopDetail
