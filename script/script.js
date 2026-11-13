let currentMap = null; // 現在実行中のシナリオデータを保持
let selectedColor = "";
let currentDate
let candidatePositions = {};
let gameSpeed = 7
let opponent
let actionPoints = true;

let stateSupport = {};

function initStateSupport() {
    const scenario = currentMap
    if (!scenario || !scenario.states) return;

    stateSupport = {}; // リセット

    // Object.entries を使うと、"AK"（州ID）と その中身 を同時に取り出せる
    Object.entries(scenario.states).forEach(([stateId, stateData]) => {
        stateSupport[stateId] = {};

        // シナリオで定義されている全政党を初期化
        scenario.parties.forEach(party => {
            const pId = party.id;

            // もしシナリオデータの州の中に support データがあればそれを入れる
            if (stateData.support && stateData.support[pId] !== undefined) {
                stateSupport[stateId][pId] = stateData.support[pId];
            } else {
                // データがない場合は、とりあえず50%や0%などデフォルト値をセット
                stateSupport[stateId][pId] = 0;
            }
        });
    });

    console.log("初期化完了（オブジェクト形式）:", stateSupport);
}

// 💡 ゲーム開始時に、すべての州の初期支持率を確定させて色を塗る関数
function initAllStatesSupport() {
    // 💡 グローバル変数（または定義済みの変数）の stateSupport を初期化
    stateSupport = {};

    // 全ての州をループ処理
    Object.keys(currentMap.states).forEach(stateId => {
        const stateData = currentMap.states[stateId];
        stateSupport[stateId] = {};

        if (stateData && stateData.baseSupport) {
            // JSONの初期支持率をそのままセット
            currentMap.parties.forEach(p => {
                // 三項演算子や||を使って、データがない政党は0%にする
                stateSupport[stateId][p.id] = stateData.baseSupport[p.id] !== undefined ? stateData.baseSupport[p.id] : 0;
            });
        } else {
            // 設定がなければ一律均等に分ける
            currentMap.parties.forEach(p => {
                stateSupport[stateId][p.id] = 100 / currentMap.parties.length;
            });
        }

        // 💡 データの整合性を合わせるために、色を塗る前に必ず正規化を挟む！
        if (typeof normalizeSupport === "function") {
            normalizeSupport(stateId);
        }

        // 💡 見た目の色を最新にする
        refreshStateColor(stateId);
    });

    console.log("歴史的初期支持率の展開が完了しました！", stateSupport);
}



let allScenarios = []; // 検索・フィルター用のデータ保持用
async function initMenu() {
    const listContainer = document.getElementById('scenario-list');
    const mapFilter = document.getElementById('map-filter');
    if (!listContainer) return;

    try {
        // 1. 目録（list.json）を読み込む
        const listResponse = await fetch('./data/list.json');
        if (!listResponse.ok) throw new Error('list.json が見つかりません');
        const scenarioIds = await listResponse.json(); // ["1928", "1860"] など

        // 2. 各JSファイルを動的にDOMへ追加して、完全に読み込まれるのを待つ
        const loadPromises = scenarioIds.map((id) => {
            return new Promise((resolve, reject) => {
                // 💡 修正ポイント：<script>タグを作って普通のJSファイルを読み込む
                const script = document.createElement('script');
                script.src = `./data/${id}.js`;
                script.async = true;

                // 読み込みが完了したら、ロード成功として処理を進める
                script.onload = () => {
                    // 各JSファイルが実行され、グローバルの mapData[id] にデータが入った状態になる
                    resolve();
                };

                script.onerror = () => reject(new Error(`${id}.js の読み込みに失敗しました`));
                document.head.appendChild(script);
            });
        });

        // すべてのJSファイルの実行が終わるまで待つ
        await Promise.all(loadPromises);

    } catch (error) {
        console.error("データの自動読み込みエラー:", error);
        return;
    }

    // 💡 ここでコンソールを確認！ 意図した通りの構造になっているかチェックします
    console.log("デバッグ - 現在のmapData:", mapData);

    // mapData から配列を取り出す
    allScenarios = Object.values(mapData);

    console.log("デバッグ - 展開されたallScenarios:", allScenarios);

    // --- 1. マップフィルターの動的生成 ---
    if (mapFilter) {
        mapFilter.innerHTML = '<option value="ALL">すべてのマップ</option>';
        const mapSources = [...new Set(allScenarios.map(s => s.mapSource || "その他"))];

        mapSources.forEach(source => {
            const opt = document.createElement('option');
            opt.value = source;
            opt.textContent = source;
            mapFilter.appendChild(opt);
        });
    }

    // --- 2. 初期描画 ---
    renderScenarios(allScenarios);
}



