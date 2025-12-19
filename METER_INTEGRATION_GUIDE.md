# Meter Number Integration Guide

## Overview
WattsFlow Dashboard integrates with your utility meters through unique meter identification numbers. This allows the system to fetch real-time consumption data from your electricity and water providers.

## How It Works

### 1. Meter Number Format
- **Electricity Meter**: `EM-YYYY-XXXXX` (e.g., EM-2024-12345)
- **Water Meter**: `WM-YYYY-XXXXX` (e.g., WM-2024-67890)

Where:
- `EM` = Electricity Meter
- `WM` = Water Meter
- `YYYY` = Installation year
- `XXXXX` = Unique identifier

### 2. Finding Your Meter Numbers

#### Electricity Meter Number
1. Check your electric bill (usually in header or account summary)
2. Look at the physical meter device (sticker or digital display)
3. Contact your utility provider
4. Check your online utility account portal

#### Water Meter Number
1. Check your water bill
2. Look at the water meter (usually in basement or outside)
3. Contact your water utility company
4. Check municipal records online

### 3. Configuring in WattsFlow

#### Step-by-Step Setup:
1. **Navigate to Settings**
   - Click on "Settings" in the dashboard sidebar
   - Or go to: http://localhost:5174/dashboard/settings

2. **Open Meter Info Tab**
   - Click the "Meter Info" tab (first tab)

3. **Enter Meter Numbers**
   - Find "Electricity Meter Number" field
   - Enter your meter ID (e.g., EM-2024-12345)
   - Find "Water Meter Number" field
   - Enter your meter ID (e.g., WM-2024-67890)

4. **Configure Reading Frequency**
   - Select how often to fetch data:
     - Every 5 minutes (most current, higher API usage)
     - Every 15 minutes (recommended)
     - Every 30 minutes (balanced)
     - Every hour (minimal API calls)

5. **Save Settings**
   - Click "Save All Changes" button (top-right)
   - Wait for success notification

### 4. Viewing Meter Status

#### Dashboard - Command Center
Navigate to the main dashboard to see:

**Connected Meters Card:**
- Real-time status (Online/Offline)
- Current meter readings
- Last update timestamp
- Manual refresh button

**Electricity Meter Display:**
```
┌─────────────────────────────────┐
│ ⚡ Electricity Meter    [Online]│
│ ID: EM-2024-12345               │
│ 52.3 kWh                        │
│ Updated: 2:45:32 PM             │
└─────────────────────────────────┘
```

**Water Meter Display:**
```
┌─────────────────────────────────┐
│ 💧 Water Meter         [Online]│
│ ID: WM-2024-67890               │
│ 125.8 gallons                   │
│ Updated: 2:45:32 PM             │
└─────────────────────────────────┘
```

### 5. Data Flow Architecture

```
Your Physical Meters
        ↓
Utility Provider API
        ↓
WattsFlow Backend (with meter numbers)
        ↓
MeterContext (React State)
        ↓
Dashboard Components
```

#### Automatic Updates:
- **Background Polling**: Every 15 minutes (configurable)
- **Real-time Display**: Dashboard updates immediately
- **Live Charts**: Reflects latest data in visualizations

#### Manual Refresh:
- Click the refresh icon (↻) in Connected Meters card
- Data fetches immediately
- Loading spinner shows during fetch

### 6. API Integration (Backend)

#### Meter Data Endpoint:
```javascript
GET /api/readings/meter/:meterNumber
```

**Request:**
```json
{
  "meterNumber": "EM-2024-12345",
  "timeRange": "24h"
}
```

**Response:**
```json
{
  "meterNumber": "EM-2024-12345",
  "type": "electricity",
  "currentReading": 52.3,
  "unit": "kWh",
  "timestamp": "2025-12-19T14:45:32Z",
  "status": "online",
  "readings": [
    { "time": "2025-12-19T14:00:00Z", "value": 45.2 },
    { "time": "2025-12-19T13:00:00Z", "value": 43.1 },
    ...
  ]
}
```

### 7. Context Provider Usage

