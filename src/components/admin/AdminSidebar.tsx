'use client';

import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeTab: 'eventos' | 'invitaciones' | 'notificaciones';
  onTabChange: (tab: 'eventos' | 'invitaciones' | 'notificaciones') => void;
  onLogout: () => void;
}

const menuItems = [
  {
    id: 'invitaciones' as const,
    label: 'Invitaciones',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'eventos' as const,
    label: 'Eventos',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'notificaciones' as const,
    label: 'Notificaciones',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
];

export default function AdminSidebar({ activeTab, onTabChange, onLogout }: AdminSidebarProps) {
  return (
    <div className="w-full md:w-64 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo / Título */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="font-serif text-2xl text-primary text-center">Panel Admin</h1>
        <p className="font-sans text-xs text-dark/40 text-center mt-1">Luis & Daniela</p>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-x-auto p-3 md:p-4">
        <ul className="flex min-w-full gap-2 md:flex-col md:space-y-2 md:gap-0">
          {menuItems.map((item) => (
            <li key={item.id} className="min-w-max flex-1 md:flex-none">
              <button
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'w-full min-h-11 flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 md:px-4 py-3 rounded-lg font-sans text-xs sm:text-sm transition-all duration-200',
                  activeTab === item.id
                    ? 'bg-primary text-light font-medium'
                    : 'text-dark/60 hover:bg-gray-50 hover:text-dark'
                )}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Cerrar sesión */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-sans text-sm text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}