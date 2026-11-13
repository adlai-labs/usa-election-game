// ★Mod制作者はここを編集するだけで曲を変更・追加できます
let PLAYLIST = [
    //    { title: "Example", src: "audio/example.mp3" },

];

const audio = new Audio();
let currentIndex = 0;

// 要素の取得
const titleEl = document.getElementById("jsMpTitle");
const statusEl = document.getElementById("jsMpStatus");
const seekEl = document.getElementById("jsMpSeek");
const currentEl = document.getElementById("jsMpCurrent");
const durationEl = document.getElementById("jsMpDuration");
const playBtn = document.getElementById("jsMpPlay");
const prevBtn = document.getElementById("jsMpPrev");
const nextBtn = document.getElementById("jsMpNext");
const volEl = document.getElementById("jsMpVol");
const listEl = document.getElementById("jsMpList");

// 初期音量の設定
audio.volume = volEl.value;

// 時間フォーマット変換 (例: 75 -> "1:15")
function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

// プレイリストの描画
function renderList() {
    listEl.innerHTML = "";
    PLAYLIST.forEach((track, index) => {
        const li = document.createElement("li");
        li.textContent = track.title;
        if (index === currentIndex) li.classList.add("active");
        li.onclick = () => loadTrack(index, true);
        listEl.appendChild(li);
    });
}

// 曲の読み込み
function loadTrack(index, autoPlay = true) {
    if (PLAYLIST.length === 0) return;
    currentIndex = (index + PLAYLIST.length) % PLAYLIST.length;
    const track = PLAYLIST[currentIndex];

    audio.src = track.src;
    titleEl.textContent = track.title;
    renderList();

    if (autoPlay) {
        audio.play();
    }
}

// 再生・一時停止の切り替え
playBtn.onclick = () => {
    if (!audio.src && PLAYLIST.length > 0) {
        loadTrack(0, true);
        return;
    }
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
};

prevBtn.onclick = () => loadTrack(currentIndex - 1, true);
nextBtn.onclick = () => loadTrack(currentIndex + 1, true);

// 音声イベントの連動
audio.onplay = () => {
    playBtn.textContent = "一時停止";
    statusEl.textContent = "再生中";
};

audio.onpause = () => {
    playBtn.textContent = "再生";
    statusEl.textContent = "停止中";
};

audio.onended = () => loadTrack(currentIndex + 1, true);

audio.ontimeupdate = () => {
    if (audio.duration) {
        seekEl.value = (audio.currentTime / audio.duration) * 100;
        currentEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }
};

// シークバー・音量操作
seekEl.oninput = () => {
    if (audio.duration) {
        audio.currentTime = (seekEl.value / 100) * audio.duration;
    }
};

volEl.oninput = () => {
    audio.volume = volEl.value;
};


