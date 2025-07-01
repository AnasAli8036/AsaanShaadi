"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MapPin, 
  ChefHat, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus
} from "lucide-react";

// Mock data for admin dashboard
const stats = {
  totalUsers: 1247,
  totalVenues: 89,
  totalCaterers: 156,
  totalBookings: 342,
  monthlyRevenue: 2450000,
  pendingApprovals: 12,
};

const recentBookings = [
  {
    id: "1",
    customerName: "Ahmed Khan",
    venueName: "Royal Palace Banquet",
    eventDate: "2024-08-15",
    status: "confirmed",
    amount: 150000,
  },
  {
    id: "2",
    customerName: "Fatima Ali",
    venueName: "Garden View Hall",
    eventDate: "2024-07-20",
    status: "pending",
    amount: 80000,
  },
  {
    id: "3",
    customerName: "Hassan Sheikh",
    venueName: "Crystal Ballroom",
    eventDate: "2024-09-10",
    status: "confirmed",
    amount: 250000,
  },
];

const pendingVenues = [
  {
    id: "1",
    name: "Elegant Gardens",
    owner: "Muhammad Tariq",
    location: "Lahore",
    submittedDate: "2024-06-20",
  },
  {
    id: "2",
    name: "Grand Marquee",
    owner: "Ali Hassan",
    location: "Islamabad",
    submittedDate: "2024-06-18",
  },
];

export default function AdminDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ProtectedRoute requiredRole={['ADMIN']}>
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-xl text-muted-foreground">
          Manage your platform and monitor business metrics
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Venues</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVenues}</div>
            <p className="text-xs text-muted-foreground">
              +3 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Caterers</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCaterers}</div>
            <p className="text-xs text-muted-foreground">
              +8 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              +23% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(stats.monthlyRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              Require approval
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
          <TabsTrigger value="venues">Venue Management</TabsTrigger>
          <TabsTrigger value="caterers">Caterer Management</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
        </TabsList>

        {/* Recent Bookings */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>
                Latest booking requests and confirmations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{booking.customerName}</p>
                      <p className="text-sm text-muted-foreground">{booking.venueName}</p>
                      <p className="text-sm text-muted-foreground">
                        Event Date: {new Date(booking.eventDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">₹{booking.amount.toLocaleString()}</p>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Venue Management */}
        <TabsContent value="venues">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Venue Management</CardTitle>
                <CardDescription>
                  Manage all venues on the platform
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Venue
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Venue Management</h3>
                <p className="text-muted-foreground">
                  Venue management interface will be implemented here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Caterer Management */}
        <TabsContent value="caterers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Caterer Management</CardTitle>
                <CardDescription>
                  Manage all caterers on the platform
                </CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Caterer
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Caterer Management</h3>
                <p className="text-muted-foreground">
                  Caterer management interface will be implemented here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Approvals */}
        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
                Review and approve new venue and caterer applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingVenues.map((venue) => (
                  <div key={venue.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{venue.name}</p>
                      <p className="text-sm text-muted-foreground">Owner: {venue.owner}</p>
                      <p className="text-sm text-muted-foreground">Location: {venue.location}</p>
                      <p className="text-sm text-muted-foreground">
                        Submitted: {new Date(venue.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                      <Button size="sm">
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </ProtectedRoute>
  );
}
