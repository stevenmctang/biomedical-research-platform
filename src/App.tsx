import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import {
  Home,
} from './pages/Home'

import {
  Explore,
} from './pages/Explore'

import {
  DiseaseExplorer,
} from './pages/DiseaseExplorer'

import {
  GeneExplorer,
} from './pages/GeneExplorer'

import {
  PathwayExplorer,
} from './pages/PathwayExplorer'

import {
  DrugExplorer,
} from './pages/DrugExplorer'

import {
  HypothesisExplorer,
} from './pages/HypothesisExplorer'

import {
  Auth,
} from './pages/Auth'

import {
  AuthCallback,
} from './pages/AuthCallback'

import {
  ResearchMapDemo,
} from './pages/ResearchMapDemo'

import './App.css'


export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/auth"
          element={<Auth />}
        />

        <Route
          path="/auth/callback"
          element={
            <AuthCallback />
          }
        />

        <Route
          path="/explore"
          element={<Explore />}
        />

        <Route
          path="/research-map"
          element={
            <ResearchMapDemo />
          }
        />

        <Route
          path="/disease/:id"
          element={
            <DiseaseExplorer />
          }
        />

        <Route
          path="/gene/:id"
          element={
            <GeneExplorer />
          }
        />

        <Route
          path="/pathway/:id"
          element={
            <PathwayExplorer />
          }
        />

        <Route
          path="/drug/:id"
          element={
            <DrugExplorer />
          }
        />

        <Route
          path="/hypotheses"
          element={
            <HypothesisExplorer />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  )
}
