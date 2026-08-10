import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ExercisePlate from "./pages/ExercisePlate";
import StickerSheet from "./pages/StickerSheet";
import Workouts from "./pages/Workouts";
import Cardio from "./pages/Cardio";
import CardioSession from "./pages/CardioSession";
import Calculators from "./pages/Calculators";
import WorkoutSession from "./pages/WorkoutSession";
import Nutrition from "./pages/Nutrition";
import MealBuilder from "./pages/MealBuilder";
import MealPrep from "./pages/MealPrep";
import Tracker from "./pages/Tracker";
import Education from "./pages/Education";
import EduArticle from "./pages/EduArticle";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/e/:slug"} component={ExercisePlate} />
      <Route path={"/workouts"} component={Workouts} />
      <Route path={"/workouts/:slug"} component={WorkoutSession} />
      <Route path={"/cardio"} component={Cardio} />
      <Route path={"/cardio/:slug"} component={CardioSession} />
      <Route path={"/nutrition"} component={Nutrition} />
      <Route path={"/nutrition/builder"} component={MealBuilder} />
      <Route path={"/nutrition/meal-prep"} component={MealPrep} />
      <Route path={"/nutrition/tracker"} component={Tracker} />
      <Route path={"/calculators"} component={Calculators} />
      <Route path={"/learn"} component={Education} />
      <Route path={"/learn/:slug"} component={EduArticle} />
      <Route path={"/stickers"} component={StickerSheet} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
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
