import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div className="landing">
      <section className="landing-hero">
        <h1>
          Clone any API. <span>Mock it in minutes.</span>
        </h1>
        <p>
          ShadowForge captures real API responses, infers their schema, and
          spins up a mock server you can point your frontend at &mdash;
          faults and all.
        </p>

        <div className="landing-actions">
          <Link to="/register" className="btn btn-primary">
            Get started
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
        </div>
      </section>

      <section className="landing-workflow">
        <h2>How it works</h2>
        <div className="workflow-steps">
          <div className="workflow-step">
            <h3>Capture</h3>
            <p>Record real responses from an endpoint you point us to.</p>
          </div>
          <div className="workflow-step">
            <h3>Infer Schema</h3>
            <p>We work out the shape and types of the captured data.</p>
          </div>
          <div className="workflow-step">
            <h3>Generate Mock</h3>
            <p>Get a mock endpoint that returns realistic fake data.</p>
          </div>
          <div className="workflow-step">
            <h3>Simulate Faults</h3>
            <p>Add delays, errors, and edge cases to test against.</p>
          </div>
        </div>

        <p className="landing-note">
          This project is under active development. The capture, schema, and
          mock engines are being built by the backend team &mdash; this
          frontend currently covers account creation and login only.
        </p>
      </section>
    </div>
  )
}

export default Landing
