// src/sections/LightMerchShop.jsx
import { useState } from "react";
import RoomSection from "../components/RoomSection";

export default function LightMerchShop({ onToggleMode }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Items", icon: "🛍️" },
    { id: "apparel", label: "Apparel", icon: "👕" },
    { id: "music", label: "Music", icon: "🎵" },
    { id: "art", label: "Art Prints", icon: "🖼️" },
    { id: "collectibles", label: "Collectibles", icon: "✨" },
  ];

  // Sample products - replace with real data
  const products = [
    { id: 1, name: "Kazmo Mansion T-Shirt", category: "apparel", price: "$29.99", image: "👕", stock: "In Stock" },
    { id: 2, name: "Vinyl Collection Vol. 1", category: "music", price: "$34.99", image: "💿", stock: "In Stock" },
    { id: 3, name: "Signed Art Print", category: "art", price: "$49.99", image: "🖼️", stock: "Limited" },
    { id: 4, name: "Gold Key Pendant", category: "collectibles", price: "$79.99", image: "🔑", stock: "In Stock" },
    { id: 5, name: "Mansion Hoodie", category: "apparel", price: "$54.99", image: "🧥", stock: "In Stock" },
    { id: 6, name: "Digital Album", category: "music", price: "$14.99", image: "🎧", stock: "In Stock" },
  ];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <RoomSection bg="/Hallway_Light.webp" className="bg-white">
      <div className="relative w-full h-full overflow-y-auto">
        {/* Theme toggle button */}
        <button
          type="button"
          onClick={onToggleMode}
          aria-label="Toggle by storefront"
          className="
            absolute
            left-[22%]
            bottom-[22%]
            w-16 h-16 md:w-20 md:h-20
            rounded-full
            bg-transparent
            hover:bg-amber-300/20
            transition
            z-30
          "
        />

        {/* Shop Container */}
        <div className="min-h-full px-4 py-8 md:px-12 md:py-12">
          {/* Header */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="bg-amber-50/95 backdrop-blur-md rounded-2xl p-6 border-2 border-amber-300/60 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-amber-500 mb-1">
                    Kazmo Mansion
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold text-amber-900">
                    Merch Shop
                  </h1>
                  <p className="text-sm text-amber-700 mt-2">
                    Exclusive merchandise & limited editions
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-amber-600">Shopping Cart</p>
                    <p className="text-2xl font-bold text-amber-900">🛒</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="max-w-6xl mx-auto mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap
                    transition-all font-medium text-sm
                    ${selectedCategory === cat.id
                      ? "bg-amber-400 text-amber-900 shadow-md scale-105"
                      : "bg-amber-100/80 text-amber-700 hover:bg-amber-200/80"}
                  `}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/95 backdrop-blur-sm rounded-xl border-2 border-amber-200/60 overflow-hidden hover:border-amber-400 hover:shadow-xl transition-all group cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center border-b-2 border-amber-200/60">
                    <span className="text-6xl group-hover:scale-110 transition-transform">
                      {product.image}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className={`
                        text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full
                        ${product.stock === "Limited" 
                          ? "bg-orange-100 text-orange-700" 
                          : "bg-green-100 text-green-700"}
                      `}>
                        {product.stock}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-amber-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-amber-700">
                        {product.price}
                      </p>
                      <button className="bg-amber-400 hover:bg-amber-500 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-amber-700">No items in this category yet</p>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="mt-4 px-6 py-2 bg-amber-400 text-amber-900 rounded-full font-semibold hover:bg-amber-500 transition-colors"
                >
                  View All Items
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </RoomSection>
  );
}
