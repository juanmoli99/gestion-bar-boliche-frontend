import {
  CalendarDays,
  ClipboardList,
  DollarSign,
  FlaskConical,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Shovel,
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

    rolesPermitidos: [
      'ADMINISTRADOR',
    ],
  },
  {
    id: 'reservas',
    label: 'Reservas',
    path: '/reservas',
    icon: CalendarDays,

    rolesPermitidos: [
      'ADMINISTRADOR',
      'OPERADOR',
      'MOZO',
    ],
  },
  {
    id: 'compras',
    label: 'Compras',
    path: '/compras',
    icon: ShoppingCart,

    rolesPermitidos: [
      'ADMINISTRADOR',
    ],
  },
  {
    id: 'inventario',
    label: 'Inventario',
    path: '/inventario',
    icon: Package,

    rolesPermitidos: [
      'ADMINISTRADOR',
      'OPERADOR',
      'BARRA',
      'COCINA',
      'MOZO',
      'LIMPIEZA',
    ],
  },
  {
    id: 'formulas',
    label: 'Fórmulas',
    path: '/formulas',
    icon: FlaskConical,

    rolesPermitidos: [
      'ADMINISTRADOR',
    ],
  },
  {
    id: 'calculos',
    label: 'Cálculos',
    path: '/calculos',
    icon: ClipboardList,

    rolesPermitidos: [
      'ADMINISTRADOR',
    ],
  },
  {
    id: 'valores',
    label: 'Valores',
    path: '/valores',
    icon: DollarSign,

    rolesPermitidos: [
      'ADMINISTRADOR',
    ],
  },
  {
    id: 'sueldos',
    label: 'Sueldos',
    path: '/sueldos',
    icon: Shovel,

    rolesPermitidos: [
      'ADMINISTRADOR',
      'OPERADOR',
    ],
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    path: '/configuracion',
    icon: Settings,

    rolesPermitidos: [
      'ADMINISTRADOR',
    ],
  },
];