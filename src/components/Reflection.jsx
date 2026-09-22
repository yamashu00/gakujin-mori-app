import { useState } from 'react';

export default function Reflection({ initialValue, onSave }) {
  const [text, setText] = useState(initialValue || '');
  const [saved, setSaved] = useState(false);

  return (
    <div className="screen">
      <div className="hero" style={{ paddingTop: 12 }}>
        <div className="eyebrow">QUESTION</div>
        <h2 style={{ fontSize: 22 }}>
          数学を使う前と後で、
          <br />
          岳人の森の見え方は変わりましたか？
        </h2>
      </div>
      <div className="card">
        <textarea
          maxLength={200}
          rows={6}
          placeholder="自由に書いてみよう（200文字まで）"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setSaved(false);
          }}
        />
        <div className="hint" style={{ textAlign: 'right' }}>{text.length}/200</div>
        <button
          className="btn btn-accent"
          onClick={() => {
            onSave(text);
            setSaved(true);
          }}
        >
          {saved ? '保存しました ✓' : '保存する'}
        </button>
      </div>
    </div>
  );
}