// カードの描画処理（完全修正版）
function renderScenarios(scenarios) {
    const listContainer = document.getElementById('scenario-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    if (scenarios.length === 0) {
        listContainer.innerHTML = '<p style="color: #888; font-size: 1.1em; margin-top: 20px;">該当するシナリオが見つかりません</p>';
        return;
    }

    scenarios.forEach(config => {
        const card = document.createElement('div');
        card.style.cssText = `
            border: 1px solid #e2e8f0;
            padding: 20px;
            border-radius: 12px;
            cursor: pointer;
            background: white;
            width: 320px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        `;

        // バッジ
        const mapBadge = config.mapSource ? `<span style="font-size:0.75em; background:#e2e8f0; color:#475569; padding:3px 8px; border-radius:12px; float:right;">${config.mapSource}</span>` : '';
        // --- 1. 候補者データの仕分け処理 ---
        const candList = config.candidates ? Object.values(config.candidates) : [];
        const mainPresidents = candList.filter(c => !c.isMate);
        const agentList = config.agents || [];

        // 【大修正】主要政党（VS枠）の自動判定ロジック
        // ① プレイヤーが操作する候補（npc !== true）の政党IDをすべて集める
        const playerPartyIds = mainPresidents
            .filter(c => c.npc !== true && c.party)
            .map(c => c.party);

        // ② もしプレイヤーの党がなければ、config.partiesの最初の党を仮の主要政党とする（念のための保険）
        if (playerPartyIds.length === 0 && config.parties && config.parties.length > 0) {
            playerPartyIds.push(config.parties[0].id);
        }

        // ③ 主要政党（プレイヤーの党、またはconfig.partiesの上位2政党）のIDリストを作る
        const majorPartyIds = [...new Set(playerPartyIds)];
        if (config.parties) {
            config.parties.forEach(p => {
                if (majorPartyIds.length < 2 && !majorPartyIds.includes(p.id)) {
                    majorPartyIds.push(p.id); // 2政党になるまでconfigの上位から補填
                }
            });
        }

        // 💡 割り出した主要政党(majorPartyIds)に基づいて候補者を綺麗に分配
        const majorPres = mainPresidents.filter(c => majorPartyIds.includes(c.party));
        const thirdPartyPres = mainPresidents.filter(c => !majorPartyIds.includes(c.party));

        // 💡 ヘッダーの対戦テキスト（主要2大政党の名前を結合）
        const vsText = majorPres.map(p => {
            const party = config.parties ? config.parties.find(pt => pt.id === p.party) : null;
            return party ? party.name : p.party;
        }).join(' VS ');

        // --- 2. メイン大統領候補アバター（上部用：横並び） ---
        let mainAvatarsHtml = '<div style="display: flex; justify-content: center; gap: 20px; margin: 15px 0;">';

        const seenParties = new Set();

        // 💡 同じ党からは1人だけに制限
        const uniqueMajorPres = majorPres.filter(c => {
            if (!c.party) return true;
            if (seenParties.has(c.party)) return false;
            seenParties.add(c.party);
            return true;
        });

        // 💡 ループ処理（エスケープバグを修正）
        uniqueMajorPres.forEach((c, idx) => {
            if (idx > 0) mainAvatarsHtml += '<div style="align-self: center; font-weight: bold; color: #94a3b8; font-size: 0.9em;">VS</div>';

            const party = config.parties ? config.parties.find(p => p.id === c.party) : null;
            const borderCol = party ? party.color : '#3b82f6';

            mainAvatarsHtml += `
                <div style="text-align: center; width: 80px;">
                    ${c.image ?
                    `<img src="${c.image}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 3px solid ${borderCol}; background: #f1f5f9;" />` :
                    `<div style="width: 50px; height: 50px; border-radius: 50%; border: 3px solid ${borderCol}; background: #e2e8f0; color: #334155; display: flex; align-items: center; justify-content: center; font-size: 0.9em; font-weight: bold; margin: 0 auto;">${c.name.charAt(0)}</div>`
                }
                    <div style="font-size: 0.75em; font-weight: bold; color: #334155; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${c.name}</div>
                </div>
            `;
        });

        mainAvatarsHtml += '</div>';

        // --- 3. 中央：第3党候補エリア（存在する場合のみ表示） ---
        let thirdPartyHtml = '';
        if (thirdPartyPres.length > 0) {
            thirdPartyHtml += `<div style="margin: 10px 0; text-align: center; background: #fff7ed; border: 1px dashed #ffedd5; padding: 6px; border-radius: 8px;">
                <span style="font-size: 0.7em; background: #ff9800; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; display: inline-block; margin-bottom: 4px;">その他</span>
                <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 12px 16px;">
            `;
            thirdPartyPres.forEach(c => {
                const party = config.parties ? config.parties.find(p => p.id === c.party) : null;
                const borderCol = party ? party.color : '#84cc16';

                thirdPartyHtml += `<span style="display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; font-size: 0.8em; font-weight: 500; color: #475569;">`;

                if (c.image) {
                    thirdPartyHtml += `<img src="${c.image}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 2px solid ${borderCol}; flex-shrink: 0;" />`;
                }
                thirdPartyHtml += `${c.name}</span>`;
            });
            thirdPartyHtml += `</div></div>`;
        }

        // --- 4. 下部：エージェント（選対スタッフ）アバター（小さく表示） ---
        let agentAvatarsHtml = '';
        if (agentList.length > 0) {
            agentAvatarsHtml += '<div style="display: flex; gap: -6px; align-items: center;">';
            agentList.slice(0, 4).forEach(a => {
                const party = config.parties ? config.parties.find(p => p.id === a.party) : null;
                const borderCol = party ? party.color : '#94a3b8';

                if (a.image) {
                    agentAvatarsHtml += `<img src="${a.image}" title="選対参謀: ${a.name}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1.5px solid ${borderCol}; margin-right: -4px; background: #f1f5f9;" />`;
                } else {
                    agentAvatarsHtml += `<div title="選対参謀: ${a.name}" style="width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid ${borderCol}; background: #f1f5f9; color: #64748b; display: flex; align-items: center; justify-content: center; font-size: 0.6em; margin-right: -4px;">${a.name.charAt(0)}</div>`;
                }
            });
            agentAvatarsHtml += `<span style="font-size: 0.7em; color: #64748b; margin-left: 8px; font-weight: bold;">選対スタッフ陣</span></div>`;
        }

        // --- 5. カード全体の組み立て ---
        card.innerHTML = `
            <div>
                <!-- タイトルヘッダー -->
                <div style="margin-bottom: 8px;">
                <!--
                    ${mapBadge} <br /> -->
                    <h3 style="margin:0; font-size: 1.2em; color: #1e293b; font-weight: 700;">${config.mapName}</h3>
                </div>
                
                <!-- 2大政党テキスト -->
                <p style="font-size: 0.8em; font-weight: bold; color: #64748b; margin: 4px 0; text-align: center; letter-spacing: 0.05em;">
                    ${vsText}
                </p>

                <!-- メイン大統領候補（VS配置） -->
                ${mainAvatarsHtml}

                <!-- 第3党エリア（中央に挿入） -->
                ${thirdPartyHtml}
                
                <!-- 選対・エージェントエリア（下部に小さく） -->
                <div style="margin-top: 12px; background: #f8fafc; padding: 8px 10px; border-radius: 8px; border: 1px solid #f1f5f9;">
                    <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <div style="font-size: 0.7em; color: #94a3b8; font-weight: bold; text-transform: uppercase;">Campaign Team</div>
                        <div class="btn-container"></div>
                    </div>
                    ${agentAvatarsHtml}
                </div>
            </div>

            <!-- 最下部 ステータス -->
            <div style="border-top: 1px solid #f1f5f9; padding-top: 10px; margin-top: 15px; display: flex; justify-content: space-between; align-items: center;">
                <p style="font-size: 0.8em; color: #64748b; margin: 0;">勝利必要票数:</p>
                <span style="font-size: 0.9em; color: #1e293b; font-weight: bold; background: #f1f5f9; padding: 2px 8px; border-radius: 6px;">
                    ${config.totalvotesToWin} 票
                </span>
            </div>
        `;

        // 💡 モーダル起動ボタンをJS要素として動的生成して安全イベント設定
        const detailBtn = document.createElement('button');
        detailBtn.innerText = "🔍 詳しく検索";
        detailBtn.style.cssText = "font-size: 0.7em; background: #e2e8f0; border: none; border-radius: 4px; padding: 2px 6px; cursor: pointer; color: #334155; font-weight: bold;";

        detailBtn.onclick = (e) => {
            e.stopPropagation(); // 親カードのゲーム開始処理をストップ
            openScenarioDetailModal(config, e); // config を安全に直接渡す！
        };

        // ボタンを配置
        card.querySelector('.btn-container').appendChild(detailBtn);

        // ホバー・クリックイベント
        card.onmouseenter = () => {
            card.style.transform = "translateY(-4px)";
            card.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
        };
        card.onmouseleave = () => {
            card.style.transform = "translateY(0)";
            card.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
        };

        // カード全体をクリックしたら即ゲーム開始
        card.onclick = (e) => openScenarioDetailModal(config, e);

        listContainer.appendChild(card);
    });
}

