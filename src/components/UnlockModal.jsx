import { useState } from 'react';
import { UNLOCK_CODE } from '../config.js';

export default function UnlockModal({ onSuccess, onClose }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (code === UNLOCK_CODE) {
      onSuccess();
    } else {
      setError('コードが違います。先生にもう一度確認しよう。');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>🔓 数学を解放</h3>
        <p style={{ fontSize: 13, color: '#4a5449' }}>
          先生が発表した4桁のコードを入力しよう。tan（タンジェント）の考え方が使えるようになる。
        </p>
        <input
          className="code-input"
          inputMode="numeric"
          maxLength={4}
          value={code}
          onChange={(e) => {
            setError('');
            setCode(e.target.value.replace(/\D/g, '').slice(0, 4));
          }}
          placeholder="____"
        />
        {error && <div className="error-text">{error}</div>}
        <button className="btn btn-accent" disabled={code.length !== 4} onClick={submit}>
          解放する
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
}
