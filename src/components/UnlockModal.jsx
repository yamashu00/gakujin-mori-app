export default function UnlockModal({ onSuccess, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>🔓 数学を解放</h3>
        <p style={{ fontSize: 13, color: '#4a5449' }}>
          先生の合図があったら押そう。tan（タンジェント）の考え方が使えるようになる。
        </p>
        <button className="btn btn-accent" onClick={onSuccess}>
          解放する
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          まだやめておく
        </button>
      </div>
    </div>
  );
}
