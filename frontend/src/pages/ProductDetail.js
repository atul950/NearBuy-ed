"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"
import { MapPin, Star, Navigation, Heart, Share2, ShoppingBag, MessageCircle } from "lucide-react"

const ProductDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedShop, setSelectedShop] = useState(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review_text: "",
  })

  useEffect(() => {
    fetchProductDetails()
  }, [id])

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`)
      setProduct(response.data)
      if (response.data.shops && response.data.shops.length > 0) {
        setSelectedShop(response.data.shops[0])
      }
    } catch (error) {
      console.error("Error fetching product details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      alert("Please login to write a review")
      return
    }

    try {
      await axios.post("/api/reviews", {
        product_id: Number.parseInt(id),
        rating: reviewForm.rating,
        review_text: reviewForm.review_text,
      })

      setShowReviewForm(false)
      setReviewForm({ rating: 5, review_text: "" })
      fetchProductDetails() // Refresh to show new review
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Failed to submit review")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h2>
        <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
      </div>
    )
  }

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Product Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-xl flex items-center justify-center overflow-hidden">
            <img
              src={`/abstract-geometric-shapes.png?height=500&width=500&query=${encodeURIComponent(product.product_name)}`}
              alt={product.product_name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">{product.product_name}</h1>
            <p className="text-lg text-muted-foreground mt-2">{product.brand}</p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold">{averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground">({product.reviews.length} reviews)</span>
              </div>
              <span className="px-2 py-1 bg-accent/10 text-accent text-sm rounded-full">{product.category}</span>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-card-foreground mb-4">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <span className="text-sm text-muted-foreground">Color:</span>
                <span className="ml-2 font-medium text-card-foreground">{product.color}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <Heart className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Available Stores */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-bold text-card-foreground mb-6">Available at {product.shops.length} stores</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Store List */}
          <div className="space-y-4">
            {product.shops.map((shop) => (
              <div
                key={shop.shop_id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedShop?.shop_id === shop.shop_id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedShop(shop)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground">{shop.shop_name}</h3>
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {shop.area}, {shop.city}
                      </span>
                    </div>
                    {shop.landmark && <p className="text-sm text-muted-foreground mt-1">Near {shop.landmark}</p>}
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">₹{shop.price.toLocaleString()}</div>
                    <div className="text-sm text-accent">{shop.stock} in stock</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Store Details */}
          {selectedShop && (
            <div className="bg-muted/50 rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4">{selectedShop.shop_name}</h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {selectedShop.area}, {selectedShop.city}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    ₹{selectedShop.price.toLocaleString()} • {selectedShop.stock} available
                  </span>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Link
                  to={`/shop/${selectedShop.shop_id}`}
                  className="flex-1 px-4 py-2 text-center text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Visit Store
                </Link>
                <button className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors">
                  <Navigation className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-card-foreground">Reviews ({product.reviews.length})</h2>
          {user && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="flex items-center space-x-2 px-4 py-2 text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Write Review</span>
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className={`w-8 h-8 ${star <= reviewForm.rating ? "text-yellow-400" : "text-muted-foreground"}`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Review</label>
                <textarea
                  value={reviewForm.review_text}
                  onChange={(e) => setReviewForm({ ...reviewForm, review_text: e.target.value })}
                  placeholder="Share your experience with this product..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-input resize-none"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 text-foreground border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {product.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={index} className="border-b border-border pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-card-foreground">{review.user_name}</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating ? "text-yellow-400 fill-current" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground">{review.review_text}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