let currentModalScenario = null;
let currentScenarioPeople = []; // 現在選択されたシナリオの全人物データ

// シナリオ詳細モーダルを開く関数
function openScenarioDetailModal(config, event) {
    if (event) event.stopPropagation(); // シナリオ即開始とクリックバブリングを分離

    currentModalScenario = config;
    document.getElementById('modal-scenario-title').innerText = config.mapName;

    const partyNames = config.parties ? config.parties.map(p => p.name).join(' VS ') : '';
    document.getElementById('modal-scenario-sub').innerText = `${config.mapSource || 'USMAP'} | ${partyNames} | 勝利ライン: ${config.totalVotesToWin}票`;

    // 「開始する」ボタンの動的バインド
    document.getElementById('modal-start-btn').onclick = () => {
        closeScenarioModal();
        startScenario(config);
    };

    // 党フィルター選択肢の初期化
    const partySelect = document.getElementById('modal-party-filter');
    partySelect.innerHTML = '<option value="ALL">全政党</option>';
    if (config.parties) {
        config.parties.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = p.name;
            partySelect.appendChild(opt);
        });
    }

    // 全人物データ（候補者＋エージェント）の標準化フォーマット化
    currentScenarioPeople = [];

    // 1. 候補者を追加
    if (config.candidates) {
        Object.entries(config.candidates).forEach(([id, c]) => {
            let roleType = c.isMate ? "MATE" : "PRESIDENT";
            let roleLabel = c.isMate ? "副大統領候補" : (c.npc ? "予備選ライバル" : "大統領候補");

            currentScenarioPeople.push({
                id: id,
                name: c.name,
                image: c.image || "",
                party: c.party,
                home: c.state || "-",
                power: c.isIncumbent ? "現職" : "新人",
                desc: `${c.state || ''}選出。${c.primary ? '予備選挙に出馬。' : ''}${c.npc ? '（プレイ不可）' : '（プレイヤー選択可能）'}`,
                roleType: roleType,
                roleLabel: roleLabel,
                isAgent: false
            });
        });
    }

    // 2. エージェント/選対スタッフを追加
    if (config.agents) {
        config.agents.forEach(a => {
            currentScenarioPeople.push({
                id: a.id,
                name: a.name,
                image: a.image || "",
                party: a.party,
                home: a.home || "-",
                power: `能力: ${a.power || 15}`,
                desc: a.desc || "選挙陣営の人物。",
                roleType: "AGENT",
                roleLabel: "選対スタッフ/参謀",
                isAgent: true
            });
        });
    }

    // フィルターの初期化と描画
    document.getElementById('modal-person-search').value = '';
    document.getElementById('modal-role-filter').value = 'ALL';
    document.getElementById('modal-party-filter').value = 'ALL';

    filterModalPeople();

    const modal = document.getElementById('scenario-detail-modal');
    modal.style.display = 'flex';
}

