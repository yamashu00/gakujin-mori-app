const KEY = 'gakujin-mori:v1';

const defaultState = () => ({
  team: '',
  eyeHeight: '',
  unlocked: false,
  showDemo: true,
  discoveries: [],
  reflection: '',
});

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('保存に失敗しました（容量オーバーの可能性）', e);
  }
}

export function makeId() {
  return `d_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
