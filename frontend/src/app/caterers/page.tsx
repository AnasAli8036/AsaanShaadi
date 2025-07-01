"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Users, Star, ChefHat, Clock, Loader2 } from "lucide-react";
import { caterersApi } from "@/lib/api";
import Link from "next/link";

export default function CaterersPage() {
  const [caterers, setCaterers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    serviceAreas: [] as string[],
    cuisine: [] as string[],
    minPrice: "",
    maxPrice: "",
    minimumOrder: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCaterers = async () => {
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
        if (params[key] === "" || params[key] === undefined || (Array.isArray(params[key]) && params[key].length === 0)) {
          delete params[key];
        }
      });

      const response = await caterersApi.getCaterers(params);

      if (response.success && response.data) {
        setCaterers(response.data.caterers || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        setError(response.error || "Failed to fetch caterers");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch caterers");
      console.error("Error fetching caterers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaterers();
  }, [currentPage, filters]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCaterers();
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Catering Services</h1>
        <p className="text-xl text-muted-foreground">
          Discover exceptional catering services for your wedding
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search caterers..."
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              Sort by Price
            </Button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Pakistani Cuisine
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Continental
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Under ₹1500/person
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Minimum 50 guests
          </Badge>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {caterers.map((caterer) => (
          <Card key={caterer.id} className="group hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted rounded-t-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary">
                  ₹{caterer.pricePerPerson}/person
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{caterer.rating}</span>
                  <span className="text-sm opacity-80">({caterer.reviewCount})</span>
                </div>
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="line-clamp-1">{caterer.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {caterer.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Serves: {caterer.serviceAreas.join(", ")}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Minimum {caterer.minimumOrder} guests</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ChefHat className="h-4 w-4" />
                <span>{caterer.cuisine.join(", ")}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {caterer.specialties.slice(0, 3).map((specialty) => (
                  <Badge key={specialty} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {caterer.specialties.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{caterer.specialties.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1" size="sm">
                  View Menu
                </Button>
                <Button variant="outline" size="sm">
                  Get Quote
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <Button variant="outline" size="lg">
          Load More Caterers
        </Button>
      </div>
    </div>
  );
}
