"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyInfo> = {
  AED: { code: 'AED', symbol: 'Dhs.', name: 'UAE', flag: '🇦🇪' },
  INR: { code: 'INR', symbol: '₹', name: 'India', flag: '🇮🇳' },
  USD: { code: 'USD', symbol: '$', name: 'USA', flag: '🇺🇸' },
  GBP: { code: 'GBP', symbol: '£', name: 'UK', flag: '🇬🇧' },
  EUR: { code: 'EUR', symbol: '€', name: 'Europe', flag: '🇪🇺' },
};

interface LocationContextType {
  country: string;
  currency: CurrencyInfo;
  exchangeRate: number; // Rate relative to AED
  isLoading: boolean;
  setCurrencyByCode: (code: string) => void;
  formatPrice: (amountAED: number) => string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountry] = useState('UAE');
  const [currency, setCurrency] = useState<CurrencyInfo>(SUPPORTED_CURRENCIES.AED);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Helper: Format price based on current currency
  const formatPrice = useCallback((amountAED: number) => {
    const converted = amountAED * exchangeRate;
    return `${currency.symbol} ${converted.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }, [currency, exchangeRate]);

  // Fetch exchange rates relative to AED
  const fetchRate = async (targetCurrency: string) => {
    if (targetCurrency === 'AED') {
      setExchangeRate(1);
      return;
    }
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/AED`);
      const data = await res.json();
      if (data.rates && data.rates[targetCurrency]) {
        setExchangeRate(data.rates[targetCurrency]);
      }
    } catch (error) {
      console.error("Failed to fetch exchange rates", error);
      setExchangeRate(1); // Fallback to 1:1
    }
  };

  const setCurrencyByCode = (code: string) => {
    if (SUPPORTED_CURRENCIES[code]) {
      setCurrency(SUPPORTED_CURRENCIES[code]);
      localStorage.setItem('dedox_currency', code);
      fetchRate(code);
    }
  };

  const detectLocation = async () => {
    setIsLoading(true);
    try {
      // 1. Check localStorage first
      const savedCurrency = localStorage.getItem('dedox_currency');
      if (savedCurrency && SUPPORTED_CURRENCIES[savedCurrency]) {
        setCurrency(SUPPORTED_CURRENCIES[savedCurrency]);
        await fetchRate(savedCurrency);
        setIsLoading(false);
        return;
      }

      // 2. IP Geolocation
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      
      const detectedCurrency = data.currency;
      const detectedCountry = data.country_name;
      
      if (detectedCurrency && SUPPORTED_CURRENCIES[detectedCurrency]) {
        setCurrency(SUPPORTED_CURRENCIES[detectedCurrency]);
        setCountry(detectedCountry);
        await fetchRate(detectedCurrency);
      } else {
        // Fallback to AED
        setCurrency(SUPPORTED_CURRENCIES.AED);
        setExchangeRate(1);
      }
    } catch (error) {
      console.error("Location detection failed", error);
      setCurrency(SUPPORTED_CURRENCIES.AED);
      setExchangeRate(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ 
      country, 
      currency, 
      exchangeRate, 
      isLoading, 
      setCurrencyByCode,
      formatPrice
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
