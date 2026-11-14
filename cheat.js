// ==========================================
// ☢️ NUKE_TESTING OFFICIAL CHEAT ENGINE ☢️
// ==========================================
(function () {
    // すでにメニューが存在する場合は二重作成を防ぐ
    if (document.getElementById("nuke-cheat-menu")) return;

    // 1. スタイル（凶悪グラデーション＆ドラッグUI）の注入
    const style = document.createElement("style");
    style.textContent = `
        #nuke-cheat-menu {
            position: fixed;
            top: 80px;
            right: 20px;
            width: 270px;
            background: linear-gradient(145deg, #1a0005 0%, #4a000d 55%, #0d0000 100%);
            border: 2px solid #ff1e42;
            box-shadow: 0 0 20px rgba(255, 0, 40, 0.6), inset 0 0 12px rgba(255, 30, 66, 0.3);
            color: #ffccd5;
            font-family: 'Courier New', Consolas, monospace;
            z-index: 99999;
            border-radius: 6px;
            user-select: none;
            overflow: hidden;
        }
        #nuke-cheat-header {
            background: linear-gradient(90deg, #660011 0%, #b3001e 50%, #4d000d 100%);
            padding: 8px 10px;
            font-weight: bold;
            font-size: 13px;
            letter-spacing: 1px;
            color: #ffffff;
            text-shadow: 0 0 6px #ff002b;
            cursor: grab;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #ff1e42;
        }
        #nuke-cheat-header:active {
            cursor: grabbing;
        }
        #nuke-cheat-toggle {
            background: #2b0007;
            border: 1px solid #ff4d6d;
            color: #fff;
            cursor: pointer;
            font-size: 11px;
            padding: 1px 6px;
            border-radius: 3px;
        }
        #nuke-cheat-body {
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .nuke-section-title {
            font-size: 10px;
            color: #ff758f;
            border-bottom: 1px dashed #800f2f;
            padding-bottom: 2px;
            margin-top: 2px;
        }
        .nuke-btn {
            background: linear-gradient(90deg, #3d000b 0%, #750014 100%);
            border: 1px solid #ff4d6d;
            color: #fff0f3;
            padding: 6px 8px;
            font-size: 12px;
            font-family: inherit;
            cursor: pointer;
            border-radius: 4px;
            text-align: left;
            transition: all 0.15s;
        }
        .nuke-btn:hover {
            background: linear-gradient(90deg, #800016 0%, #c9184a 100%);
            box-shadow: 0 0 10px rgba(255, 77, 109, 0.8);
            transform: translateX(2px);
        }
        .nuke-btn:active {
            transform: scale(0.97);
        }
        .nuke-row {
            display: flex;
            gap: 4px;
        }
        .nuke-input {
            background: #140003;
            border: 1px solid #a4133c;
            color: #ffccd5;
            padding: 4px 6px;
            font-size: 12px;
            font-family: inherit;
            border-radius: 3px;
            width: 100%;
        }
        #nuke-status {
            font-size: 10px;
            color: #ffb3c1;
            background: rgba(0, 0, 0, 0.5);
            padding: 4px 6px;
            border-radius: 3px;
            min-height: 14px;
        }
    `;
    document.head.appendChild(style);

    // 2. HTML構造の生成
    const menu = document.createElement("div");
    menu.id = "nuke-cheat-menu";
    menu.innerHTML = `
        <div id="nuke-cheat-header">
            <span>☢️ NUKE CHEAT v1.0</span>
            <button id="nuke-cheat-toggle">_</button>
        </div>
        <div id="nuke-cheat-body">
            <div class="nuke-section-title">▼ 世論操作（支持率チート）</div>
            <button class="nuke-btn" id="btn-nuke-win">🔥 自陣営 全州支持率 +100%</button>
            <button class="nuke-btn" id="btn-nuke-destroy">💀 敵対陣営 全州支持率 -100%</button>
            <button class="nuke-btn" id="btn-nuke-chaos">🎲 全州・全政党 ランダムカオス化</button>

            <div class="nuke-section-title">▼ イベント強制起爆（ID指定）</div>
            <div class="nuke-row">
                <input type="text" id="nuke-event-id" class="nuke-input" placeholder="例: landonpoll_fail">
                <button class="nuke-btn" id="btn-nuke-event" style="width: 70px; text-align:center;">発火</button>
            </div>

            <div id="nuke-status">READY FOR DETONATION...</div>
        </div>
    `;
    document.body.appendChild(menu);

    const statusEl = document.getElementById("nuke-status");
    const logStatus = (msg) => {
        statusEl.textContent = `> ${msg}`;
        console.log(`[NUKE CHEAT] ${msg}`);
    };

    // 3. ドラッグ移動ロジック
    const header = document.getElementById("nuke-cheat-header");
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    header.addEventListener("mousedown", (e) => {
        if (e.target.id === "nuke-cheat-toggle") return;
        isDragging = true;
        offsetX = e.clientX - menu.offsetLeft;
        offsetY = e.clientY - menu.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        menu.style.left = `${e.clientX - offsetX}px`;
        menu.style.top = `${e.clientY - offsetY}px`;
        menu.style.right = "auto";
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    // 最小化トグル
    const toggleBtn = document.getElementById("nuke-cheat-toggle");
    const bodyEl = document.getElementById("nuke-cheat-body");
    toggleBtn.addEventListener("click", () => {
        const isHidden = bodyEl.style.display === "none";
        bodyEl.style.display = isHidden ? "flex" : "none";
        toggleBtn.textContent = isHidden ? "_" : "□";
    });

    // 4. チート機能群
    // ① 自陣営 全州 +100%
    document.getElementById("btn-nuke-win").addEventListener("click", () => {
        if (typeof currentMap === "undefined" || !currentMap) {
            return logStatus("エラー: ゲーム開始後に押してください");
        }
        const playerParty = currentMap.candidates[selectedPresident].party;
        Object.keys(currentMap.states).forEach(sId => {
            updateStateSupport(sId, playerParty, 100);
        });
        logStatus(`${playerParty} の全州支持率を +100% しました`);
    });

    // ② 敵対陣営 全州 -100%
    document.getElementById("btn-nuke-destroy").addEventListener("click", () => {
        if (typeof currentMap === "undefined" || !currentMap) {
            return logStatus("エラー: ゲーム開始後に押してください");
        }
        const playerParty = currentMap.candidates[selectedPresident].party;
        currentMap.parties.forEach(p => {
            if (p.id !== playerParty) {
                Object.keys(currentMap.states).forEach(sId => {
                    updateStateSupport(sId, p.id, -100);
                });
            }
        });
        logStatus("全ライバル政党を壊滅させました");
    });

    // ③ ランダムカオス化
    document.getElementById("btn-nuke-chaos").addEventListener("click", () => {
        if (typeof currentMap === "undefined" || !currentMap) {
            return logStatus("エラー: ゲーム開始後に押してください");
        }
        Object.keys(currentMap.states).forEach(sId => {
            currentMap.parties.forEach(p => {
                const rand = Math.floor(Math.random() * 101) - 50; // -50 ~ +50
                updateStateSupport(sId, p.id, rand);
            });
        });
        logStatus("全米の世論をカオス状態にしました");
    });

    // ④ イベント強制起爆（disabledも無視してロック解除）
    document.getElementById("btn-nuke-event").addEventListener("click", () => {
        const evId = document.getElementById("nuke-event-id").value.trim();
        if (!evId) return logStatus("イベントIDを入力してください");
        if (!window.loadedScenarioEvents) return logStatus("イベントデータ未読込");

        const targetEv = window.loadedScenarioEvents.find(e => e.id === evId);
        if (!targetEv) return logStatus(`ID [${evId}] が見つかりません`);

        targetEv.disabled = false;
        // エンジン側にイベント表示関数（showEventなど）がある場合はここで呼び出し可能
        if (typeof triggerEvent === "function") {
            triggerEvent(targetEv);
            logStatus(`イベント [${evId}] を強制発火！`);
        } else if (typeof showEventModal === "function") {
            showEventModal(targetEv);
            logStatus(`イベント [${evId}] を強制発火！`);
        } else {
            logStatus(`[${evId}] のロックを解除しました（日付到達で発生）`);
        }
    });
})();
