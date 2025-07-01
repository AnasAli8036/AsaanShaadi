import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create cities
  const cities = await Promise.all([
    prisma.city.upsert({
      where: { name: 'Karachi' },
      update: {},
      create: {
        name: 'Karachi',
        province: 'Sindh',
        country: 'Pakistan',
        latitude: 24.8607,
        longitude: 67.0011,
      },
    }),
    prisma.city.upsert({
      where: { name: 'Lahore' },
      update: {},
      create: {
        name: 'Lahore',
        province: 'Punjab',
        country: 'Pakistan',
        latitude: 31.5204,
        longitude: 74.3587,
      },
    }),
    prisma.city.upsert({
      where: { name: 'Islamabad' },
      update: {},
      create: {
        name: 'Islamabad',
        province: 'Federal Capital Territory',
        country: 'Pakistan',
        latitude: 33.6844,
        longitude: 73.0479,
      },
    }),
  ]);

  console.log('✅ Cities created');

  // Create areas
  const areas = await Promise.all([
    // Karachi areas
    prisma.area.upsert({
      where: { name_cityId: { name: 'DHA', cityId: cities[0].id } },
      update: {},
      create: {
        name: 'DHA',
        cityId: cities[0].id,
        postCode: '75500',
      },
    }),
    prisma.area.upsert({
      where: { name_cityId: { name: 'Clifton', cityId: cities[0].id } },
      update: {},
      create: {
        name: 'Clifton',
        cityId: cities[0].id,
        postCode: '75600',
      },
    }),
    prisma.area.upsert({
      where: { name_cityId: { name: 'Gulshan', cityId: cities[0].id } },
      update: {},
      create: {
        name: 'Gulshan',
        cityId: cities[0].id,
        postCode: '75300',
      },
    }),
    // Lahore areas
    prisma.area.upsert({
      where: { name_cityId: { name: 'DHA', cityId: cities[1].id } },
      update: {},
      create: {
        name: 'DHA',
        cityId: cities[1].id,
        postCode: '54000',
      },
    }),
    prisma.area.upsert({
      where: { name_cityId: { name: 'Gulberg', cityId: cities[1].id } },
      update: {},
      create: {
        name: 'Gulberg',
        cityId: cities[1].id,
        postCode: '54660',
      },
    }),
  ]);

  console.log('✅ Areas created');

  // Create amenities
  const amenities = await Promise.all([
    prisma.amenity.upsert({
      where: { name: 'Parking' },
      update: {},
      create: {
        name: 'Parking',
        description: 'Dedicated parking space for guests',
        category: 'facility',
        icon: 'car',
      },
    }),
    prisma.amenity.upsert({
      where: { name: 'Air Conditioning' },
      update: {},
      create: {
        name: 'Air Conditioning',
        description: 'Climate controlled environment',
        category: 'facility',
        icon: 'snowflake',
      },
    }),
    prisma.amenity.upsert({
      where: { name: 'Sound System' },
      update: {},
      create: {
        name: 'Sound System',
        description: 'Professional audio equipment',
        category: 'equipment',
        icon: 'volume-2',
      },
    }),
    prisma.amenity.upsert({
      where: { name: 'Stage' },
      update: {},
      create: {
        name: 'Stage',
        description: 'Elevated platform for performances',
        category: 'facility',
        icon: 'music',
      },
    }),
    prisma.amenity.upsert({
      where: { name: 'Bridal Room' },
      update: {},
      create: {
        name: 'Bridal Room',
        description: 'Private room for bride preparation',
        category: 'facility',
        icon: 'heart',
      },
    }),
  ]);

  console.log('✅ Amenities created');

  // Create cuisines
  const cuisines = await Promise.all([
    prisma.cuisine.upsert({
      where: { name: 'Pakistani' },
      update: {},
      create: {
        name: 'Pakistani',
        description: 'Traditional Pakistani dishes',
        origin: 'Pakistan',
      },
    }),
    prisma.cuisine.upsert({
      where: { name: 'Continental' },
      update: {},
      create: {
        name: 'Continental',
        description: 'European style cuisine',
        origin: 'Europe',
      },
    }),
    prisma.cuisine.upsert({
      where: { name: 'Chinese' },
      update: {},
      create: {
        name: 'Chinese',
        description: 'Chinese cuisine and flavors',
        origin: 'China',
      },
    }),
    prisma.cuisine.upsert({
      where: { name: 'Indian' },
      update: {},
      create: {
        name: 'Indian',
        description: 'Traditional Indian dishes',
        origin: 'India',
      },
    }),
  ]);

  console.log('✅ Cuisines created');

  // Create specialties
  const specialties = await Promise.all([
    prisma.specialty.upsert({
      where: { name: 'Biryani' },
      update: {},
      create: {
        name: 'Biryani',
        description: 'Traditional rice dish',
        category: 'dish',
      },
    }),
    prisma.specialty.upsert({
      where: { name: 'BBQ' },
      update: {},
      create: {
        name: 'BBQ',
        description: 'Grilled meat specialties',
        category: 'dish',
      },
    }),
    prisma.specialty.upsert({
      where: { name: 'Live Cooking' },
      update: {},
      create: {
        name: 'Live Cooking',
        description: 'Food prepared in front of guests',
        category: 'service',
      },
    }),
    prisma.specialty.upsert({
      where: { name: 'Vegetarian' },
      update: {},
      create: {
        name: 'Vegetarian',
        description: 'Plant-based dishes only',
        category: 'dietary',
      },
    }),
  ]);

  console.log('✅ Specialties created');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@asaanshaadi.com' },
    update: {},
    create: {
      email: 'admin@asaanshaadi.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+92 300 0000000',
      role: UserRole.ADMIN,
      isVerified: true,
    },
  });

  console.log('✅ Admin user created');

  // Create sample vendor user
  const vendorPassword = await bcrypt.hash('vendor123', 12);
  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@asaanshaadi.com' },
    update: {},
    create: {
      email: 'vendor@asaanshaadi.com',
      password: vendorPassword,
      firstName: 'Vendor',
      lastName: 'User',
      phone: '+92 300 1111111',
      role: UserRole.VENDOR,
      isVerified: true,
    },
  });

  console.log('✅ Vendor user created');

  // Create sample regular user
  const userPassword = await bcrypt.hash('user123', 12);
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@asaanshaadi.com' },
    update: {},
    create: {
      email: 'user@asaanshaadi.com',
      password: userPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+92 300 2222222',
      role: UserRole.USER,
      isVerified: true,
    },
  });

  console.log('✅ Regular user created');

  // Create sample venues
  const sampleVenues = await Promise.all([
    prisma.venue.create({
      data: {
        name: 'Royal Palace Banquet',
        description: 'Elegant banquet hall perfect for grand wedding celebrations with luxurious interiors and professional service.',
        address: 'Plot 123, DHA Phase 5, Karachi',
        cityId: cities[0].id, // Karachi
        areaId: areas[0].id, // DHA
        capacity: 500,
        pricePerDay: 150000,
        pricePerHour: 8000,
        isAirConditioned: true,
        contactPerson: 'Ahmed Khan',
        contactPhone: '+92 300 1234567',
        contactEmail: 'contact@royalpalace.com',
        latitude: 24.8607,
        longitude: 67.0011,
        ownerId: vendorUser.id,
        isApproved: true,
        rating: 4.8,
        reviewCount: 124,
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Garden View Hall',
        description: 'Beautiful outdoor venue with garden views, perfect for intimate wedding ceremonies and receptions.',
        address: 'Block 15, Gulshan-e-Iqbal, Karachi',
        cityId: cities[0].id, // Karachi
        areaId: areas[2].id, // Gulshan
        capacity: 300,
        pricePerDay: 80000,
        pricePerHour: 4500,
        isAirConditioned: false,
        contactPerson: 'Fatima Ali',
        contactPhone: '+92 300 2345678',
        contactEmail: 'info@gardenview.com',
        latitude: 24.9056,
        longitude: 67.0822,
        ownerId: vendorUser.id,
        isApproved: true,
        rating: 4.5,
        reviewCount: 89,
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Crystal Ballroom',
        description: 'Luxurious ballroom with crystal chandeliers and premium amenities for sophisticated wedding celebrations.',
        address: 'Sea View, Clifton Block 4, Karachi',
        cityId: cities[0].id, // Karachi
        areaId: areas[1].id, // Clifton
        capacity: 800,
        pricePerDay: 250000,
        pricePerHour: 12000,
        isAirConditioned: true,
        contactPerson: 'Hassan Sheikh',
        contactPhone: '+92 300 3456789',
        contactEmail: 'bookings@crystalballroom.com',
        latitude: 24.8138,
        longitude: 67.0299,
        ownerId: adminUser.id,
        isApproved: true,
        rating: 4.9,
        reviewCount: 156,
      },
    }),
  ]);

  console.log('✅ Sample venues created');

  // Add venue amenities
  for (const venue of sampleVenues) {
    await prisma.venueAmenity.createMany({
      data: [
        { venueId: venue.id, amenityId: amenities[0].id }, // Parking
        { venueId: venue.id, amenityId: amenities[1].id }, // Air Conditioning
        { venueId: venue.id, amenityId: amenities[2].id }, // Sound System
      ],
    });
  }

  // Add bridal room to Crystal Ballroom
  await prisma.venueAmenity.create({
    data: {
      venueId: sampleVenues[2].id,
      amenityId: amenities[4].id, // Bridal Room
    },
  });

  console.log('✅ Venue amenities added');

  // Create sample caterers
  const sampleCaterers = await Promise.all([
    prisma.caterer.create({
      data: {
        name: 'Royal Catering Services',
        description: 'Premium catering with authentic Pakistani and continental cuisine, serving delicious meals for over 10 years.',
        pricePerPerson: 1500,
        minimumOrder: 100,
        contactPerson: 'Muhammad Tariq',
        contactPhone: '+92 300 4567890',
        contactEmail: 'orders@royalcatering.com',
        ownerId: vendorUser.id,
        isApproved: true,
        rating: 4.7,
        reviewCount: 89,
      },
    }),
    prisma.caterer.create({
      data: {
        name: 'Spice Garden Catering',
        description: 'Fresh ingredients, authentic flavors, exceptional service. Specializing in traditional Pakistani and Indian cuisine.',
        pricePerPerson: 1200,
        minimumOrder: 50,
        contactPerson: 'Ayesha Khan',
        contactPhone: '+92 300 5678901',
        contactEmail: 'info@spicegarden.com',
        ownerId: adminUser.id,
        isApproved: true,
        rating: 4.5,
        reviewCount: 156,
      },
    }),
  ]);

  console.log('✅ Sample caterers created');

  // Add caterer service areas
  for (const caterer of sampleCaterers) {
    await prisma.catererServiceArea.createMany({
      data: [
        { catererId: caterer.id, cityId: cities[0].id }, // Karachi
        { catererId: caterer.id, cityId: cities[1].id }, // Lahore
      ],
    });
  }

  // Add caterer cuisines
  for (const caterer of sampleCaterers) {
    await prisma.catererCuisine.createMany({
      data: [
        { catererId: caterer.id, cuisineId: cuisines[0].id }, // Pakistani
        { catererId: caterer.id, cuisineId: cuisines[1].id }, // Continental
      ],
    });
  }

  // Add caterer specialties
  for (const caterer of sampleCaterers) {
    await prisma.catererSpecialty.createMany({
      data: [
        { catererId: caterer.id, specialtyId: specialties[0].id }, // Biryani
        { catererId: caterer.id, specialtyId: specialties[1].id }, // BBQ
      ],
    });
  }

  console.log('✅ Caterer details added');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('Admin: admin@asaanshaadi.com / admin123');
  console.log('Vendor: vendor@asaanshaadi.com / vendor123');
  console.log('User: user@asaanshaadi.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
