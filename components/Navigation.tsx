'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Train, Utensils, AlertTriangle, Car } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Trains', href: '/trains', icon: Train },
    { name: 'Mess', href: '/mess', icon: Utensils },
    { name: 'Cabs', href: '/transport', icon: Car },
    { name: 'Complaints', href: '/complaints', icon: AlertTriangle },
  ];

  return (
    <>
      {/* Desktop Side Navigation (Hidden on phones) */}
      <nav className="hidden md:flex flex-col w-64 h-screen bg-surface border-r border-gray-800 p-4 fixed left-0 top-0">
        <div className="text-neonBlue text-2xl font-bold mb-8 p-3">IITP Hub</div>
        <div className="flex flex-col gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                  isActive ? 'bg-gray-800 text-neonBlue' : 'text-textMuted hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Navigation (Hidden on laptops) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-gray-800 flex justify-around p-2 pb-6 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`flex flex-col items-center p-2 transition-colors ${
                isActive ? 'text-neonBlue' : 'text-textMuted hover:text-white'
              }`}
            >
              <Icon size={24} className={isActive ? 'drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]' : ''} />
              <span className="text-[10px] mt-1 font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}