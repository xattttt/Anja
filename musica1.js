const audio = document.querySelector('#audio');
const button = document.querySelector('.toggle-play');
const statusText = document.querySelector('#music-status');
const progress = document.querySelector('#progress');
const tracks = (window.ANJA_PLAYLIST || []).slice(0, 10);
const list = document.querySelector('#playlist');
let current = 0;
let selection = 0;
audio.volume = .5;
const time = value => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
function syncPlayer() {
  const playing = !audio.paused && !audio.ended;
  document.querySelector('.music').classList.toggle('is-playing', playing);
  button.setAttribute('aria-pressed', String(playing));
  button.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproduzir música');
  statusText.textContent = playing ? 'Tocando agora · aproveite ♡' : 'Dê o play e fique um pouco';
}
async function play() {
  const version = selection;
  try { await audio.play(); }
  catch (error) { if (version === selection && error.name !== 'AbortError') statusText.textContent = 'Não foi possível tocar esta música.'; }
}
function selectTrack(index, autoplay = false) {
  if (!tracks.length) return;
  selection++;
  audio.pause();
  current = (index + tracks.length) % tracks.length;
  const track = tracks[current];
  document.querySelector('#track-title').textContent = track.name;
  document.querySelector('#track-count').textContent = `${String(current + 1).padStart(2, '0')} / ${String(tracks.length).padStart(2, '0')}`;
  progress.value = 0;
  progress.disabled = true;
  document.querySelector('#current-time').textContent = '0:00';
  document.querySelector('#duration').textContent = '0:00';
  list.querySelectorAll('button').forEach((row, i) => row.setAttribute('aria-current', String(i === current)));
  audio.src = track.src;
  audio.load();
  syncPlayer();
  if (autoplay) play();
}
tracks.forEach((track, index) => {
  const li = document.createElement('li');
  const row = document.createElement('button');
  row.type = 'button';
  row.className = 'playlist-song';
  const number = document.createElement('span');
  number.className = 'song-number';
  number.textContent = String(index + 1).padStart(2, '0');
  const title = document.createElement('span');
  title.textContent = track.name;
  row.append(number, title);
  row.addEventListener('click', () => selectTrack(index, true));
  li.append(row);
  list.append(li);
});
document.querySelector('#playlist-count').textContent = `${tracks.length} de 10`;
button.disabled = !tracks.length;
document.querySelectorAll('.skip').forEach(control => control.disabled = tracks.length < 2);
button.addEventListener('click', () => audio.paused ? play() : audio.pause());
document.querySelector('.previous').addEventListener('click', () => selectTrack(current - 1, true));
document.querySelector('.next').addEventListener('click', () => selectTrack(current + 1, true));
['play', 'pause'].forEach(event => audio.addEventListener(event, syncPlayer));
audio.addEventListener('ended', () => selectTrack(current + 1, true));
audio.addEventListener('loadedmetadata', () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    document.querySelector('#duration').textContent = time(audio.duration);
    progress.disabled = false;
  }
});
audio.addEventListener('timeupdate', () => {
  document.querySelector('#current-time').textContent = time(audio.currentTime);
  progress.value = audio.duration ? audio.currentTime / audio.duration * 100 : 0;
});
progress.addEventListener('input', () => { if (Number.isFinite(audio.duration)) audio.currentTime = Number(progress.value) / 100 * audio.duration; });
audio.addEventListener('error', () => { syncPlayer(); statusText.textContent = 'Arquivo indisponível. Escolha outra música.'; });
if (tracks.length) selectTrack(0);
else { document.querySelector('#track-title').textContent = 'Playlist vazia'; statusText.textContent = 'Nenhuma música disponível.'; }
let toastTimer;
document.querySelector('.copy-id').addEventListener('click', async () => {
  const toast = document.querySelector('.toast');
  try { await navigator.clipboard.writeText('94624182'); toast.textContent = 'ID copiado ♡'; }
  catch { toast.textContent = 'ID da Anja: 94624182'; }
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2600);
});
const stars = document.querySelector('.stars');
for (let i = 0; i < 80; i++) {
  const star = document.createElement('span');
  star.className = 'star';
  star.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--speed:${0.8+Math.random()*1.6}s;--delay:-${Math.random()*4}s`;
  stars.appendChild(star);
}

