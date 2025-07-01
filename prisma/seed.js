"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
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
    const adminPassword = await bcryptjs_1.default.hash('admin123', 12);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@asaanshaadi.com' },
        update: {},
        create: {
            email: 'admin@asaanshaadi.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            phone: '+92 300 0000000',
            role: client_1.UserRole.ADMIN,
            isVerified: true,
        },
    });
    console.log('✅ Admin user created');
    // Create sample vendor user
    const vendorPassword = await bcryptjs_1.default.hash('vendor123', 12);
    const vendorUser = await prisma.user.upsert({
        where: { email: 'vendor@asaanshaadi.com' },
        update: {},
        create: {
            email: 'vendor@asaanshaadi.com',
            password: vendorPassword,
            firstName: 'Vendor',
            lastName: 'User',
            phone: '+92 300 1111111',
            role: client_1.UserRole.VENDOR,
            isVerified: true,
        },
    });
    console.log('✅ Vendor user created');
    // Create sample regular user
    const userPassword = await bcryptjs_1.default.hash('user123', 12);
    const regularUser = await prisma.user.upsert({
        where: { email: 'user@asaanshaadi.com' },
        update: {},
        create: {
            email: 'user@asaanshaadi.com',
            password: userPassword,
            firstName: 'John',
            lastName: 'Doe',
            phone: '+92 300 2222222',
            role: client_1.UserRole.USER,
            isVerified: true,
        },
    });
    console.log('✅ Regular user created');
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
//# sourceMappingURL=seed.js.map