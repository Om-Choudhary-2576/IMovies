import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
    },
    posterUrl: {
      type: String,
      required: [true, 'Poster image URL is required'],
    },
    backdropUrl: {
      type: String,
      required: [true, 'Backdrop image URL is required'],
    },
    genres: {
      type: [String],
      required: [true, 'At least one genre is required'],
      index: true,
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      default: 'English',
      index: true,
    },
    duration: {
      type: Number, // Duration in minutes
      required: [true, 'Duration in minutes is required'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    cast: {
      type: [String],
      default: [],
    },
    director: {
      type: String,
      default: '',
    },
    certification: {
      type: String,
      enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'U', 'UA', 'A'],
      default: 'PG-13',
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.5,
    },
    votesCount: {
      type: Number,
      default: 1200,
    },
    trailerUrl: {
      type: String,
      default: '',
      trim: true,
      validate: {
        validator: function (v) {
          if (!v || typeof v !== 'string' || v.trim() === '') return true;
          return /(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/|^)([a-zA-Z0-9_-]{11})/i.test(v.trim());
        },
        message: (props) => `${props.value} is not a valid YouTube video URL or ID!`,
      },
    },
    alternativeTrailerUrl: {
      type: String,
      default: '',
      trim: true,
      validate: {
        validator: function (v) {
          if (!v || typeof v !== 'string' || v.trim() === '') return true;
          return /(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/|^)([a-zA-Z0-9_-]{11})/i.test(v.trim());
        },
        message: (props) => `${props.value} is not a valid YouTube video URL or ID!`,
      },
    },
    status: {
      type: String,
      enum: ['NOW_SHOWING', 'COMING_SOON', 'INACTIVE'],
      default: 'NOW_SHOWING',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    ticketPrice: {
      standard: { type: Number, default: 12.0 },
      premium: { type: Number, default: 16.0 },
      vip: { type: Number, default: 22.0 },
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title before save if not provided
movieSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
