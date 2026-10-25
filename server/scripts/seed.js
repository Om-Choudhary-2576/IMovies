import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Movie from '../src/models/Movie.js';
import Theatre from '../src/models/Theatre.js';
import Show from '../src/models/Show.js';
import Booking from '../src/models/Booking.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import QRCode from 'qrcode';

dotenv.config();

export const sampleMovies = [
  // --- Existing 7 Movies ---
  {
    title: 'Dune: Part Two',
    slug: 'dune-part-two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    language: 'English',
    duration: 166,
    releaseDate: new Date('2024-03-01'),
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    director: 'Denis Villeneuve',
    certification: 'PG-13',
    rating: 8.8,
    votesCount: 420000,
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    status: 'NOW_SHOWING',
    isFeatured: true,
  },
  {
    title: 'Oppenheimer',
    slug: 'oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, examining the moral dilemmas and political fallout that followed.',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1920&q=80',
    genres: ['Biography', 'Drama', 'History'],
    language: 'English',
    duration: 180,
    releaseDate: new Date('2023-07-21'),
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    director: 'Christopher Nolan',
    certification: 'R',
    rating: 8.9,
    votesCount: 650000,
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    status: 'NOW_SHOWING',
    isFeatured: true,
  },
  {
    title: 'Interstellar: IMAX Special',
    slug: 'interstellar-imax-special',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    language: 'English',
    duration: 169,
    releaseDate: new Date('2024-11-07'),
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    director: 'Christopher Nolan',
    certification: 'PG-13',
    rating: 8.7,
    votesCount: 980000,
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    status: 'NOW_SHOWING',
    isFeatured: false,
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    slug: 'spider-man-across-the-spider-verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1920&q=80',
    genres: ['Animation', 'Action', 'Adventure'],
    language: 'English',
    duration: 140,
    releaseDate: new Date('2023-06-02'),
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Jake Johnson'],
    director: 'Joaquim Dos Santos, Kemp Powers',
    certification: 'PG',
    rating: 8.7,
    votesCount: 350000,
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    status: 'NOW_SHOWING',
    isFeatured: false,
  },
  {
    title: 'The Batman: Extended Edition',
    slug: 'the-batman-extended-edition',
    description: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.',
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Crime', 'Drama'],
    language: 'English',
    duration: 176,
    releaseDate: new Date('2024-04-15'),
    cast: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano', 'Colin Farrell'],
    director: 'Matt Reeves',
    certification: 'PG-13',
    rating: 7.9,
    votesCount: 740000,
    trailerUrl: 'https://www.youtube.com/watch?v=mqqft2x_Aa4',
    status: 'NOW_SHOWING',
    isFeatured: false,
  },
  {
    title: 'Gladiator II',
    slug: 'gladiator-ii',
    description: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
    posterUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Adventure', 'Drama'],
    language: 'English',
    duration: 148,
    releaseDate: new Date('2026-11-22'),
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
    director: 'Ridley Scott',
    certification: 'R',
    rating: 8.4,
    votesCount: 95000,
    trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
    status: 'COMING_SOON',
    isFeatured: true,
  },
  {
    title: 'Mission: Impossible - The Final Reckoning',
    slug: 'mission-impossible-the-final-reckoning',
    description: 'Ethan Hunt and his IMF team face off against their most formidable adversary yet, an all-powerful rogue AI known as the Entity, culminating in a race across the globe to secure humanity’s survival.',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Thriller', 'Adventure'],
    language: 'English',
    duration: 165,
    releaseDate: new Date('2026-12-18'),
    cast: ['Tom Cruise', 'Hayley Atwell', 'Ving Rhames', 'Simon Pegg'],
    director: 'Christopher McQuarrie',
    certification: 'PG-13',
    rating: 8.6,
    votesCount: 88000,
    trailerUrl: 'https://www.youtube.com/watch?v=NOhDyHNwvbc',
    status: 'COMING_SOON',
    isFeatured: false,
  },

  // --- 15 NEW MOVIES (Bollywood, Hollywood, and South Indian Cinema) ---
  {
    title: '3 Idiots',
    slug: '3-idiots',
    description: 'Two friends embark on a quest for a lost college buddy who challenged their perspectives on education and life. Through college memories, they revisit Rancho, an eccentric free-thinker who changed their lives.',
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80',
    genres: ['Comedy', 'Drama'],
    language: 'Hindi',
    duration: 170,
    releaseDate: new Date('2009-12-25'),
    cast: ['Aamir Khan', 'R. Madhavan', 'Sharman Joshi', 'Kareena Kapoor', 'Boman Irani'],
    director: 'Rajkumar Hirani',
    certification: 'UA',
    rating: 8.4,
    votesCount: 430000,
    trailerUrl: 'https://www.youtube.com/watch?v=K0eDlFX9GMc',
    status: 'NOW_SHOWING',
    isFeatured: true,
  },
  {
    title: 'Dangal',
    slug: 'dangal',
    description: 'Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.',
    posterUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1920&q=80',
    genres: ['Biography', 'Drama', 'Action'],
    language: 'Hindi',
    duration: 161,
    releaseDate: new Date('2016-12-23'),
    cast: ['Aamir Khan', 'Fatima Sana Shaikh', 'Sanya Malhotra', 'Sakshi Tanwar'],
    director: 'Nitesh Tiwari',
    certification: 'U',
    rating: 8.3,
    votesCount: 215000,
    trailerUrl: 'https://www.youtube.com/watch?v=x_7YlGv9u1g',
    status: 'NOW_SHOWING',
    isFeatured: false,
  },
  {
    title: 'Zindagi Na Milegi Dobara',
    slug: 'zindagi-na-milegi-dobara',
    description: 'Three childhood friends reunite for an unforgettable bachelor road trip across Spain, confronting their deepest fears, past wounds, and rediscovering the thrill of truly living.',
    posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
    genres: ['Adventure', 'Comedy', 'Drama', 'Romance'],
    language: 'Hindi',
    duration: 155,
    releaseDate: new Date('2011-07-15'),
    cast: ['Hrithik Roshan', 'Farhan Akhtar', 'Abhay Deol', 'Katrina Kaif', 'Kalki Koechlin'],
    director: 'Zoya Akhtar',
    certification: 'UA',
    rating: 8.2,
    votesCount: 92000,
    trailerUrl: 'https://www.youtube.com/watch?v=FJrpcDgC3zU',
    status: 'NOW_SHOWING',
    isFeatured: false,
  },
  {
    title: 'Bajrangi Bhaijaan',
    slug: 'bajrangi-bhaijaan',
    description: 'A devout and kind-hearted Indian man undertakes a perilous journey across the border to reunite a mute young Pakistani girl with her family against all political and social odds.',
    posterUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Adventure', 'Comedy', 'Drama'],
    language: 'Hindi',
    duration: 163,
    releaseDate: new Date('2015-07-17'),
    cast: ['Salman Khan', 'Harshaali Malhotra', 'Kareena Kapoor', 'Nawazuddin Siddiqui'],
    director: 'Kabir Khan',
    certification: 'UA',
    rating: 8.1,
    votesCount: 110000,
    trailerUrl: 'https://www.youtube.com/watch?v=4nwAra0mz_Q',
    status: 'NOW_SHOWING',
    isFeatured: false,
  },
  {
    title: 'Chennai Express',
    slug: 'chennai-express',
    description: "A Mumbai man embarks on a journey to Rameswaram by train to immerse his late grandfather's ashes, but accidentally gets swept into the turbulent world of a runaway South Indian village head's daughter.",
    posterUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Comedy', 'Romance'],
    language: 'Hindi',
    duration: 141,
    releaseDate: new Date('2013-08-08'),
    cast: ['Shah Rukh Khan', 'Deepika Padukone', 'Nikitin Dheer', 'Sathyaraj'],
    director: 'Rohit Shetty',
    certification: 'UA',
    rating: 6.5,
    votesCount: 65000,
    trailerUrl: 'https://www.youtube.com/watch?v=hZGR4F_yFbg',
    status: 'NOW_SHOWING',
    isFeatured: false,
  },
  {
    title: 'Drishyam',
    slug: 'drishyam',
    description: 'When the son of a high-ranking police officer goes missing after harassing his daughter, a simple cable operator constructs an airtight, genius alibi using his knowledge of cinema to protect his beloved family.',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    genres: ['Crime', 'Drama', 'Mystery', 'Thriller'],
    language: 'Hindi',
    duration: 163,
    releaseDate: new Date('2015-07-31'),
    cast: ['Ajay Devgn', 'Tabu', 'Shriya Saran', 'Rajat Kapoor', 'Ishita Dutta'],
    director: 'Nishikant Kamat',
    certification: 'UA',
    rating: 8.2,
    votesCount: 95000,
    trailerUrl: 'https://www.youtube.com/watch?v=AuuX2j14NBg',
    status: 'NOW_SHOWING',
    isFeatured: false,
  },
  {
    title: 'RRR',
    slug: 'rrr',
    description: 'A fearless revolutionary and an officer in the British force develop an unbreakable brotherly bond before their true opposing identities are revealed, sparking an epic battle for freedom.',
    posterUrl: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Drama', 'Adventure'],
    language: 'Telugu',
    duration: 187,
    releaseDate: new Date('2022-03-25'),
    cast: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt', 'Ajay Devgn', 'Olivia Morris'],
    director: 'S.S. Rajamouli',
    certification: 'UA',
    rating: 8.7,
    votesCount: 180000,
    trailerUrl: 'https://www.youtube.com/watch?v=NgBoMJy3_6M',
    status: 'NOW_SHOWING',
    isFeatured: true,
  },
  {
    title: 'Baahubali 2: The Conclusion',
    slug: 'baahubali-2-the-conclusion',
    description: 'When Shiva, the son of Amarendra Baahubali, learns of his royal lineage and the cruel betrayal that took his father\'s life, he rises to overthrow the tyrannical ruler Bhallaladeva.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Drama', 'Adventure'],
    language: 'Telugu',
    duration: 167,
    releaseDate: new Date('2017-04-28'),
    cast: ['Prabhas', 'Rana Daggubati', 'Anushka Shetty', 'Sathyaraj', 'Ramya Krishnan'],
    director: 'S.S. Rajamouli',
    certification: 'UA',
    rating: 8.2,
    votesCount: 125000,
    trailerUrl: 'https://www.youtube.com/watch?v=qD-6d8Wo3do',
    status: 'NOW_SHOWING',
    isFeatured: false,
  },
  {
    title: 'Pushpa 2: The Rule',
    slug: 'pushpa-2-the-rule',
    description: 'The clash between Pushpa Raj and Bhanwar Singh Shekhawat escalates into a fierce all-out war as Pushpa solidifies his syndicate empire across international borders.',
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Crime', 'Drama', 'Thriller'],
    language: 'Telugu',
    duration: 175,
    releaseDate: new Date('2026-12-05'),
    cast: ['Allu Arjun', 'Rashmika Mandanna', 'Fahadh Faasil', 'Jagapathi Babu'],
    director: 'Sukumar',
    certification: 'UA',
    rating: 8.8,
    votesCount: 85000,
    trailerUrl: 'https://www.youtube.com/watch?v=g3JUbgOHgdw',
    status: 'COMING_SOON',
    isFeatured: true,
  },
  {
    title: 'KGF: Chapter 2',
    slug: 'kgf-chapter-2',
    description: 'In the blood-soaked Kolar Gold Fields, Rocky\'s undisputed reign faces mortal peril from lethal adversaries Adheera and Prime Minister Ramika Sen as the fight for total dominion peaks.',
    posterUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Crime', 'Drama'],
    language: 'Kannada',
    duration: 168,
    releaseDate: new Date('2022-04-14'),
    cast: ['Yash', 'Sanjay Dutt', 'Raveena Tandon', 'Srinidhi Shetty', 'Prakash Raj'],
    director: 'Prashanth Neel',
    certification: 'UA',
    rating: 8.3,
    votesCount: 165000,
    trailerUrl: 'https://www.youtube.com/watch?v=JKa05nyUmuQ',
    status: 'NOW_SHOWING',
    isFeatured: false,
  },
  {
    title: 'Avengers: Endgame',
    slug: 'avengers-endgame',
    description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\'s actions and restore balance to the universe.',
    posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Adventure', 'Sci-Fi', 'Drama'],
    language: 'English',
    duration: 181,
    releaseDate: new Date('2019-04-26'),
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth', 'Scarlett Johansson'],
    director: 'Anthony Russo, Joe Russo',
    certification: 'PG-13',
    rating: 8.4,
    votesCount: 1300000,
    trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    status: 'NOW_SHOWING',
    isFeatured: true,
  },
  {
    title: 'Inception',
    slug: 'inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the mission.',
    posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Adventure', 'Sci-Fi', 'Thriller'],
    language: 'English',
    duration: 148,
    releaseDate: new Date('2010-07-16'),
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy', 'Ken Watanabe'],
    director: 'Christopher Nolan',
    certification: 'PG-13',
    rating: 8.8,
    votesCount: 2500000,
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    status: 'NOW_SHOWING',
    isFeatured: false,
  },
  {
    title: 'The Dark Knight',
    slug: 'the-dark-knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Crime', 'Drama', 'Thriller'],
    language: 'English',
    duration: 152,
    releaseDate: new Date('2008-07-18'),
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine', 'Maggie Gyllenhaal'],
    director: 'Christopher Nolan',
    certification: 'PG-13',
    rating: 9.0,
    votesCount: 2900000,
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    status: 'NOW_SHOWING',
    isFeatured: true,
  },
  {
    title: 'Spider-Man: No Way Home',
    slug: 'spider-man-no-way-home',
    description: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    language: 'English',
    duration: 148,
    releaseDate: new Date('2021-12-17'),
    cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch', 'Jacob Batalon', 'Willem Dafoe'],
    director: 'Jon Watts',
    certification: 'PG-13',
    rating: 8.2,
    votesCount: 900000,
    trailerUrl: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
    status: 'NOW_SHOWING',
    isFeatured: false,
  },
  {
    title: 'Jawan',
    slug: 'jawan',
    description: 'A high-octane action thriller outlining the emotional journey of a man who is set to rectify the wrongs in society, driven by a personal vendetta while keeping a promise made years ago.',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    genres: ['Action', 'Thriller'],
    language: 'Hindi',
    duration: 169,
    releaseDate: new Date('2023-09-07'),
    cast: ['Shah Rukh Khan', 'Nayanthara', 'Vijay Sethupathi', 'Deepika Padukone', 'Sanya Malhotra'],
    director: 'Atlee',
    certification: 'UA',
    rating: 7.0,
    votesCount: 95000,
    trailerUrl: 'https://www.youtube.com/watch?v=COv52Qyctws',
    status: 'NOW_SHOWING',
    isFeatured: false,
  },
];

