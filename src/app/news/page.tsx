const NewsPage = () => {
  return (
    <div className="py-5">
      <h1>News & Events</h1>
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Annual School Fair</h5>
          <p className="card-text">
            Our annual school fair is just around the corner! Join us for a day of fun, games, and food. All proceeds will go towards funding our new library.
          </p>
          <p className="card-text">
            <small className="text-muted">Posted on September 1, 2025</small>
          </p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Parent-Teacher Conferences</h5>
          <p className="card-text">
            Parent-teacher conferences will be held on October 15th and 16th. Please sign up for a time slot with your child&apos;s teacher.
          </p>
          <p className="card-text">
            <small className="text-muted">Posted on August 25, 2025</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;