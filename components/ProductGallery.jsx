"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductGallery({ images, productName, labels }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleImages = images.length > 1;
  const activeImage = images[activeIndex] || images[0];

  function showPrevious() {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % images.length);
  }

  return (
    <div className="product-gallery">
      <div className="product-primary-media">
        <Image
          key={activeImage}
          src={activeImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 42vw"
        />

        {hasMultipleImages ? (
          <div className="product-gallery-controls" aria-label={labels.controlsLabel}>
            <button className="product-gallery-arrow" type="button" onClick={showPrevious} aria-label={labels.previous}>
              <ChevronLeft size={28} strokeWidth={1.7} aria-hidden="true" />
            </button>
            <button className="product-gallery-arrow" type="button" onClick={showNext} aria-label={labels.next}>
              <ChevronRight size={28} strokeWidth={1.7} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div className="product-thumb-row" aria-label={labels.thumbsLabel}>
          {images.map((image, index) => (
            <button
              key={image}
              className="product-thumb"
              type="button"
              aria-label={`${labels.thumbnail} ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
            >
              <Image src={image} alt={`${productName} ${index + 1}`} fill sizes="120px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
