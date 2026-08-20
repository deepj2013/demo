/* The BookSpot — Demo Mock Data */
window.BOOKSPOT = {
    brand: {
    name: 'The BookSpot',
    tagline: 'New & Used Books in English — Maadi, Cairo',
    email: 'bookspotonline@gmail.com',
    phone: '02-2378-1006',
    address: '70 Road 9 (First Floor), Maadi, Cairo, Egypt',
    website: 'https://www.bookspotonline.com/',
    shopUrl: 'https://www.bookspotonline.com/middle.php?file=home',
    poweredBy: { name: 'Savoka', url: 'https://savoka.in' },
    founded: 2004,
    authors: 847,
    titles: 1240,
    countries: 12,
    whatsappSubscribers: 28400,
    socialFollowers: 45600,
    currency: 'LE',
    about: 'The Bookspot opened on September 7, 2004 in Maadi, Cairo. Started by Sigrun (Iceland) and Mandy (United States), it offers a large selection of new and used English books, with delivery anywhere in Egypt. Books are imported from the UK and US; any in-print title can be special-ordered.'
  },

  books: [
  { id: 1, title: "Starside (Deluxe Edition)", author: "Alex Aster", authorId: 1, genre: "Fantasy", price: 1950, mrp: 2240, format: ['Paperback'], isbn: '978-BOOKSPOT-0001', cover: "⚔️", rating: 4.4, reviews: 57, stock: 23, status: 'published', pages: 208, language: 'English', published: '2025-02-15', synopsis: "Enter the enchanting and deadly world of Starside, where swords have magic and power isn't inherited — it's claimed.", sales: { website: 120, amazon: 230, flipkart: 60, kindle: 35 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 2, title: "The Yellow Wallpaper and Other Stories", author: "Charlotte Perkins Gilman", authorId: 2, genre: "Classics", price: 500, mrp: 570, format: ['Paperback'], isbn: '978-BOOKSPOT-0002', cover: "📜", rating: 4.5, reviews: 64, stock: 26, status: 'published', pages: 216, language: 'English', published: '2025-03-15', synopsis: "A landmark collection of 19th-century stories including the iconic Yellow Wallpaper.", sales: { website: 140, amazon: 260, flipkart: 70, kindle: 40 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 3, title: "The Book of Disquiet", author: "Fernando Pessoa", authorId: 3, genre: "Classics", price: 990, mrp: 1130, format: ['Paperback'], isbn: '978-BOOKSPOT-0003', cover: "📖", rating: 4.6, reviews: 71, stock: 29, status: 'published', pages: 224, language: 'English', published: '2025-04-15', synopsis: "Penguin Modern Classics edition of Pessoa's fragmentary masterpiece.", sales: { website: 160, amazon: 290, flipkart: 80, kindle: 45 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 4, title: "In Her Own League", author: "Liz Tomforde", authorId: 4, genre: "Romance", price: 780, mrp: 890, format: ['Paperback'], isbn: '978-BOOKSPOT-0004', cover: "🏀", rating: 4.7, reviews: 78, stock: 32, status: 'published', pages: 232, language: 'English', published: '2025-05-15', synopsis: "The new sports romance from Liz Tomforde.", sales: { website: 180, amazon: 320, flipkart: 90, kindle: 50 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 5, title: "The Vanishing Cherry Blossom Bookshop (Deluxe)", author: "Takuya Asakura", authorId: 5, genre: "Literary", price: 1500, mrp: 1720, format: ['Paperback'], isbn: '978-BOOKSPOT-0005', cover: "🌸", rating: 4.8, reviews: 85, stock: 35, status: 'published', pages: 240, language: 'English', published: '2025-06-15', synopsis: "Deluxe edition of the beloved Japanese bookshop story.", sales: { website: 200, amazon: 350, flipkart: 100, kindle: 55 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 6, title: "Uncharmed: A Cozy Fall Fantasy", author: "Lucy Jane Wood", authorId: 6, genre: "Fantasy", price: 780, mrp: 890, format: ['Paperback'], isbn: '978-BOOKSPOT-0006', cover: "🍂", rating: 4.3, reviews: 92, stock: 38, status: 'published', pages: 248, language: 'English', published: '2025-07-15', synopsis: "A cozy fall fantasy perfect for autumn reading.", sales: { website: 220, amazon: 380, flipkart: 110, kindle: 60 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 7, title: "Secrets of Blackthorn Hall", author: "Cassandra Clare", authorId: 7, genre: "Fantasy", price: 1700, mrp: 1950, format: ['Paperback'], isbn: '978-BOOKSPOT-0007', cover: "🏰", rating: 4.4, reviews: 99, stock: 41, status: 'published', pages: 256, language: 'English', published: '2025-08-15', synopsis: "Return to the Shadowhunter world with Cassandra Clare.", sales: { website: 240, amazon: 410, flipkart: 120, kindle: 65 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 8, title: "White Nights", author: "Fyodor Dostoyevsky", authorId: 8, genre: "Classics", price: 350, mrp: 400, format: ['Paperback'], isbn: '978-BOOKSPOT-0008', cover: "🌙", rating: 4.5, reviews: 106, stock: 44, status: 'published', pages: 264, language: 'English', published: '2025-09-15', synopsis: "Penguin Little Black Classics edition of Dostoyevsky's romantic tale.", sales: { website: 260, amazon: 440, flipkart: 130, kindle: 70 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 9, title: "The Ocean Would Paint Me Blue", author: "Zoulfa Katouh", authorId: 1, genre: "Literary", price: 880, mrp: 1010, format: ['Paperback'], isbn: '978-BOOKSPOT-0009', cover: "🌊", rating: 4.6, reviews: 113, stock: 47, status: 'published', pages: 272, language: 'English', published: '2025-01-15', synopsis: "A powerful story from the author of As Long As the Lemon Trees Grow.", sales: { website: 280, amazon: 470, flipkart: 140, kindle: 75 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 10, title: "Two Kinds of Stranger", author: "Steve Cavanagh", authorId: 2, genre: "Mystery", price: 780, mrp: 890, format: ['Paperback'], isbn: '978-BOOKSPOT-0010', cover: "🔍", rating: 4.7, reviews: 120, stock: 50, status: 'published', pages: 280, language: 'English', published: '2025-02-15', synopsis: "A gripping thriller from bestselling author Steve Cavanagh.", sales: { website: 300, amazon: 500, flipkart: 150, kindle: 80 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 11, title: "Amal Unbound", author: "Aisha Saeed", authorId: 3, genre: "Young Adult", price: 680, mrp: 780, format: ['Paperback'], isbn: '978-BOOKSPOT-0011', cover: "✨", rating: 4.8, reviews: 127, stock: 53, status: 'published', pages: 288, language: 'English', published: '2025-03-15', synopsis: "A powerful YA novel about a Pakistani girl's fight for education.", sales: { website: 320, amazon: 530, flipkart: 160, kindle: 85 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 12, title: "Daughter of Crows", author: "Mark Lawrence", authorId: 4, genre: "Fantasy", price: 1550, mrp: 1780, format: ['Paperback'], isbn: '978-BOOKSPOT-0012', cover: "🐦", rating: 4.3, reviews: 134, stock: 56, status: 'published', pages: 296, language: 'English', published: '2025-04-15', synopsis: "Dark fantasy from the acclaimed author Mark Lawrence.", sales: { website: 340, amazon: 560, flipkart: 170, kindle: 90 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 13, title: "Project Hail Mary (Movie Tie-in)", author: "Andy Weir", authorId: 5, genre: "Sci-fi", price: 780, mrp: 890, format: ['Paperback'], isbn: '978-BOOKSPOT-0013', cover: "🚀", rating: 4.4, reviews: 141, stock: 59, status: 'published', pages: 304, language: 'English', published: '2025-05-15', synopsis: "The bestselling sci-fi sensation — now a major motion picture tie-in.", sales: { website: 360, amazon: 590, flipkart: 180, kindle: 95 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 14, title: "We Have Always Lived in the Castle", author: "Shirley Jackson", authorId: 6, genre: "Literary", price: 780, mrp: 890, format: ['Paperback'], isbn: '978-BOOKSPOT-0014', cover: "🏚️", rating: 4.5, reviews: 148, stock: 62, status: 'published', pages: 312, language: 'English', published: '2025-06-15', synopsis: "Shirley Jackson's gothic classic of isolation and family secrets.", sales: { website: 380, amazon: 620, flipkart: 190, kindle: 100 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 15, title: "This Kingdom Will Not Kill Me", author: "Ilona Andrews", authorId: 7, genre: "Fantasy", price: 1800, mrp: 2070, format: ['Paperback'], isbn: '978-BOOKSPOT-0015', cover: "👑", rating: 4.6, reviews: 155, stock: 65, status: 'published', pages: 320, language: 'English', published: '2025-07-15', synopsis: "New fantasy adventure from Ilona Andrews.", sales: { website: 400, amazon: 650, flipkart: 200, kindle: 105 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 16, title: "Release Me (Deluxe Edition)", author: "Tahereh Mafi", authorId: 8, genre: "Romance", price: 1350, mrp: 1550, format: ['Paperback'], isbn: '978-BOOKSPOT-0016', cover: "💔", rating: 4.7, reviews: 162, stock: 68, status: 'published', pages: 328, language: 'English', published: '2025-08-15', synopsis: "Deluxe edition of Tahereh Mafi's romantic fantasy.", sales: { website: 420, amazon: 680, flipkart: 210, kindle: 110 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 17, title: "The Wisdom of Psychopaths", author: "Kevin Dutton", authorId: 1, genre: "Non-Fiction", price: 880, mrp: 1010, format: ['Paperback'], isbn: '978-BOOKSPOT-0017', cover: "🧠", rating: 4.8, reviews: 169, stock: 71, status: 'published', pages: 336, language: 'English', published: '2025-09-15', synopsis: "What psychopaths can teach us about success and sanity.", sales: { website: 440, amazon: 710, flipkart: 220, kindle: 115 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 18, title: "The Outsiders", author: "S. E. Hinton", authorId: 2, genre: "Young Adult", price: 780, mrp: 890, format: ['Paperback'], isbn: '978-BOOKSPOT-0018', cover: "⚡", rating: 4.3, reviews: 176, stock: 74, status: 'published', pages: 344, language: 'English', published: '2025-01-15', synopsis: "The timeless coming-of-age classic.", sales: { website: 460, amazon: 740, flipkart: 230, kindle: 120 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 19, title: "Bluey: Hide and Seek", author: "Bluey", authorId: 3, genre: "Children", price: 620, mrp: 710, format: ['Paperback'], isbn: '978-BOOKSPOT-0019', cover: "🐶", rating: 4.4, reviews: 183, stock: 77, status: 'published', pages: 352, language: 'English', published: '2025-02-15', synopsis: "Fun Bluey picture book for young readers.", sales: { website: 480, amazon: 770, flipkart: 240, kindle: 125 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 20, title: "Diary of a Young Doctor", author: "Dr Ezzideen Shehab", authorId: 4, genre: "Non-Fiction", price: 880, mrp: 1010, format: ['Paperback'], isbn: '978-BOOKSPOT-0020', cover: "🏥", rating: 4.5, reviews: 190, stock: 80, status: 'published', pages: 360, language: 'English', published: '2025-03-15', synopsis: "Notes from the Genocide in Gaza — a powerful firsthand account.", sales: { website: 500, amazon: 800, flipkart: 250, kindle: 130 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 21, title: "Omar Rising", author: "Aisha Saeed", authorId: 5, genre: "Young Adult", price: 680, mrp: 780, format: ['Paperback'], isbn: '978-BOOKSPOT-0021', cover: "🎓", rating: 4.6, reviews: 197, stock: 83, status: 'published', pages: 368, language: 'English', published: '2025-04-15', synopsis: "Aisha Saeed's inspiring story of a scholarship student in Pakistan.", sales: { website: 520, amazon: 830, flipkart: 260, kindle: 135 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 22, title: "Heart the Lover", author: "Lily King", authorId: 6, genre: "Literary", price: 880, mrp: 1010, format: ['Paperback'], isbn: '978-BOOKSPOT-0022', cover: "❤️", rating: 4.7, reviews: 204, stock: 86, status: 'published', pages: 376, language: 'English', published: '2025-05-15', synopsis: "A moving novel from the acclaimed author Lily King.", sales: { website: 540, amazon: 860, flipkart: 270, kindle: 140 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 23, title: "First-Time Caller", author: "B.K. Borison", authorId: 7, genre: "Romance", price: 780, mrp: 890, format: ['Paperback'], isbn: '978-BOOKSPOT-0023', cover: "📞", rating: 4.8, reviews: 211, stock: 89, status: 'published', pages: 384, language: 'English', published: '2025-06-15', synopsis: "A charming romance from B.K. Borison.", sales: { website: 560, amazon: 890, flipkart: 280, kindle: 145 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 24, title: "The Impossible Fortune", author: "Richard Osman", authorId: 8, genre: "Mystery", price: 780, mrp: 890, format: ['Paperback'], isbn: '978-BOOKSPOT-0024', cover: "🕵️", rating: 4.3, reviews: 218, stock: 92, status: 'published', pages: 392, language: 'English', published: '2025-07-15', synopsis: "A Thursday Murder Club mystery from Richard Osman.", sales: { website: 580, amazon: 920, flipkart: 290, kindle: 150 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 25, title: "Dungeon Crawler Carl", author: "Matt Dinniman", authorId: 1, genre: "Fantasy", price: 1700, mrp: 1950, format: ['Paperback'], isbn: '978-BOOKSPOT-0025', cover: "🎮", rating: 4.4, reviews: 225, stock: 95, status: 'published', pages: 400, language: 'English', published: '2025-08-15', synopsis: "The viral LitRPG phenomenon.", sales: { website: 600, amazon: 950, flipkart: 300, kindle: 155 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 26, title: "Before the Coffee Gets Cold", author: "Toshikazu Kawaguchi", authorId: 2, genre: "Literary", price: 780, mrp: 890, format: ['Paperback'], isbn: '978-BOOKSPOT-0026', cover: "☕", rating: 4.5, reviews: 232, stock: 98, status: 'published', pages: 408, language: 'English', published: '2025-09-15', synopsis: "The international bestseller about a café that lets you travel in time.", sales: { website: 620, amazon: 980, flipkart: 310, kindle: 160 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 27, title: "I'm Glad My Mom Died", author: "Jennette McCurdy", authorId: 3, genre: "Non-Fiction", price: 990, mrp: 1130, format: ['Paperback'], isbn: '978-BOOKSPOT-0027', cover: "🎤", rating: 4.6, reviews: 239, stock: 101, status: 'published', pages: 416, language: 'English', published: '2025-01-15', synopsis: "The #1 bestselling memoir.", sales: { website: 640, amazon: 1010, flipkart: 320, kindle: 165 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 28, title: "Anxious People", author: "Fredrik Backman", authorId: 4, genre: "Literary", price: 880, mrp: 1010, format: ['Paperback'], isbn: '978-BOOKSPOT-0028', cover: "😅", rating: 4.7, reviews: 246, stock: 104, status: 'published', pages: 424, language: 'English', published: '2025-02-15', synopsis: "A witty, heartwarming novel from the author of A Man Called Ove.", sales: { website: 660, amazon: 1040, flipkart: 330, kindle: 170 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 29, title: "Cairo Gambit", author: "S.W. Perry", authorId: 5, genre: "Mystery", price: 880, mrp: 1010, format: ['Paperback'], isbn: '978-BOOKSPOT-0029', cover: "🕌", rating: 4.8, reviews: 253, stock: 107, status: 'published', pages: 432, language: 'English', published: '2025-03-15', synopsis: "A thriller set in Cairo.", sales: { website: 680, amazon: 1070, flipkart: 340, kindle: 175 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 30, title: "The Prophet", author: "Kahlil Gibran", authorId: 6, genre: "Classics", price: 500, mrp: 570, format: ['Paperback'], isbn: '978-BOOKSPOT-0030', cover: "🕊️", rating: 4.3, reviews: 260, stock: 110, status: 'published', pages: 440, language: 'English', published: '2025-04-15', synopsis: "The timeless spiritual classic.", sales: { website: 700, amazon: 1100, flipkart: 350, kindle: 180 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 31, title: "Harry Potter and the Chamber of Secrets", author: "J.K. Rowling", authorId: 7, genre: "Young Adult", price: 680, mrp: 780, format: ['Paperback'], isbn: '978-BOOKSPOT-0031', cover: "⚡", rating: 4.4, reviews: 267, stock: 113, status: 'published', pages: 448, language: 'English', published: '2025-05-15', synopsis: "Book 2 of the Harry Potter series.", sales: { website: 720, amazon: 1130, flipkart: 360, kindle: 185 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 32, title: "As Long As the Lemon Trees Grow", author: "Zoulfa Katouh", authorId: 8, genre: "Young Adult", price: 780, mrp: 890, format: ['Paperback'], isbn: '978-BOOKSPOT-0032', cover: "🍋", rating: 4.5, reviews: 274, stock: 116, status: 'published', pages: 456, language: 'English', published: '2025-06-15', synopsis: "A Syrian love story of hope and resistance.", sales: { website: 740, amazon: 1160, flipkart: 370, kindle: 190 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 33, title: "Orientalism", author: "Edward W. Said", authorId: 1, genre: "Non-Fiction", price: 1050, mrp: 1200, format: ['Paperback'], isbn: '978-BOOKSPOT-0033', cover: "🌍", rating: 4.6, reviews: 281, stock: 119, status: 'published', pages: 464, language: 'English', published: '2025-07-15', synopsis: "The foundational postcolonial studies classic.", sales: { website: 760, amazon: 1190, flipkart: 380, kindle: 195 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 34, title: "The Martian (Deluxe Edition)", author: "Andy Weir", authorId: 2, genre: "Sci-fi", price: 2300, mrp: 2640, format: ['Paperback'], isbn: '978-BOOKSPOT-0034', cover: "🪐", rating: 4.7, reviews: 288, stock: 122, status: 'published', pages: 472, language: 'English', published: '2025-08-15', synopsis: "Deluxe edition of the bestselling survival epic.", sales: { website: 780, amazon: 1220, flipkart: 390, kindle: 200 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 35, title: "Nineteen Eighty-Four (Collector's Edition)", author: "George Orwell", authorId: 3, genre: "Classics", price: 990, mrp: 1130, format: ['Paperback'], isbn: '978-BOOKSPOT-0035', cover: "👁️", rating: 4.8, reviews: 295, stock: 125, status: 'published', pages: 480, language: 'English', published: '2025-09-15', synopsis: "Wordsworth Collector's Edition of Orwell's dystopian masterpiece.", sales: { website: 800, amazon: 1250, flipkart: 400, kindle: 205 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' },
  { id: 36, title: "Caraval", author: "Stephanie Garber", authorId: 4, genre: "Fantasy", price: 780, mrp: 890, format: ['Paperback'], isbn: '978-BOOKSPOT-0036', cover: "🎪", rating: 4.3, reviews: 302, stock: 128, status: 'published', pages: 488, language: 'English', published: '2025-01-15', synopsis: "Enter the magical competition of Caraval.", sales: { website: 820, amazon: 1280, flipkart: 410, kindle: 210 }, sourceUrl: 'https://www.bookspotonline.com/middle.php?file=home' }
  ],

  authors: [
    { id: 1, name: 'Ananya Sharma', email: 'ananya@email.com', phone: '+91 98123 45678', city: 'Delhi', joined: '2023-04-12', books: 2, status: 'active', royalty: 12, avatar: 'AS', bio: 'Award-winning novelist. Sahitya Akademi nominee 2024.', totalSales: 6890, pendingPayout: 28400 },
    { id: 2, name: 'Rahul Mehta', email: 'rahul.m@email.com', phone: '+91 98234 56789', city: 'Bengaluru', joined: '2023-08-20', books: 1, status: 'active', royalty: 10, avatar: 'RM', bio: 'Former tech lead turned thriller writer.', totalSales: 8390, pendingPayout: 35200 },
    { id: 3, name: 'Priya Nair', email: 'priya.nair@email.com', phone: '+91 98345 67890', city: 'Kochi', joined: '2022-11-05', books: 2, status: 'active', royalty: 12, avatar: 'PN', bio: 'Historical fiction specialist. Kerala Sahitya Award 2023.', totalSales: 11240, pendingPayout: 52100 },
    { id: 4, name: 'Vikram Joshi', email: 'vikram@email.com', phone: '+91 98456 78901', city: 'Indore', joined: '2024-06-15', books: 1, status: 'active', royalty: 10, avatar: 'VJ', bio: 'Entrepreneur and humorist.', totalSales: 3430, pendingPayout: 12800 },
    { id: 5, name: 'Meera Iyer', email: 'meera@email.com', phone: '+91 98567 89012', city: 'Chennai', joined: '2024-02-28', books: 1, status: 'active', royalty: 11, avatar: 'MI', bio: 'Physicist and poet. IIT Madras faculty.', totalSales: 2000, pendingPayout: 8900 },
    { id: 6, name: 'Arjun Singh', email: 'arjun@email.com', phone: '+91 98678 90123', city: 'Srinagar', joined: '2023-01-10', books: 1, status: 'active', royalty: 13, avatar: 'ASi', bio: 'Journalist and memoirist.', totalSales: 13770, pendingPayout: 67800 },
    { id: 7, name: 'Kavita Desai', email: 'kavita@email.com', phone: '+91 98789 01234', city: 'Ahmedabad', joined: '2025-09-01', books: 0, status: 'pending', royalty: 10, avatar: 'KD', bio: 'Debut author — children\'s fiction.', totalSales: 0, pendingPayout: 0 },
    { id: 8, name: 'Sanjay Verma', email: 'sanjay@email.com', phone: '+91 98890 12345', city: 'Jaipur', joined: '2025-10-15', books: 0, status: 'review', royalty: 10, avatar: 'SV', bio: 'Rajasthani folklore researcher.', totalSales: 0, pendingPayout: 0 }
  ],

  manuscripts: [
    { id: 101, title: 'The Last Train to Shimla', authorId: 7, author: 'Kavita Desai', genre: 'Historical Fiction', submitted: '2025-10-28', status: 'submitted', pages: 340, format: 'docx', stage: 'Initial Review' },
    { id: 102, title: 'Rajasthani Folktales Retold', authorId: 8, author: 'Sanjay Verma', genre: 'Folklore', submitted: '2025-11-02', status: 'review', pages: 280, format: 'pdf', stage: 'Editorial Review' },
    { id: 103, title: 'AI for Indian Farmers', authorId: 2, author: 'Rahul Mehta', genre: 'Non-Fiction', submitted: '2025-11-10', status: 'editing', pages: 220, format: 'docx', stage: 'Copy Editing' },
    { id: 104, title: 'Echoes of Partition', authorId: 6, author: 'Arjun Singh', genre: 'Memoir', submitted: '2025-09-15', status: 'design', pages: 380, format: 'pdf', stage: 'Cover Design' },
    { id: 105, title: 'Cookbook of the Coast', authorId: 3, author: 'Priya Nair', genre: 'Cookbook', submitted: '2025-08-20', status: 'isbn', pages: 200, format: 'pdf', stage: 'ISBN Registration' }
  ],

  isbnRequests: [
    { id: 'ISBN-001', bookTitle: 'Cookbook of the Coast', author: 'Priya Nair', submitted: '2025-11-01', status: 'processing', agency: 'Raja Rammohun Roy National Agency', expectedDate: '2025-12-15' },
    { id: 'ISBN-002', bookTitle: 'Echoes of Partition', author: 'Arjun Singh', submitted: '2025-10-20', status: 'approved', agency: 'Raja Rammohun Roy National Agency', expectedDate: '2025-11-28', isbn: '978-93-87654-109-8' },
    { id: 'ISBN-003', bookTitle: 'Monsoon Letters (Reprint)', author: 'Priya Nair', submitted: '2025-09-10', status: 'completed', agency: 'Raja Rammohun Roy National Agency', isbn: '978-93-87654-108-1' }
  ],

  orders: [
    { id: 'ORD-7841', date: '2025-11-19', customer: 'Rohit Kapoor', email: 'rohit@email.com', channel: 'website', items: [{ bookId: 1, title: 'The Midnight Library of Delhi', qty: 2, price: 399 }, { bookId: 5, title: 'Whispers in Varanasi', qty: 1, price: 379 }], total: 1177, status: 'shipped', tracking: 'DL78349201', authorIds: [1] },
    { id: 'ORD-7840', date: '2025-11-19', customer: 'Amazon FBA', email: 'auto@amazon.in', channel: 'amazon', items: [{ bookId: 2, title: 'Code & Karma', qty: 15, price: 349 }], total: 5235, status: 'delivered', tracking: 'AMZ-928374', authorIds: [2] },
    { id: 'ORD-7839', date: '2025-11-18', customer: 'Flipkart Customer', email: 'fk@flipkart.com', channel: 'flipkart', items: [{ bookId: 3, title: 'Spices of Malabar', qty: 3, price: 429 }, { bookId: 7, title: 'Borders of Belonging', qty: 1, price: 499 }], total: 1786, status: 'processing', tracking: null, authorIds: [3, 6] },
    { id: 'ORD-7838', date: '2025-11-18', customer: 'Sneha Reddy', email: 'sneha@email.com', channel: 'website', items: [{ bookId: 7, title: 'Borders of Belonging', qty: 1, price: 499 }], total: 499, status: 'delivered', tracking: 'DL78349198', authorIds: [6] },
    { id: 'ORD-7837', date: '2025-11-17', customer: 'Amazon FBA', email: 'auto@amazon.in', channel: 'amazon', items: [{ bookId: 1, title: 'The Midnight Library of Delhi', qty: 8, price: 399 }, { bookId: 3, title: 'Spices of Malabar', qty: 5, price: 429 }], total: 5337, status: 'delivered', tracking: 'AMZ-928371', authorIds: [1, 3] },
    { id: 'ORD-7836', date: '2025-11-17', customer: 'Amit Patel', email: 'amit@email.com', channel: 'website', items: [{ bookId: 4, title: 'Startup Samosa', qty: 1, price: 299 }, { bookId: 6, title: 'The Quantum Poet', qty: 1, price: 459 }], total: 758, status: 'pending', tracking: null, authorIds: [4, 5] },
    { id: 'ORD-7835', date: '2025-11-16', customer: 'Flipkart Customer', email: 'fk@flipkart.com', channel: 'flipkart', items: [{ bookId: 2, title: 'Code & Karma', qty: 2, price: 349 }], total: 698, status: 'delivered', tracking: 'FK-482910', authorIds: [2] },
    { id: 'ORD-7834', date: '2025-11-16', customer: 'Kindle Direct', email: 'kdp@amazon.com', channel: 'kindle', items: [{ bookId: 2, title: 'Code & Karma (eBook)', qty: 45, price: 199 }], total: 8955, status: 'delivered', tracking: null, authorIds: [2] }
  ],

  integrations: [
    { id: 'amazon', name: 'Amazon India', icon: '🛒', status: 'connected', lastSync: '2025-11-19 09:15', ordersToday: 23, revenue: 89400, apiKey: '****-AMZ-7823' },
    { id: 'flipkart', name: 'Flipkart', icon: '🛍️', status: 'connected', lastSync: '2025-11-19 09:12', ordersToday: 14, revenue: 45200, apiKey: '****-FK-9102' },
    { id: 'kindle', name: 'Kindle Direct Publishing', icon: '📱', status: 'connected', lastSync: '2025-11-19 08:45', ordersToday: 67, revenue: 23400, apiKey: '****-KDP-4456' },
    { id: 'google', name: 'Google Play Books', icon: '📖', status: 'connected', lastSync: '2025-11-18 22:00', ordersToday: 8, revenue: 5600, apiKey: '****-GPB-7789' },
    { id: 'whatsapp', name: 'WhatsApp Business API', icon: '💬', status: 'connected', lastSync: '2025-11-19 10:30', ordersToday: 0, revenue: 0, apiKey: '****-WA-5567' },
    { id: 'meta', name: 'Meta Business Suite', icon: '📱', status: 'connected', lastSync: '2025-11-19 09:00', ordersToday: 0, revenue: 0, apiKey: '****-META-8890' },
    { id: 'instamojo', name: 'Instamojo Payments', icon: '💳', status: 'connected', lastSync: '2025-11-19 10:00', ordersToday: 5, revenue: 4200, apiKey: '****-IM-3344' },
    { id: 'shiprocket', name: 'Shiprocket', icon: '🚚', status: 'connected', lastSync: '2025-11-19 09:30', ordersToday: 12, revenue: 0, apiKey: '****-SR-1122' },
    { id: 'meesho', name: 'Meesho', icon: '🏪', status: 'available', lastSync: null, ordersToday: 0, revenue: 0, apiKey: null }
  ],

  whatsappCampaigns: [
    { id: 'WA-001', name: 'Diwali Book Sale 2025', type: 'promotion', audience: 'All Readers', contacts: 18400, sent: 18400, delivered: 17892, read: 12450, clicks: 3420, orders: 287, status: 'completed', date: '2025-11-01' },
    { id: 'WA-002', name: 'New Launch: Whispers in Varanasi', type: 'book_launch', audience: 'Fiction Lovers', contacts: 8200, sent: 8200, delivered: 8012, read: 5890, clicks: 1890, orders: 156, status: 'completed', date: '2025-08-10' },
    { id: 'WA-003', name: 'Become an Author — Open Call', type: 'author_acquisition', audience: 'Aspiring Writers', contacts: 5600, sent: 5600, delivered: 5480, read: 3200, clicks: 890, orders: 0, signups: 47, status: 'completed', date: '2025-10-15' },
    { id: 'WA-004', name: 'Weekend Flash Sale — 30% Off', type: 'promotion', audience: 'Past Buyers', contacts: 9200, sent: 0, delivered: 0, read: 0, clicks: 0, orders: 0, status: 'scheduled', date: '2025-11-22' },
    { id: 'WA-005', name: 'Book Club: Spices of Malabar Discussion', type: 'engagement', audience: 'Book Club Members', contacts: 1200, sent: 0, delivered: 0, read: 0, clicks: 0, orders: 0, status: 'draft', date: '2025-11-25' }
  ],

  whatsappLists: [
    { id: 1, name: 'All Readers & Buyers', count: 18400, desc: 'Website buyers + bookstore subscribers' },
    { id: 2, name: 'Aspiring Authors', count: 5600, desc: 'Signed up via Publish With Us form' },
    { id: 3, name: 'Book Club Members', count: 1200, desc: 'Monthly reading group participants' },
    { id: 4, name: 'Fiction Lovers', count: 8200, desc: 'Tagged by genre preference' },
    { id: 5, name: 'Past 90-Day Buyers', count: 9200, desc: 'Recent purchasers for retargeting' }
  ],

  whatsappTemplates: [
    { id: 'T1', name: 'New Book Launch', preview: 'Hi {{name}}! 📚 New release alert: "{{book_title}}" by {{author}} is now available. Get 20% off today → {{link}}' },
    { id: 'T2', name: 'Flash Sale', preview: '🔥 Weekend Flash Sale! 30% off on all Bookspot titles. Use code BOOKSPOT30. Shop now → {{link}}' },
    { id: 'T3', name: 'Author Open Call', preview: '✍️ Want to publish your book? The BookSpot is accepting manuscripts. Register free → {{link}}' },
    { id: 'T4', name: 'Order Shipped', preview: 'Your order {{order_id}} has been shipped! Track: {{tracking_link}}. Happy reading! 📖' }
  ],

  socialPosts: [
    { id: 'SP-001', platform: 'instagram', type: 'carousel', book: 'Spices of Malabar', caption: 'A saga spanning 170 years of Kerala\'s spice coast 🌶️', scheduled: '2025-11-20 18:00', status: 'scheduled', likes: 0, reach: 0 },
    { id: 'SP-002', platform: 'facebook', type: 'video', book: 'Code & Karma', caption: 'Tech thriller meets Indian startup culture. Watch the book trailer →', scheduled: '2025-11-19 12:00', status: 'published', likes: 342, reach: 8900 },
    { id: 'SP-003', platform: 'linkedin', type: 'article', book: null, caption: 'How independent publishing is changing India\'s literary landscape', scheduled: '2025-11-18 09:00', status: 'published', likes: 128, reach: 4200 },
    { id: 'SP-004', platform: 'instagram', type: 'reel', book: 'Whispers in Varanasi', caption: 'POV: You\'re reading on the ghats at sunset 🕉️', scheduled: '2025-11-21 19:30', status: 'scheduled', likes: 0, reach: 0 },
    { id: 'SP-005', platform: 'twitter', type: 'thread', book: 'Borders of Belonging', caption: '5 reasons this memoir is the most important book of 2025 🧵', scheduled: '2025-11-19 20:00', status: 'published', likes: 89, reach: 3400 }
  ],

  socialStats: {
    instagram: { followers: 18200, engagement: 4.2, postsMonth: 24 },
    facebook: { followers: 12400, engagement: 2.8, postsMonth: 18 },
    linkedin: { followers: 8900, engagement: 3.1, postsMonth: 12 },
    twitter: { followers: 6100, engagement: 1.9, postsMonth: 30 }
  },

  businessSOPs: [
    {
      id: 'SOP-01', title: 'Author Onboarding', owner: 'Operations Manager', sla: '48 hours',
      steps: [
        { step: 1, task: 'Receive application via portal', auto: true, role: 'System' },
        { step: 2, task: 'Send welcome email + portal credentials', auto: true, role: 'System' },
        { step: 3, task: 'Profile & KYC verification', auto: false, role: 'Ops Team' },
        { step: 4, task: 'Assign relationship manager', auto: true, role: 'System' },
        { step: 5, task: 'Schedule intro call with author', auto: false, role: 'Editorial Head' }
      ]
    },
    {
      id: 'SOP-02', title: 'Manuscript to Publication', owner: 'Editorial Head', sla: '60–90 days',
      steps: [
        { step: 1, task: 'Initial manuscript review (14 days)', auto: false, role: 'Editor' },
        { step: 2, task: 'Send acceptance/revision letter', auto: true, role: 'System' },
        { step: 3, task: 'Developmental editing', auto: false, role: 'Editor' },
        { step: 4, task: 'Copy editing & proofreading', auto: false, role: 'Copy Editor' },
        { step: 5, task: 'Cover design (3 concepts)', auto: false, role: 'Designer' },
        { step: 6, task: 'ISBN application via RRRLF', auto: true, role: 'System' },
        { step: 7, task: 'Copyright registration', auto: false, role: 'Legal' },
        { step: 8, task: 'Print file preparation', auto: false, role: 'Production' },
        { step: 9, task: 'Marketplace listing (Amazon, Flipkart, Kindle)', auto: true, role: 'System' },
        { step: 10, task: 'Launch campaign (WhatsApp + Social)', auto: true, role: 'System' }
      ]
    },
    {
      id: 'SOP-03', title: 'Order Fulfillment', owner: 'Operations Manager', sla: '24 hours',
      steps: [
        { step: 1, task: 'Order received (any channel)', auto: true, role: 'System' },
        { step: 2, task: 'Inventory check & allocation', auto: true, role: 'System' },
        { step: 3, task: 'Generate shipping label (Shiprocket)', auto: true, role: 'System' },
        { step: 4, task: 'Pack & dispatch', auto: false, role: 'Warehouse' },
        { step: 5, task: 'Send tracking via WhatsApp + Email', auto: true, role: 'System' },
        { step: 6, task: 'Update author dashboard with sale', auto: true, role: 'System' },
        { step: 7, task: 'Calculate royalty per sale', auto: true, role: 'System' }
      ]
    },
    {
      id: 'SOP-04', title: 'Monthly Royalty Payout', owner: 'Finance', sla: '1st of every month',
      steps: [
        { step: 1, task: 'Aggregate sales from all channels', auto: true, role: 'System' },
        { step: 2, task: 'Calculate author-wise royalty', auto: true, role: 'System' },
        { step: 3, task: 'Generate payout report', auto: true, role: 'System' },
        { step: 4, task: 'Finance approval', auto: false, role: 'Finance Head' },
        { step: 5, task: 'Bank transfer / UPI payout', auto: true, role: 'System' },
        { step: 6, task: 'Notify author via portal + WhatsApp', auto: true, role: 'System' }
      ]
    },
    {
      id: 'SOP-05', title: 'Book Launch Marketing', owner: 'Marketing Head', sla: '7 days pre-launch',
      steps: [
        { step: 1, task: 'Create launch assets (cover, quotes, trailer)', auto: false, role: 'Marketing' },
        { step: 2, task: 'Schedule social media posts (7-day calendar)', auto: true, role: 'System' },
        { step: 3, task: 'Send bulk WhatsApp to relevant lists', auto: true, role: 'System' },
        { step: 4, task: 'Email newsletter to subscribers', auto: true, role: 'System' },
        { step: 5, task: 'Amazon/Flipkart listing optimization', auto: false, role: 'Marketing' },
        { step: 6, task: 'Track conversions & report to author', auto: true, role: 'System' }
      ]
    }
  ],

  automations: [
    { id: 'AUTO-01', name: 'Marketplace Order Sync', trigger: 'Every 15 minutes', action: 'Pull orders from Amazon, Flipkart, Kindle → Unified Dashboard', status: 'active', runsToday: 96, lastRun: '2 min ago' },
    { id: 'AUTO-02', name: 'New Author Welcome Flow', trigger: 'Author registers on portal', action: 'Send credentials + welcome email + WhatsApp intro + assign RM', status: 'active', runsToday: 3, lastRun: '4 hours ago' },
    { id: 'AUTO-03', name: 'Royalty Auto-Calculation', trigger: 'On every sale (any channel)', action: 'Calculate author royalty → update dashboard → add to pending payout', status: 'active', runsToday: 47, lastRun: '12 min ago' },
    { id: 'AUTO-04', name: 'ISBN Status Tracker', trigger: 'Daily at 9 AM', action: 'Check RRRLF API → update ISBN status → notify author & publisher', status: 'active', runsToday: 1, lastRun: '3 hours ago' },
    { id: 'AUTO-05', name: 'Low Stock Alert', trigger: 'Stock < 50 units', action: 'Alert ops team + suggest reprint → notify author', status: 'active', runsToday: 2, lastRun: '6 hours ago' },
    { id: 'AUTO-06', name: 'Book Launch Campaign', trigger: 'Book status → Published', action: 'Schedule 7-day social calendar + WhatsApp blast + email newsletter', status: 'active', runsToday: 0, lastRun: '2 days ago' },
    { id: 'AUTO-07', name: 'Order Shipped Notification', trigger: 'Order status → Shipped', action: 'WhatsApp tracking link + email + update author sales dashboard', status: 'active', runsToday: 12, lastRun: '45 min ago' },
    { id: 'AUTO-08', name: 'Manuscript Stage Advance', trigger: 'Editor marks stage complete', action: 'Notify author → move pipeline → assign next team member', status: 'active', runsToday: 4, lastRun: '1 hour ago' },
    { id: 'AUTO-09', name: 'Monthly Payout Processing', trigger: '1st of every month', action: 'Generate reports → calculate payouts → initiate bank transfers', status: 'active', runsToday: 0, lastRun: '19 days ago' },
    { id: 'AUTO-10', name: 'Abandoned Cart Recovery', trigger: 'Cart abandoned > 2 hours', action: 'WhatsApp reminder with 10% discount code', status: 'active', runsToday: 8, lastRun: '30 min ago' },
    { id: 'AUTO-11', name: 'Review Request', trigger: '7 days after delivery', action: 'WhatsApp + email asking for Amazon/website review', status: 'paused', runsToday: 0, lastRun: '5 days ago' },
    { id: 'AUTO-12', name: 'Social Post Auto-Publish', trigger: 'Scheduled post time reached', action: 'Publish to Instagram, Facebook, LinkedIn, Twitter via Meta API', status: 'active', runsToday: 3, lastRun: '2 hours ago' }
  ],

  publisherStats: {
    revenueMonth: 2847500,
    revenuePrev: 2456000,
    ordersMonth: 1847,
    ordersPrev: 1623,
    newAuthors: 34,
    manuscriptsPending: 12,
    booksPublished: 8,
    avgRoyalty: 11.2,
    whatsappSent: 32200,
    whatsappConversions: 443,
    socialReach: 89000,
    automationsRun: 186
  },

  authorDashboard: {
    authorId: 1,
    name: 'Ananya Sharma',
    notifications: [
      { id: 1, type: 'sale', text: '12 copies of "Midnight Library" sold on Amazon today', time: '2 hours ago', read: false },
      { id: 2, type: 'royalty', text: 'Royalty payout of ₹28,400 scheduled for Dec 1', time: '1 day ago', read: false },
      { id: 3, type: 'marketing', text: 'WhatsApp campaign for "Whispers in Varanasi" reached 8,200 readers', time: '2 days ago', read: false },
      { id: 4, type: 'review', text: 'New 5-star review on "Whispers in Varanasi"', time: '3 days ago', read: true },
      { id: 5, type: 'order', text: 'Website order ORD-7841 includes your books', time: '4 days ago', read: true }
    ]
  },

  services: [
    { icon: '🗺️', title: 'Google Maps & Business Profile', desc: 'Verified Google listing, photos, hours, reviews — so customers find you nearby', category: 'presence' },
    { icon: '🌐', title: 'Modern Website & SEO', desc: 'Fast mobile site, Google search visibility, and local SEO for Maadi / Cairo', category: 'presence' },
    { icon: '🛒', title: 'Online Bookstore', desc: 'Shop with cart, checkout, click & collect — synced with your live catalog', category: 'presence' },
    { icon: '⭐', title: 'Reviews & Reputation', desc: 'Collect Google & website reviews, reply fast, build 5-star trust online', category: 'presence' },
    { icon: '💬', title: 'WhatsApp Business', desc: 'Catalog, bulk campaigns, order updates, abandoned cart recovery', category: 'growth' },
    { icon: '📱', title: 'Social Media Management', desc: 'Instagram, Facebook, TikTok/Reels calendar with auto-posting', category: 'growth' },
    { icon: '📧', title: 'Email & Newsletter', desc: 'New arrivals, sales, book club invites — automated drip campaigns', category: 'growth' },
    { icon: '🎯', title: 'Google & Meta Ads', desc: 'Local ads to drive footfall and online orders with clear ROI tracking', category: 'growth' },
    { icon: '📝', title: 'Publishing Services', desc: 'Manuscript review, editing, cover design, ISBN & copyright', category: 'publish' },
    { icon: '🖨️', title: 'Print & Distribution', desc: 'POD / offset + marketplace listing (Amazon, Kindle & more)', category: 'publish' },
    { icon: '📊', title: 'Unified Sales Dashboard', desc: 'Website, WhatsApp, marketplace orders & royalties in one place', category: 'ops' },
    { icon: '⚡', title: 'Business Automation', desc: 'SOPs for orders, launches, royalties — 90%+ tasks on autopilot', category: 'ops' },
    { icon: '💳', title: 'Digital Payments', desc: 'Cards, wallets, Instapay / Fawry-ready checkout for Egypt', category: 'ops' },
    { icon: '📅', title: 'Events & Book Club', desc: 'Online booking for readings, signings, and community events', category: 'growth' },
    { icon: '🎁', title: 'Loyalty & CRM', desc: 'Customer profiles, wishlists, loyalty points, birthday offers', category: 'ops' },
    { icon: '📷', title: 'Store Digitization', desc: 'QR menus, digital receipts, photo gallery, virtual store tour', category: 'presence' }
  ],

  digitalPresence: {
    googleBusiness: {
      name: 'The BookSpot',
      status: 'verified',
      rating: 4.8,
      reviews: 312,
      viewsMonth: 18400,
      searchesMonth: 6200,
      directionRequests: 890,
      callsMonth: 156,
      websiteClicks: 1240,
      photos: 48,
      address: '70 Road 9 (First Floor), Maadi, Cairo, Egypt',
      hours: 'Sat–Thu 10:00–21:00 · Fri 14:00–21:00',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=The+BookSpot+Maadi+Cairo+Road+9',
      categories: ['Book store', 'Used bookstore', 'Publisher']
    },
    seo: {
      score: 86,
      keywords: [
        { term: 'bookstore Maadi', rank: 2, traffic: 1200 },
        { term: 'English books Cairo', rank: 3, traffic: 980 },
        { term: 'used books Maadi', rank: 1, traffic: 740 },
        { term: 'BookSpot Cairo', rank: 1, traffic: 2100 },
        { term: 'buy books online Egypt', rank: 8, traffic: 450 }
      ]
    },
    channels: [
      { name: 'Google Business Profile', status: 'live', metric: '18.4K monthly views', icon: '🗺️' },
      { name: 'Website + SEO', status: 'live', metric: 'Score 86/100', icon: '🌐' },
      { name: 'Online Shop', status: 'live', metric: '1,847 orders/mo', icon: '🛒' },
      { name: 'WhatsApp Business', status: 'live', metric: '28.4K subscribers', icon: '💬' },
      { name: 'Instagram', status: 'live', metric: '18.2K followers', icon: '📸' },
      { name: 'Facebook', status: 'live', metric: '12.4K followers', icon: '👤' },
      { name: 'Email Newsletter', status: 'live', metric: '9.1K subscribers', icon: '📧' },
      { name: 'Google Ads (Local)', status: 'active', metric: 'LE 4.2 cost/click', icon: '🎯' }
    ],
    checklist: [
      { item: 'Google Business verified + NAP consistent', done: true },
      { item: 'Store photos, hours, services updated weekly', done: true },
      { item: 'Review reply automation (<24h)', done: true },
      { item: 'Mobile-first website with local SEO', done: true },
      { item: 'WhatsApp catalog linked to Google profile', done: true },
      { item: 'Click & collect + delivery options', done: true },
      { item: 'Instagram shopping tags', done: false },
      { item: 'QR code posters in-store → reviews', done: true },
      { item: 'Book club event bookings online', done: false },
      { item: 'Loyalty / CRM live', done: false }
    ]
  },

  testimonials: [
    { name: 'Ananya Sharma', role: 'Bestselling Author', text: 'The BookSpot handled everything from ISBN to Amazon listing. Their WhatsApp campaign sold 156 copies on launch day alone!', avatar: 'AS' },
    { name: 'Rahul Mehta', role: 'Tech Thriller Author', text: 'As a first-time author, the automated portal made publishing simple. Upload manuscript, track editing, see orders — all in one place.', avatar: 'RM' },
    { name: 'Priya Nair', role: 'Historical Fiction Writer', text: 'Their social media team manages my Instagram and the bulk WhatsApp marketing drives real sales. I focus on writing.', avatar: 'PN' }
  ],

  monthlySales: [
    { month: 'Jun', website: 180000, amazon: 420000, flipkart: 210000, kindle: 89000 },
    { month: 'Jul', website: 195000, amazon: 445000, flipkart: 225000, kindle: 92000 },
    { month: 'Aug', website: 210000, amazon: 478000, flipkart: 240000, kindle: 98000 },
    { month: 'Sep', website: 225000, amazon: 502000, flipkart: 255000, kindle: 105000 },
    { month: 'Oct', website: 248000, amazon: 534000, flipkart: 268000, kindle: 112000 },
    { month: 'Nov', website: 267000, amazon: 567000, flipkart: 289000, kindle: 124000 }
  ],

  /* —— Bookspot Publishers India — Instagram Offer Automation —— */
  publishingOffer: {
    headline: 'BOOK PUBLISHING OFFER',
    tagline: "India's Writers Community — Get published from ₹999 + GST",
    slotsTotal: 25,
    slotsLeft: 12,
    submissionDeadlineMonths: 6,
    processDays: '20–30 days',
    benefits: [
      'No Hidden Charges', 'Cover Design', 'Manuscript Formatting', 'Proofreading',
      'ISBN', 'Copyright ©', '100% Profit Royalty', 'Paperback Launch',
      'Amazon & Flipkart Distribution', 'Paperback Publishing',
      'Social Media Promotion', 'Promotional Posts', 'E-Certificate Free',
      'Live Sales Dashboard', 'Top books → Offline store distribution'
    ],
    terms: [
      'Page Limit: ≤150 pages B/W included in base package',
      '150–300 pages: extra package charges',
      'Content submission deadline: 6 months from registration',
      'Agreement provided after registration',
      'Author copies at production rates',
      'Regional language & Academic books not allowed'
    ],
    packages: [
      { id: 'pkg-basic', name: 'Starter', pages: 'Up to 150 pages', price: 999, gst: 181, total: 1180, popular: true, desc: 'B/W paperback · Full benefits listed' },
      { id: 'pkg-standard', name: 'Standard', pages: '150–300 pages', price: 1999, gst: 360, total: 2359, popular: false, desc: 'Extended page count · Same publishing stack' },
      { id: 'pkg-premium', name: 'Premium', pages: '300–500 pages', price: 2999, gst: 540, total: 3539, popular: false, desc: 'Long-form novels · Priority processing' }
    ],
    pipelineSteps: [
      { id: 1, key: 'registration', title: 'Registration & Payment', desc: 'Author fills form + confirms package payment', sla: 'Instant', auto: true },
      { id: 2, key: 'manuscript', title: 'Manuscript Submission', desc: 'Submit .doc/.docx or Google Docs via portal (replaces email)', sla: 'Within 6 months', auto: false },
      { id: 3, key: 'formatting', title: 'Content Processing & Formatting', desc: 'Editorial + formatting per publishing standards', sla: '10–15 days', auto: false },
      { id: 4, key: 'author_review', title: 'Author Review & Approval', desc: 'Processed content shared for approval', sla: 'Author dependent', auto: true },
      { id: 5, key: 'cover', title: 'Cover Design', desc: 'Design team creates cover from theme + author inputs', sla: '3–5 days', auto: false },
      { id: 6, key: 'cover_approval', title: 'Cover Approval', desc: 'Author approves final cover', sla: 'Author dependent', auto: true },
      { id: 7, key: 'royalty_form', title: 'Royalty Calculator + Book Details', desc: 'Pages, specs, royalty estimate → listing form', sla: '1 day', auto: true },
      { id: 8, key: 'listing', title: 'Amazon / Flipkart Listing', desc: 'Book submitted for publishing & eCommerce listing', sla: '3–7 days', auto: true },
      { id: 9, key: 'live', title: 'Live + Sales Dashboard', desc: 'Dashboard updates every month on the 20th · Min withdrawal ₹1,000', sla: 'Ongoing', auto: true }
    ]
  },

  publishRegistrations: [
    { id: 'REG-2401', author: 'Ananya Sharma', email: 'ananya@email.com', phone: '+91 98123 45678', genre: 'Literary Fiction', pages: 128, packageId: 'pkg-basic', amount: 1180, paid: true, paidAt: '2025-10-05', stage: 'live', bookTitle: 'Whispers of the Monsoon', submittedAt: '2025-10-08', listedAt: '2025-10-28', amazonUrl: '#', flipkartUrl: '#' },
    { id: 'REG-2402', author: 'Rahul Mehta', email: 'rahul.m@email.com', phone: '+91 98234 56789', genre: 'Thriller', pages: 220, packageId: 'pkg-standard', amount: 2359, paid: true, paidAt: '2025-10-20', stage: 'listing', bookTitle: 'Code & Karma', submittedAt: '2025-10-22', listedAt: null },
    { id: 'REG-2403', author: 'Kavita Desai', email: 'kavita@email.com', phone: '+91 98789 01234', genre: 'Children', pages: 96, packageId: 'pkg-basic', amount: 1180, paid: true, paidAt: '2025-11-01', stage: 'cover', bookTitle: 'The Last Train to Shimla', submittedAt: '2025-11-03', listedAt: null },
    { id: 'REG-2404', author: 'Sanjay Verma', email: 'sanjay@email.com', phone: '+91 98890 12345', genre: 'Fiction', pages: 180, packageId: 'pkg-standard', amount: 2359, paid: true, paidAt: '2025-11-08', stage: 'formatting', bookTitle: 'Rajasthani Folktales Retold', submittedAt: '2025-11-10', listedAt: null },
    { id: 'REG-2405', author: 'Neha Kapoor', email: 'neha@email.com', phone: '+91 99112 33445', genre: 'Romance', pages: 140, packageId: 'pkg-basic', amount: 1180, paid: true, paidAt: '2025-11-15', stage: 'manuscript', bookTitle: 'Letters Untold', submittedAt: null, listedAt: null },
    { id: 'REG-2406', author: 'Amit Shah', email: 'amit.s@email.com', phone: '+91 99223 44556', genre: 'Self-Help', pages: 310, packageId: 'pkg-premium', amount: 3539, paid: false, paidAt: null, stage: 'registration', bookTitle: '', submittedAt: null, listedAt: null }
  ],

  /* Demo author live sales dashboard (replaces systeme.io) */
  authorSalesDashboard: {
    authorId: 1,
    registrationId: 'REG-2401',
    bookTitle: 'Whispers of the Monsoon',
    isbn: '978-93-87654-201-8',
    packageId: 'pkg-basic',
    listedOn: '2025-10-28',
    mrp: 199,
    authorRoyaltyPerCopy: 45,
    minWithdrawal: 1000,
    walletBalance: 2340,
    lifetimeEarnings: 4860,
    nextDashboardUpdate: '2025-12-20',
    updateNote: 'Sales dashboard updates every month on the 20th for the previous month.',
    channels: {
      amazon: { copies: 38, amount: 1710 },
      flipkart: { copies: 14, amount: 630 }
    },
    monthly: [
      { month: 'Oct 2025', amazon: 8, flipkart: 2, royalty: 450, status: 'paid', updatedOn: '2025-11-20' },
      { month: 'Nov 2025', amazon: 22, flipkart: 8, royalty: 1350, status: 'paid', updatedOn: '2025-12-20' },
      { month: 'Dec 2025 (current)', amazon: 8, flipkart: 4, royalty: 540, status: 'pending_update', updatedOn: null }
    ],
    withdrawals: [
      { id: 'WD-01', date: '2025-11-22', amount: 1200, status: 'completed', mode: 'UPI' },
      { id: 'WD-02', date: '2025-12-21', amount: 1320, status: 'completed', mode: 'Bank Transfer' }
    ],
    journey: {
      currentStep: 9,
      completed: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      manuscriptFile: 'Whispers_of_the_Monsoon_final.docx',
      coverApproved: true,
      formattingApproved: true
    }
  }
};

// Backward compatibility alias
window.INKBRIDGE = window.BOOKSPOT;
window.BOOKSPO = window.BOOKSPOT;
