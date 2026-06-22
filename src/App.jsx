import { useState, useCallback, useMemo, useRef } from 'react'
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
import Checkout from './screens/Checkout'
import './styles/components.css'
import './styles/screens.css'

const NAV_TABS = ['home', 'list', 'map', 'fridge', 'recipes']

// Build the current Mon–Sun week
function buildWeek() {
  const today = new Date()
  const dow = (today.getDay() + 6) % 7 // Mon = 0
  const monday = new Date(today)
  monday.setDate(today.getDate() - dow)
  const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const full = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  return names.map((n, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return { key: i, short: n, full: full[i], date: d.getDate(), isToday: i === dow }
  })
}

const SEED = [
  { name: 'Milk', emoji: '🥛', category: 'Dairy' },
  { name: 'Yogurt', emoji: '🥣', category: 'Dairy' },
  { name: 'Cheese', emoji: '🧀', category: 'Dairy', done: true },
  { name: 'Apples', emoji: '🍎', category: 'Fruit' },
  { name: 'Tomatoes', emoji: '🍅', category: 'Fruit' },
  { name: 'Bread', emoji: '🍞', category: 'Bakery', done: true },
  { name: 'Pasta', emoji: '🍝', category: 'Pantry' },
]

export default function App() {
  const [route, setRoute] = useState('onboarding')
  const [toast, setToast] = useState(null)
  const [navTarget, setNavTarget] = useState(null)
  const [checkout, setCheckout] = useState(null)

  // ===== shared shopping-list state (multiple lists, planned per weekday) =====
  const week = useMemo(buildWeek, [])
  const todayIndex = week.findIndex((d) => d.isToday)
  const idc = useRef(1)
  const [lists, setLists] = useState([{ id: 'family', name: 'Family List' }])
  const [activeListId, setActiveListId] = useState('family')
  const [listDay, setListDay] = useState(todayIndex)
  const [items, setItems] = useState(() =>
    SEED.map((x, i) => ({ id: 's' + i, listId: 'family', day: todayIndex, done: false, ...x }))
  )

  const addItems = useCallback((listId, day, arr) => {
    setItems((prev) => [
      ...prev,
      ...arr.map((a) => ({ id: 'i' + idc.current++, listId, day, done: false, ...a })),
    ])
  }, [])
  const toggleItem = useCallback((id) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it)))
  }, [])
  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }, [])
  const addList = useCallback((name) => {
    const id = 'l' + idc.current++
    setLists((prev) => [...prev, { id, name: name || `List ${prev.length + 1}` }])
    setActiveListId(id)
    return id
  }, [])

  const listApi = {
    week, todayIndex, lists, activeListId, setActiveListId, addList,
    listDay, setListDay, items, addItems, toggleItem, removeItem,
  }

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
    home: <Home go={go} toast={showToast} list={listApi} />,
    list: <ShoppingList go={go} toast={showToast} list={listApi} />,
    map: <StoreMap go={go} toast={showToast} openNav={setNavTarget} />,
    fridge: <Fridge go={go} toast={showToast} list={listApi} />,
    recipes: <Recipes go={go} toast={showToast} list={listApi} />,
    household: <Household go={go} toast={showToast} list={listApi} />,
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
              onFinish={(boughtItems) => {
                setNavTarget(null)
                setCheckout(boughtItems)
              }}
              toast={showToast}
            />
          )}

          {checkout && (
            <Checkout items={checkout} onClose={() => setCheckout(null)} toast={showToast} />
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
