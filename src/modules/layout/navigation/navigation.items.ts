import {
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  TableProperties,
  WalletCards,
} from 'lucide-react';

import type {
  NavigationItem,
} from './NavigationItem';

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    id: 'mesas',
    label: 'Mesas',
    path: '/mesas',
    icon: TableProperties,
  },
  {
    id: 'reservas',
    label: 'Reservas',
    path: '/reservas',
    icon: CalendarDays,
  },
  {
    id: 'caja',
    label: 'Caja',
    path: '/caja',
    icon: WalletCards,
  },
  {
    id: 'compras',
    label: 'Compras',
    path: '/compras',
    icon: ShoppingCart,
  },
  {
    id: 'inventario',
    label: 'Inventario',
    path: '/inventario',
    icon: Package,
  },
  {
    id: 'calculos',
    label: 'Cálculos',
    path: '/calculos',
    icon: ClipboardList,
  },
  {
    id: 'reportes',
    label: 'Reportes',
    path: '/reportes',
    icon: ChartNoAxesCombined,
  },
  {
    id: 'valores',
    label: 'Valores',
    path: '/valores',
    icon: DollarSign,
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    path: '/configuracion',
    icon: Settings,
  },
];