import { useEffect, useState, useRef } from 'react';

// Custom hook to observe when an element enters the viewport
export const useScrollAnimation = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef(null);
  
  const defaultOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.1, // trigger when 10% of the element is visible
    ...options
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      
      // Once the element has appeared, stop observing if we want the animation to happen once
      if (entry.isIntersecting && options.once) {
        observer.unobserve(elementRef.current);
      }
    }, defaultOptions);

    const currentElement = elementRef.current;
    
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options.once, defaultOptions]);

  return [elementRef, isIntersecting];
};

// HOC (Higher Order Component) to add scroll animation to any component
export const withScrollAnimation = (WrappedComponent, animationClass, options = {}) => {
  return (props) => {
    const [ref, isIntersecting] = useScrollAnimation({ once: true, ...options });
    
    return (
      <div 
        ref={ref} 
        className={isIntersecting ? animationClass : ''}
        style={{ opacity: isIntersecting ? 1 : 0, transition: 'opacity 0.5s ease' }}
      >
        <WrappedComponent {...props} />
      </div>
    );
  };
};

// Component that wraps its children with scroll animation
export const ScrollAnimation = ({ 
  children, 
  animationClass = 'animate', 
  duration = 0.8,
  delay = 0, 
  once = true,
  direction = 'up', // 'up', 'down', 'left', 'right'
  distance = 50,  // in pixels
  threshold = 0.1,
  style = {}
}) => {
  const [ref, isIntersecting] = useScrollAnimation({ 
    once, 
    threshold
  });

  // Define the animation properties
  let transform = 'translateY(0)';
  if (!isIntersecting) {
    switch (direction) {
      case 'up':
        transform = `translateY(${distance}px)`;
        break;
      case 'down':
        transform = `translateY(-${distance}px)`;
        break;
      case 'left':
        transform = `translateX(${distance}px)`;
        break;
      case 'right':
        transform = `translateX(-${distance}px)`;
        break;
      default:
        transform = `translateY(${distance}px)`;
    }
  }

  const animationStyle = {
    opacity: isIntersecting ? 1 : 0,
    transform,
    transition: `opacity ${duration}s ease, transform ${duration}s ease`,
    transitionDelay: `${delay}s`,
    ...style
  };

  return (
    <div 
      ref={ref} 
      className={isIntersecting ? animationClass : ''}
      style={animationStyle}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation;