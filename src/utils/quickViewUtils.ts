// Utility functions for quick view functionality

export interface QuickViewProduct {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  discount?: string;
  brand: string;
  description?: string;
  sizes?: string[];
  colors?: string[];
  stockCount?: number;
}

export interface QuickViewOptions {
  enableKeyboardNavigation?: boolean;
  enableAnalytics?: boolean;
  loadingDelay?: number;
  errorRetryAttempts?: number;
}

export class QuickViewError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'QuickViewError';
  }
}

/**
 * Validates product data to ensure all required fields are present
 */
export const validateProductData = (product: any): product is QuickViewProduct => {
  if (!product) {
    throw new QuickViewError('Product data is null or undefined', 'PRODUCT_NULL');
  }

  const requiredFields = ['id', 'name', 'price', 'image', 'category'];
  const missingFields = requiredFields.filter(field => !product[field]);

  if (missingFields.length > 0) {
    throw new QuickViewError(
      `Missing required fields: ${missingFields.join(', ')}`,
      'MISSING_FIELDS'
    );
  }

  // Validate data types
  if (typeof product.id !== 'number') {
    throw new QuickViewError('Product ID must be a number', 'INVALID_ID');
  }

  if (typeof product.rating === 'number' && (product.rating < 0 || product.rating > 5)) {
    throw new QuickViewError('Product rating must be between 0 and 5', 'INVALID_RATING');
  }

  return true;
};

/**
 * Extracts product ID from various element attributes
 */
export const extractProductId = (element: HTMLElement): number | null => {
  // Try different attribute names
  const attributes = [
    'data-product-id',
    'data-id',
    'data-product',
    'product-id',
    'id'
  ];

  for (const attr of attributes) {
    const value = element.getAttribute(attr);
    if (value) {
      const id = parseInt(value, 10);
      if (!isNaN(id) && id > 0) {
        return id;
      }
    }
  }

  // Try to extract from closest parent with product data
  const productCard = element.closest('[data-product-id]');
  if (productCard) {
    const id = parseInt(productCard.getAttribute('data-product-id') || '', 10);
    if (!isNaN(id) && id > 0) {
      return id;
    }
  }

  return null;
};

/**
 * Creates a debounced function to prevent rapid successive calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Handles keyboard navigation for quick view
 */
export const handleKeyboardNavigation = (event: KeyboardEvent, callback: () => void) => {
  // Enter or Space key
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
};

/**
 * Tracks analytics events for quick view interactions
 */
export const trackQuickViewEvent = (
  eventName: string,
  productId: number,
  productName?: string,
  additionalData?: Record<string, any>
) => {
  try {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'product_interaction',
        event_label: productName || `Product ${productId}`,
        product_id: productId,
        ...additionalData
      });
    }

    // Custom analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track(eventName, {
        productId,
        productName,
        ...additionalData
      });
    }

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Quick View Analytics:', {
        event: eventName,
        productId,
        productName,
        ...additionalData
      });
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

/**
 * Preloads product images for better performance
 */
export const preloadProductImages = (images: string[]): Promise<void[]> => {
  const imagePromises = images.map(src => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  });

  return Promise.all(imagePromises);
};

/**
 * Formats price strings consistently
 */
export const formatPrice = (price: string | number): string => {
  if (typeof price === 'number') {
    return `₹${price.toLocaleString('en-IN')}`;
  }
  
  // If already formatted, return as is
  if (typeof price === 'string' && price.includes('₹')) {
    return price;
  }
  
  // Try to parse and format
  const numericPrice = parseFloat(price.toString().replace(/[^\d.]/g, ''));
  if (!isNaN(numericPrice)) {
    return `₹${numericPrice.toLocaleString('en-IN')}`;
  }
  
  return price.toString();
};

/**
 * Generates a unique ID for modal instances
 */
export const generateModalId = (): string => {
  return `quick-view-modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Manages focus trap for modal accessibility
 */
export class FocusTrap {
  private focusableElements: HTMLElement[] = [];
  private firstFocusableElement: HTMLElement | null = null;
  private lastFocusableElement: HTMLElement | null = null;
  private previousActiveElement: HTMLElement | null = null;

  constructor(private container: HTMLElement) {
    this.updateFocusableElements();
  }

  private updateFocusableElements() {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    this.focusableElements = Array.from(
      this.container.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];

    this.firstFocusableElement = this.focusableElements[0] || null;
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1] || null;
  }

  activate() {
    this.previousActiveElement = document.activeElement as HTMLElement;
    this.container.addEventListener('keydown', this.handleKeyDown);
    
    // Focus first element
    if (this.firstFocusableElement) {
      this.firstFocusableElement.focus();
    }
  }

  deactivate() {
    this.container.removeEventListener('keydown', this.handleKeyDown);
    
    // Restore previous focus
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusableElement) {
        event.preventDefault();
        this.lastFocusableElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusableElement) {
        event.preventDefault();
        this.firstFocusableElement?.focus();
      }
    }
  };
}