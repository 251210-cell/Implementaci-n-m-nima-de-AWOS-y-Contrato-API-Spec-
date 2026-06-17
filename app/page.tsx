'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  nombre: string;
  email: string;
  rol: 'cliente' | 'admin';
  activo: boolean;
  telefono: string;
}

interface Category {
  id: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

interface Address {
  id: string;
  destinatario: string;
  telefono: string;
  calle: string;
  colonia: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;
  pais: string;
}

interface Payment {
  id: string;
  order_id: string;
  monto: number;
  metodo: string;
  estado: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  meta: Record<string, unknown> | null;
  error: { code: string; message: string; details?: unknown[] } | null;
}


const API_BASE = '/api/v1';

async function apiFetch<T>(
  path: string,
  token: string | null,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 204) {
    return { success: true, data: null, meta: null, error: null };
  }
  return (await res.json()) as ApiResponse<T>;
}


type Tab = 'categorias' | 'usuarios' | 'direcciones' | 'pagos' | 'perfil';

const TABS: { key: Tab; label: string }[] = [
  { key: 'categorias', label: 'Categorías' },
  { key: 'usuarios', label: 'Usuarios' },
  { key: 'direcciones', label: 'Mis direcciones' },
  { key: 'pagos', label: 'Pagos' },
  { key: 'perfil', label: 'Mi perfil' },
];


