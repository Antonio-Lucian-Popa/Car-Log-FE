import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff,
  CreditCard,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Mail,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import { authService } from '@/services/authService';

const profileSchema = z.object({
  name: z.string().min(2, 'Numele trebuie să aibă minimum 2 caractere'),
  email: z.string().email('Email invalid'),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Parola actuală este obligatorie'),
  newPassword: z.string().min(6, 'Parola nouă trebuie să aibă minimum 6 caractere'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Parolele nu se potrivesc',
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export function SettingsPage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
   const { theme, setTheme, resolvedTheme } = useTheme();
  const [language, setLanguage] = useState('ro');
  

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const handleProfileUpdate = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await authService.updateUser(data);
      toast.success('Profilul a fost actualizat cu succes');
    } catch (error) {
      toast.error('Eroare la actualizarea profilului');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (data: PasswordFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await authService.changePassword(data.currentPassword, data.newPassword);
      toast.success('Parola a fost schimbată cu succes');
      passwordForm.reset();
    } catch (error) {
      toast.error('Eroare la schimbarea parolei');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Datele au fost exportate cu succes');
    } catch (error) {
      toast.error('Eroare la exportarea datelor');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await authService.deleteUser();
      toast.success('Contul a fost șters cu succes');
      logout();
    } catch (error) {
      toast.error('Eroare la ștergerea contului');
    }
  };

   const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    const themeNames = {
      light: 'luminos',
      dark: 'întunecat',
      system: 'sistem'
    };
    toast.success(`Tema a fost schimbată la ${themeNames[newTheme as keyof typeof themeNames]}`);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Setări</h1>
        <p className="text-muted-foreground text-sm lg:text-base">
          Gestionează contul și preferințele tale
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-3">
          <TabsTrigger value="profile" className="text-xs lg:text-sm">
            <User className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="text-xs lg:text-sm">
            <Palette className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Aspect</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="text-xs lg:text-sm">
            <SettingsIcon className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Cont</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Informații personale
                </CardTitle>
                <CardDescription>
                  Actualizează informațiile tale de profil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nume complet</Label>
                    <Input
                      id="name"
                      {...profileForm.register('name')}
                      disabled={loading}
                    />
                    {profileForm.formState.errors.name && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...profileForm.register('email')}
                      disabled={loading}
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon (opțional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+40 xxx xxx xxx"
                      {...profileForm.register('phone')}
                      disabled={loading}
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Se salvează...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvează modificările
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Schimbă parola
                </CardTitle>
                <CardDescription>
                  Actualizează parola pentru securitate sporită
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Parola actuală</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        {...passwordForm.register('currentPassword')}
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Parola nouă</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        {...passwordForm.register('newPassword')}
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmă parola nouă</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...passwordForm.register('confirmPassword')}
                      disabled={loading}
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Se schimbă...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Schimbă parola
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Abonament actual</CardTitle>
              <CardDescription>
                Gestionează planul tău de abonament
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">Plan FREE</h3>
                      <Badge variant="secondary">Activ</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      1 mașină • Funcționalități de bază
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => window.location.href = '/subscription'}>
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Temă
                </CardTitle>
                <CardDescription>
                  Alege tema aplicației
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                   <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      theme === 'light' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Sun className="h-6 w-6" />
                      <span className="text-sm font-medium">Luminos</span>
                    </div>
                  </div>
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Moon className="h-6 w-6" />
                      <span className="text-sm font-medium">Întunecat</span>
                    </div>
                  </div>
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      theme === 'system' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => handleThemeChange('system')}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Monitor className="h-6 w-6" />
                      <span className="text-sm font-medium">Sistem</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Limbă și regiune
                </CardTitle>
                <CardDescription>
                  Setează limba aplicației
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Limbă</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ro">Română</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Monedă</Label>
                  <Select defaultValue="ron">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ron">RON (Lei)</SelectItem>
                      <SelectItem value="eur">EUR (Euro)</SelectItem>
                      <SelectItem value="usd">USD (Dolari)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={() => toast.success('Setările au fost salvate')} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Salvează setările
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">


          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Zona de pericol
              </CardTitle>
              <CardDescription>
                Acțiuni ireversibile pentru contul tău
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Ștergerea contului este permanentă și nu poate fi anulată. Toate datele tale vor fi pierdute definitiv.
                </AlertDescription>
              </Alert>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Șterge contul permanent
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Ești absolut sigur?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Această acțiune nu poate fi anulată. Aceasta va șterge permanent contul tău și va elimina datele de pe serverele noastre.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Anulează</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Da, șterge contul
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}