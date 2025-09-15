import Image from 'next/image';
import styles from './Gallery.module.css';

const images = [
  '/g1.png',
  '/g2.jpg',
  '/g3.jpg',
  '/g4.jpg',
  '/g5.webp',
  '/g6.jpg',
  '/g7.jpg',
  '/g8.jpg',
];

const Gallery = () => {
  return (
    <div className={styles.galleryContainer}>
      <h2 className={styles.galleryTitle}>Gallery</h2>
      <div className={styles.galleryGrid}>
        {images.map((src, index) => (
          <div key={index} className={styles.galleryItem}>
            <Image
              src={src}
              alt={`Gallery image ${index + 1}`}
              width={300}
              height={200}
              className={styles.galleryImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
