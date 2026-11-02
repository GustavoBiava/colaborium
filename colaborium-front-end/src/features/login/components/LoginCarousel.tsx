import { useState, useEffect } from "react";

interface LoginCarouselProps {
    images: string[];
    interval?: number;
}

export function LoginCarousel({ images, interval }: LoginCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [previousIndex, setPreviousIndex] = useState<number | null>(null);

    useEffect(() => {
        if (images.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((index) => (index + 1) % images.length)
        }, interval);

        return () => clearInterval(timer);
    }, [images.length, interval]);

    if (images.length === 0) return null;

    return (
    <div className="relative h-full w-full overflow-hidden">
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden={index !== currentIndex}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-3000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
    )
}