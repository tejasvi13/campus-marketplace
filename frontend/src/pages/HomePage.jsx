export default function HomePage({ user, onSignOut }) {
  return (
    <div className="home">
      <header className="home__bar">
        <span className="wordmark wordmark--dark">Campus Marketplace</span>
        <button type="button" className="button button--quiet" onClick={onSignOut}>
          Sign out
        </button>
      </header>

      <div className="home__body">
        <h1 className="page-title">Welcome, {user.name}.</h1>
        <p className="page-sub">
          Your college e-mail is verified, so you can trade with anyone else on this
          campus.
        </p>

        <dl className="detail-list">
          <div className="detail-list__row">
            <dt>Register number</dt>
            <dd>{user.regNo}</dd>
          </div>
          <div className="detail-list__row">
            <dt>E-mail</dt>
            <dd>{user.email}</dd>
          </div>
          <div className="detail-list__row">
            <dt>Department</dt>
            <dd>{user.department || "Not filled in"}</dd>
          </div>
          <div className="detail-list__row">
            <dt>Verified</dt>
            <dd>Yes</dd>
          </div>
        </dl>

      </div>
    </div>
  );
}
