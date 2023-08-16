import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Loader from './Loader';
import Button from './Button';
import Modal from './Modal';
import { fetchImages } from './api';
import './styles.css';
 
const App = () => {
  const [images, setImages] = useState({ hits: [], total: 0 });
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (query === '') return;

      setIsLoading(true);
      try {
        const { hits, totalHits } = await fetchImages(query, page);
        setImages(prevState => ({
          hits: [...prevState.hits, ...hits],
          total: totalHits,
        }));
        setShowButton(page < Math.ceil(totalHits / 12));
        setIsLoading(false);

        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      } catch (error) {
        console.error('Error fetching images:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query, page]); // Include query and page as dependencies

  const handleSearchSubmit = newQuery => {
    setQuery(newQuery);
    setImages({ hits: [], total: 0 });
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleImageClick = largeImageURL => {
    setSelectedImage(largeImageURL);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedImage('');
    setShowModal(false);
  };

  return (
    <div className="App">
      <Searchbar onSubmit={handleSearchSubmit} />
      <ImageGallery images={images.hits} onClick={handleImageClick} />
      {isLoading && <Loader />}
      {images.hits.length > 0 && !isLoading && showButton && (
        <Button
          onClick={handleLoadMore}
          isLastPage={images.hits.length >= images.total}
        />
      )}
      {showModal && (
        <Modal largeImageURL={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;
