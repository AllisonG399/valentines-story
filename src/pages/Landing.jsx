export default function Landing() {
  return (
    <div className="card">
      <h1>Welcome to Valentine Story</h1>
      <p>Create a message or story for someone special 💕</p>

      <button onClick={() => (window.location.hash = '#/create')}>
        Create Valentine
      </button>
    </div>
  );
}