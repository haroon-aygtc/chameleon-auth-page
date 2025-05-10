import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, MapPin, Globe, Phone, Briefcase, Building,
  Camera, ArrowLeft, Save, Loader2, Shield, Calendar, Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileUpdateData } from '@/services/profileService';
import { showSuccessToast, showErrorToast } from '@/utils/toast-utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user: authUser, hasRole } = useAuth();
  const { user, loading, avatarLoading, updateProfile, updateAvatar } = useProfile();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<ProfileUpdateData>({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    phone: user?.phone || '',
    job_title: user?.job_title || '',
    company: user?.company || '',
    theme_preference: user?.theme_preference || 'system',
    notification_preferences: user?.notification_preferences || {
      email_notifications: true,
      push_notifications: true,
      marketing_emails: false,
      security_alerts: true,
    },
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleNotificationChange = (key: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [key]: checked,
      },
    }));
  };

  const handleThemeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      theme_preference: value as 'light' | 'dark' | 'system',
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await updateAvatar(file);
    } catch (error) {
      console.error('Failed to update avatar:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile(formData);
    } catch (error: any) {
      // Handle validation errors
      if (error.isAxiosError && error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          const newErrors: Record<string, string> = {};

          Object.entries(validationErrors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              newErrors[field] = messages[0] as string;
            }
          });

          setErrors(newErrors);
        }
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (passwordData.password !== passwordData.password_confirmation) {
      setErrors({ password_confirmation: 'Passwords do not match' });
      return;
    }

    try {
      await updateProfile(passwordData);
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
      showSuccessToast('Password Updated', 'Your password has been updated successfully');
    } catch (error: any) {
      // Handle validation errors
      if (error.isAxiosError && error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          const newErrors: Record<string, string> = {};

          Object.entries(validationErrors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              newErrors[field] = messages[0] as string;
            }
          });

          setErrors(newErrors);
        }
      }
    }
  };

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const userInitials = user.name ? getInitials(user.name) : 'U';
  const isAdmin = hasRole('Admin');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            className="mr-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative group mb-4">
                    <Avatar className="h-24 w-24 border-4 border-background">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xl bg-primary/10 text-primary">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                      onClick={handleAvatarClick}
                    >
                      {avatarLoading ? (
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      ) : (
                        <Camera className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </div>

                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-muted-foreground text-sm mb-2">{user.email}</p>

                  {user.job_title && (
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span>{user.job_title}</span>
                    </div>
                  )}

                  {user.company && (
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <Building className="h-4 w-4 mr-2" />
                      <span>{user.company}</span>
                    </div>
                  )}

                  {user.location && (
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{user.location}</span>
                    </div>
                  )}

                  <Separator className="my-4" />

                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Roles</span>
                      {isAdmin && (
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Admin
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Member since</span>
                      <span className="text-sm text-muted-foreground">
                        {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last login</span>
                      <span className="text-sm text-muted-foreground">
                        {user.last_login_at ? format(new Date(user.last_login_at), 'MMM d, yyyy') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Profile Settings</h2>
              </CardHeader>

              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="general" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      General
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center">
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="mt-0">
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? "border-destructive" : ""}
                          />
                          {errors.name && (
                            <p className="text-sm text-destructive">{errors.name}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? "border-destructive" : ""}
                          />
                          {errors.email && (
                            <p className="text-sm text-destructive">{errors.email}</p>
                          )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio || ''}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Tell us about yourself"
                            className={errors.bio ? "border-destructive" : ""}
                          />
                          {errors.bio && (
                            <p className="text-sm text-destructive">{errors.bio}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="job_title">Job Title</Label>
                          <Input
                            id="job_title"
                            name="job_title"
                            value={formData.job_title || ''}
                            onChange={handleChange}
                            placeholder="e.g. Software Engineer"
                            className={errors.job_title ? "border-destructive" : ""}
                          />
                          {errors.job_title && (
                            <p className="text-sm text-destructive">{errors.job_title}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            name="company"
                            value={formData.company || ''}
                            onChange={handleChange}
                            placeholder="e.g. Acme Inc."
                            className={errors.company ? "border-destructive" : ""}
                          />
                          {errors.company && (
                            <p className="text-sm text-destructive">{errors.company}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={formData.location || ''}
                            onChange={handleChange}
                            placeholder="e.g. San Francisco, CA"
                            className={errors.location ? "border-destructive" : ""}
                          />
                          {errors.location && (
                            <p className="text-sm text-destructive">{errors.location}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            name="website"
                            value={formData.website || ''}
                            onChange={handleChange}
                            placeholder="e.g. https://example.com"
                            className={errors.website ? "border-destructive" : ""}
                          />
                          {errors.website && (
                            <p className="text-sm text-destructive">{errors.website}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            placeholder="e.g. +1 (555) 123-4567"
                            className={errors.phone ? "border-destructive" : ""}
                          />
                          {errors.phone && (
                            <p className="text-sm text-destructive">{errors.phone}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Theme Preference</Label>
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              variant={formData.theme_preference === 'light' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleThemeChange('light')}
                            >
                              Light
                            </Button>
                            <Button
                              type="button"
                              variant={formData.theme_preference === 'dark' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleThemeChange('dark')}
                            >
                              Dark
                            </Button>
                            <Button
                              type="button"
                              variant={formData.theme_preference === 'system' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleThemeChange('system')}
                            >
                              System
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Button type="submit" disabled={loading} className="w-full md:w-auto">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="security" className="mt-0">
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Change Password</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Update your password to keep your account secure.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current_password">Current Password</Label>
                            <Input
                              id="current_password"
                              name="current_password"
                              type="password"
                              value={passwordData.current_password}
                              onChange={handlePasswordChange}
                              className={errors.current_password ? "border-destructive" : ""}
                            />
                            {errors.current_password && (
                              <p className="text-sm text-destructive">{errors.current_password}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              value={passwordData.password}
                              onChange={handlePasswordChange}
                              className={errors.password ? "border-destructive" : ""}
                            />
                            {errors.password && (
                              <p className="text-sm text-destructive">{errors.password}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirm New Password</Label>
                            <Input
                              id="password_confirmation"
                              name="password_confirmation"
                              type="password"
                              value={passwordData.password_confirmation}
                              onChange={handlePasswordChange}
                              className={errors.password_confirmation ? "border-destructive" : ""}
                            />
                            {errors.password_confirmation && (
                              <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                            )}
                          </div>
                        </div>

                        <Button type="submit" disabled={loading}>
                          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Update Password
                        </Button>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="notifications" className="mt-0">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Notification Preferences</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Manage how you receive notifications from our platform.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications via email
                            </p>
                          </div>
                          <Switch
                            checked={formData.notification_preferences?.email_notifications || false}
                            onCheckedChange={(checked) => handleNotificationChange('email_notifications', checked)}
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications in your browser
                            </p>
                          </div>
                          <Switch
                            checked={formData.notification_preferences?.push_notifications || false}
                            onCheckedChange={(checked) => handleNotificationChange('push_notifications', checked)}
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Marketing Emails</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive emails about new features and updates
                            </p>
                          </div>
                          <Switch
                            checked={formData.notification_preferences?.marketing_emails || false}
                            onCheckedChange={(checked) => handleNotificationChange('marketing_emails', checked)}
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Security Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive alerts about security-related activities
                            </p>
                          </div>
                          <Switch
                            checked={formData.notification_preferences?.security_alerts || false}
                            onCheckedChange={(checked) => handleNotificationChange('security_alerts', checked)}
                          />
                        </div>
                      </div>

                      <Button onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Preferences
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
