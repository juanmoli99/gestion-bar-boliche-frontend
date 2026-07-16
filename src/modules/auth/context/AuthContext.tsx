import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { login as loginRequest } from '../api/auth.api';

import type {
  LoginRequest,
  UsuarioAutenticado,
} from '../types/auth.types';

interface AuthContextValue {
  usuario: UsuarioAutenticado | null;
  token: string | null;
  estaAutenticado: boolean;
  cargando: boolean;
  sesionInicializada: boolean;

  login(
    request: LoginRequest,
  ): Promise<void>;

  logout(): void;
}

export const AuthContext =
  createContext<AuthContextValue | null>(
    null,
  );

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_STORAGE_KEY = 'previa_token';
const USER_STORAGE_KEY = 'previa_usuario';

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [usuario, setUsuario] =
    useState<UsuarioAutenticado | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [cargando, setCargando] =
    useState(false);

  const [
    sesionInicializada,
    setSesionInicializada,
  ] = useState(false);

  const limpiarSesion = useCallback(() => {
    localStorage.removeItem(
      TOKEN_STORAGE_KEY,
    );

    localStorage.removeItem(
      USER_STORAGE_KEY,
    );

    setToken(null);
    setUsuario(null);
  }, []);

  useEffect(() => {
    try {
      const storedToken =
        localStorage.getItem(
          TOKEN_STORAGE_KEY,
        );

      const storedUser =
        localStorage.getItem(
          USER_STORAGE_KEY,
        );

      if (!storedToken || !storedUser) {
        limpiarSesion();
        return;
      }

      const parsedUser =
        JSON.parse(
          storedUser,
        ) as UsuarioAutenticado;

      const usuarioValido =
        typeof parsedUser?.id === 'string' &&
        typeof parsedUser?.usuario ===
          'string' &&
        typeof parsedUser?.nombreCompleto ===
          'string' &&
        typeof parsedUser?.rol === 'string';

      if (!usuarioValido) {
        limpiarSesion();
        return;
      }

      setToken(storedToken);
      setUsuario(parsedUser);
    } catch {
      limpiarSesion();
    } finally {
      setSesionInicializada(true);
    }
  }, [limpiarSesion]);

  const login = useCallback(
    async (
      request: LoginRequest,
    ) => {
      setCargando(true);

      try {
        const response =
          await loginRequest(request);

        localStorage.setItem(
          TOKEN_STORAGE_KEY,
          response.accessToken,
        );

        localStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(
            response.usuario,
          ),
        );

        setToken(response.accessToken);
        setUsuario(response.usuario);
      } finally {
        setCargando(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    limpiarSesion();
  }, [limpiarSesion]);

  const value = useMemo(
    () => ({
      usuario,
      token,
      cargando,
      login,
      logout,
      sesionInicializada,
      estaAutenticado:
        sesionInicializada &&
        usuario !== null &&
        token !== null,
    }),
    [
      usuario,
      token,
      cargando,
      login,
      logout,
      sesionInicializada,
    ],
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}