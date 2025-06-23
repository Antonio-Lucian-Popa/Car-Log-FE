import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { FuelPage } from '@/pages/FuelPage';
import { RepairsPage } from '@/pages/RepairsPage';
import { RemindersPage } from '@/pages/RemindersPage';
import { SubscriptionPage } from '@/pages/SubscriptionPage';
import { SubscriptionSuccessPage } from '@/pages/SubscriptionSuccessPage';
import { SubscriptionCancelPage } from '@/pages/SubscriptionCancelPage';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />
            <Route path="/subscription/cancel" element={<SubscriptionCancelPage />} />
            
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="fuel" element={<FuelPage />} />
              <Route path="repairs" element={<RepairsPage />} />
              <Route path="reminders" element={<RemindersPage />} />
              <Route path="subscription" element={<SubscriptionPage />} />
              <Route path="" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App