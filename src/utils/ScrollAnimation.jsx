import { useEffect, useState, useRef } from 'react';

// Custom hook to observe when an element enters the viewport
export const useScrollAnimation = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false); // Track if animation has occurred
  const elementRef = useRef(null);
  
  const defaultOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.1, // trigger when 10% of the element is visible
    ...options
  };

  useEffect(() => {
    // If we've already animated once and the "once" option is true, don't re-observe
    if (hasAnimated && options.once) {
      setIsIntersecting(true);
      return;
    }
    
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return; // Guard against invalid entries
      
      // If this element is intersecting, mark it as animated
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
      }
      
      setIsIntersecting(entry.isIntersecting);
      
      // Once the element has appeared, stop observing if we want the animation to happen once
      if (entry.isIntersecting && options.once && entry.target) {
        observer.unobserve(entry.target);
      }
    }, defaultOptions);

    const currentElement = elementRef.current;
    
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      // Clean up the observer completely instead of trying to unobserve specific elements
      // This prevents trying to unobserve elements that may no longer exist
      observer.disconnect();
    };
  }, [options.once, defaultOptions, hasAnimated]);

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
  style = {},
  disabled = false // Add option to disable animations completely
}) => {
  const [elementId] = useState(() => `scroll-anim-${Math.random().toString(36).substr(2, 9)}`);
  
  // Check if this component has already been animated in this session
  const [alreadyAnimated, setAlreadyAnimated] = useState(() => {
    if (typeof window !== 'undefined') {
      const animatedElements = sessionStorage.getItem('scrollAnimatedElements') || '{}';
      try {
        const parsed = JSON.parse(animatedElements);
        return parsed[elementId] === true;
      } catch (e) {
        return false;
      }
    }
    return false;
  });
  
  // Skip animation tracking if disabled
  const effectiveOnce = disabled ? false : once;
  
  const [ref, isIntersecting] = useScrollAnimation({ 
    once: effectiveOnce, 
    threshold
  });
  
  // When the element is intersecting, record it in session storage
  useEffect(() => {
    if (isIntersecting && once && !alreadyAnimated && typeof window !== 'undefined') {
      setAlreadyAnimated(true);
      try {
        const animatedElements = JSON.parse(sessionStorage.getItem('scrollAnimatedElements') || '{}');
        animatedElements[elementId] = true;
        sessionStorage.setItem('scrollAnimatedElements', JSON.stringify(animatedElements));
      } catch (e) {
        console.error('Failed to save animation state', e);
      }
    }
  }, [isIntersecting, once, elementId, alreadyAnimated]);
  
  // If animations are disabled or element was already animated, skip animation
  const shouldAnimate = !disabled && !(once && alreadyAnimated);
  const forceVisible = disabled || (once && alreadyAnimated);
  
  // Define the animation properties
  let transform = 'translateY(0)';
  if (!isIntersecting && shouldAnimate) {
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

  const animationStyle = forceVisible ? 
    { ...style, opacity: 1 } : // Force visible without animations
    {
      opacity: isIntersecting ? 1 : 0,
      transform,
      transition: `opacity ${duration}s ease, transform ${duration}s ease`,
      transitionDelay: `${delay}s`,
      ...style
    };

  return (
    <div 
      ref={shouldAnimate ? ref : null} 
      className={isIntersecting || forceVisible ? animationClass : ''}
      style={animationStyle}
      data-anim-id={elementId}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation;