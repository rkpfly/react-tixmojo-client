import React, { useState } from 'react';

const PromoCode = ({ onApplyPromo, initialDiscount = 0 }) => {
  const [promoCode, setPromoCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // If an initial discount is provided, set success message
  React.useEffect(() => {
    if (initialDiscount > 0) {
      setSuccess(`Promo code applied: ${initialDiscount * 100}% discount`);
    }
  }, [initialDiscount]);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setError('Please enter a promo code');
      return;
    }

    setIsApplying(true);
    setError('');
    setSuccess('');

    // Simulate API call to validate promo code
    setTimeout(() => {
      // Mock validation - for real implementation, this would be an API call
      const validCodes = ['WELCOME10', 'SUMMER20', 'SPECIAL15'];
      const discounts = {
        'WELCOME10': 0.1,
        'SUMMER20': 0.2,
        'SPECIAL15': 0.15
      };

      if (validCodes.includes(promoCode.toUpperCase())) {
        setSuccess(`Promo code applied successfully!`);
        onApplyPromo(discounts[promoCode.toUpperCase()]);
      } else {
        setError('Invalid promo code');
      }
      setIsApplying(false);
    }, 1000);
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '5px',
        }}
      >
        <input
          type="text"
          placeholder="Enter Promo Code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          style={{
            flex: '1',
            padding: '10px 15px',
            borderRadius: '8px',
            border: '1px solid var(--purple-100)',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary)';
            e.target.style.boxShadow = '0 0 0 2px var(--purple-100)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--purple-100)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          onClick={handleApplyPromo}
          disabled={isApplying}
          style={{
            padding: '10px 15px',
            borderRadius: '8px',
            backgroundColor: isApplying ? 'var(--purple-200)' : 'var(--primary)',
            color: 'white',
            border: 'none',
            fontWeight: '600',
            fontSize: '14px',
            cursor: isApplying ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!isApplying) {
              e.currentTarget.style.backgroundColor = 'var(--purple-700)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isApplying) {
              e.currentTarget.style.backgroundColor = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {isApplying ? 'Applying...' : 'Apply'}
        </button>
      </div>
      
      {error && (
        <div style={{ color: '#ff5757', fontSize: '12px', marginTop: '5px' }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ color: '#22c55e', fontSize: '12px', marginTop: '5px' }}>
          {success}
        </div>
      )}
    </div>
  );
};

export default PromoCode;