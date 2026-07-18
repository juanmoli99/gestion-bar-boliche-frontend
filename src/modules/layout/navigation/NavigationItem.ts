import type {
  LucideIcon,
} from 'lucide-react';

import type {
  RolUsuario,
} from '../../auth/types/auth.types';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: LucideIcon;

  rolesPermitidos: RolUsuario[];

  children?: NavigationItem[];
}