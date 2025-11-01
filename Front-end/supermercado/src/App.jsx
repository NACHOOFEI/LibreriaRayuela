import React, { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";
import Navbar from "./components/navBar";
import Loader from "./components/loader";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Cart from "./pages/cart";
import Elementos from "./pages/elementos";
import AdminPanel from "./pages/adminPanel";
import ProtectedRoute from "./components/protectedRoute";

const ElementoDetail = lazy(() => import("./pages/elementoDetail"));

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/carrito" component={Cart} />
          <Route path="/elementos" component={Elementos} />
          <Route path="/admin">
            {() => (
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/elementos/:id">
            {(params) => <ElementoDetail params={params} />}
          </Route>
        </Switch>
      </Suspense>
    </div>
  );
}
