import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Budget from "./pages/Budget";
import BudgetDetail from "./pages/BudgetDetail";
import History from "./pages/History";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/budget"} component={Budget} />
      <Route path={"/budget/:id"} component={BudgetDetail} />
      <Route path={"/history"} component={History} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Theme: Light mode with professional blue accents

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