#### In Your Components:
```javascript
import { useMeters } from '@/context/meters'

function MyComponent() {
  const { 
    electricityMeter,    // Electricity meter object
    waterMeter,          // Water meter object
    updateMeterNumber,   // Update function
    fetchMeterData,      // Manual refresh
    isLoading            // Loading state
  } = useMeters()

  return (
    <div>
      <p>Electricity: {electricityMeter?.currentValue} kWh</p>
      <p>Meter ID: {electricityMeter?.number}</p>
      <button onClick={fetchMeterData}>
        Refresh {isLoading && '...'}
      </button>
    </div>
  )
}
```

### 8. Troubleshooting

#### Meter Shows "Offline"
**Possible Causes:**
- Incorrect meter number format
- Meter not registered with utility provider
- API connection issues
- Meter physically offline/disconnected

**Solutions:**
1. Verify meter number on your utility bill
2. Check Settings → Meter Info for typos
3. Contact utility provider to confirm meter is active
4. Try manual refresh
5. Check browser console for error messages

#### No Data Appearing
**Checklist:**
- [ ] Meter numbers entered correctly
- [ ] Reading frequency set (not blank)
- [ ] Save All Changes button clicked
- [ ] Backend server running (port 5000)
- [ ] Frontend connected to backend
- [ ] Check Network tab in browser DevTools

#### Data Not Updating
**Try:**
1. Click manual refresh button
2. Check reading frequency setting
3. Verify "Live" indicator is green
4. Restart application: `npm run dev`
5. Clear browser cache

### 9. Security & Privacy

#### Data Protection:
- Meter numbers encrypted in transit (HTTPS)
- Stored securely in MongoDB
- JWT authentication required
- No sharing with third parties

#### Best Practices:
- Don't share meter numbers publicly
- Use strong account passwords
- Enable 2FA when available
- Regularly review connected devices

### 10. Testing with Mock Data

#### For Development:
The system includes mock data generators for testing:

```javascript
// In Dashboard.jsx
const generateLiveData = () => {
  // Simulates 24 hours of meter readings
  // Updates every 5 seconds
}
```

**To Switch to Real Data:**
1. Configure actual meter numbers
2. Ensure backend API is connected to utility provider
3. Set environment variables for API keys
4. Update `fetchMeterData()` to call real endpoints

### 11. Advanced Configuration

#### Custom Polling Intervals:
Edit `frontend/src/context/meters.tsx`:
```javascript
// Change from 15 minutes to custom interval
const interval = setInterval(() => {
  fetchMeterData()
}, 5 * 60 * 1000) // 5 minutes
```

#### Multiple Meters:
To support multiple electricity or water meters:
```javascript
const [meters, setMeters] = useState([
  { id: '1', number: 'EM-2024-12345', type: 'electricity', location: 'Main House' },
  { id: '2', number: 'EM-2024-67891', type: 'electricity', location: 'Guest House' },
  { id: '3', number: 'WM-2024-67890', type: 'water', location: 'Main Supply' }
])
```

### 12. FAQ

**Q: Can I use this with any utility provider?**  
A: Yes, as long as they provide an API or you can fetch data programmatically.

**Q: What if my meter doesn't have a number?**  
A: Contact your utility provider to get your meter ID. All smart meters have unique identifiers.

**Q: Does this work with analog meters?**  
A: Analog meters require manual entry. Consider upgrading to smart meters for automatic tracking.

**Q: How accurate is the real-time data?**  
A: Depends on your meter's update frequency. Smart meters typically update every 5-15 minutes.

**Q: Can I export my meter data?**  
A: Yes, use the "Export Report" button in Analytics page.

**Q: Is my meter data backed up?**  
A: Yes, all readings are stored in MongoDB with automatic backups.

### 13. Support

**Issues or Questions?**
- Check the [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- Review backend API logs: `backend/server.js`
- Check browser console for errors (F12)
- Contact your utility provider for meter-specific questions

---

**Last Updated**: December 19, 2025  
**Documentation Version**: 1.0.0
