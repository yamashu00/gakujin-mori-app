import { useEffect, useState } from 'react';
import { loadState, saveState, makeId } from './storage.js';
import { demoDiscoveries } from './demoData.js';

import Onboarding from './components/Onboarding.jsx';
import Home from './components/Home.jsx';
import Mission from './components/Mission.jsx';
import MeasureForm from './components/MeasureForm.jsx';
import DiscoveryDetail from './components/DiscoveryDetail.jsx';
import MapScreen from './components/MapScreen.jsx';
import RecordsScreen from './components/RecordsScreen.jsx';
import Reflection from './components/Reflection.jsx';
import UnlockModal from './components/UnlockModal.jsx';
import NavBar from './components/NavBar.jsx';

const TITLES = {
  home: '岳人の森 数学MAP',
  mission: '今日のミッション',
  measure: '新しく測る',
  detail: 'Discovery',
  map: 'MAP',
  records: '自分たちの記録',
  reflection: '振り返り',
};

export default function App() {
  const [state, setState] = useState(loadState);
  const [view, setView] = useState('home');
  const [selectedId, setSelectedId] = useState(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  useEffect(() => {
    saveState(state);
  }, [state]);

  if (!state.team) {
    return (
      <div className="app">
        <Onboarding
          onComplete={({ team, eyeHeight }) =>
            setState((s) => ({ ...s, team, eyeHeight }))
          }
        />
      </div>
    );
  }

  const navigate = (v) => {
    setView(v);
    if (v !== 'detail') setSelectedId(null);
  };

  const openDetail = (id) => {
    setSelectedId(id);
    setView('detail');
  };

  const addDiscovery = (fields) => {
    const discovery = {
      id: makeId(),
      team: state.team,
      createdAt: Date.now(),
      notes: '',
      height: null,
      ...fields,
    };
    setState((s) => ({ ...s, discoveries: [...s.discoveries, discovery] }));
    openDetail(discovery.id);
  };

  const calcHeight = (id, height) => {
    setState((s) => ({
      ...s,
      discoveries: s.discoveries.map((d) => (d.id === id ? { ...d, height } : d)),
    }));
  };

  const saveNotes = (id, notes) => {
    setState((s) => ({
      ...s,
      discoveries: s.discoveries.map((d) => (d.id === id ? { ...d, notes } : d)),
    }));
  };

  const deleteDiscovery = (id) => {
    setState((s) => ({ ...s, discoveries: s.discoveries.filter((d) => d.id !== id) }));
    navigate('records');
  };

  const allMapDiscoveries = [
    ...state.discoveries,
    ...(state.showDemo ? demoDiscoveries : []),
  ];

  const selected = state.discoveries.find((d) => d.id === selectedId);

  return (
    <div className="app">
      <div className="topbar">
        {view === 'home' ? (
          <h1>{TITLES[view]}</h1>
        ) : (
          <>
            <button className="back" onClick={() => navigate('home')}>← 戻る</button>
            <h1>{TITLES[view]}</h1>
          </>
        )}
        <button
          className={`lock-btn ${state.unlocked ? 'unlocked' : ''}`}
          onClick={() => (state.unlocked ? null : setShowUnlockModal(true))}
        >
          {state.unlocked ? '🔓 解放済み' : '🔒 解放する'}
        </button>
      </div>

      {view === 'home' && (
        <Home team={state.team} unlocked={state.unlocked} onNavigate={navigate} />
      )}

      {view === 'mission' && <Mission onNavigate={navigate} />}

      {view === 'measure' && (
        <MeasureForm
          defaultEyeHeight={state.eyeHeight}
          onCancel={() => navigate('home')}
          onSave={addDiscovery}
        />
      )}

      {view === 'detail' && selected && (
        <DiscoveryDetail
          discovery={selected}
          unlocked={state.unlocked}
          onCalculate={calcHeight}
          onSaveNotes={saveNotes}
          onDelete={deleteDiscovery}
          onRequestUnlock={() => setShowUnlockModal(true)}
        />
      )}

      {view === 'map' && (
        <MapScreen
          discoveries={allMapDiscoveries}
          showDemo={state.showDemo}
          onToggleDemo={(v) => setState((s) => ({ ...s, showDemo: v }))}
        />
      )}

      {view === 'records' && (
        <RecordsScreen discoveries={state.discoveries} onOpen={openDetail} />
      )}

      {view === 'reflection' && (
        <Reflection
          initialValue={state.reflection}
          onSave={(text) => setState((s) => ({ ...s, reflection: text }))}
        />
      )}

      <NavBar current={view === 'detail' ? 'records' : view} onNavigate={navigate} />

      {showUnlockModal && (
        <UnlockModal
          onClose={() => setShowUnlockModal(false)}
          onSuccess={() => {
            setState((s) => ({ ...s, unlocked: true }));
            setShowUnlockModal(false);
          }}
        />
      )}
    </div>
  );
}