export const sampleTheatres = [
  {
    name: 'IMovies Grand Cinema',
    city: 'New York',
    address: '1540 Broadway, Times Square, New York, NY 10036',
    location: { lat: 40.7589, lng: -73.9851 },
    amenities: ['IMAX with Laser', 'Dolby Atmos', 'Luxury Recliners', 'Gourmet Bar', 'Reserved Seating'],
    screens: [
      {
        screenNumber: 1,
        name: 'Screen 1 - IMAX Laser',
        screenType: 'IMAX',
        totalRows: 8,
        seatsPerRow: 12,
        totalSeats: 96,
      },
      {
        screenNumber: 2,
        name: 'Screen 2 - Dolby Cinema',
        screenType: 'Dolby Cinema',
        totalRows: 8,
        seatsPerRow: 12,
        totalSeats: 96,
      },
    ],
  },
  {
    name: 'IMovies Starplex',
    city: 'Los Angeles',
    address: '6801 Hollywood Blvd, Los Angeles, CA 90028',
    location: { lat: 34.1016, lng: -118.3414 },
    amenities: ['4DX Motion', 'Dolby Atmos', 'In-Seat Dining', 'Valet Parking', 'Wheelchair Access'],
    screens: [
      {
        screenNumber: 1,
        name: 'Screen 1 - 4DX Immersion',
        screenType: '4DX',
        totalRows: 8,
        seatsPerRow: 12,
        totalSeats: 96,
      },
      {
        screenNumber: 2,
        name: 'Screen 2 - Premier Standard',
        screenType: 'Standard',
        totalRows: 8,
        seatsPerRow: 12,
        totalSeats: 96,
      },
    ],
  },
  {
    name: 'IMovies Metro Cineplex',
    city: 'Chicago',
    address: '600 E Grand Ave, Navy Pier, Chicago, IL 60611',
    location: { lat: 41.8917, lng: -87.6086 },
    amenities: ['IMAX 70mm', 'Dolby Surround', 'Arcade Lounge', 'Café & Bakery', 'Full Bar'],
    screens: [
      {
        screenNumber: 1,
        name: 'Screen 1 - IMAX Grand',
        screenType: 'IMAX',
        totalRows: 8,
        seatsPerRow: 12,
        totalSeats: 96,
      },
      {
        screenNumber: 2,
        name: 'Screen 2 - Classic Screen',
        screenType: 'Standard',
        totalRows: 8,
        seatsPerRow: 12,
        totalSeats: 96,
      },
    ],
  },
];

