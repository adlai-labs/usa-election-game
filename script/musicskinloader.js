const MP_SKINS = {
    anno_domini: `
            #js-mp-container.js-mp-container {
            position: relative;
            width: 340px;
            padding: 24px 20px 20px;
            box-sizing: border-box;
            /* 経年変化した羊皮紙の質感グラデーション */
            background: radial-gradient(circle at 20% 20%, #f7eed6 0%, #e6d3a7 65%, #c9ae78 100%);
            color: #2b1b0e;
            /* 濃いクルミ材の額縁＋内側の二重インク線 */
            border: 6px double #4a2e16;
            border-radius: 3px;
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.65), inset 0 0 24px rgba(101, 67, 33, 0.45);
            font-family: "Georgia", "Times New Roman", "Palatino Linotype", "YuMincho", serif;
        }

        /* 上部の古文書ヘッダー装飾（羽根ペンと1788の刻印風） */
        #js-mp-container.js-mp-container::before {
            content: "✒  ANNO DOMINI 1788  ✒";
            display: block;
            text-align: center;
            font-size: 10px;
            font-weight: bold;
            letter-spacing: 0.18em;
            color: #5c3a1e;
            border-bottom: 1px solid #8c6a43;
            padding-bottom: 6px;
            margin-bottom: 12px;
        }

        /* 右下の赤い封蝋（シーリングワックス）スタンプ風装飾 */
        #js-mp-container.js-mp-container::after {
            content: "1788";
            position: absolute;
            top: 10px;
            right: 10px;
            width: 34px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            font-size: 9px;
            font-weight: bold;
            letter-spacing: 0.05em;
            color: #f5d6c6;
            background: radial-gradient(circle at 35% 35%, #b82929, #7a1212 75%, #4d0808 100%);
            border: 2px dashed #5e0c0c;
            border-radius: 50%;
            box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.45), inset 0 1px 3px rgba(255, 180, 180, 0.4);
            transform: rotate(12deg);
            pointer-events: none;
        }

        /* 曲名表示エリア（インクで書かれた見出し枠） */
        #js-mp-container .js-mp-now {
            background: rgba(255, 250, 238, 0.6);
            color: #2b1b0e;
            padding: 10px 12px;
            border: 1px solid #8c6a43;
            border-top: 2px solid #4a2e16;
            border-bottom: 2px solid #4a2e16;
            text-align: center;
            margin-bottom: 14px;
        }

        #js-mp-container .js-mp-title {
            margin: 0 0 4px;
            font-size: 16px;
            font-weight: bold;
            font-style: italic;
            letter-spacing: 0.04em;
            color: #1f1209;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        #js-mp-container .js-mp-status {
            font-size: 11px;
            color: #6b4423;
            letter-spacing: 0.08em;
        }

        /* スライダー（真鍮＆焦げ茶のつまみ） */
        #js-mp-container input[type="range"] {
            width: 100%;
            cursor: pointer;
            accent-color: #7a1212; /* 封蝋と同じクリムゾンレッド */
        }

        /* 時間表示 */
        #js-mp-container .js-mp-time {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            font-style: italic;
            color: #4a2e16;
            margin-bottom: 10px;
        }

        /* 操作ボタン（活版印刷・古書の押しボタン風） */
        #js-mp-container .js-mp-controls {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 12px 0 14px;
        }

        #js-mp-container .js-mp-controls button {
            background: linear-gradient(to bottom, #efe2c4, #d4bc8b);
            color: #2b1b0e;
            border: 1px solid #5c3a1e;
            border-radius: 2px;
            padding: 5px 14px;
            font-family: inherit;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 0.05em;
            cursor: pointer;
            box-shadow: 1px 2px 3px rgba(43, 27, 14, 0.35);
        }

        #js-mp-container .js-mp-controls button:hover {
            background: #f7eed6;
        }

        /* 中央の再生ボタン（赤い封蝋カラーで強調） */
        #js-mp-container .js-mp-controls button.js-mp-play {
            background: linear-gradient(to bottom, #9e1b1b, #6e0f0f);
            color: #f7eed6;
            border: 1px solid #3d0606;
        }

        #js-mp-container .js-mp-controls button.js-mp-play:hover {
            filter: brightness(1.15);
        }

        /* 音量バー */
        #js-mp-container .js-mp-volume {
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
            font-size: 12px;
            font-style: italic;
            color: #3d2512;
        }

        /* プレイリスト（楽譜・目録リスト風） */
        #js-mp-container .js-mp-list {
            list-style: none;
            padding: 4px 6px;
            margin: 0;
            max-height: 150px;
            overflow-y: auto;
            background: rgba(255, 248, 232, 0.55);
            border: 1px solid #8c6a43;
        }

        #js-mp-container .js-mp-list li {
            padding: 6px 8px;
            border-bottom: 1px dashed #a8875b;
            font-size: 13px;
            color: #2b1b0e;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        #js-mp-container .js-mp-list li:last-child {
            border-bottom: none;
        }

        #js-mp-container .js-mp-list li:hover {
            background: rgba(140, 106, 67, 0.18);
        }

        /* 再生中の曲（羽根ペン記号＋クリムゾンレッドインクで強調） */
        #js-mp-container .js-mp-list li.active {
            background: rgba(122, 18, 18, 0.12);
            color: #7a1212;
            font-weight: bold;
            font-style: italic;
        }

        #js-mp-container .js-mp-list li.active::before {
            content: "❧ "; /* 18世紀の書籍に使われた装飾記号（フルーロン） */
        }
            `,
    gramophone: `
        /* ここに蓄音機CSSを貼る */
    `,
    win98: `
        /* ここにWin98 CSSを貼る */
    `,
    ipod: `
        /* ここにiPod CSSを貼る */
    `,
    spotify: `
        /* ここにSpotify CSSを貼る */
    `
};

window.setPlayerSkin = function (skinName) {
    const styleId = "active-mp-skin";
    document.getElementById(styleId)?.remove();

    if (!skinName || skinName === "default" || !MP_SKINS[skinName]) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = MP_SKINS[skinName];
    document.head.appendChild(style);
};

(() => {
    const autoSkin = document.currentScript?.getAttribute("data-skin");
    if (autoSkin) {
        window.setPlayerSkin(autoSkin);
    }
})();
