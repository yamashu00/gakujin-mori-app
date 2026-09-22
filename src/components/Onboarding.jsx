import { useState } from 'react';

export default function Onboarding({ onComplete }) {
  const [team, setTeam] = useState('');
  const [eyeHeight, setEyeHeight] = useState('1.55');

  const canStart = team.trim().length > 0 && Number(eyeHeight) > 0;

  return (
    <div className="screen">
      <div className="hero">
        <div className="eyebrow">FOREST × MATH</div>
        <h2>
          岳人の森
          <br />
          数学MAP
        </h2>
        <p>森の中に隠れた三角形を探そう。</p>
      </div>

      <div className="card">
        <div className="field">
          <label>班名 / ニックネーム</label>
          <input
            type="text"
            placeholder="例：TEAM 1"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          />
        </div>
        <div className="field">
          <label>あなたの目線の高さ</label>
          <div className="unit">
            <input
              type="number"
              step="0.01"
              value={eyeHeight}
              onChange={(e) => setEyeHeight(e.target.value)}
            />
            <span>m</span>
          </div>
          <div className="hint">後で高さを計算するときに使う。あとから変更できる。</div>
        </div>
        <button
          className="btn btn-primary"
          disabled={!canStart}
          onClick={() => onComplete({ team: team.trim(), eyeHeight: Number(eyeHeight) })}
        >
          はじめる
        </button>
      </div>
    </div>
  );
}
