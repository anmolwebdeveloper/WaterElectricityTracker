/**
 * Database Migration Script
 * Run this once to update existing users with the new schema fields
 */

import mongoose from 'mongoose';
import User from './models/User.js';
import SystemSettings from './models/SystemSettings.js';
import dotenv from 'dotenv';

dotenv.config();

async function migrateDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // 1. Update existing users with new fields
    console.log('\n📝 Updating existing users...');
    const result = await User.updateMany(
      { status: { $exists: false } },
      {
        $set: {
          status: 'active',
          role: 'user',
          auditLogs: [],
          loginHistory: []
        }
      }
    );
    console.log(`✅ Updated ${result.modifiedCount} users with new status fields`);

    // 2. Set verified users to active status
    console.log('\n📝 Setting verified users to active...');
    const verifiedResult = await User.updateMany(
      { isVerified: true, status: { $ne: 'removed' } },
      { $set: { status: 'active' } }
    );
    console.log(`✅ Set ${verifiedResult.modifiedCount} verified users to active`);

    // 3. Set unverified users to pending status
    console.log('\n📝 Setting unverified users to pending...');
    const pendingResult = await User.updateMany(
      { isVerified: false, status: { $ne: 'removed' } },
      { $set: { status: 'pending' } }
    );
    console.log(`✅ Set ${pendingResult.modifiedCount} unverified users to pending`);

    // 4. Set admin user
    console.log('\n📝 Setting up admin user...');
    const adminEmail = 'admin@wattsflow.com';
    const adminResult = await User.updateOne(
      { email: adminEmail },
      {
        $set: {
          role: 'admin',
          status: 'active',
          isVerified: true
        }
      }
    );
    
    if (adminResult.matchedCount > 0) {
      console.log(`✅ Admin user (${adminEmail}) updated`);
    } else {
      console.log(`⚠️  Admin user (${adminEmail}) not found. Please create it manually.`);
    }

    // 5. Create default system settings
    console.log('\n📝 Creating default system settings...');
    const existingSettings = await SystemSettings.findOne({ region: 'global' });
    
    if (!existingSettings) {
      await SystemSettings.create({
        region: 'global',
        electricityRate: {
          value: 0.12,
          currency: 'USD',
          unit: 'kWh',
          lastUpdated: new Date()
        },
        waterRate: {
          value: 0.004,
          currency: 'USD',
          unit: 'gallon',
          lastUpdated: new Date()
        },
        peakHours: {
          electricity: [
            { start: '17:00', end: '21:00', multiplier: 1.5 }
          ],
          water: [
            { start: '06:00', end: '09:00', multiplier: 1.2 },
            { start: '18:00', end: '22:00', multiplier: 1.2 }
          ]
        },
        systemConfig: {
          maintenanceMode: false,
          maintenanceMessage: '',
          allowNewRegistrations: true,
          requireEmailVerification: false,
          requireAdminApproval: true
        }
      });
      console.log('✅ Default system settings created');
    } else {
      console.log('ℹ️  System settings already exist');
    }

    // 6. Display statistics
    console.log('\n📊 Migration Statistics:');
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const pendingUsers = await User.countDocuments({ status: 'pending' });
    const removedUsers = await User.countDocuments({ status: 'removed' });
    const adminUsers = await User.countDocuments({ role: 'admin' });

    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Active: ${activeUsers}`);
    console.log(`   Pending: ${pendingUsers}`);
    console.log(`   Removed: ${removedUsers}`);
    console.log(`   Admins: ${adminUsers}`);

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Verify the admin user can login');
    console.log('   2. Check that existing users can still access their dashboards');
    console.log('   3. Test the new admin features');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from database');
    process.exit(0);
  }
}

// Run migration
console.log('🚀 Starting database migration...\n');
migrateDatabase();
