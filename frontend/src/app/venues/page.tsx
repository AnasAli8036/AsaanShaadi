"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Users, Star, Wifi, Car, Snowflake, Loader2 } from "lucide-react";
import { venuesApi } from "@/lib/api";
import Link from "next/link";

export default function VenuesPage() {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    area: "",
    minCapacity: "",
    maxCapacity: "",
    minPrice: "",
    maxPrice: "",
    isAirConditioned: undefined as boolean | undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: currentPage,
        limit: 12,
        ...filters,
      };

      // Remove empty values
      Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await venuesApi.getVenues(params);

      if (response.success && response.data) {
        setVenues(response.data.venues || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        setError(response.error || "Failed to fetch venues");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch venues");
      console.error("Error fetching venues:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [currentPage, filters]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchVenues();
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Wedding Venues</h1>
        <p className="text-xl text-muted-foreground">
          Find the perfect venue for your special day
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search venues..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <select
              className="px-3 py-2 border rounded-md"
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="pricePerDay-asc">Price: Low to High</option>
              <option value="pricePerDay-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="capacity-desc">Largest Capacity</option>
              <option value="name-asc">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={filters.isAirConditioned === true ? "default" : "secondary"}
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            onClick={() => handleFilterChange('isAirConditioned', filters.isAirConditioned === true ? undefined : true)}
          >
            Air Conditioned
          </Badge>
          <Badge
            variant={filters.maxPrice === "100000" ? "default" : "secondary"}
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            onClick={() => handleFilterChange('maxPrice', filters.maxPrice === "100000" ? "" : "100000")}
          >
            Under ₹100K
          </Badge>
          <Badge
            variant={filters.minCapacity === "500" ? "default" : "secondary"}
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            onClick={() => handleFilterChange('minCapacity', filters.minCapacity === "500" ? "" : "500")}
          >
            500+ Capacity
          </Badge>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading venues...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchVenues}>Try Again</Button>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          <div className="mb-4">
            <p className="text-muted-foreground">
              Showing {venues.length} venues
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <Card key={venue.id} className="group hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted rounded-t-lg relative overflow-hidden">
                  {venue.primaryImage ? (
                    <img
                      src={venue.primaryImage}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary">
                      ₹{venue.pricePerDay?.toLocaleString()}/day
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{venue.rating || 0}</span>
                      <span className="text-sm opacity-80">({venue.reviewCount || 0})</span>
                    </div>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-1">{venue.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {venue.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{venue.address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Up to {venue.capacity} guests</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {venue.amenities?.slice(0, 3).map((amenity: any) => (
                      <Badge key={amenity.id || amenity.name} variant="outline" className="text-xs">
                        {amenity.name === "Air Conditioning" && <Snowflake className="h-3 w-3 mr-1" />}
                        {amenity.name === "Parking" && <Car className="h-3 w-3 mr-1" />}
                        {amenity.name === "Sound System" && <Wifi className="h-3 w-3 mr-1" />}
                        {amenity.name || amenity}
                      </Badge>
                    ))}
                    {venue.amenities?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{venue.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1" size="sm" asChild>
                      <Link href={`/venues/${venue.id}`}>View Details</Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

    </div>
  );
}
