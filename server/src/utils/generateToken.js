import jwt from 'jsonwebtoken';

export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'imovies_dev_jwt_secret_key_cinema_booking_app_2026',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};
