# Zone-Aware Content Upload System

## Overview
The ContentUploader component now automatically detects the zone and wing where the admin is currently located, ensuring content is properly categorized based on the upload context.

## How It Works

### 1. Zone Context Detection
- **ZoneContext** (`src/context/ZoneContext.jsx`) tracks the current zone and wing
- **AppRouter** automatically sets the zone based on the active world:
  - `kazmo-mansion` → `kazmo`
  - `club-hollywood` → `clubHollywood`
  - `shadow-market` → `shadowMarket`
- **KazmoMansionWorld** reports its current mode (light/dark wing) to the context

### 2. Auto-Categorization
When uploading content:
- **Zone field** is pre-populated with the current zone
- **Wing field** is pre-populated with the current wing (light/dark/both)
- **Access level** is intelligently set:
  - Dark Wing content → `premium` by default
  - Shadow Market content → `premium` by default
  - Light Wing/Club Hollywood → `public` by default

### 3. Visual Feedback
The upload form displays:
```
📍 Uploading to: Kazmo Mansion • Dark Wing
Content will automatically be categorized for this zone as premium content
```

### 4. Field Protection
- When zone/wing are auto-detected, those fields are disabled to prevent accidental changes
- The label shows "(auto-detected)" to indicate the field is context-aware
- You can still manually change these fields when uploading from the Universe Map

## Benefits

### Premium Content Grouping
- Content uploaded in the **Dark Wing** is automatically tagged as premium
- Content uploaded in the **Shadow Market** is automatically premium
- This ensures premium content sits with other premium content

### Workflow Efficiency
- No need to manually select zone/wing for each upload
- Reduces human error in categorization
- Faster upload workflow for bulk content

### Contextual Organization
- Content is naturally organized by where it was created
- Easy to manage zone-specific content libraries
- Clear separation between public and premium content

## Usage Examples

### Example 1: Uploading to Light Wing
1. Navigate to Kazmo Mansion Light Wing
2. Open Admin Upload panel
3. Zone is set to "Kazmo Mansion"
4. Wing is set to "Light Wing"
5. Access level defaults to "Public"
6. Upload your content

### Example 2: Uploading Premium Content
1. Navigate to Kazmo Mansion Dark Wing
2. Open Admin Upload panel
3. Zone is set to "Kazmo Mansion"
4. Wing is set to "Dark Wing"
5. Access level automatically set to "Premium"
6. Upload your content
7. Content will appear alongside other premium content

### Example 3: Manual Override
1. From Universe Map (no active world)
2. Open Admin Upload panel
3. Manually select any zone and wing
4. Useful for cross-world content management

## Technical Implementation

### Files Modified
- **`src/context/ZoneContext.jsx`** - New context for zone tracking
- **`src/AppRouter.jsx`** - Provides zone context to ContentUploader
- **`src/worlds/kazmoMansion/KazmoMansionWorld.jsx`** - Reports wing changes
- **`src/admin/ContentUploader.jsx`** - Receives and uses zone context

### Context Flow
```
AppRouter (sets zone based on activeWorld)
    ↓
ZoneProvider (stores currentZone, currentWing)
    ↓
KazmoMansionWorld (updates currentWing on mode change)
    ↓
ContentUploader (uses context for form defaults)
```

### Smart Defaults Function
```javascript
const getDefaultAccessLevel = () => {
  if (currentZone === 'shadowMarket') return 'premium';
  if (currentWing === 'dark') return 'premium';
  return 'public';
};
```

## Future Enhancements
- [ ] Add zone-specific upload restrictions (e.g., only certain content types per zone)
- [ ] Track upload history per zone
- [ ] Zone-specific file size limits
- [ ] Bulk upload with zone preservation
- [ ] Upload templates per zone

## Notes
- The zone/wing context resets when returning to the Universe Map
- Form reset after upload maintains the current zone/wing context
- Admin can always manually override zone/wing from the Universe Map
