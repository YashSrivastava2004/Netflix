const movies = [
  { id: 1, title: 'Stranger Things', category: 'Sci-Fi', match: '98% Match', image: 'stranger.jpg', trailer: 'https://www.youtube.com/embed/b9EkMc79ZSU' },
  { id: 2, title: 'The Crown', category: 'Drama', match: '95% Match', image: 'crown.jpg', trailer: 'https://www.youtube.com/embed/JWtnJjn6ng0' },
  { id: 3, title: 'Money Heist', category: 'Action', match: '99% Match', image: 'money.jpg', trailer: 'https://www.youtube.com/embed/_InqQJRqGW4' },
  { id: 4, title: 'Squid Game', category: 'Drama', match: '97% Match', image: 'squid.jpg', trailer: 'https://www.youtube.com/embed/oqxAJKy0ii4' },
  { id: 5, title: 'Inception', category: 'Sci-Fi', match: '88% Match', image: 'inception.jpg', trailer: 'https://www.youtube.com/embed/YoHD9XEInc0' },
  { id: 6, title: 'The Dark Knight', category: 'Action', match: '90% Match', image: 'dark knight.jpg', trailer: 'https://www.youtube.com/embed/EXeTwQWrcwY' },
  { id: 7, title: 'Interstellar', category: 'Sci-Fi', match: '96% Match', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&auto=format&fit=crop', trailer: 'https://www.youtube.com/embed/zSWdZVtXT7E' },
  { id: 8, title: 'Breaking Bad', category: 'Drama', match: '99% Match', image: 'breaking.jpg', trailer: 'https://www.youtube.com/embed/HhesaQXLuRY' },
  { id: 9, title: 'Avengers: Endgame', category: 'Action', match: '94% Match', image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=300&auto=format&fit=crop', trailer: 'https://www.youtube.com/embed/TcMBFSGVi1c' },
  { id: 10, title: 'The Witcher', category: 'Action', match: '92% Match', image: 'witcher.jpg', trailer: 'https://www.youtube.com/embed/ndl1W4ltcmg' }
];
let myWatchlist = JSON.parse(localStorage.getItem('netflix_watchlist')) || [];
document.addEventListener('DOMContentLoaded', () => {
  const savedUser = localStorage.getItem('netflix_username');
  if (savedUser) showAppScreen(savedUser);
});
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const nameValue = document.getElementById('username').value.trim();
  if (nameValue) {
    localStorage.setItem('netflix_username', nameValue);
    showAppScreen(nameValue);
  }
});
function showAppScreen(userName) {
  document.getElementById('userDisplay').innerText = `Welcome, ${userName}`;
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');
  openCategory('Home');
}
function logout() {
  localStorage.removeItem('netflix_username');
  document.getElementById('username').value = '';
  document.getElementById('app-screen').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
}
function openCategory(categoryName, clickedElement) {
  const titleElement = document.getElementById('page-title');
  const heroBanner = document.getElementById('hero-banner');
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  if (clickedElement) clickedElement.classList.add('active');
  if (categoryName === 'Home') {
    heroBanner.style.display = 'flex';
    titleElement.innerText = 'Popular Movies';
    renderMovies(movies);
  } else if (categoryName === 'MyList') {
    heroBanner.style.display = 'none';
    titleElement.innerText = 'My Saved List';
    const savedMovies = movies.filter(m => myWatchlist.includes(m.id));
    renderMovies(savedMovies);
  } else {
    heroBanner.style.display = 'none';
    titleElement.innerText = `${categoryName} Movies`;
    const filtered = movies.filter(m => m.category === categoryName);
    renderMovies(filtered);
  }
}
function renderMovies(movieList) {
  const grid = document.getElementById('movies-grid');
  grid.innerHTML = '';
  if (movieList.length === 0) {
  }
  movieList.forEach((movie) => {
    const isSaved = myWatchlist.includes(movie.id);
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.onclick = () => openModal(movie.trailer);
    card.innerHTML = `
      <img src="${movie.image}" alt="${movie.title}">
      <div class="movie-info">
        <div class="movie-title">${movie.title}</div>
        <div class="match-score">${movie.match} • ${movie.category}</div>
        <button onclick="toggleWatchlist(${movie.id}, event)" style="margin-top: 10px; width: 100%; background: ${isSaved ? '#E50914' : '#333'}; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 0.75rem; font-weight: bold;">
          ${isSaved ? '✓ Saved' : '+ Add to My List'}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}
function toggleWatchlist(movieId, event) {
  event.stopPropagation();
  if (myWatchlist.includes(movieId)) {
    myWatchlist = myWatchlist.filter(id => id !== movieId);
  } else {
    myWatchlist.push(movieId);
  }
  localStorage.setItem('netflix_watchlist', JSON.stringify(myWatchlist));
  const activeTitle = document.getElementById('page-title').innerText;
  if (activeTitle === 'My Saved List') {
    openCategory('MyList');
  } else {
    renderMovies(movies);
  }
}
function handleSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const heading = document.getElementById('page-title');
  const filtered = movies.filter(movie => movie.title.toLowerCase().includes(query));

  heading.innerText = query ? `Search Results for "${query}"` : 'Popular Movies';
  renderMovies(filtered);
}
function openModal(videoUrl) {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('modalIframe');
  iframe.src = videoUrl + '?autoplay=1';
  modal.style.display = 'flex';
}
function closeModal() {
  document.getElementById('modalIframe').src = '';
  document.getElementById('videoModal').style.display = 'none';
}