export const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('\n[Seed] Connecting to database...');
      await connectDB();
    }

    console.log('[Seed] Clearing existing demo collections...');
    await Promise.all([
      User.deleteMany({}),
      Movie.deleteMany({}),
      Theatre.deleteMany({}),
      Show.deleteMany({}),
      Booking.deleteMany({}),
    ]);

    // 1. Create Administrator and Demo Users
    console.log('[Seed] Creating Administrator and Customer accounts...');
    const admin = await User.create({
      name: 'Cinema Administrator',
      email: 'admin@imovies.com',
      password: 'Admin@123456',
      role: 'admin',
      phone: '+1 (555) 019-2834',
    });

    const demoUser = await User.create({
      name: 'Demo Customer',
      email: 'user@imovies.com',
      password: 'User@123456',
      role: 'user',
      phone: '+1 (555) 014-9988',
    });

    // 2. Insert Movies (All 22 Movies)
    console.log(`[Seed] Inserting ${sampleMovies.length} movies into catalog...`);
    const createdMovies = await Movie.insertMany(sampleMovies);

    // 3. Insert Theatres & Screens
    console.log('[Seed] Inserting cinema theatres and screens...');
    const createdTheatres = await Theatre.insertMany(sampleTheatres);

    // 4. Generate Shows across 5 days, covering all 22 movies
    console.log('[Seed] Scheduling shows across cinema screens ensuring every movie has shows...');
    // Five realistic showtime slots: Morning, Early Afternoon, Late Afternoon, Prime Evening, Late Night
    const showtimes = ['10:00', '13:15', '16:30', '19:45', '22:30'];
    const createdShows = [];

    const formatDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const now = new Date();
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      dates.push(formatDate(d));
    }

    // Distribute movies round-robin so every movie has upcoming shows
    let movieIndex = 0;

    for (const showDate of dates) {
      for (let theatreIdx = 0; theatreIdx < createdTheatres.length; theatreIdx++) {
        const theatre = createdTheatres[theatreIdx];

        for (let screenIdx = 0; screenIdx < theatre.screens.length; screenIdx++) {
          const screen = theatre.screens[screenIdx];

          for (const time of showtimes) {
            const movie = createdMovies[movieIndex % createdMovies.length];
            movieIndex++;

            const pricing = screen.screenType === 'IMAX'
              ? { standard: 16.0, premium: 20.0, vip: 26.0 }
              : screen.screenType === '4DX'
              ? { standard: 18.0, premium: 22.0, vip: 28.0 }
              : { standard: 12.0, premium: 16.0, vip: 22.0 };

            const seats = Show.generateSeats(screen.totalRows, screen.seatsPerRow, pricing);

            // Mark a few seats as pre-booked for realism
            if (seats.length > 10) {
              seats[2].status = 'BOOKED';
              seats[3].status = 'BOOKED';
              seats[14].status = 'BOOKED';
            }

            const show = await Show.create({
              movie: movie._id,
              theatre: theatre._id,
              screenId: screen._id,
              screenName: screen.name,
              screenType: screen.screenType,
              date: showDate,
              startTime: time,
              tierPricing: pricing,
              seats,
              status: 'ACTIVE',
            });

            createdShows.push(show);
          }
        }
      }
    }

    // 5. Create a sample confirmed booking for the demo user
    console.log('[Seed] Creating initial sample booking for demo user...');
    const firstShow = createdShows[0];
    const firstMovie = await Movie.findById(firstShow.movie);
    const firstTheatre = await Theatre.findById(firstShow.theatre);

    const bookedSeats = [
      { seatNumber: 'C7', row: 'C', column: 7, tier: 'premium', price: 16.0 },
      { seatNumber: 'C8', row: 'C', column: 8, tier: 'premium', price: 16.0 },
    ];

    for (const seat of firstShow.seats) {
      if (seat.seatNumber === 'C7' || seat.seatNumber === 'C8') {
        seat.status = 'BOOKED';
        seat.heldBy = demoUser._id;
      }
    }
    await firstShow.save();

    const subtotal = 32.0;
    const convenienceFee = 3.0;
    const tax = 2.56;
    const totalAmount = 37.56;

    const qrPayload = JSON.stringify({
      ref: 'IM-7382-9104',
      showId: firstShow._id,
      movie: firstMovie.title,
      date: firstShow.date,
      time: firstShow.startTime,
      seats: ['C7', 'C8'],
    });

    const qrCode = await QRCode.toDataURL(qrPayload);

    await Booking.create({
      bookingReference: 'IM-7382-9104',
      user: demoUser._id,
      show: firstShow._id,
      movie: {
        id: firstMovie._id,
        title: firstMovie.title,
        posterUrl: firstMovie.posterUrl,
        duration: firstMovie.duration,
        language: firstMovie.language,
      },
      theatre: {
        id: firstTheatre._id,
        name: firstTheatre.name,
        city: firstTheatre.city,
        screenName: firstShow.screenName,
        screenType: firstShow.screenType,
      },
      showDetails: {
        date: firstShow.date,
        startTime: firstShow.startTime,
        endTime: firstShow.endTime,
      },
      seats: bookedSeats,
      subtotal,
      convenienceFee,
      tax,
      discount: 0,
      totalAmount,
      bookingStatus: 'CONFIRMED',
      paymentStatus: 'SUCCESS',
      paymentMethod: 'Credit Card (Demo Mode)',
      qrCode,
    });

    console.log('\n======================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY');
    console.log('======================================================');
    console.log(`👤 Admin:      admin@imovies.com  / Admin@123456`);
    console.log(`👤 Customer:   user@imovies.com   / User@123456`);
    console.log(`🎬 Movies:     ${createdMovies.length} records in catalog`);
    console.log(`🏛️  Theatres:   ${createdTheatres.length} cinema complexes`);
    console.log(`🎟️  Shows:      ${createdShows.length} scheduled screenings`);
    console.log('======================================================\n');
  } catch (error) {
    console.error(`[Seed] Error seeding database: ${error.message}`);
    throw error;
  }
};

// Execute if run directly from CLI
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async (err) => {
      await disconnectDB();
      process.exit(1);
    });
}
