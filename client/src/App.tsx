import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BookBanner } from "@/components/BookBanner";
import { SocialFooter } from "@/components/SocialFooter";
import { AuthProvider } from "@/contexts/AuthContext";
import { SavedProvider } from "@/contexts/SavedContext";
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
import Mobility from "./pages/Mobility";
import Calculators from "./pages/Calculators";
import WorkoutSession from "./pages/WorkoutSession";
import Nutrition from "./pages/Nutrition";
import MealBuilder from "./pages/MealBuilder";
import MealPrep from "./pages/MealPrep";
import Tracker from "./pages/Tracker";
import Education from "./pages/Education";
import EduArticle from "./pages/EduArticle";
import SavedWorkouts from "./pages/SavedWorkouts";
import WorkoutOfDay from "./pages/WorkoutOfDay";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/e/:slug"} component={ExercisePlate} />
      <Route path={"/workouts"} component={Workouts} />
      <Route path={"/wod"} component={WorkoutOfDay} />
      <Route path={"/workouts/:slug"} component={WorkoutSession} />
      <Route path={"/cardio"} component={Cardio} />
      <Route path={"/cardio/:slug"} component={CardioSession} />
      <Route path={"/mobility"} component={Mobility} />
      <Route path={"/nutrition"} component={Nutrition} />
      <Route path={"/nutrition/builder"} component={MealBuilder} />
      <Route path={"/nutrition/meal-prep"} component={MealPrep} />
      <Route path={"/nutrition/tracker"} component={Tracker} />
      <Route path={"/calculators"} component={Calculators} />
      <Route path={"/learn"} component={Education} />
      <Route path={"/learn/:slug"} component={EduArticle} />
      <Route path={"/stickers"} component={StickerSheet} />
      <Route path={"/saved"} component={SavedWorkouts} />
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
        <AuthProvider>
          <SavedProvider>
            <TooltipProvider>
              <BookBanner />
              <Toaster />
              <Router />
              <SocialFooter />
            </TooltipProvider>
          </SavedProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
