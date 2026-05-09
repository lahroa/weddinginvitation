'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from './AdminSidebar';
import InvitacionesList from './InvitacionesList';
import EventosList from './EventosList';
import NotificacionesList from './NotificacionesList';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'eventos' | 'invitaciones' | 'notificaciones'>('invitaciones');
  const { logout } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'invitaciones':
        return <InvitacionesList />;
      case 'eventos':
        return <EventosList />;
      case 'notificaciones':
        return <NotificacionesList />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={logout}
      />

      {/* Contenido principal */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}