export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [emailInput, setEmailInput] = useState('admin@correo.com');
  const [passwordInput, setPasswordInput] = useState('cualquier-cosa');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [tab, setTab] = useState<Tab>('categorias');

  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [direcciones, setDirecciones] = useState<Address[]>([]);
  const [pagos, setPagos] = useState<Payment[]>([]);
  const [perfil, setPerfil] = useState<User | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    destinatario: '',
    telefono: '',
    calle: '',
    colonia: '',
    ciudad: '',
    estado: '',
    codigo_postal: '',
    pais: 'MX',
  });
  const [addressFormError, setAddressFormError] = useState<string | null>(null);
  const [addressFormLoading, setAddressFormLoading] = useState(false);

  // Form de edición de perfil
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
  });
  const [profileFormError, setProfileFormError] = useState<string | null>(null);
  const [profileFormLoading, setProfileFormLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('auth_token');
    if (saved) setToken(saved);
    setCheckingSession(false);
  }, []);

  useEffect(() => {
    if (!token) return;

    if (tab === 'categorias') loadCategorias();
    if (tab === 'usuarios') loadUsuarios();
    if (tab === 'direcciones') loadDirecciones();
    if (tab === 'pagos') loadPagos();
    if (tab === 'perfil') loadPerfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, token]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    const res = await apiFetch<{ token: string; user: User }>('/auth/login', null, {
      method: 'POST',
      body: JSON.stringify({ email: emailInput, password: passwordInput }),
    });

    setLoginLoading(false);

    if (!res.success || !res.data) {
      setLoginError(res.error?.message ?? 'Error al iniciar sesión');
      return;
    }

    localStorage.setItem('auth_token', res.data.token);
    setToken(res.data.token);
    setTab('categorias');
  }

  function handleLogout() {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUsuarios([]);
    setCategorias([]);
    setDirecciones([]);
    setPagos([]);
    setPerfil(null);
    setError(null);
  }

  async function loadCategorias() {
    setLoading(true);
    setError(null);
    const res = await apiFetch<Category[]>('/categories', token);
    if (!res.success || !res.data) {
      setError(res.error?.message ?? 'No se pudieron cargar las categorías.');
    } else {
      setCategorias(res.data);
    }
    setLoading(false);
  }

  async function loadUsuarios() {
    setLoading(true);
    setError(null);
    const res = await apiFetch<User[]>('/users', token);
    if (!res.success || !res.data) {
      setError(res.error?.message ?? 'No se pudieron cargar los usuarios.');
    } else {
      setUsuarios(res.data);
    }
    setLoading(false);
  }

  async function loadDirecciones() {
    setLoading(true);
    setError(null);
    const res = await apiFetch<Address[]>('/me/addresses', token);
    if (!res.success || !res.data) {
      setError(res.error?.message ?? 'No se pudieron cargar las direcciones.');
    } else {
      setDirecciones(res.data);
    }
    setLoading(false);
  }

  async function loadPagos() {
    setLoading(true);
    setError(null);
    const res = await apiFetch<Payment[]>('/payments', token);
    if (!res.success || !res.data) {
      setError(res.error?.message ?? 'No se pudieron cargar los pagos.');
    } else {
      setPagos(res.data);
    }
    setLoading(false);
  }

  async function loadPerfil() {
    setLoading(true);
    setError(null);
    const res = await apiFetch<User>('/users/me', token);
    if (!res.success || !res.data) {
      setError(res.error?.message ?? 'No se pudo cargar el perfil.');
    } else {
      setPerfil(res.data);
      setProfileForm({
        nombre: res.data.nombre,
        email: res.data.email,
        telefono: res.data.telefono,
      });
    }
    setLoading(false);
  }

  async function handleCreateAddress(e: React.FormEvent) {
    e.preventDefault();
    setAddressFormLoading(true);
    setAddressFormError(null);

    const res = await apiFetch<Address>('/me/addresses', token, {
      method: 'POST',
      body: JSON.stringify(addressForm),
    });

    setAddressFormLoading(false);

    if (!res.success || !res.data) {
      setAddressFormError(
        res.error?.details?.map((d: any) => d.issue).join(' ') ??
          res.error?.message ??
          'No se pudo crear la dirección.',
      );
      return;
    }

    setAddressForm({
      destinatario: '',
      telefono: '',
      calle: '',
      colonia: '',
      ciudad: '',
      estado: '',
      codigo_postal: '',
      pais: 'MX',
    });
    setShowAddressForm(false);
    loadDirecciones();
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileFormLoading(true);
    setProfileFormError(null);

    const res = await apiFetch<User>('/users/me', token, {
      method: 'PATCH',
      body: JSON.stringify(profileForm),
    });

    setProfileFormLoading(false);

    if (!res.success || !res.data) {
      setProfileFormError(
        res.error?.details?.map((d: any) => d.issue).join(' ') ??
          res.error?.message ??
          'No se pudo actualizar el perfil.',
      );
      return;
    }

    setPerfil(res.data);
    setEditingProfile(false);
  }

  
  if (checkingSession) {
    return null;
  }

  
  if (!token) {
    return (
      <div className="max-w-sm mx-auto mt-24 p-6 border rounded-lg">
        <h1 className="text-xl font-semibold mb-4">Iniciar sesión</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-2">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="email"
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="password"
            className="border rounded px-3 py-2"
            required
          />
          {loginError && <p className="text-red-600 text-sm">{loginError}</p>}
          <button
            type="submit"
            disabled={loginLoading}
            className="bg-black text-white rounded px-3 py-2 disabled:opacity-50"
          >
            {loginLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    );
  }

  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Panel de recursos</h1>
        <div className="flex items-center gap-3">
          <button onClick={handleLogout} className="text-sm text-red-400 underline">
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4 border-b">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-2 text-sm border-b-2 -mb-px ${
              tab === t.key
                ? 'border-black font-medium'
                : 'border-transparent text-zinc-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-zinc-500">Cargando...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && tab === 'categorias' && (
        <ul className="flex flex-col gap-2">
          {categorias.map((c) => (
            <li key={c.id} className="border rounded p-3">
              <p className="font-medium">{c.nombre}</p>
              <p className="text-sm text-zinc-500">{c.descripcion}</p>
            </li>
          ))}
          {categorias.length === 0 && <p className="text-zinc-500">Sin categorías.</p>}
        </ul>
      )}

      {!loading && !error && tab === 'usuarios' && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Nombre</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Rol</th>
              <th className="py-2 pr-4">Activo</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="py-2 pr-4">{u.nombre}</td>
                <td className="py-2 pr-4">{u.email}</td>
                <td className="py-2 pr-4">{u.rol}</td>
                <td className="py-2 pr-4">{u.activo ? 'Sí' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && tab === 'direcciones' && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-zinc-500">{direcciones.length} dirección(es)</p>
           
          </div>

          <ul className="flex flex-col gap-2">
            {direcciones.map((a) => (
              <li key={a.id} className="border rounded p-3">
                <p className="font-medium">{a.destinatario}</p>
                <p className="text-sm text-zinc-500">
                  {a.calle}, {a.colonia}, {a.ciudad}, {a.estado}, {a.codigo_postal}, {a.pais}
                </p>
              </li>
            ))}
            {direcciones.length === 0 && (
              <p className="text-zinc-500">Sin direcciones.</p>
            )}
          </ul>
        </div>
      )}

      {!loading && !error && tab === 'pagos' && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Orden</th>
              <th className="py-2 pr-4">Monto</th>
              <th className="py-2 pr-4">Método</th>
              <th className="py-2 pr-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-2 pr-4">{p.order_id}</td>
                <td className="py-2 pr-4">${p.monto.toFixed(2)}</td>
                <td className="py-2 pr-4">{p.metodo}</td>
                <td className="py-2 pr-4">{p.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && tab === 'perfil' && perfil && (
        <div className="border rounded-lg p-4 max-w-md">
          {!editingProfile ? (
            <div className="flex flex-col gap-2">
              <p><span className="text-zinc-500">Nombre:</span> {perfil.nombre}</p>
              <p><span className="text-zinc-500">Email:</span> {perfil.email}</p>
              <p><span className="text-zinc-500">Teléfono:</span> {perfil.telefono}</p>
              <p><span className="text-zinc-500">Rol:</span> {perfil.rol}</p>
              <p><span className="text-zinc-500">Activo:</span> {perfil.activo ? 'Sí' : 'No'}</p>
              <button
                onClick={() => setEditingProfile(true)}
                className="mt-2 text-sm bg-black text-white rounded px-3 py-1.5 w-fit"
              >
                Editar perfil
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-2">
              <input
                placeholder="Nombre"
                value={profileForm.nombre}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, nombre: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />
              <input
                placeholder="Teléfono"
                value={profileForm.telefono}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, telefono: e.target.value })
                }
                className="border rounded px-3 py-2"
                required
              />
              {profileFormError && (
                <p className="text-red-600 text-sm">{profileFormError}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={profileFormLoading}
                  className="bg-black text-white rounded px-3 py-2 disabled:opacity-50"
                >
                  {profileFormLoading ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className="border rounded px-3 py-2"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}