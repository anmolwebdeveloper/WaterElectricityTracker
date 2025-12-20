// Test script for admin approval flow
const API_URL = 'http://localhost:5000/api';

async function testAdminFlow() {
  console.log('🔍 Testing Admin Approval Flow...\n');

  try {
    // Step 1: Create a test user
    console.log('Step 1: Creating test user...');
    const signupResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: `testuser${Date.now()}@example.com`,
        password: 'password123',
        electricityMeterNo: 'ELEC-TEST-123',
        waterMeterNo: 'WATER-TEST-456'
      })
    });
    
    const userData = await signupResponse.json();
    if (!signupResponse.ok) {
      throw new Error(userData.error || 'Signup failed');
    }
    console.log('✅ Test user created:', userData.user.email);
    console.log('   User ID:', userData.user.id);
    console.log('   Verified:', userData.user.isVerified);
    
    const testUserId = userData.user.id;
    const testUserEmail = userData.user.email;

    // Step 2: Login as admin
    console.log('\nStep 2: Logging in as admin...');
    const adminLoginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@wattsflow.com',
        password: '123456'
      })
    });
    
    const adminData = await adminLoginResponse.json();
    if (!adminLoginResponse.ok) {
      throw new Error(adminData.error || 'Admin login failed');
    }
    console.log('✅ Admin logged in successfully');
    console.log('   Admin token received');
    
    const adminToken = adminData.token;

    // Step 3: Fetch pending users
    console.log('\nStep 3: Fetching pending users...');
    const pendingResponse = await fetch(`${API_URL}/admin/pending`, {
      headers: { 
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const pendingData = await pendingResponse.json();
    if (!pendingResponse.ok) {
      throw new Error(pendingData.error || 'Failed to fetch pending users');
    }
    console.log('✅ Pending users fetched:', pendingData.count);
    
    const pendingUser = pendingData.users.find(u => u._id === testUserId);
    if (pendingUser) {
      console.log('   Found test user in pending list');
      console.log('   Name:', pendingUser.name);
      console.log('   Email:', pendingUser.email);
    }

    // Step 4: Approve the test user
    console.log('\nStep 4: Approving test user...');
    const approveResponse = await fetch(`${API_URL}/admin/verify/${testUserId}`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const approveData = await approveResponse.json();
    if (!approveResponse.ok) {
      throw new Error(approveData.error || 'Failed to approve user');
    }
    console.log('✅ User approved successfully!');
    console.log('   Message:', approveData.message);
    console.log('   User verified:', approveData.user.isVerified);
    console.log('   Verified at:', approveData.user.verifiedAt);

    // Step 5: Verify by logging in as the test user
    console.log('\nStep 5: Testing user login after approval...');
    const userLoginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUserEmail,
        password: 'password123'
      })
    });
    
    const userLoginData = await userLoginResponse.json();
    if (!userLoginResponse.ok) {
      throw new Error(userLoginData.error || 'User login failed');
    }
    console.log('✅ User logged in successfully');
    console.log('   User verified status:', userLoginData.user.isVerified);
    
    if (userLoginData.user.isVerified) {
      console.log('\n🎉 SUCCESS! User can now access the dashboard!');
    } else {
      console.log('\n❌ FAILED! User is still not verified');
    }

    // Step 6: Check verified users list
    console.log('\nStep 6: Checking verified users list...');
    const verifiedResponse = await fetch(`${API_URL}/admin/verified`, {
      headers: { 
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const verifiedData = await verifiedResponse.json();
    if (!verifiedResponse.ok) {
      throw new Error(verifiedData.error || 'Failed to fetch verified users');
    }
    console.log('✅ Verified users fetched:', verifiedData.count);
    
    const verifiedUser = verifiedData.users.find(u => u._id === testUserId);
    if (verifiedUser) {
      console.log('   ✅ Test user found in verified list!');
    } else {
      console.log('   ❌ Test user NOT found in verified list');
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎯 TEST SUMMARY:');
    console.log('   ✅ User registration: SUCCESS');
    console.log('   ✅ Admin login: SUCCESS');
    console.log('   ✅ Fetch pending users: SUCCESS');
    console.log('   ✅ Approve user: SUCCESS');
    console.log('   ✅ User login after approval: SUCCESS');
    console.log('   ✅ User in verified list: ' + (verifiedUser ? 'SUCCESS' : 'FAILED'));
    console.log('='.repeat(50));

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testAdminFlow();
