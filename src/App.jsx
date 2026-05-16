import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { CustomerPage } from './components/customer/CustomerPage';
import { OrderSuccess } from './components/customer/OrderSuccess';

import { LoginPage } from './components/owner/LoginPage';
import { Dashboard } from './components/owner/Dashboard';
import { ActiveOrders } from './components/owner/ActiveOrders';
import { RecordsPage } from './components/owner/RecordsPage';
import { SettingsPage } from './components/owner/SettingsPage';
import { ProtectedRoute } from './components/shared/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerPage />} />
        <Route path="/success" element={<OrderSuccess />} />
        
        <Route path="/owner" element={<Navigate to="/owner/login" replace />} />
        <Route path="/owner/login" element={<LoginPage />} />
        
        <Route 
          path="/owner/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="active" replace />} />
          <Route path="active" element={<ActiveOrders />} />
          <Route path="records" element={<RecordsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
