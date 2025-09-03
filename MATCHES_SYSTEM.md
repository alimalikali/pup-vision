# Matches System Documentation

## Overview
The matches system provides a complete dating/matching platform with profile discovery, compatibility scoring, and admire/pass functionality.

## Features Implemented

### 1. API Endpoints

#### `/api/matches` (GET)
- **Purpose**: List profiles with cursor-based pagination and filtering
- **Features**:
  - Cursor-based pagination for efficient loading
  - Server-side compatibility scoring
  - Advanced filtering (age, location, education, profession, purpose, interests)
  - Caching support
- **Query Parameters**:
  - `cursor`: Pagination cursor
  - `limit`: Number of profiles to return (default: 20)
  - `includeCompatibility`: Include compatibility scores (default: true)
  - Filter parameters: `ageMin`, `ageMax`, `gender`, `city`, `state`, `education`, `profession`, `purposeDomain`, `interests`

#### `/api/profile/[id]` (GET)
- **Purpose**: Get single profile with optional compatibility scoring
- **Features**:
  - Full profile payload
  - Optional compatibility calculation
  - Prevents users from viewing their own profile
- **Query Parameters**:
  - `includeCompatibility`: Include compatibility score (default: true)

#### `/api/admire` (POST)
- **Purpose**: Admire or pass on a user
- **Features**:
  - Admire/pass actions
  - Automatic match creation for mutual admiration
  - Updates user's admired/admiredBy lists
- **Body**: `{ targetUserId: string, action: 'admire' | 'pass' }`

#### `/api/admire` (GET)
- **Purpose**: Get admire data (who I admire, who admires me, matches)
- **Features**:
  - Returns lists of admired users, admirers, and matches
  - Includes full profile data for each user

### 2. Compatibility Scoring Algorithm

The compatibility score is calculated based on multiple factors:

- **Purpose Alignment (60% weight)**:
  - Domain match: 30 points
  - Archetype match: 20 points
  - Modality match: 10 points

- **Education Compatibility (15% weight)**:
  - Based on education level similarity

- **Interest Overlap (20% weight)**:
  - Percentage of shared interests

- **Lifestyle Compatibility (15% weight)**:
  - Smoking, drinking, drugs preferences

- **Age Compatibility (10% weight)**:
  - Age difference penalty

- **Location Compatibility (10% weight)**:
  - City/state matching

### 3. Frontend Components

#### Matches Page (`/matches`)
- **Features**:
  - Real-time profile loading with pagination
  - Advanced filtering sidebar
  - Sort by compatibility or recent
  - Load more functionality
  - Error handling and loading states
  - Admire/pass actions

#### Match Detail Page (`/matches/[id]`)
- **Features**:
  - Full profile view with tabs
  - Compatibility breakdown
  - Purpose profile display
  - Admire/pass/super like actions
  - Photo gallery

#### Dashboard Integration
- **Features**:
  - Shows recent matches
  - Displays who admires you
  - Shows people you admire
  - Real-time stats

### 4. State Management

#### Matches Store (`useMatchesStore`)
- **State**:
  - `profiles`: List of available profiles
  - `currentProfile`: Currently viewed profile
  - `admireData`: Admire/admirers/matches data
  - `filters`: Current filter settings
  - `cursor`: Pagination cursor
  - `hasMore`: Whether more profiles are available
  - Loading and error states

- **Actions**:
  - `fetchProfiles()`: Load profiles with pagination
  - `loadMoreProfiles()`: Load additional profiles
  - `fetchProfile(id)`: Get single profile
  - `admireUser(id)`: Admire a user
  - `passUser(id)`: Pass on a user
  - `fetchAdmireData()`: Get admire data
  - `updateFilters()`: Update filter settings

### 5. Services

#### Matches Service (`matchesService`)
- **Methods**:
  - `getMatches()`: Fetch profiles with filters and pagination
  - `getProfile()`: Get single profile
  - `admireUser()`: Admire a user
  - `passUser()`: Pass on a user
  - `getAdmireData()`: Get admire data

## Database Schema

The system uses the existing Prisma schema with the following key relationships:

- `User` -> `Profile` (1:1)
- `Profile` has `admiredUsers` and `admiredBy` arrays
- `Match` table for mutual admirations
- All profile fields for compatibility calculation

## Usage Examples

### Fetching Profiles with Filters
```typescript
const { profiles, fetchProfiles, updateFilters } = useMatchesStore()

// Apply filters
updateFilters({
  ageMin: 25,
  ageMax: 35,
  city: "San Francisco",
  education: "BACHELORS"
})

// Fetch profiles
await fetchProfiles(true) // true = reset pagination
```

### Admiring a User
```typescript
const { admireUser } = useMatchesStore()

const success = await admireUser("user-id")
if (success) {
  console.log("User admired successfully")
}
```

### Getting Admire Data
```typescript
const { admireData, fetchAdmireData } = useMatchesStore()

await fetchAdmireData()
console.log("Matches:", admireData?.matches)
console.log("Admirers:", admireData?.admirers)
console.log("Admired:", admireData?.admired)
```

## Performance Considerations

1. **Cursor-based Pagination**: Efficient for large datasets
2. **Server-side Compatibility**: Reduces client-side computation
3. **Caching**: API responses can be cached
4. **Lazy Loading**: Profiles loaded on demand
5. **Filter Optimization**: Database queries optimized for common filters

## Security

1. **Authentication**: All endpoints require valid JWT tokens
2. **Authorization**: Users can only view other users' profiles
3. **Input Validation**: All inputs are validated
4. **Rate Limiting**: Can be added to prevent abuse

## Future Enhancements

1. **Real-time Notifications**: WebSocket support for new matches
2. **Advanced Matching**: Machine learning-based compatibility
3. **Photo Management**: Multiple photos per profile
4. **Messaging**: Chat system for matches
5. **Premium Features**: Advanced filters, unlimited likes
6. **Analytics**: User behavior tracking
7. **Mobile App**: React Native version
