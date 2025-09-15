import Gallery from '@/components/Gallery';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1 className="mb-3">Welcome to Springfield Elementary</h1>
        <p className="mb-3">Nurturing young minds for a bright future.</p>
        
      </div>

      {/* Quick Links Section */}
      <div className="container py-5">
        <div className="row text-center">
          <div className="col-md-4">
            <h3>About Us</h3>
            <p>Learn about our mission, vision, and values.</p>
            <Link href="/about" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
          <div className="col-md-4">
            <h3>Academics</h3>
            <p>Explore our curriculum and academic programs.</p>
            <Link href="/academics" className="btn btn-secondary">
              Explore
            </Link>
          </div>
          <div className="col-md-4">
            <h3>News & Events</h3>
            <p>Stay up-to-date with the latest school news and events.</p>
            <Link href="/news" className="btn btn-secondary">
              View News
            </Link>
          </div>
        </div>
      </div>

      {/* Principal's Message Section */}
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="mb-4">Principal&apos;s Message</h2>
            <p className="lead">
              &quot;Welcome to Springfield Elementary, where we are dedicated to fostering a love for learning in a supportive and engaging environment. Our goal is to empower every student to achieve their full potential, both academically and personally. We believe in a holistic approach to education, encouraging curiosity, creativity, and critical thinking. We look forward to partnering with you in your child&apos;s educational journey.&quot;
            </p>
            <p className="mt-3">- Principal Jane Doe</p>
          </div>
          <div className="col-md-6" style={{ paddingLeft: '10%' }}>
            <Image
              src="/Waqas.jpeg"
              alt="Principal Waqas"
              width={400}
              height={400}
              className="img-fluid rounded-circle shadow-lg"
            />
          </div>
        </div>
      </div>
      <Gallery />
    </div>
  );
};

export default HomePage;
