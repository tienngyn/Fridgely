import { useState, useCallback } from 'react'
import BottomNav from './components/BottomNav'
import Icon from './components/Icon'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import ShoppingList from './screens/ShoppingList'
import StoreMap from './screens/StoreMap'
import Fridge from './screens/Fridge'
import Recipes from './screens/Recipes'
import Household from './screens/Household'
import StoreNav from './screens/StoreNav'
import './styles/components.css'
import './styles/screens.css'

// Tabs reachable from the bottom navigation
const NAV_TABS = ['home', 'list', 'map', 'fridge', 'recipes']

export default function App() {
  const [route, setRoute] = useState('onboarding')
  const [toast, setToast] = useState(null)
  // product whose live 3D navigation overlay is open (null = closed)
  const [navTarget, setNavTarget] = useState(null)

  const showToast = useCallback((msg) => {
    setToast(msg)
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(null), 2200)
  }, [])

  const go = useCallback((r) => {
    document.querySelector('.screen')?.scrollTo({ top: 0 })
    setRoute(r)
  }, [])

  const isOnboarding = route === 'onboarding'
  const showNav = NAV_TABS.includes(route)

  const screens = {
    onboarding: <Onboarding onStart={() => go('home')} />,
    home: <Home go={go} toast={showToast} />,
    list: <ShoppingList go={go} toast={showToast} />,
    map: <StoreMap go={go} toast={showToast} openNav={setNavTarget} />,
    fridge: <Fridge go={go} toast={showToast} />,
    recipes: <Recipes go={go} toast={showToast} />,
    household: <Household go={go} toast={showToast} />,
  }

  return (
    <div className="device-stage">
      <div className="phone">
        <div className="phone__notch" />
        <div className="phone__screen">
          {isOnboarding ? (
            <div className="screen">{screens.onboarding}</div>
          ) : (
            <div className={`screen ${showNav ? 'screen--with-nav' : ''}`}>
              <div className="screen__pad" key={route}>
                {screens[route]}
              </div>
            </div>
          )}

          {showNav && <BottomNav active={route} onNavigate={go} />}

          {navTarget && (
            <StoreNav
              stops={navTarget.stops}
              onClose={() => setNavTarget(null)}
              toast={showToast}
            />
          )}

          {toast && (
            <div className="toast">
              <span className="toast__icn">
                <Icon name="check" size={16} strokeWidth={3} />
              </span>
              {toast}
            </div>
          )}
        </div>
      </div>
      <p className="stage-hint">
        <b>Fridgely</b> — interactive prototype. Tap <b>Get Started</b>, then explore via the bottom navigation.
      </p>
    </div>
  )
}
