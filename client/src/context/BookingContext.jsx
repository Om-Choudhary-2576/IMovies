import React, { createContext, useContext, useState } from 'react';
import { bookingsApi } from '../services/api';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [heldSeatsData, setHeldSeatsData] = useState([]);
  const [holdExpiresAt, setHoldExpiresAt] = useState(null);
  const [pricing, setPricing] = useState({
    subtotal: 0,
    convenienceFee: 0,
    tax: 0,
    discount: 0,
    totalAmount: 0,
  });
  const [promoCode, setPromoCode] = useState('');

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.seatNumber === seat.seatNumber);
      if (exists) {
        return prev.filter((s) => s.seatNumber !== seat.seatNumber);
      }
      if (prev.length >= 8) {
        alert('You can select a maximum of 8 seats per booking.');
        return prev;
      }
      return [...prev, seat];
    });
  };

  const holdSelectedSeats = async (showId, seatNumbers) => {
    const res = await bookingsApi.holdSeats({ showId, seatNumbers });
    if (res.success && res.data) {
      setHeldSeatsData(res.data.seats);
      setHoldExpiresAt(res.data.holdExpiresAt);
      setPricing(res.data.pricing);
      return res.data;
    }
    throw new Error(res.message || 'Failed to place seat hold');
  };

  const confirmCurrentBooking = async (paymentMethod = 'Card', appliedPromo) => {
    if (!selectedShow || selectedSeats.length === 0) {
      throw new Error('No active show or seats selected');
    }

    const seatNumbers = selectedSeats.map((s) => s.seatNumber);
    const res = await bookingsApi.confirmBooking({
      showId: selectedShow._id,
      seatNumbers,
      paymentMethod,
      promoCode: appliedPromo || promoCode,
    });

    if (res.success && res.data) {
      // Clear selection upon success
      setSelectedSeats([]);
      setHeldSeatsData([]);
      setHoldExpiresAt(null);
      return res.data;
    }
    throw new Error(res.message || 'Failed to confirm booking');
  };

  const clearBooking = () => {
    setSelectedSeats([]);
    setHeldSeatsData([]);
    setHoldExpiresAt(null);
    setPricing({
      subtotal: 0,
      convenienceFee: 0,
      tax: 0,
      discount: 0,
      totalAmount: 0,
    });
    setPromoCode('');
  };

  const value = {
    selectedMovie,
    setSelectedMovie,
    selectedTheatre,
    setSelectedTheatre,
    selectedShow,
    setSelectedShow,
    selectedSeats,
    setSelectedSeats,
    toggleSeat,
    heldSeatsData,
    holdExpiresAt,
    pricing,
    setPricing,
    promoCode,
    setPromoCode,
    holdSelectedSeats,
    confirmCurrentBooking,
    clearBooking,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
