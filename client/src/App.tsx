import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BookBanner } from "@/components/BookBanner";
import { SocialFooter } from "@/components/SocialFooter";
import { TrafficAnalytics } from "@/components/TrafficAnalytics";
import { AuthProvider } from "@/contexts/AuthContext";
import { SavedProvider } from "@/contexts/SavedContext";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./components/group-workouts.css";

const NotFound = lazy(() => import("@/pages/NotFound"));
const Home = lazy(() => import("./pages/Home"));
const ExercisePlate = lazy(() => import("./pages/ExercisePlate"));
const StickerSheet = lazy(() => import("./pages/StickerSheet"));
const Workouts = lazy(() => import("./pages/Workouts"));
const Cardio = lazy(() => import("./pages/Cardio"));
const CardioSession = lazy(() => import("./pages/CardioSession"));
const Mobility = lazy(() => import("./pages/Mobility"));
const Calculators = lazy(() => import("./pages/Calculators"));
const WorkoutSession = lazy(() => import("./pages/WorkoutSession"));
const Nutrition = lazy(() => import("./pages/Nutrition"));
const MealBuilder = lazy(() => import("./pages/MealBuilder"));
const MealPrep = lazy(() => import("./pages/MealPrep"));
const Tracker = lazy(() => import("./pages/Tracker"));
const Education = lazy(() => import("./pages/Education"));
const EduArticle = lazy(() => import("./pages/EduArticle"));
const SavedWorkouts = lazy(() => import("./pages/SavedWorkouts"));
const Account = lazy(() => import("./pages/Account"));
const WorkoutOfDay = lazy(() => import("./pages/WorkoutOfDay"));
const WorkoutTools = lazy(() => import("./pages/WorkoutTools"));
const WorkoutBuilder = lazy(() => import("./pages/WorkoutBuilder"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const InstagramPage = lazy(() => import("./pages/Instagram"));
const GroupWorkouts = lazy(() => import("./pages/GroupWorkouts"));

function Router() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Switch>
      {/* Legacy public URLs: keep existing bookmarks and production tabs useful. */}
      <Route path="/exercises">
        <Redirect to="/" />
      </Route>
      <Route path="/physical-fitness/running">
        <Redirect to="/cardio" />
      </Route>
      <Route path="/fitness/warm-up-and-cooldown">
        <Redirect to="/mobility" />
      </Route>
      <Route path="/fitness-calculators/bmi">
        <Redirect to="/calculators#bmi" />
      </Route>
      <Route path="/fitness-calculators">
        <Redirect to="/calculators" />
      </Route>
      <Route path="/fitness">
        <Redirect to="/learn" />
      </Route>
      <Route path="/workouts/today">
        <Redirect to="/wod" />
      </Route>
      <Route path="/resources">
        <Redirect to="/learn" />
      </Route>
      <Route path="/app">
        <Redirect to="/" />
      </Route>
      <Route path="/downloads">
        <Redirect to="/stickers" />
      </Route>
      <Route path="/account" component={Account} />
      <Route path="/nutrition/foods">
        <Redirect to="/nutrition" />
      </Route>
      <Route path="/nutrition/education">
        <Redirect to="/learn" />
      </Route>
      <Route path="/nutrition/grocery-planner">
        <Redirect to="/nutrition/meal-prep" />
      </Route>
      <Route path="/nutrition/search">
        <Redirect to="/nutrition" />
      </Route>
      <Route path={"/"} component={Home} />
      <Route path="/instagram" component={InstagramPage} />
      <Route path={"/e/:slug"} component={ExercisePlate} />
      <Route path={"/workouts"} component={Workouts} />
      <Route path={"/wod"} component={WorkoutOfDay} />
      <Route path={"/workouts/tools"} component={WorkoutTools} />
      <Route path={"/workouts/builder"} component={WorkoutBuilder} />
      <Route path={"/workouts/groups"} component={GroupWorkouts} />
      <Route
        path={"/workouts/programs/:programId/:week/:day"}
        component={WorkoutSession}
      />
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
      <Route path={"/reset-password"} component={ResetPassword} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function RouteLoading() {
  return (
    <div className="container flex min-h-[55vh] items-center justify-center">
      <div className="text-center">
        <div className="hazard-rule mb-5 w-40" />
        <p className="meta text-[0.55rem] text-lime">Loading the next plate…</p>
      </div>
    </div>
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
              <TrafficAnalytics />
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
