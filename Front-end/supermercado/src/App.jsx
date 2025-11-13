import React, { Suspense, lazy, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import Navbar from "./components/navBar";
import Loader from "./components/loader";
import TransferenciaInfo from "./components/transferenciaInfo";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Cart from "./pages/cart";
import Elementos from "./pages/elementos";
import ProtectedRoute from "./components/protectedRoute";
import { useAuthStore } from "./store/authStore";
import UserpageAdmin from "./pages/userpageAdmin";
import Footer from "./components/footer";

// Componentes cargados de manera perezosa
const ElementoDetail = lazy(() => import("./pages/elementoDetail"));
const AdminPanel = lazy(() => import("./pages/adminPanel"));
const CreateProduct = lazy(() => import("./pages/createProduct"));
const AsingRole = lazy(() => import("./pages/asingRole.jsx"));
export default function App() {
  const [location] = useLocation();
  const hideNavbar = location === "/login" || location === "/register";
  const hydrate = useAuthStore((s) => s.hydrate);

  // Rehidratamos la sesión (por si el usuario recargó la página).
  // Se ejecuta una sola vez al montar la App.
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader />
            </div>
          }
        >
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/carrito" component={Cart} />
            <Route path="/transferencia" component={TransferenciaInfo} />
            <Route path="/elementos" component={Elementos} />
            <Route path="/elementos/:id">
              {(params) => <ElementoDetail id={params.id} />}
            </Route>
            <Route path="/admin">
              {() => (
                <ProtectedRoute requiredRole="Admin">
                  <AdminPanel />
                </ProtectedRoute>
              )}

            </Route>
            <Route path="/admin/users">
              {() => (
                <ProtectedRoute requiredRole="Admin">
                  <UserpageAdmin />
                </ProtectedRoute>
              )}
            </Route>
            <Route path="/admin/users/:id/roles">
              {(params) => (
                <ProtectedRoute requiredRole="Admin">
                  <AsingRole id={params.id} />
                </ProtectedRoute>
              )}
            </Route>
            <Route path="/admin/productos/nuevo">
              {() => (
                <ProtectedRoute requiredRole="Admin">
                  <CreateProduct />
                </ProtectedRoute>
              )}
            </Route>
            <Route path="/admin/productos/editar/:id">
              {(params) => (
                <ProtectedRoute requiredRole="Admin">
                  <CreateProduct id={params.id} />
                </ProtectedRoute>
              )}
            </Route>
          </Switch>
        </Suspense>
      </main>
      {!hideNavbar && <Footer />}
    </div>
  );
}