function closeScenarioModal() {
    document.getElementById('scenario-detail-modal').style.display = 'none';
}

// モーダル内の検索・フィルター実行
function filterModalPeople() {
    if (!currentModalScenario) return;

    const searchText = document.getElementById('modal-person-search').value.toLowerCase();
    const roleFilter = document.getElementById('modal-role-filter').value;
    const partyFilter = document.getElementById('modal-party-filter').value;

    const filtered = currentScenarioPeople.filter(p => {
        const matchesRole = (roleFilter === 'ALL') || (p.roleType === roleFilter);
        const matchesParty = (partyFilter === 'ALL') || (p.party === partyFilter);

        const targetStr = `${p.name} ${p.desc} ${p.home} ${p.roleLabel}`.toLowerCase();
        const matchesSearch = targetStr.includes(searchText);

        return matchesRole && matchesParty && matchesSearch;
    });

    renderModalPeopleCards(filtered);
}

// モーダル内の人物カード一覧の描画
function renderModalPeopleCards(people) {
    const container = document.getElementById('modal-people-list');
    const countEl = document.getElementById('modal-person-count');
    container.innerHTML = '';

    countEl.innerText = `該当件数: ${people.length} 名`;

    if (people.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 30px;">条件に合う人物が見つかりません</div>';
        return;
    }

    people.forEach(p => {
        const partyObj = currentModalScenario.parties ? currentModalScenario.parties.find(pt => pt.id === p.party) : null;
        const partyColor = partyObj ? partyObj.color : '#64748b';
        const partyName = partyObj ? partyObj.name : p.party;

        const card = document.createElement('div');
        card.style.cssText = `
            background: white;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
            padding: 14px;
            display: flex;
            gap: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        `;

        // 画像アイコン
        const imgHtml = p.image ?
            `<img src="${p.image}" style="width: 54px; height: 54px; border-radius: 50%; object-fit: cover; border: 2px solid ${partyColor}; flex-shrink: 0;" />` :
            `<div style="width: 54px; height: 54px; border-radius: 50%; border: 2px solid ${partyColor}; background: #f1f5f9; color: #475569; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">${p.name.charAt(0)}</div>`;

        card.innerHTML = `
            ${imgHtml}
            <div style="flex: 1; min-width: 0;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 4px;">
                    <div style="font-weight: bold; color: #0f172a; font-size: 0.95em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</div>
                    <span style="font-size: 0.7em; padding: 2px 6px; border-radius: 4px; background: ${partyColor}; color: white; white-space: nowrap;">${partyName}</span>
                </div>
                <div style="font-size: 0.75em; color: #2563eb; margin: 2px 0 6px; font-weight: 500;">
                    ${p.roleLabel} • 出身: ${p.home} (${p.power})
                </div>
                <div style="font-size: 0.75em; color: #64748b; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${p.desc}
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

// 検索＆ドロップダウンによる絞り込み処理
function filterScenarios() {
    const searchText = (document.getElementById('scenario-search')?.value || '').toLowerCase();
    const selectedMap = document.getElementById('map-filter')?.value || 'ALL';

    const filtered = allScenarios.filter(config => {
        // マップフィルターの一致判定
        const matchesMap = (selectedMap === 'ALL') || (config.mapSource === selectedMap);

        // 検索ワードの判定（タイトル、マップ種別、政党名、出馬候補者名からヒットさせる）
        const partyNames = config.parties ? config.parties.map(p => p.name).join(' ') : '';
        const candNames = config.candidates ? Object.values(config.candidates).map(c => c.name).join(' ') : '';
        const targetString = `${config.mapName} ${config.mapSource} ${partyNames} ${candNames}`.toLowerCase();

        const matchesSearch = targetString.includes(searchText);

        return matchesMap && matchesSearch;
    });

    renderScenarios(filtered);
}
