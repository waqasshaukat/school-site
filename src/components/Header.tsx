'use client';
import Link from 'next/link';
import { useState } from 'react';
import Modal from './Modal';
import AdmissionForm from '@/components/AdmissionForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <header className="sticky-top">
      <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
        <div className="container">
          <Link href="/" className="navbar-brand">
            <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
            <strong>Springfield Elementary</strong>
          </Link>
          <div className="d-lg-none">
            <button className="btn btn-primary" onClick={openModal}>
              Enroll Now
            </button>
          </div>
          <button
            className="navbar-toggler d-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link href="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/about" className="nav-link">
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/academics" className="nav-link">
                  Academics
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admissions" className="nav-link">
                  Admissions
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/news" className="nav-link">
                  News & Events
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/contact" className="nav-link">
                  Contact
                </Link>
              </li>
              <li className="nav-item d-none d-lg-block">
                <button className="btn btn-primary ms-lg-3" onClick={openModal}>
                  Enroll Now
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AdmissionForm />
      </Modal>
    </header>
  );
};

export default Header;