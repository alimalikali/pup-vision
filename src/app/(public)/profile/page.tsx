'use client';

import { Navbar } from '@/components/common/layout/navbar';
import { PhotoGallery } from '@/components/feature/profile/photo-gallery';
import { ProfileEditForm } from '@/components/feature/profile/profile-edit-form';
import { PurposeSection } from '@/components/feature/profile/purpose-section';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatEnumLabel } from '@/lib/utils';
import { useProfileStore } from '@/store';
import { useAuthStore } from '@/store';
import { Profile } from '@types';
import { Briefcase, Camera, Edit, GraduationCap, MapPin, Settings, Target, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoaderWait from '@/components/common/layout/loader-wait';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  const { profile, error, fetchProfile, updateProfile } = useProfileStore();
  const { user, status, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication first
    const initAuth = async () => {
      await checkAuth();
    };
    initAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Only fetch profile if user is authenticated
    if (status === 'authenticated' && user) {
      fetchProfile();
    } else if (status === 'unauthenticated') {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [status, user, fetchProfile, router]);

  // Show loading while checking authentication
  if (status === 'loading' || status === 'idle' || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <LoaderWait className="pt-[20vh]" variant="spinner" size="lg" color="primary" text="Loading profile..." />
      </div>
    );
  }

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  const handleSaveProfile = async (profileData: Partial<Profile>) => {
    const success = await updateProfile(profileData);
    if (success) {
      setIsEditing(false);
      // Refresh the profile data to show the latest changes
      await fetchProfile();
    }
    return success;
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Calculate age from date of birth
  const age = profile.dob ? Math.floor((Date.now() - new Date(profile.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Profile</h1>
              <p className="mt-2 text-muted-foreground">Manage your profile and preferences</p>
            </div>
            <Button onClick={() => setIsEditing(!isEditing)}>
              <Edit className="mr-2 h-4 w-4" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {isEditing ? (
          <ProfileEditForm profile={profile} onSave={handleSaveProfile} onCancel={handleCancelEdit} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile Content */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="purpose">Purpose</TabsTrigger>
                  <TabsTrigger value="photo">Photo</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Basic Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="mr-2 h-5 w-5" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Name</label>
                            <p className="text-foreground">{profile.name}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Age</label>
                            <p className="text-foreground">{age} years old</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Gender</label>
                            <p className="text-foreground">{formatEnumLabel(profile.gender)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Location</label>
                            <p className="text-foreground flex items-center">
                              <MapPin className="mr-1 h-4 w-4" />
                              {profile.city && profile.state ? `${profile.city}, ${profile.state}` : 'Location not specified'}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Profession</label>
                            <p className="text-foreground flex items-center">
                              <Briefcase className="mr-1 h-4 w-4" />
                              {formatEnumLabel(profile.profession)}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Education</label>
                            <p className="text-foreground flex items-center">
                              <GraduationCap className="mr-1 h-4 w-4" />
                              {formatEnumLabel(profile.education)}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Religion</label>
                            <p className="text-foreground">{formatEnumLabel(profile.religion)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Personality</label>
                            <p className="text-foreground">{formatEnumLabel(profile.personality)}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="purpose">
                  <PurposeSection
                    purpose={{
                      domain: profile.purposeDomain,
                      archetype: profile.purposeArchetype,
                      modality: profile.purposeModality,
                      narrative: profile.purposeNarrative || '',
                    }}
                  />
                </TabsContent>

                <TabsContent value="photo">
                  <PhotoGallery
                    avatar={profile.avatar}
                    onAvatarChange={avatarUrl => {
                      // Update the profile with the new avatar
                      updateProfile({ avatar: avatarUrl });
                    }}
                  />
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="mr-2 h-5 w-5" />
                        Details
                      </CardTitle>
                      <CardDescription>Your details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Marital Status</label>
                          <p className="text-foreground">{formatEnumLabel(profile.maritalStatus)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Looking For</label>
                          <p className="text-foreground">{formatEnumLabel(profile.lookingFor)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Language</label>
                          <p className="text-foreground">{formatEnumLabel(profile.language)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Location</label>
                          <p className="text-foreground">{profile.city && profile.state ? `${profile.city}, ${profile.state}` : 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Height</label>
                          <p className="text-foreground">{profile.height} cm</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Weight</label>
                          <p className="text-foreground">{profile.weight} kg</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Interests */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Interests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests && profile.interests.length > 0 ? (
                          profile.interests.map((interest: string) => (
                            <Badge key={interest} variant="secondary">
                              {formatEnumLabel(interest)}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No interests specified</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lifestyle */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Lifestyle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Smoking</label>
                          <p className="text-foreground">{formatEnumLabel(profile.smoke)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Drinking</label>
                          <p className="text-foreground">{formatEnumLabel(profile.alcohol)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Drugs</label>
                          <p className="text-foreground">{formatEnumLabel(profile.drugs)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Political Views */}
                  {profile.politics && profile.politics.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Political Views</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {profile.politics.map((politics: string) => (
                            <Badge key={politics} variant="outline">
                              {formatEnumLabel(politics)}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarImage src={profile.avatar || '/placeholder.svg'} />
                      <AvatarFallback className="text-lg">{profile?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">{profile.name}</h3>
                    <p className="text-muted-foreground">{formatEnumLabel(profile.profession)}</p>
                    <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-4 w-4" />
                      {profile.city && profile.state ? `${profile.city}, ${profile.state}` : 'Location not specified'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full bg-transparent" variant="outline" onClick={() => setActiveTab('photo')}>
                    <Camera className="mr-2 h-4 w-4" />
                    View Photos
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline" onClick={() => setActiveTab('purpose')}>
                    <Target className="mr-2 h-4 w-4" />
                    View Purpose
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline" onClick={() => setActiveTab('details')}>
                    <Settings className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
