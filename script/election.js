
window.addEventListener('load', initMenu);

// 暫定結果
function setupEvents() {
    let startX, startY;

    document.querySelectorAll('path').forEach(stateEl => {
        // 1. マウス（または指）が押された瞬間の座標を記録
        stateEl.addEventListener('mousedown', function (e) {
            startX = e.clientX;
            startY = e.clientY;
        });

        // 2. 離されたときに、押した時との距離を比べる
        stateEl.addEventListener('mouseup', function (e) {
            const diffX = Math.abs(e.clientX - startX);
            const diffY = Math.abs(e.clientY - startY);

            // 距離が5ピクセル以上なら「これはドラッグだ」とみなして何もしない
            if (diffX > 5 || diffY > 5) {
                return;
            }
            const stateId = this.id;
            const stateData = currentMap.states[stateId];
            const support = stateSupport[stateId];
            const stateName = stateData?.name || stateId;
            const classList = (stateData?.class || "").split(/\s+/);
            const isAppoint = classList.includes("appoint");
            if (typeof stateData.votes === 'undefined') return;
            if (!stateData || !support) {
                openModal(`${stateName}の情勢`, `
                <p><strong>選挙人数:</strong> ${stateData.votes}票</p>
                <hr>
                <center>データなし</center>
                ${isAppoint ? "" : `
                        <button onclick="executeCampaign('${stateId}')" class="campaign-btn">
                            ここに行く
                        </button>`
                    }
            `);
                return;
            };


            // -------------------------------------------------------------
            // ⭐【追加】予測される勝者・選挙人の計算ロジック
            // -------------------------------------------------------------
            let winnerText = "";
            const totalVotes = stateData.votes || 0;

            // 支持率（support）のオブジェクトから、[政党ID, 支持率] の配列を作ってソート
            const sortedSupport = Object.entries(support)
                .filter(([_, val]) => val > 0)
                .sort((a, b) => b[1] - a[1]); // 支持率が高い順
            if (isWinnerTakeAll) {
                // 【勝者総取り（通常ルール）】 1位の政党が全選挙人を獲得
                // ⭐【修正】 sortedSupport の「0番目（1位）」をしっかり指定して分解する！
                const [topPartyId, topVal] = sortedSupport[0];

                const party = currentMap.parties.find(p => p.id === topPartyId);
                const color = party ? party.color : "#000";

                const candidateList = Object.values(currentMap.candidates || {});
                const candidate = candidateList.find(c => c.party === topPartyId);

                const candidateName = candidate ? candidate.name : `${topPartyId}候補`;
                const iconUrl = candidate ? candidate.image : "./img/cand/default.png";

                winnerText = `
        <p><strong>予測される勝者:</strong><br>
            <span style="display: inline-flex; align-items: center; gap: 8px; font-size: 1.1em; color: ${color}; font-weight: bold;">
                <img src="${iconUrl}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 2px solid ${color};">
                ${candidateName}
            </span>
            （${totalVotes}票獲得）
        </p>`;
            }
            else {
                // 【比例配分ルール】 支持率に応じて選挙人を分配
                winnerText = `<p><strong>予測される勝者:</strong><br>`;
                sortedSupport.forEach(([pid, val]) => {
                    const party = currentMap.parties.find(p => p.id === pid);
                    const color = party ? party.color : "#000";

                    // party（政党ID）が一致する候補者を探す
                    const candidateList = Object.values(currentMap.candidates || {});
                    const candidate = candidateList.find(c => c.party === pid);

                    const candidateName = candidate ? candidate.name : `${pid}`;
                    const iconUrl = candidate ? candidate.image : "./img/cand/default.png";

                    // 支持率の割合（val / 100）をかけて割り当て票数を計算
                    const allocatedVotes = Math.round((val / 100) * totalVotes);
                    if (allocatedVotes > 0) {
                        winnerText += `
                <span style="display: inline-flex; align-items: center; gap: 6px; margin: 4px 0; color: ${color}; font-weight: bold;">
                    <img src="${iconUrl}" style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover; border: 1.5px solid ${color};">
                    ${candidateName}: <strong>${allocatedVotes}票</strong> (${val.toFixed(1)}%)
                </span><br>`;
                    }
                });
                winnerText += `</p>`;
            }


            // 2. モーダルに表示するコンテンツを作成
            // 各政党の支持率をリスト化する
            let supportDetails = "<ul>";
            Object.entries(support).forEach(([pid, val]) => {
                const party = currentMap.parties.find(p => p.id === pid);
                const partyName = party ? party.name : pid;
                const color = party ? party.color : "#000";
                if (val === 0) return;
                // バーチャート風の見た目にする
                supportDetails += `
                    <li style="list-style:none; margin: 10px 0;">
                        <strong>${partyName}</strong>: ${val.toFixed(1)}%
                        <div style="background:#eee; width:100%; height:10px; border-radius:5px;">
                            <div style="background:${color}; width:${val}%; height:100%; border-radius:5px;"></div>
                        </div>
                    </li>`;
            });
            supportDetails += "</ul>";

            // 3. 汎用モーダルを開く
            openModal(`${stateName}の情勢`, `
        <p><strong>選挙人数:</strong> ${totalVotes}票</p>
        ${winnerText}
        <hr>
        ${supportDetails}
                ${isAppoint ? "" : `
                        <button onclick="executeCampaign('${stateId}')" class="campaign-btn">
                            ここに行く
                        </button>`
                }
            `);
        });
    });
}
function checkNpcHiring(npcId, stateId) {
    const npc = currentMap.candidates[npcId];
    if (!npc) return;

    // --- ここでエラーを防ぐ！ ---
    // stateSupport[stateId] が無い場合は支持率 0% として扱う
    const stateData = stateSupport[stateId];
    if (!stateData) {
        console.warn(`${stateId} の支持率データが見つかりません`);
        return;
    }
    const support = stateData[npc.party];
    // --------------------------

    // 支持率60%以上、かつ党派(party)が一致するエージェントを探す
    const targetAgent = currentMap.agents.find(a =>
        a.party === npc.party && // 党派重視
        a.home === stateId &&
        a.owner === null
    );

    if (targetAgent && support >= 60) {
        targetAgent.owner = npcId;
        targetAgent.currentState = stateId;
        console.log(`%c[雇用] ${npc.name} が ${targetAgent.name} を仲間にしました`, "color: orange;");
    }
}

function openAgentList() {
    const tbody = document.getElementById('agent-list-table-body');
    tbody.innerHTML = ""; // 中身をリセット

    currentMap.agents.forEach(agent => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = "1px solid #ddd";
        let agentColor = "#7f8c8d";

        // 状態（誰が雇っているか）のテキスト
        let statusText = "フリー";
        let statusStyle = "color: gray;";
        if (agent.owner) {
            const owner = currentMap.candidates[agent.owner];
            statusText = owner.name;
            const ownerCandi = currentMap.candidates[agent.owner];
            if (ownerCandi) {
                // 候補者の所属政党（GOP, DEM等）に一致するパーツデータを取得
                const ownerParty = currentMap.parties.find(p => p.id === ownerCandi.party);
                // 政党データに設定されている色（color）を使う
                if (ownerParty) {
                    agentColor = ownerParty.color;
                }
            }


        }

        statusStyle = `color: ${agentColor}; font-weight: bold;`;

        tr.innerHTML = `
            <td style="padding: 10px;">${agent.name}</td>
            <td style="padding: 10px;">${agent.home}</td>
            <td style="padding: 10px; ${statusStyle}">${statusText}</td>
            <td style="padding: 10px;">
                <button onclick="showAgentModal('${agent.id}')" style="cursor:pointer;">詳細</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    openModal("エージェント一覧", document.getElementById('agent-list-modal-content').innerHTML);
}

// 雇用・管理用の関数
function showAgentModal(agentId) {
    const agent = currentMap.agents.find(a => a.id === agentId);
    if (!agent) return;

    // 現在のプレイヤーID
    const myId = selectedPresident;

    let buttonHtml = "";

    if (agent.owner === null) {
        // まだ誰のものでもない場合：雇用ボタン
        buttonHtml = `
            <button onclick="confirmHire('${agent.id}')" style="background:#28a745; color:white; border:none; padding:12px; border-radius:5px; width:100%; cursor:pointer; font-weight:bold;">
                雇う
            </button>`;
    } else if (agent.owner === myId) {
        // 自分が雇い主の場合：クビにするボタン
        buttonHtml = `
            <button onclick="confirmFire('${agent.id}')" style="background:#dc3545; color:white; border:none; padding:12px; border-radius:5px; width:100%; cursor:pointer; font-weight:bold;">
                解雇する
            </button>`;
    } else {
        // 他のNPCが雇っている場合
        const ownerData = currentMap.candidates[agent.owner];
        const ownerName = ownerData ? ownerData.name : "Error";
        buttonHtml = `<p style="color:red; font-weight:bold;">${ownerName}陣営が雇用中</p>`;
    }

    const content = `
        <div style="text-align: center;">
            <img src="${agent.image}" style="width:100px; height:100px; border-radius:50%; border:3px solid ${agent.owner ? '#dc3545' : '#ccc'};">
            <h2>${agent.name}</h2>
            <p>${agent.party}</p>
            <p style="text-align:left; background:#f8f9fa; padding:10px; border-radius:5px;">${agent.desc}</p>
            <div style="margin-bottom:15px; text-align:left; font-size:0.9em;">
                <strong>出身地域:</strong> ${agent.home}
            </div>
            ${buttonHtml}
        </div>
    `;
    openModal("エージェント管理", content);
}

// 雇用実行
function confirmHire(agentId) {
    const agent = currentMap.agents.find(a => a.id === agentId);
    if (!agent) return;

    // 1. 党派のチェック
    const playerCandi = currentMap.candidates[selectedPresident];
    if (agent.party !== playerCandi.party) {
        alert(`${agent.name}は${agent.party === 'GOP' ? '共和党' : '民主党'}の人間だ。我々（${playerCandi.party}）の陣営には加わらないだろう。`);
        return;
    }

    // 2. 支持率のチェック（エージェントのホームステートを基準にする）
    const stateData = stateSupport[agent.home];
    if (!stateData) {
        console.error(`エラー: 州 '${agent.home}' の支持率データが stateSupport に存在しません。`);
        alert(`データエラー: ${agent.home} の情報が読み込めません。`);
        return;
    }
    // ------------------------------

    const support = stateData[playerCandi.party];
    if (support < 60) {
        alert(`${agent.home}での我々の支持率は ${support}% です。${agent.name}を動かすには、少なくとも60%以上の支持が必要です！`);
        return;
    }

    // すべての条件をクリア
    agent.owner = selectedPresident; // プレイヤーのIDをセット
    agent.currentState = agent.home; // 初期位置をセット

    closeModal();
    alert(`【雇用成功】${agent.name}が陣営に加わりました！`);

    // アイコンを即時更新
    updateCandidateIcons();
}
// 解雇実行（クビ）
function confirmFire(agentId) {
    if (!confirm("本当に解雇しますか？（他陣営に引き抜かれる可能性があります）")) return;

    const agent = currentMap.agents.find(a => a.id === agentId);
    agent.owner = null; // ownerを空にする
    closeModal();
    alert(`${agent.name} を解雇しました。`);
}
function getBestStateForParty(partyId) {
    const candiId = Object.keys(currentMap.candidates).find(id => currentMap.candidates[id].party === partyId);
    const candi = currentMap.candidates[candiId];
    // 防御策：もしデータがおかしければ、配列の最初の州ではなく、全州からランダムに返す
    const stateIds = Object.keys(currentMap.states);
    if (!candi || stateIds.length === 0) return stateIds[Math.floor(Math.random() * stateIds.length)];

    const isIncumbent = candi.isIncumbent || candi.power === "現職";
    const topTwoPartyIds = [...currentMap.parties]
        .sort((a, b) => b.seats - a.seats)
        .slice(0, 2)
        .map(party => party.id); // 例: ["LDP", "CDP"]

    // 2. 上位2政党に含まれていない場合は「諸派（Third Party）」と判定する
    const isThirdParty = !topTwoPartyIds.includes(partyId);
    const cutoffLine = isThirdParty ? 0 : 35; // 🌟サードパーティの足切りを完全にゼロ化（絶対に0点にしない）

    let stateScores = stateIds.map(sId => {
        const stateData = currentMap.states[sId];
        const support = stateSupport[sId] || {};
        const sClass = stateData.class || "";

        // 浮動票の補正計算
        let mySupport = support[partyId] || 0;
        if (mySupport === 0 && isThirdParty) {
            let majorSupportSum = 0;
            Object.entries(support).forEach(([pid, val]) => {
                if (pid === "GOP" || pid === "DEM") majorSupportSum += val;
            });
            mySupport = Math.max(0, 100 - majorSupportSum);
        }

        // ランキングの作成
        const fullSupportMap = { ...support };
        fullSupportMap[partyId] = mySupport;
        const sorted = Object.entries(fullSupportMap)
            .map(([pid, val]) => ({ id: pid, score: val }))
            .sort((a, b) => b.score - a.score);

        const leadingParty = sorted.length > 0 ? sorted[0].id : null;
        const maxSupport = sorted.length > 0 ? sorted[0].score : 0;
        const rivalSupport = (leadingParty === partyId && sorted.length > 1) ? sorted[1].score : maxSupport;
        const margin = Math.abs(mySupport - rivalSupport);

        // 🌟 基本スコア（アラスカ対策：アラスカ(AK)なら強制的に基本スコアを落とす）
        let score = (sId === "AK") ? 1 : 20;

        if (isThirdParty) {
            // 諸派は巨大州を狙うより、地道に票を稼ぐために票数の重みをかなり小さくする（15.0 → 2.0など）
            score += (stateData.votes || 3) * 2.0;
        } else {
            // 主要2大政党（GOP/DEM）は今まで通り巨大州に強烈な引力を生ませる
            score += (stateData.votes || 3) * 15.0;
        }
        if (candi.region && candi.region !== "NONE" && sClass.includes(candi.region)) {
            score += 25;
        }

        // 🛠️ 修正部分：足切りと激戦区（スイング・ステート）判定
        if (!isThirdParty && (sClass.includes(`anti-${partyId}`) || mySupport < cutoffLine)) {
            // 主要政党（GOP/DEM）用の足切り
            score = -999;
        } else if (sClass.includes("appoint")) {
            score = -999;
        } else if (isThirdParty) {
            // 🌟 諸派専用のスコアリング（勝ち負け関係なく、支持率が高い州を優先して狙う）
            if (sClass.includes(`anti-${partyId}`) || mySupport <= 0) {
                score = 0; // 支持率が完全に0％、または明確なアンチ州なら0点
            } else {
                score += mySupport * 10.0; // 支持率が高い州ほど高スコア（例: 5%なら+50点）
            }
        } else {
            // 主要政党（GOP/DEM）の激戦区判定（既存のロジック）
            if (leadingParty === partyId) {
                if (margin < 5) {
                    score += 60; // 🌟超危険！今すぐ守れ！（最優先）
                } else if (margin < 12) {
                    score += 40; // 安全圏に入れたいので補強
                } else {
                    score += 0;  // 大勝している州は放置（リソースの無駄）
                }
            } else {
                if (margin < 5) {
                    score += 70; // 🌟あと一歩で奪える！最大チャンス（最優先）
                } else if (margin < 15) {
                    score += 45; // 射程圏内、攻め込む価値あり
                } else if (margin >= 60) {
                    score = 0;   // 🌟大差で負けている州は「捨て州」にする（主要政党のみ）
                }
            }
        }

        return { id: sId, score: Math.max(0, score) };
    });

    const totalScore = stateScores.reduce((sum, item) => sum + item.score, 0);

    if (totalScore === 0) {
        console.log(`⚠️ AI(${partyId}) のスコアが全滅したため、最大票数の州へフォールバックします`);
        return stateIds.reduce((bestId, currentId) => {
            const bestVotes = currentMap.states[bestId]?.votes || 0;
            const currentVotes = currentMap.states[currentId]?.votes || 0;
            return currentVotes > bestVotes ? currentId : bestId;
        }, stateIds[0]);
    }

    let randomVal = Math.random() * totalScore;
    for (const item of stateScores) {
        randomVal -= item.score;
        if (randomVal <= 0) return item.id;
    }

    return stateIds[Math.floor(Math.random() * stateIds.length)];
}


function runAgentsTurn() {
    currentMap.agents.forEach(agent => {
        if (!agent.owner) return;

        // 雇い主の候補者データを取得
        const ownerData = currentMap.candidates[agent.owner];
        if (!ownerData) return;

        // ❌ ランダムを廃止し、雇い主の政党にとって「今一番おいしい州」をAIに選ばせる！
        const targetId = getBestStateForParty(ownerData.party);

        agent.currentState = targetId;

        // 応援の効果量計算
        const boost = Math.floor(Math.random() * agent.power) + 3;

        // 先ほど統合した共通の選挙活動関数（executeCampaign）をエージェントでも使いたい場合は以下のように、
        // あるいは既存のupdateStateSupportのままでもOKです
        updateStateSupport(targetId, ownerData.party, boost);

        showSpeechBubble({ name: agent.name }, targetId, `応援に駆けつけました！`);
    });

    updateCandidateIcons();
}


// 実際に「演説」ボタンを押した時の処理
function executeCampaign(stateId, partyId = null, isNpc = false, candidateidcandidateId = selectedPresident) {
    const stateData = currentMap.states[stateId];
    const stateClass = stateData ? stateData.class : "";
    const stateName = stateData.name || stateId;
    if (stateClass.includes("appoint")) {
        return;
    }
    // ── 使うデータと政党IDの特定 ──
    // NPCなら引数のpartyIdから候補者データを検索、プレイヤーならselectedPresidentから取得
    if (!isNpc) {
        partyId = currentMap.candidates[selectedPresident].party;
    }

    let candiId = candidateidcandidateId || Object.keys(currentMap.candidates).find(id => currentMap.candidates[id].party === partyId);
    const candiData = currentMap.candidates[candiId];
    console.log(candiData);
    if (!candiData) return 0; // データがなければ終了

    // ── プレイヤーのみの行動制限（NPCはスタミナ制限を受けない） ──
    if (!isNpc) {
        if (!actionPoints) {
            openModal(`疲れた`, `疲れたので待つ必要があります、部下など雇って派遣することもできます。`);
            return 0;
        }
        actionPoints = false; // 1回クリックしたら行動不能に
    }

    // ── ベースのブースト量決定 ──
    let amount = 0;
    if (isNpc) {
        amount = Math.floor(Math.random() * 8) + 4; // NPCの基本 4～11%
        if (candiData.isIncumbent || candiData.power === "現職") {
            amount += 2; // NPCの現職ボーナス
        }
    } else {
        amount = Math.floor(Math.random() * 10) + 3; // プレイヤーの基本 3～12%
    }

    let finalAmount = amount;

    // ── ★ここに地域補正・汎用システムを集約！★ ──
    if (candiData.party && stateClass) {

        // 1. 【超大好物】「like-政党名」が含まれる州（例: class: "south like-DIX"）
        if (stateClass.includes(`like-${candiData.party}`)) {
            finalAmount = amount * 1.5;
            console.log(`🔥 [地域熱狂] ${candiData.name} の大得意な地盤！ 効果: ${finalAmount}`);
        }

        // 2. 【大の苦手】「anti-政党名」が含まれる州（例: class: "south anti-DIX"）
        else if (stateClass.includes(`anti-${candiData.party}`)) {
            finalAmount = amount * 0.1;
            console.log(`❄️ [地域拒絶] ${candiData.name} はこの地域で激しく嫌われている... 効果: ${finalAmount}`);
        }

        // 3. 【通常の得意地域】候補者の所属regionと州の地域タグが一致する場合（例: region: "south"）
        else if (candiData.region && candiData.region !== "NONE" && stateClass.includes(candiData.region)) {
            finalAmount = amount * 1.0; // 本来の地域ボーナス（必要なら1.5倍などに調整可）
            console.log(`☀️ [地域一致] ${candiData.name} の活動地域内。 効果: ${finalAmount}`);
        }

        // 4. 【ウォレス等の全国泡沫用】得意地域を持たない全国移動型（例: region: "NONE"）
        else if (candiData.region === "NONE") {
            finalAmount = amount * 0.06;
            console.log(`🍃 [全域微風] 全国一律で効果が薄い。 効果: ${finalAmount}`);
        }

        // 5. 【それ以外「普通」】
        else {
            finalAmount = amount * 0.5;
        }


    }

    // 出身州ボーナス
    if (candiData.state && stateId === candiData.state) {
        finalAmount = finalAmount * 1.5;
    }

    // 四捨五入
    finalAmount = Math.round(finalAmount * 10) / 10;

    // 1. 支持率アップ（計算）
    updateStateSupport(stateId, candiData.party, finalAmount);

    // 2. 居場所を更新
    candidatePositions[candiId] = stateId;
    updateCandidateIcons();

    if (!isNpc) {
        const resulttext = getResultText(stateName, candiData, finalAmount);
        openModal(resulttext[0], resulttext[1]);
    }

    return finalAmount;
}

let getResultText = (stateName, candiData, finalAmount) => [
    `${stateName}での結果`,
    `<p>${candiData.name}の演説により、支持率が <span style="color: #27ae60; font-size: 1.5em;">+${finalAmount}%</span> アップしました！</p>`
];

/**
 * 汎用モーダルを表示する
 * @param {string} title - タイトル
 * @param {string} message - 本文（HTMLも可）
 */
function openModal(title, message) {
    const modal = document.getElementById('generic-modal');
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-body').innerHTML = message;

    modal.style.display = 'flex';
}

/**
 * モーダルを閉じる
 */
function closeModal() {
    document.getElementById('generic-modal').style.display = 'none';
}

async function getMapSource(fileName) {
    try {
        // 動的インポートを実行
        const module = await import(`.../maps/${fileName}.js`);

        // モジュールからUSMAPを取り出す
        // export default USMAP なら module.default
        // export const USMAP なら module.USMAP
        return module.map;
    } catch (error) {
        console.error(`[MapLoader] "${fileName}.js" の読み込みに失敗:`, error);

        // フォールバック用の最小限のSVGデータを返す
        // これを返しておけば、呼び出し側で container.innerHTML = source.map が壊れない
        return {
            map: `<svg width="500" height="300" viewBox="0 0 500 300">
                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="red">
                        Error: MAP "${fileName}" NOT FOUND
                    </text>
                  </svg>`,
            error: true
        };
    }
}

function advanceTime() {
    // 初回実行時に開始日をセット
    if (!currentDate) {
        currentDate = new Date(currentMap.startDate);
    }
    presData = currentMap.candidates[selectedPresident];
    mateData = currentMap.candidates[selectedMate];
    runAgentsTurn();
    setupEvents();
    processEvents();
    actionPoints = true

    const logEl = document.getElementById('primary-log');
    if (logEl) logEl.innerText = "🔄 ターンが経過し、行動可能になりました！";



    updateMainCandidateDisplay(selectedPresident, selectedMate);
    setupOpponent(selectedPresident);

    // 設定されたスピード分だけ日付を進める
    currentDate.setDate(currentDate.getDate() + gameSpeed);

    // 画面表示用のフォーマット (YYYY-MM-DD)
    const dateStr = currentDate.toISOString().split('T')[0];
    const displayElement = document.getElementById('current-date');
    if (displayElement) displayElement.innerText = dateStr;

    allNpcsTurn();

    // 進行度をバーとかで出しても面白いかもね！
    updateProgress(dateStr);

    // 投票日判定
    if (dateStr >= currentMap.electionDate) {
        alert("投票日です！");
        finishGame();
    }
}
function updateStateSupport(stateId, partyId, amount) {
    const stateData = currentMap.states[stateId];
    if (!stateSupport[stateId]) {
        stateSupport[stateId] = {};
        if (stateData && stateData.baseSupport) {
            currentMap.parties.forEach(p => {
                stateSupport[stateId][p.id] = stateData.baseSupport[p.id] || 0;
            });
        } else {
            currentMap.parties.forEach(p => {
                stateSupport[stateId][p.id] = 100 / currentMap.parties.length;
            });
        }
    }

    // 2. イベントの場合は倍率計算なしでそのまま反映！
    stateSupport[stateId][partyId] += amount;

    // 3. 他の全政党から均等に引く
    const otherParties = currentMap.parties.filter(p => p.id !== partyId);
    const reduction = amount / otherParties.length;

    otherParties.forEach(p => {
        stateSupport[stateId][p.id] -= reduction;
        if (stateSupport[stateId][p.id] < 0) stateSupport[stateId][p.id] = 0;
    });

    // 4. 正規化と色更新
    normalizeSupport(stateId);
    refreshStateColor(stateId);
}
function refreshStateColor(stateId) {
    const stateEl = document.getElementById(stateId);
    if (!stateEl || !stateSupport[stateId]) return;

    const supports = stateSupport[stateId];
    const parties = currentMap.parties;

    // 1. すべての政党の支持率を「高い順」に並び替える（第3党、第4党も自動対応）
    const sortedSupports = Object.entries(supports)
        .map(([pid, val]) => ({ id: pid, score: val }))
        .sort((a, b) => b.score - a.score);

    if (sortedSupports.length === 0) return;

    // 1位の政党データを取得
    const winnerPartyId = sortedSupports[0].id;
    const partyData = parties.find(p => p.id === winnerPartyId);

    if (partyData) {
        const topScore = sortedSupports[0].score;
        // 2位がいればそのスコア、いなければ0（単独トップの場合）
        const secondScore = sortedSupports.length > 1 ? sortedSupports[1].score : 0;

        // 💡 運命の「1位と2位の支持率の差」
        const margin = topScore - secondScore;

        let finalColor = "";

        // 🟥🟦🟩 【超滑らかロジック】
        if (margin < 20) {
            // ① 差が20%未満：接戦ゾーン（差が0%に近づくほど、白に近いグレー #e2e8f0 へ滑らかに変化）
            // 差が 0% なら 白100%、差が 20% なら 元の色100% になるようにブレンド率を計算
            const mixPercent = Math.max(0, Math.min(100, (margin / 20) * 100));
            finalColor = `color-mix(in srgb, ${partyData.color} ${mixPercent}%, #e2e8f0)`;

        } else if (margin < 40) {
            // ② 差が20%〜40%：単独優勢ゾーン（元の色がそのまま100%出る状態から、差が広がるほど黒が混ざる）
            // 差が 20% なら 黒0%、差が 40% なら 黒25% になるようにブレンド率を計算
            const blackPercent = Math.max(0, Math.min(25, ((margin - 20) / 20) * 25));
            const partyPercent = 100 - blackPercent;
            finalColor = `color-mix(in srgb, ${partyData.color} ${partyPercent}%, black)`;

        } else {
            // ③ 差が40%以上：圧倒的独走ゾーン（地盤・安全圏：黒を上限25%まで混ぜたドス黒いソリッドカラー固定）
            finalColor = `color-mix(in srgb, ${partyData.color} 75%, black)`;
        }

        // 💡 透過度は使わず、不透明度100%のソリッドな色でガツンと塗る！
        stateEl.style.fill = finalColor;
        stateEl.style.fillOpacity = "1.0";
    }

    updateScore();
}

let selectedPresident = null;
let selectedMate = null;
let selectedParty = null; // 現在選択中の党ID
let isHistoricalMode = true; // 歴史的展開（NPCのイベント選択肢など）
let isWinnerTakeAll = true;   // 勝者総取り方式
let currentStep = 1;
let totalSteps = 5;
let stepTitles = [
    "Loading...",
    "2. ゲームルール設定",
    "3. 政党を選んでください",
    "4. 大統領候補を選んでください",
    "5. 副大統領候補を選んでください"
];

let notmate = false

async function startScenario(config) {
    console.log(config);
    currentMap = config;

    document.getElementById('scenario-selector').style.display = 'none';
    document.getElementById('setup-screen').style.display = 'block';
    document.getElementById('js-mp-container').style.display = 'block';

    // 開始時にステップを1に初期化
    currentStep = 1;
    stepTitles[0] = currentMap.mapName
    if (!currentMap.mate) notmate = true;
    else notmate = false;



    updateStepUI();

    selectedPresident = null;
    selectedMate = null;

    let introArea = document.getElementById('scenario-intro-area');
    if (!introArea) {
        introArea = document.createElement('div');
        introArea.id = 'scenario-intro-area';
        document.getElementById('step-content-1').appendChild(introArea);
    }
    introArea.innerHTML = `${config.description || "このシナリオの情報はありません。"}`;

    // --- ステップ2の箱の中にオプションエリアを作成・挿入 ---
    let optionsArea = document.getElementById('game-options-area');
    if (!optionsArea) {
        optionsArea = document.createElement('div');
        optionsArea.id = 'game-options-area';
        document.getElementById('step-content-2').appendChild(optionsArea);
    }
    isHistoricalMode = true;
    isWinnerTakeAll = true;

    optionsArea.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer;">
                <input type="checkbox" id="chk-historical" checked style="margin-top: 4px; cursor: pointer;">
                <div>
                    <strong>歴史的な展開（AIイベント選択）</strong>
                    <div style="font-size: 0.85em; color: #777; margin-top: 2px;">AIの候補者が歴史上の史実に基づいたイベントや選択肢を選びます。</div>
                </div>
            </label>
            <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer;">
                <input type="checkbox" id="chk-wta" checked style="margin-top: 4px; cursor: pointer;">
                <div>
                    <strong>勝者総取り方式（Winner-Take-All）</strong>
                    <div style="font-size: 0.85em; color: #777; margin-top: 2px;">各州で1票でも多く獲得した勝者が、その州の選挙人をすべて獲得します。（オフにすると得票率に応じた比例配分になります）</div>
                </div>
            </label>
        </div>
    `;

    document.getElementById('chk-historical').addEventListener('change', (e) => {
        isHistoricalMode = e.target.checked;
    });
    document.getElementById('chk-wta').addEventListener('change', (e) => {
        isWinnerTakeAll = e.target.checked;
    });

    // --- 【修正】Step3のプルダウンを取得して中身を生成 ---
    const partyDropdown = document.getElementById('party-dropdown');
    partyDropdown.innerHTML = '';

    // 【修正】config.candidates の Object から候補者配列を作成
    const allCandidates = config.candidates ? Object.values(config.candidates) : [];

    // 政党の選択肢を追加
    config.parties.forEach((party) => {
        // この政党に属する大統領候補（!isMate）を抽出
        const partyPresidents = allCandidates.filter(c => {
            const matchParty = (c.partyId === party.id || c.party === party.id || c.party_id === party.id);
            return matchParty && !c.isMate;
        });

        // 大統領候補が全員NPC（npc === true）か、または候補者がそもそも0人ならスキップ
        const hasPlayableCandidate = partyPresidents.some(c => c.npc !== true);
        if (!hasPlayableCandidate) return;


        // プレイヤーが選べる候補がいる場合のみ、選択肢に追加
        const opt = document.createElement('option');
        opt.value = party.id;
        opt.innerText = party.name;
        partyDropdown.appendChild(opt);
    });

    // ◆ 政党プルダウンが変更された時の連動イベント
    partyDropdown.onchange = (e) => {
        const partyId = e.target.value;
        const infoWindow = document.getElementById('party-info-window');

        if (!partyId) {
            infoWindow.style.display = 'none'; // 未選択なら非表示
            return;
        }

        selectedParty = partyId;
        presparty = partyId;
        mateparty = partyId;

        // 選択された政党のデータをconfigから取得
        const selectedPartyData = config.parties.find(p => p.id === partyId);
        const partyColor = selectedPartyData ? selectedPartyData.color : '#000';
        const partyName = selectedPartyData ? selectedPartyData.name : '';

        // この政党に属する大統領候補（!isMate）を Object から抽出
        const allCandidates = config.candidates ? Object.values(config.candidates) : [];
        const partyPresidents = allCandidates.filter(c => {
            const matchParty = (c.partyId === partyId || c.party === partyId || c.party_id === partyId);
            return matchParty && !c.isMate;
        });

        // 候補者名のリスト（プレイヤー操作可能かNPCかも分かりやすく表記）
        const candidateListHTML = partyPresidents.map(c => {
            return `<li><strong>${c.name}</strong></li>`;
        }).join('');

        const partyMates = allCandidates.filter(c => {
            const matchParty = (c.partyId === partyId || c.party === partyId || c.party_id === partyId);
            return matchParty && c.isMate;
        });

        const mateListHTML = partyMates.map(c => {
            return `<li><strong>${c.name}</strong></li>`;
        }).join('');

        // インフォウィンドウの中身を書き換えて表示
        infoWindow.style.display = 'block';
        infoWindow.style.borderColor = partyColor; // 枠線を政党の色にする
        infoWindow.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <!-- 政党のイメージカラーを示す色ボックス -->
                <div style="width: 20px; height: 20px; background-color: ${partyColor}; border: 1px solid #000; border-radius: 4px;"></div>
                <h4 style="margin: 0; font-size: 1.1em; color: ${partyColor};">${partyName}</h4>
            </div>
            <p style="margin: 0 0 5px 0; font-size: 0.9em; font-weight: bold;">所属する候補:</p>
            <ul style="margin: 0; padding-left: 20px; font-size: 0.95em; line-height: 1.5;">
                ${candidateListHTML || "<li>候補者データがありません</li>"}
            </ul>
            ${mateListHTML ? `<br/><p style="margin: 0 0 5px 0; font-size: 0.9em; font-weight: bold;">選択可能な副候補:</p>
            <ul style="margin: 0; padding-left: 20px; font-size: 0.95em; line-height: 1.5;">
                ${mateListHTML}
            </ul>` : ``}
        `;

        // 【連動】大統領候補のプルダウンを更新
        updateCandidateDropdown(config, partyId, false);
        updateCandidateDropdown(config, partyId, true);
    };
    partyDropdown.selectedIndex = 0;
    partyDropdown.dispatchEvent(new Event('change'));

    // 初期化の最後にステップ1にリセット
    currentStep = 1;
    if (typeof currentMap.custommenu === 'function') {
        currentMap.custommenu();
    }

    if (!audio.src && PLAYLIST.length > 0) {
        loadTrack(0, true);
    }

    updateStepUI();

}

function partynamemenu(config, partyId) {
    const party = config.parties.find(p => p.id === partyId);
    return party ? party.name : partyId; // 見つからなければIDをそのまま返す保険付き
}
function updateCandidateDropdown(config, partyId, isMATEMODE) {
    const prefix = isMATEMODE ? 'mate' : 'president';
    const dropdown = document.getElementById(`${prefix}-dropdown`);
    const infoWindow = document.getElementById(`${prefix}-info-window`);

    if (!dropdown) return;
    dropdown.innerHTML = '';
    if (infoWindow) infoWindow.style.display = 'none';


    if (config.candidates) {
        // オブジェクトの「キー（日本語の名前）」と「値（中身データ）」を両方同時にループ回す
        Object.entries(config.candidates).forEach(([nameKey, candidate]) => {
            const matchParty = (candidate.partyId === partyId || candidate.party === partyId || candidate.party_id === partyId);
            const matchRole = isMATEMODE ? candidate.isMate : !candidate.isMate;

            if (matchParty && matchRole && candidate.npc !== true) {
                const opt = document.createElement('option');
                // 【重要】valueにオブジェクトのキーである「日本語の名前」をそのまま入れます
                opt.value = nameKey;
                opt.innerText = candidate.name || nameKey; // 表示も日本語の名前
                dropdown.appendChild(opt);
            }
        });
    }

    // ◆ プルダウンが変更された時のイベント
    dropdown.onchange = (e) => {
        const selectedName = e.target.value; // ここに日本語の名前（"ハーバート・フーバー"など）が入る

        if (isMATEMODE) {
            selectedMate = selectedName;
        } else {
            selectedPresident = selectedName;
        }

        if (!selectedName) {
            if (infoWindow) infoWindow.style.display = 'none';
            return;
        }

        // 【大修正】配列から探すのをやめ、日本語の名前キーでObjectから一撃でデータを引く！
        const candidateData = config.candidates[selectedName];

        if (candidateData && infoWindow) {
            infoWindow.style.display = 'block';

            const imgEl = document.getElementById(`${prefix}-info-img`);
            const noImgEl = document.getElementById(`${prefix}-info-noimg`);
            const imgUrl = candidateData.image || candidateData.img || candidateData.img_url;

            if (imgEl && noImgEl) {
                if (imgUrl) {
                    imgEl.src = imgUrl;
                    imgEl.style.display = 'block';
                    noImgEl.style.display = 'none';
                } else {
                    imgEl.src = '';
                    imgEl.style.display = 'none';
                    noImgEl.style.display = 'block';
                }
            }

            const bioEl = document.getElementById(`${prefix}-info-bio`);
            const bioText = candidateData.description || candidateData.desc || candidateData.bio || "この候補者の解説はありません。";
            const ptname = partynamemenu(config, partyId);
            if (bioEl) {
                bioEl.innerHTML = `
                    <strong style="font-size: 1.1em;">${candidateData.name}</strong><br><br>
                    <li><strong>所属:</strong> ${ptname}</li>
                    <li><strong>地域:</strong> ${candidateData.state}</li>
                    ${bioText}
                `;
            }
        }
    };

    dropdown.selectedIndex = 0;
    dropdown.dispatchEvent(new Event('change'));

}




function changeStep(direction) {
    currentStep += direction;
    updateStepUI();
}

function updateStepUI() {
    for (let i = 1; i <= totalSteps; i++) {
        const el = document.getElementById(`step-content-${i}`);
        if (el) {
            el.style.display = (i === currentStep) ? "block" : "none";
        }
    }

    document.getElementById("setup-title").innerText = stepTitles[currentStep - 1];

    // 常にボタンは表示（Step 1ならシナリオ戻り、それ以外なら前のステップ戻り）
    document.getElementById("prev-btn").style.display = "inline-block";

    if (currentStep === 1) {
        // 【修正】Step 1のときはシナリオ選択へ戻る処理を上書き
        document.getElementById("prev-btn").onclick = () => {
            if (!confirm("本当に戻りますか？")) return;
            document.getElementById('scenario-selector').style.display = 'block';
            document.getElementById('setup-screen').style.display = 'none';
            document.getElementById('js-mp-container').style.display = 'none';

        };
    } else {
        // 【修正】Step 2以降は通常のステップ戻り処理に上書き
        document.getElementById("prev-btn").onclick = () => {
            changeStep(-1);
        };
    }
    if (notmate && currentStep === totalSteps - 1) {
        document.getElementById("next-btn").style.display = "none";
        document.getElementById("start-btn").style.display = "inline-block";
    }
    else if (currentStep === totalSteps) {
        document.getElementById("next-btn").style.display = "none";
        document.getElementById("start-btn").style.display = "inline-block";
    } else {
        document.getElementById("next-btn").style.display = "inline-block";
        document.getElementById("start-btn").style.display = "none";
    }
}



function renderCandidateLists(config, partyId) {
    const presList = document.getElementById('president-list');
    const mateList = document.getElementById('mate-list');
    presList.innerHTML = '';
    mateList.innerHTML = '';

    selectedPresident = null;
    selectedMate = null;

    Object.entries(config.candidates).forEach(([id, candi]) => {
        if (candi.party !== partyId) return;

        const card = createSimpleCard(id, candi);

        // NPC（プレイ不可候補）の見た目を少しトーンダウン
        if (candi.npc) {
            card.style.opacity = '0.65';
            card.style.filter = 'grayscale(40%)';
        }

        if (candi.isMate) {
            card.onclick = () => {
                selectedMate = id;
                highlightCard('mate-list', card);
            };
            mateList.appendChild(card);
        } else {
            card.onclick = () => {
                if (candi.npc) {
                    alert("この候補者はNPCのため選択できません。");
                    return;
                }
                selectedPresident = id;
                highlightCard('president-list', card);
            };
            presList.appendChild(card);
        }
    });
}
function setupOpponent(selectedPresId) {
    const allCandidates = currentMap.candidates;

    // 候補者Objectから安全に政党IDをぶっこ抜く
    const candidate = allCandidates[selectedPresId];
    if (!candidate) {
        console.error("指定された大統領IDが見つかりません:", selectedPresId);
        return;
    }

    const playerParty = candidate.partyId || candidate.party || candidate.party_id;

    // プレイヤーと違う政党の候補者の中から、一人目を見つける
    const opponentId = Object.keys(allCandidates).find(id =>
        allCandidates[id].party !== playerParty && !allCandidates[id].isMate
    );

    opponent = allCandidates[opponentId];
    if (opponent) {
        // VS画面の右側（Candidate 2）を更新
        document.getElementById('c2-name').innerText = opponent.name;
        document.getElementById('c2-image').src = opponent.image;
        document.getElementById('c2-party').innerText = opponent.party;
        document.getElementById('c2-status').innerText = opponent.isIncumbent ? "現職" : "新人";

        // 相手の枠の色をセット
        const oppParty = currentMap.parties.find(p => p.id === opponent.party);
        document.getElementById('c2-image').style.borderColor = oppParty ? oppParty.color : "blue";
    }
}

function updateCandidateIcons() {
    const viewport = document.querySelector('.svg-pan-zoom_viewport');
    const targetContainer = viewport || document.getElementById('main-svg');
    if (!targetContainer) return;

    // 既存のアイコン（候補者とエージェント両方）を消す
    document.querySelectorAll('.map-icon').forEach(icon => icon.remove());

    // 1. 候補者（大統領）のアイコンを表示
    Object.entries(candidatePositions).forEach(([id, stateId]) => {
        const candi = currentMap.candidates[id];
        drawSvgIcon(targetContainer, stateId, candi.image, 24, "candidate-icon");
    });

    // 2. エージェント（部下）のアイコンを表示
    currentMap.agents.forEach(agent => {
        // 誰かに雇われている場合のみ表示（あるいは派遣先の州が決まっている場合）
        if (agent.owner && agent.currentState) {
            // 候補者と重ならないように、少しオフセット（ずらし）を入れる
            drawSvgIcon(targetContainer, agent.currentState, agent.image, 18, "agent-icon", true);
        }
    });
}

/**
 * SVG内にアイコンを描画する共通関数
 * @param {Element} container - 追加先の要素
 * @param {string} stateId - 州のID
 * @param {string} imgHref - 画像のパス
 * @param {number} size - アイコンのサイズ
 * @param {string} className - CSSクラス名
 * @param {boolean} offset - 位置をランダムにずらすか
 */
function drawSvgIcon(container, stateId, imgHref, size, className, offset = false) {
    const stateEl = document.getElementById(stateId);
    if (!stateEl) return;

    const bbox = stateEl.getBBox();
    let centerX = bbox.x + bbox.width / 2;
    let centerY = bbox.y + bbox.height / 2;

    // エージェント同士が重ならないようにランダムに散らす
    if (offset) {
        centerX += (Math.random() - 0.5) * 15;
        centerY += (Math.random() - 0.5) * 15;
    }

    const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
    img.setAttributeNS(null, "href", imgHref);
    img.setAttributeNS(null, "x", centerX - size / 2);
    img.setAttributeNS(null, "y", centerY - size / 2);
    img.setAttributeNS(null, "width", size);
    img.setAttributeNS(null, "height", size);
    img.setAttributeNS(null, "class", `map-icon ${className}`);
    img.style.pointerEvents = "none";

    container.appendChild(img);
}
function showSpeechBubble(candi, stateId, quote) {
    const viewport = document.querySelector('.svg-pan-zoom_viewport');
    const stateEl = document.getElementById(stateId);
    if (!viewport || !stateEl) return;

    const bbox = stateEl.getBBox();
    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y + bbox.height / 2;

    // SVGのtext要素を作成
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

    text.setAttribute("x", centerX);
    text.setAttribute("y", centerY - 20); // アイコンより少し上
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("class", "speech-bubble");
    text.textContent = quote;

    viewport.appendChild(text);

    // アニメーションが終わったら要素を消す
    setTimeout(() => {
        text.remove();
    }, 2000);
}

function allNpcsTurn() {
    if (!currentMap || !currentMap.candidates) return;

    const candidates = Object.entries(currentMap.candidates);
    const stateIds = Object.keys(currentMap.states);

    candidates.forEach(([id, candi]) => {
        // 予備選のみの候補、プレイヤーが選んだ候補、副大統領候補はスキップ
        if (candi.primary || id === selectedPresident || candi.isMate) return;

        // 1. 15%の確率でスタミナ切れ・休憩（少しだけ確率を調整）
        if (Math.random() < 0.15) {
            console.log(`☕ ${candi.name} は本日のキャンペーンを休憩中...`);
            return;
        }

        let targetId = null;
        let strategyReason = "";

        // 現職（大統領）かどうかの判定
        const isIncumbent = candi.isIncumbent || candi.power === "現職";

        // --- A. 最優先: 自分の党の未雇用エージェント（選対スタッフ）スカウト ---
        const freeAgent = currentMap.agents ? currentMap.agents.find(a => {
            if (a.party !== candi.party || a.owner !== null) return false;

            // エージェントの地元の情勢をチェック
            const homeSupport = stateSupport[a.home]?.[candi.party] || 0;

            // 支持率が40%以上、かつ拒絶地域でなければ候補として認める
            return homeSupport >= 60;
        }) : null;

        if (freeAgent && Math.random() < 0.75) {
            targetId = freeAgent.home;
            strategyReason = `🤝 安全圏の有力者 ${freeAgent.name} の獲得`;
        }

        // --- B. ターゲット州の戦略的選定（エージェントがいない場合） ---
        if (!targetId) {
            targetId = getBestStateForParty(candi.party);
            strategyReason = isIncumbent ? `🛡️ 地盤防衛 (${targetId})` : `⚔️ 敵陣攻勢 (${targetId})`;

            // 💡 ターゲットに選んだ州がすでに65%を超えていたら（ペンキ屋防止）
            let currentSupport = stateSupport[targetId]?.[candi.party] || 0;

            if (currentSupport > 65.0) {
                // 1. まだ60%未満の「まだ安全圏に入っていない全ての州」を配列で集める
                const eligibleStates = stateIds.filter(sid => {
                    const sSup = stateSupport[sid]?.[candi.party] || 0;
                    return sSup < 60.0;
                });

                // 2. 候補となる接戦州があれば、その中から【ランダム】に1つ選ぶ！
                if (eligibleStates.length > 0) {
                    const randomIndex = Math.floor(Math.random() * eligibleStates.length);
                    targetId = eligibleStates[randomIndex]; // ターゲットをランダムな接戦州に上書き！
                    strategyReason = `遊撃 ⚔️ 未開拓の接戦州へ転進 (${targetId})`;
                }
            }
        }



        // --- C. ブースト値と現職ボーナスの計算（共通関数に丸投げ！） ---
        // 引数に (ターゲット州, NPCの政党, true[NPCフラグ]) を渡す
        let randomBoost = executeCampaign(targetId, candi.party, true, id);

        console.log(`🤖 [NPC AI] ${candi.name} -> ${targetId} | 理由: ${strategyReason} | 支持率加算: +${randomBoost}%`);

        // エージェント雇用の判定
        checkNpcHiring(id, targetId);

        // 吹き出し表示
        showSpeechBubble(candi, targetId, `+${randomBoost}%`);

    });

    updateCandidateIcons();
}


function updateScore() {
    if (!currentMap || !stateSupport) return null;

    // 1. 各政党の得票数をゼロで初期化する
    let scores = {};
    currentMap.parties.forEach(p => {
        scores[p.id] = 0;
    });

    // 2. 全ての州をループして、勝っている政党に票を加算する

    Object.keys(currentMap.states).forEach(stateId => {
        const support = stateSupport[stateId];
        const stateData = currentMap.states[stateId];

        if (support && stateData) {
            const totalVotes = stateData.votes || 0;

            if (isWinnerTakeAll) {
                // 【勝者総取り（通常ルール）】 1位の政党がその州の全選挙人を獲得
                let winnerId = null;
                let maxVal = -1;

                Object.entries(support).forEach(([pid, val]) => {
                    if (val > maxVal) {
                        maxVal = val;
                        winnerId = pid;
                    }
                });

                if (winnerId) {
                    scores[winnerId] += totalVotes;
                }
            } else {
                // 【比例配分ルール】 各政党の支持率（%）に応じて選挙人を分配して加算
                Object.entries(support).forEach(([pid, val]) => {
                    if (val > 0) {
                        // 支持率の割合（val / 100）をかけて割り当て票数を計算
                        const allocatedVotes = Math.round((val / 100) * totalVotes);
                        // 計算された票数を、それぞれの政党の合計スコアに加算する
                        scores[pid] += allocatedVotes;
                    }
                });
            }
        }
    });

    // 3. 画面の表示を更新する
    const scoreText = currentMap.parties.map(p => {
        return `${p.name}: ${scores[p.id]}`;
    }).join(' / ');

    const displayEl = document.getElementById('display');
    if (displayEl) {
        displayEl.innerText = `${scoreText} (過半数: ${currentMap.totalvotesToWin})`;
    }

    // 🌟 これが原因だった！計算した scores を呼び出し元に返す！
    return scores;
}

function normalizeSupport(stateId) {
    const scores = stateSupport[stateId];

    // 現在の全政党のスコア合計を計算
    const total = Object.values(scores).reduce((a, b) => a + b, 0);

    // 合計が0（ありえないけど念のため）じゃなければ、比率を維持して100に合わせる
    if (total > 0) {
        Object.keys(scores).forEach(partyId => {
            stateSupport[stateId][partyId] = (stateSupport[stateId][partyId] / total) * 100;
        });
    }
} let presData
let mateData
function updateMainCandidateDisplay(presId, mateId) {
    // 安全対策：IDが渡されている時だけデータを取得する
    presData = presId ? currentMap.candidates[presId] : null;
    mateData = mateId ? currentMap.candidates[mateId] : null;

    // --- 1. 大統領候補（メイン画像）の処理 ---
    const c1Image = document.getElementById('c1-image');
    if (presData) {
        c1Image.src = presData.image;

        // 所属政党の色を安全に取得
        const presParty = currentMap.parties.find(p => p.id === presData.party);
        if (presParty) {
            c1Image.style.borderColor = presParty.color;
            document.getElementById('c1-party').innerText = presParty.name;
            // プレイヤーが選んだキャラの色を「操作色」に自動セット
            selectedColor = presParty.color;
        }

        // 名前とステータスを書き換え
        document.getElementById('c1-name').innerHTML = `${presData.name} <br>`;
        document.getElementById('c1-status').innerText = presData.isIncumbent ? "現職" : "新人";
    } else {
        // もし大統領データが壊れていたら最低限の表示にする（エラー落ちを防ぐ）
        c1Image.src = "";
        document.getElementById('c1-name').innerText = "候補者不明";
    }

    // --- 2. 副大統領候補（ランニングメイト）の処理 ---
    const c1MateImage = document.getElementById('c1-mate-image');

    if (mateData) {
        c1MateImage.src = mateData.image;

        const mateParty = currentMap.parties.find(p => p.id === mateData.party);
        if (mateParty) {
            c1MateImage.style.borderColor = mateParty.color;
        }

        document.getElementById('c1-mate-name').innerText = mateData.name;
        c1MateImage.style.display = "block";
    } else {
        // 副大統領がまだ決まっていない、または空文字（""）の場合
        if (c1MateImage) {
            c1MateImage.style.display = "none";
            c1MateImage.src = ""; // 古い画像をクリア
        }
        const c1MateName = document.getElementById('c1-mate-name');
        if (c1MateName) {
            c1MateName.innerHTML = "";
            // candidate-panel の更新処理などの中で実行
            const panel = document.getElementById("c1-mate-joint");
            if (panel) {
                // 親要素の中から「2番目のdiv」をピンポイントで捕まえて非表示にする
                panel.innerHTML = "";
            }

        }
    }
}


async function confirmSetup() {
    if (!selectedPresident || !selectedMate && !notmate) {
        alert("候補を選んでください");
        return;
    }

    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('main-game').style.display = 'block';

    // マップ読み込み（既存のロジック）
    const source = await getMapSource(currentMap.mapSource);
    currentMap.mapSource = source;
    updateMainCandidateDisplay(selectedPresident, selectedMate);
    setupOpponent(selectedPresident);
    setupEvents();
    currentMap.agents.forEach(a => {
        if (!a.owner) {
            a.owner = null;
        }
    });

    // メインUIに反映
    initGame(currentMap);


    // ここで選択した2人をVS画面の左側に表示するロジックを呼ぶ
    updateMainCandidateDisplay(selectedPresident, selectedMate);
}
// 選択用の小さいカードを作る補助関数
function createSimpleCard(id, candi) {
    const div = document.createElement('div');
    const partycolor = currentMap.parties.find(p => p.id === candi.party)?.color || candi.party;

    const party = currentMap.parties.find(p => p.id === candi.party)?.name || candi.party;
    div.className = 'select-card';
    div.style = "border: 2px solid #ccc; padding: 10px; cursor: pointer; background: white; width: 120px; display: flex; flex-direction: column; justify: space-between;";

    div.innerHTML = `
        <div>
<img src="${candi.image}" style="width: 100%; aspect-ratio: 1 / 1; object-fit: contain;" referrerpolicy="no-referrer">
            <div style="font-size:0.8em; font-weight:bold; margin-top: 4px;">${candi.name}</div>
            <div style="font-size:0.4em; font-weight:bold; color:${partycolor};">${party}</div>
            <div style="font-size:0.4em; font-weight:bold;">${candi.primary ? "予備選挙候補者" : "候補者"}</div>
            <div style="font-size:1em; font-weight:bold; color:red">${candi.npc ? "プレイ不可" : ""}</div>
        </div>
        <button type="button" class="desc-btn" style="margin-top: 6px; font-size: 0.7em; padding: 2px 4px; cursor: pointer;">詳細</button>
    `;

    // 詳細ボタンをクリックしたときの処理
    const descBtn = div.querySelector('.desc-btn');
    descBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // カード本体の「選択イベント（チェック等）」が発火するのを防ぐ
        // 候補者選定のためのプロフィールHTMLを組み立てる
        const modalContent = `
<div style="text-align: center; margin-bottom: 20px;">
    <img src="${candi.image}" 
         style="width: 180px; height: 180px; object-fit: contain; border-radius: 12px; background: #eef2f7; box-shadow: 0 4px 6px rgba(0,0,0,0.05);" 
         referrerpolicy="no-referrer" 
         alt="${candi.name}">
</div>

<h2 style="margin: 0 0 5px 0; text-align: center; font-size: 1.5em; color: #333;">${candi.name}</h2>
<div style="text-align: center; margin-bottom: 15px;">
    <span style="background: #e0e0e0; padding: 6px 12px; border-radius: 15px; font-size: 0.9em; font-weight: bold; display: inline-flex; align-items: center; gap: 8px;">
        <span style="display: inline-block; width: 12px; height: 12px; background-color: ${partycolor}; border-radius: 2px; border: 1px solid rgba(0,0,0,0.15);"></span>
        ${party}
    </span>
</div>

<!-- 出身地の下に少し余白（margin-bottom）を追加しました -->
<div style="text-align: center; margin-bottom: 20px; color: #555; font-size: 0.95em;">
    出身地：${candi.state}
</div>

<!-- スクロールエリア（candi.desc 内のHTMLタグも正常に動きます） -->
<div style="height: 180px; overflow-y: auto; box-sizing: border-box; border-top: 1px solid #eee; padding-top: 10px;">
    <p style="margin: 0; white-space: normal; line-height: 1.6; color: #444; text-align: left;">
        ${candi.desc || "詳細情報はありません。"}
    </p>
</div>
`;

        // 「候補者詳細」としてモーダルを開く
        openModal(`${candi.name}`, modalContent);

    });

    return div;
}

function highlightCard(parentId, selectedCard) {
    document.getElementById(parentId).querySelectorAll('.select-card').forEach(c => c.style.borderColor = '#ccc');
    selectedCard.style.borderColor = '#007bff';
}

function updateCandidateUI(config) {
    const list = document.getElementById('extra-candidates-list');
    const mainCandi1 = document.getElementById('candidate-1');
    const mainCandi2 = document.getElementById('candidate-2');
    list.innerHTML = ''; // リセット

    const candiEntries = Object.entries(currentMap.candidates);
    candiEntries.forEach(([id, candi], index) => {
        // 1. その候補者自身が「予備選フラグ」を持っているかチェック
        const isPrimaryCandidate = candi.primary === true;
        if (id === selectedPresident) {
            return; // 次のループへ（自分自身はリストに作らない）
        }
        if (candi.name === opponent.name) {
            return;
        }
        if (candi.isMate) {
            return;
        }
        // 3人目以降、または予備選フラグがオンの候補者をリストに表示
        if (index >= 0) {
            const card = document.createElement('div');
            card.style = "background: white; padding: 10px; border-radius: 5px; width: 120px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer; border: 1px solid #eee;";

            // ★ ここ！候補者のデータにある primary を見に行くようにしたよ
            const primaryTag = isPrimaryCandidate ? `<br><span style="font-size:0.7em; color:orange; font-weight:bold;">[予備選候補]</span>` : "";

            card.innerHTML = `
                <img src="${candi.image}" style="width:100%; height:80px; object-fit:cover; border-radius:3px;" referrerpolicy="no-referrer">
                <div style="font-size: 0.8em; font-weight: bold; margin-top:5px;">${candi.name}</div>
                <div style="font-size: 0.7em; color: #666;">${candi.party}${primaryTag}</div>
            `;

            card.onclick = () => {
                const party = config.parties.find(p => p.id === candi.party);
                if (party) {
                    selectedColor = party.color;
                    console.log("選択中の候補者:", candi.name);
                }
            };
            list.appendChild(card);
        }
    });
}

let currentScenarioVariables = {};


async function initGame(config) {
    updateCandidateUI(currentMap);
    if (typeof currentMap.custominit === 'function') {
        currentMap.custominit();
    }


    currentScenarioVariables = {
        // 全シナリオ共通で使いそうな最低限の基礎データだけ自動セット
        "selected_president": selectedPresident, // "hoover" や "trump"
        "selected_mate": selectedMate            // "lowden" や "pence"
    };

    if (config.startDate) {
        document.getElementById('current-date').innerText = config.startDate;
        currentDate = new Date(config.startDate);
        updateProgress(config.startDate);

    }
    const container = document.getElementById('map-container');
    // config.mapSource.map (getMapSourceの戻り値) を流し込む
    container.innerHTML = config.mapSource.map;

    const checker = container.querySelector('svg');
    if (checker) {
        checker.setAttribute('id', 'main-svg');
        checker.style.width = '100%';
        checker.style.height = 'auto';

        // SVGの各パスに票数データを注入
        checker.querySelectorAll('path').forEach(stateEl => {
            const stateId = stateEl.id; // SVGの path id="AK" など
            const stateInfo = config.states[stateId];
            stateEl.style.fill = "#b3b3b3";
            if (stateInfo) {
                // シナリオで定義された票数を dataset に入れる
                stateEl.dataset.votes = stateInfo.votes;
                // 必要ならクラスなども追加
                if (stateInfo.class) {
                    // スペースで区切って、配列にしてからスプレッド演算子(...)で展開して渡す
                    stateEl.classList.add(...stateInfo.class.split(' '));
                }
            } else {
                // 定義がない場合は3票にしておく
                stateEl.dataset.votes = 3;
            }
        });
    }
    initAllStatesSupport();
    document.getElementById('scenario-name').innerText = config.mapName;

    // ズーム設定
    svgPanZoom('#main-svg', { zoomEnabled: true, controlIconsEnabled: false });

}

let summaryPanZoom = null; // ズームインスタンス保持用

document.querySelectorAll(".summary-tab-btn").forEach(btn => {
    btn.onclick = () => {
        // ボタンのactive切り替え
        document.querySelectorAll(".summary-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // 中身の表示切り替え
        const targetId = btn.getAttribute("data-tab");
        document.querySelectorAll(".summary-tab-content").forEach(content => {
            content.style.display = (content.id === targetId) ? "block" : "none";
        });

        // ★「最終マップ」タブが表示された瞬間に svgPanZoom を初期化（幅・高さが確定しているためエラーにならない）
        if (targetId === "tab-map" && typeof svgPanZoom !== "undefined") {
            const summarySvg = document.getElementById("summary-svg");
            if (summarySvg && !summaryPanZoom) {
                summaryPanZoom = svgPanZoom("#summary-svg", {
                    zoomEnabled: true,
                    controlIconsEnabled: false,
                    fit: true,
                    center: true,
                    minZoom: 0.8,
                    maxZoom: 10
                });
                summaryPanZoom.reset();
                summaryPanZoom.fit();
                summaryPanZoom.center();
            } else if (summaryPanZoom) {
                summaryPanZoom.resize();
                summaryPanZoom.fit();
                summaryPanZoom.center();
            }
        }
    };
});

// 「結果を見る」ボタンから呼ぶ関数
function openFinalSummary(scores, topPartyId, maxVotes, winThreshold, isPlayerWinner) {
    // 1. 開票速報画面を閉じて、最終リザルト画面を開く
    document.getElementById("electionResultOverlay").style.display = "none";
    const summaryScreen = document.getElementById("finalSummaryScreen");
    summaryScreen.style.display = "flex";

    const topParty = currentMap.parties.find(p => p.id === topPartyId);
    const topCand = topParty ? getCandidateForParty(topParty.id) : { name: "該当者なし" };

    // 2. 見出しとバッジのセット
    const badgeEl = document.getElementById("summaryOutcomeBadge");
    const headlineEl = document.getElementById("summaryHeadline");
    const sublineEl = document.getElementById("summarySubline");
    const storyEl = document.getElementById("summaryStoryBody");

    sublineEl.textContent = `最多獲得: ${topCand.name} (${maxVotes} 票) ／ 過半数ライン: ${winThreshold} 票`;

    if (isPlayerWinner) {
        badgeEl.textContent = "勝利";
        headlineEl.textContent = `おめでとうございます、貴方は勝利しました。`;
        // Mod側で custom ending が用意されていればそれを使い、なければ自動生成
        storyEl.textContent = currentMap.endingWin ||
            `開票の結果、あなた（${topParty.name}）が過半数となる${maxVotes}人の票を獲得し、勝利を収めました。\n\n全国から寄せられた支持を背景に、あなたのスタッフや陣営は直ちに重要政策・政権移行の準備へと動き出します。`;
    } else if (maxVotes >= winThreshold) {
        badgeEl.textContent = "敗北";
        headlineEl.textContent = `${topCand.name}が勝利、貴方は敗北した。`;
        storyEl.textContent = currentMap.endingLose ||
            `激戦の末、${topCand.name}（${topParty.name}）が${maxVotes}票を獲得して当選を決めました。\n\nあなたの陣営も各地で善戦しましたが、これは残念な結果です。敗北宣言を行ったあなたの陣営は、次なる時代の巻き返しを誓っています。`;
    } else {
        badgeEl.textContent = "過半数割れ";
        headlineEl.textContent = `どの候補も過半数に届かず。`;
        storyEl.textContent = currentMap.endingDeadlock ||
            `全土の開票が完了しましたが、いずれの候補も過半数（${winThreshold}票）に到達しませんでした。`;
    }

    // 3. マップの複製（ここでは配置だけして svgPanZoom はまだ呼ばない）
    const summaryMapBox = document.getElementById("summaryMapContainer");
    summaryMapBox.innerHTML = "";
    const finishedSvg = document.getElementById("result-svg") || document.getElementById("main-svg");

    if (finishedSvg) {
        const clonedMap = finishedSvg.cloneNode(true);
        clonedMap.id = "summary-svg";

        // 元の svg-pan-zoom が作った余計なコントローラーUIや変形をリセット
        clonedMap.querySelector("#svg-pan-zoom-controls")?.remove();
        clonedMap.removeAttribute("style");
        clonedMap.removeAttribute("data-plugin-spz");

        const viewportG = clonedMap.querySelector(".svg-pan-zoom-viewport");
        if (viewportG) {
            viewportG.removeAttribute("style");
            viewportG.removeAttribute("transform");
        }

        clonedMap.style.width = "100%";
        clonedMap.style.height = "100%";
        clonedMap.style.display = "block";

        summaryMapBox.appendChild(clonedMap);
    }

    // 4. 各州の分析と得票率テーブルの生成
    const tbody = document.getElementById("summaryStateTableBody");
    const highlightBox = document.getElementById("summaryHighlights");
    tbody.innerHTML = "";
    highlightBox.innerHTML = "";

    const stateResults = []; // 分析用データ配列

    Object.entries(currentMap.states).forEach(([stateId, st]) => {
        if (!st.votes || st.votes <= 0) return; // 選挙人0票の州（当時のNYなど）は除外

        const supportData = st.currentSupport || st.baseSupport || {};
        const stateName = st.name || stateId;

        // 全政党の得票率を集めて高い順にソート（1位と2位の差を計算するため）
        const ranking = currentMap.parties.map(p => {
            const cand = getCandidateForParty(p.id);
            return {
                partyId: p.id,
                partyName: p.name,
                candName: cand.name,
                color: p.color || "#666",
                pct: Number(supportData[p.id] || 0)
            };
        }).sort((a, b) => b.pct - a.pct);

        const first = ranking[0];
        const second = ranking[1] || { pct: 0, candName: "-" };
        const margin = first.pct - second.pct; // 1位と2位の点差

        stateResults.push({ stateId, stateName, votes: st.votes, ranking, first, second, margin });

        // 視覚的な横並びカラーバーHTML
        const barSegmentsHtml = ranking
            .map(r => `<div class="mini-bar-seg" style="width: ${r.pct}%; background: ${r.color};" title="${r.candName}: ${r.pct.toFixed(1)}%"></div>`)
            .join("");

        // 横並びの得票率テキスト（改行だらけを解消）
        const pctListHtml = ranking
            .map(r => `<span><strong style="color:${r.color};">■</strong> ${r.candName} ${r.pct.toFixed(1)}%</span>`)
            .join("");

        // 接戦ラベル（5%未満なら「激戦」表示）
        const marginLabel = margin < 5.0 ? `🔥 接戦 (+${margin.toFixed(1)}%)` : `+${margin.toFixed(1)}%`;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <strong>${stateName}</strong><br>
                <small>${st.votes} 票</small>
            </td>
            <td>
                <strong style="color: ${first.color};">${first.candName}</strong>
                <span class="margin-badge">${marginLabel}</span>
            </td>
            <td>
                <div class="mini-bar-wrap">${barSegmentsHtml}</div>
                <div class="mini-pct-list">${pctListHtml}</div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    // ★ 5. 注目地域ハイライトの自動抽出
    if (stateResults.length > 0) {
        // ① 最も接戦だった地域（点差が最小の州）
        const closest = [...stateResults].sort((a, b) => a.margin - b.margin)[0];

        // ② 最も大差がついた地域（点差が最大の州）
        const blowout = [...stateResults].sort((a, b) => b.margin - a.margin)[0];

        let cardsHtml = `
            <div class="highlight-card">
                <div class="highlight-card-title">🔥 最も接戦だった地域</div>
                <strong>${closest.stateName}</strong>（${closest.votes}票）<br>
                ${closest.first.candName}が${closest.second.candName}をわずか <strong>${closest.margin.toFixed(1)}%差</strong> で制す
            </div>
            <div class="highlight-card">
                <div class="highlight-card-title">👑 最も大差がついた地域</div>
                <strong>${blowout.stateName}</strong>（${blowout.votes}票）<br>
                ${blowout.first.candName}が <strong>${blowout.first.pct.toFixed(1)}%</strong> を獲得し圧勝（+${blowout.margin.toFixed(1)}%）
            </div>
        `;

        // ▼ 1つ以上の地域で1位（勝利）を獲得した政党IDを重複なしで取得
        const winningPartyIds = new Set(stateResults.map(s => s.first.partyId));

        // 地域を獲得した候補（政党）ごとにカードを生成
        currentMap.parties.forEach(p => {
            // どの地域でも1位を取れなかった候補はスキップ
            if (!winningPartyIds.has(p.id)) return;

            const cand = getCandidateForParty(p.id);

            // 全州での自分のデータを抽出
            const myStates = stateResults.map(s => {
                const myData = s.ranking.find(r => r.partyId === p.id);
                return {
                    stateName: s.stateName,
                    myPct: myData ? myData.pct : 0,
                    isWin: s.first.partyId === p.id,
                    diffFromTop: s.first.pct - (myData ? myData.pct : 0)
                };
            });

            // 最高得票率の州を取得
            const highestState = [...myStates].sort((a, b) => b.myPct - a.myPct)[0];

            // 得票率があれば無条件で最高得票率を追加
            if (highestState && highestState.myPct > 0) {
                let detailHtml = `
                    <div>・<strong>最高得票率:</strong> ${highestState.stateName}（${highestState.myPct.toFixed(1)}%）</div>
                `;

                // 敗れた（2位以下だった）州を抽出
                const lostStates = myStates.filter(s => !s.isWin);

                if (lostStates.length > 0) {
                    // 敗れた中で一番惜しかった州（善戦）
                    const bestFight = [...lostStates].sort((a, b) => a.diffFromTop - b.diffFromTop)[0];
                    // 敗れた中で一番差が開いた州（大敗）
                    const worstLoss = [...lostStates].sort((a, b) => b.diffFromTop - a.diffFromTop)[0];

                    detailHtml += `
                        <div>・<strong>善戦:</strong> ${bestFight.stateName}（${bestFight.myPct.toFixed(1)}% / 差 -${bestFight.diffFromTop.toFixed(1)}%）</div>
                        <div>・<strong>大敗:</strong> ${worstLoss.stateName}（${worstLoss.myPct.toFixed(1)}% / 差 -${worstLoss.diffFromTop.toFixed(1)}%）</div>
                    `;
                } else {
                    detailHtml += `
                        <div>・<strong>戦績:</strong> 全土で1位を獲得し、完全制覇を達成！</div>
                    `;
                }

                cardsHtml += `
                    <div class="highlight-card">
                        <div class="highlight-card-title" style="color:${p.color};">📊 ${cand.name}の注目地域</div>
                        ${detailHtml}
                    </div>
                `;
            }
        });

        highlightBox.innerHTML = cardsHtml;
    }


}


async function finishGame() {
    // 1. スコア集計と勝者判定
    const scores = updateScore();
    const winThreshold = currentMap.totalvotesToWin || 270;
    document.getElementById("main-game").style.display = 'none';

    // 1. 全体で1位の政党と最大票数を調べる（開票演出や勝者名表示用）
    let topPartyId = null;
    let maxVotes = -1;
    if (scores) {
        Object.entries(scores).forEach(([pid, votes]) => {
            if (votes > maxVotes) {
                maxVotes = votes;
                topPartyId = pid;
            }
        });
    }

    // 2. プレイヤー（selectedpresident）の政党IDと得票数を取得
    const playerPartyId = currentMap.candidates[selectedPresident].party;
    const playerVotes = scores?.[playerPartyId] || 0;

    // 3. プレイヤーの勝敗判定（過半数到達 ＆ 1位であること）
    const isWinner = (playerVotes >= winThreshold) && (topPartyId === playerPartyId);
    const overlay = document.getElementById("electionResultOverlay");
    // 2. index.html に用意したオーバーレイを取得して表示
    overlay.style.display = "flex";

    // テキスト・勝敗表示の反映
    document.getElementById("resultMapName").textContent = currentMap.name || "大統領選挙";
    document.getElementById("resultThreshold").textContent = winThreshold;

    const winnerTitle = document.getElementById("resultWinnerTitle");
    winnerTitle.textContent = isWinner ? "勝利" : "敗北";
    winnerTitle.style.color = isWinner ? "#facc15" : "#ef4444";

    // 3. 政党ごとのゲージバーを生成（再プレイ時の重複防止で一旦クリア）
    const gaugeList = document.getElementById("resultGaugeList");
    gaugeList.innerHTML = "";

    currentMap.parties.forEach(p => {
        const cand = getCandidateForParty(p.id);
        gaugeList.innerHTML += `
            <div class="result-party-row">
                <div class="result-party-info">
                    <span>${cand.name} (${p.name})</span>
                    <div>
                        <span id="vote-count-${p.id}" style="color: ${p.color}; font-size: 1.1em;">0 票</span>
                        <span id="vote-share-${p.id}" style="color: #94a3b8; margin-left: 6px;">(0.0%)</span>
                    </div>
                </div>
                <div class="result-bar-bg">
                    <div class="result-bar-center-line"></div>
                    <div id="bar-${p.id}" class="result-bar-fill" style="background: ${p.color};"></div>
                </div>
            </div>
        `;
    });

    // 4. メインのSVGを結果コンテナにクローン複製
    const mapContainer = document.getElementById("resultMapContainer");
    mapContainer.innerHTML = ""; // 前回のマップが残っていればクリア

    const originalSvg = document.getElementById("main-svg");
    let resultMapSvg = null;
    if (originalSvg) {
        resultMapSvg = originalSvg.cloneNode(true);
        resultMapSvg.id = "result-svg";
        resultMapSvg.removeAttribute("style");
        resultMapSvg.removeAttribute("data-plugin-spz");

        const viewportG = resultMapSvg.querySelector(".svg-pan-zoom-viewport");
        if (viewportG) {
            viewportG.removeAttribute("style");
            viewportG.removeAttribute("transform");
        }

        resultMapSvg.querySelectorAll("g, path").forEach(el => {
            el.style.transform = "";
        });

        resultMapSvg.style.width = "100%";
        resultMapSvg.style.height = "100%";
        resultMapSvg.style.display = "block";

        mapContainer.appendChild(resultMapSvg);

        if (typeof svgPanZoom !== "undefined") {
            try {
                const resultPanZoom = svgPanZoom("#result-svg", {
                    zoomEnabled: true,
                    controlIconsEnabled: false,
                    fit: true,
                    center: true,
                    minZoom: 0.8,
                    maxZoom: 10
                });
                resultPanZoom.reset();
                resultPanZoom.fit();
                resultPanZoom.center();
            } catch (e) {
                console.warn("svgPanZoom init on result-svg failed:", e);
            }
        }

        resultMapSvg.querySelectorAll("path").forEach(p => {
            p.style.fill = "#334155";
            p.style.cursor = "pointer";
            p.style.transition = "fill 0.5s ease";
            p.onclick = () => showStateInfo(p.id);
        });
    }

    // 5. 各政党の現在のカウント管理（この後の開票アニメーション処理へ続く）
    const currentVotes = {};
    currentMap.parties.forEach(p => currentVotes[p.id] = 0);


    let isSkipped = false;
    const stateIds = Object.keys(currentMap.states);

    // スキップボタン押下時の処理
    document.getElementById("skipResultBtn").onclick = () => {
        isSkipped = true;
        // 一気に全州反映
        stateIds.forEach(stateId => revealState(stateId));
        updateAllGauges();
        showFinalNotice();
    };

    // 4. 州を1つずつ順々に開票するアニメーション処理
    let stateIndex = 0;
    updateNationalPopularVote();
    const interval = setInterval(() => {
        if (isSkipped || stateIndex >= stateIds.length) {
            clearInterval(interval);
            if (!isSkipped) showFinalNotice();
            return;
        }

        const stateId = stateIds[stateIndex];
        revealState(stateId);
        updateAllGauges();
        updateNationalPopularVote();

        stateIndex++;
    }, 1000); // 0.4秒ごとに1州開票

    function calculateNationalVoteShare() {
        // 1. 候補者（または政党）ごとの全国総得票数を記録するオブジェクト
        const nationalVotesByParty = {};
        let totalNationalVoters = 0;

        // 2. すべての州をループ処理
        for (const stateId in currentMap.states) {
            const state = currentMap.states[stateId];
            const supports = stateSupport[stateId];

            // 州の総有権者数を取得（プロパティ名が voters や totalVotes だと仮定）
            // もしデータにない場合は、簡易的に一律 1000000 などの重みを入れるか、
            // 単純平均にする場合は const stateVoters = 1; としてください。
            const stateVoters = state.voters || state.population || 1000000;

            if (!supports) continue;

            // 3. 州内の各政党の得票数を計算して全国累計に加算
            for (const [partyId, percentage] of Object.entries(supports)) {
                if (percentage === 0) continue;

                // 州の有権者数 × 支持率(%) = その州での得票数
                const votes = stateVoters * (percentage / 100);

                if (!nationalVotesByParty[partyId]) {
                    nationalVotesByParty[partyId] = 0;
                }
                nationalVotesByParty[partyId] += votes;
                totalNationalVoters += votes; // 全国総得票数に加算
            }
        }

        // 4. 得票数から全国の得票率（%）を計算し、候補者情報と紐付けてソート
        const nationalResults = [];
        for (const [partyId, votes] of Object.entries(nationalVotesByParty)) {
            const party = currentMap.parties.find(p => p.id === partyId);

            // 候補者情報を取得（既存の getCandidateForParty 関数を利用）
            // もし getCandidateForParty がグローバル関数であればそのまま動きます
            const candidate = typeof getCandidateForParty === 'function' ? getCandidateForParty(partyId) : null;

            const share = totalNationalVoters > 0 ? (votes / totalNationalVoters) * 100 : 0;

            nationalResults.push({
                partyId: partyId,
                partyName: party ? party.name : partyId,
                partyColor: party ? party.color : '#fff',
                candidateName: candidate ? (candidate.name || candidate) : '不明', // 戻り値の型に合わせて調整してください
                share: share,
                votes: votes
            });
        }

        // 5. 得票率の高い順にソートして返す
        return nationalResults.sort((a, b) => b.share - a.share);
    }


    // 州を1つ開票する内部関数
    function revealState(stateId) {
        const winnerPartyId = getWinnerPartyForState(stateId);
        const votes = parseInt(currentMap.states[stateId].votes || 3);

        if (winnerPartyId) {
            const party = currentMap.parties.find(p => p.id === winnerPartyId);
            const color = party ? party.color : "#999";

            // マップ上の州を勝者カラーに変更
            if (resultMapSvg) {
                const targetPath = resultMapSvg.querySelector(`#${stateId}`);
                if (targetPath) targetPath.style.fill = color;
            }

            // 獲得票数を加算（二重加算防止チェック）
            if (!currentMap.states[stateId]._revealed) {
                currentMap.states[stateId]._revealed = true;
                currentVotes[winnerPartyId] = (currentVotes[winnerPartyId] || 0) + votes;
            }

            // 右側のログ領域を最新の開票結果に更新
            showStateInfo(stateId);
        }
    }

    function updateAllGauges() {
        // 1. 各州のデータから、政党（候補者）ごとの全国総一般得票数を計算
        const nationalVotesByParty = {};
        let totalNationalVoters = 0;

        for (const stateId in currentMap.states) {
            const state = currentMap.states[stateId];
            const supports = stateSupport[stateId];

            // 州の有権者数（プロパティ名が voters や population でない場合は書き換えてください）
            const stateVoters = state.voters || state.population || 1000000;

            if (!supports) continue;

            for (const [partyId, percentage] of Object.entries(supports)) {
                if (percentage === 0) continue;
                // 州の有権者数 × 支持率(%) = その州での得票数
                const v = stateVoters * (percentage / 100);

                if (!nationalVotesByParty[partyId]) nationalVotesByParty[partyId] = 0;
                nationalVotesByParty[partyId] += v;
                totalNationalVoters += v;
            }
        }

        // 2. 各政党（候補者）のゲージとテキストを更新
        currentMap.parties.forEach(p => {
            // --- 選挙人数の更新（従来通りのロジック） ---
            const votes = currentVotes[p.id] || 0;
            const countEl = document.getElementById(`vote-count-${p.id}`);
            const bar = document.getElementById(`bar-${p.id}`);

            if (countEl) countEl.innerText = `${votes} 票`;
            if (bar) {
                const percent = Math.min(100, (votes / (winThreshold * 2)) * 100);
                bar.style.width = `${percent}%`;
            }

            // --- 全国の一般得票率の更新（追加ロジック） ---
            const shareEl = document.getElementById(`vote-share-${p.id}`);
            if (shareEl) {
                const partyVotes = nationalVotesByParty[p.id] || 0;
                // 全国の総得票数に対する割合（%）を計算
                const share = totalNationalVoters > 0 ? (partyVotes / totalNationalVoters) * 100 : 0;
                // 画面に「(48.5%)」のように反映
                shareEl.innerText = `(${share.toFixed(1)}%)`;
            }
        });
    }


    function updateNationalPopularVote() {
        const totalWeightedSupport = {}; // 各政党の重み付き支持率の合計
        let totalElectoralVotes = 0;     // 全米の総選挙機票数

        // 1. 各政党の集計用カウンターを0で初期化
        currentMap.parties.forEach(p => {
            totalWeightedSupport[p.id] = 0;
        });

        // 2. すべての州をループして重み付き数値を加算
        // Object.keys(stateSupport) または Object.keys(currentMap.states) でループします
        Object.keys(currentMap.states).forEach(stateId => {
            const stateData = currentMap.states[stateId];
            if (!stateData) return;

            // その州の選挙機票数（votesがない場合はデフォルト3）を人口の重みとする
            const weight = stateData.votes || 3;
            totalElectoralVotes += weight;

            // その州の各政党の支持率を取得
            const supports = stateSupport[stateId];
            if (supports) {
                Object.entries(supports).forEach(([pid, val]) => {
                    if (totalWeightedSupport[pid] !== undefined) {
                        // 支持率(%) × 州の重み(票数) を足していく
                        totalWeightedSupport[pid] += (val * weight);
                    }
                });
            }
        });

        // 3. 全米の総選挙機票数で割り、各マシンの%表示を更新
        currentMap.parties.forEach(p => {
            const nationalRate = totalElectoralVotes > 0
                ? (totalWeightedSupport[p.id] / totalElectoralVotes).toFixed(1)
                : "0.0";

            // プログレスバーの横など、用意した要素（例: id="pop-rate-gop" など）に反映
            const rateEl = document.getElementById(`pop-rate-${p.id}`);
            if (rateEl) {
                rateEl.innerText = `(${nationalRate}%)`;
            }
        });
    }


    // 州タップ時に詳細カードを表示する関数
    function showStateInfo(stateId) {
        const stateData = currentMap.states[stateId];
        const detailBox = document.getElementById("stateDetailBox");
        if (!stateData || !detailBox) return;

        const winnerPartyId = getWinnerPartyForState(stateId);
        const winnerParty = currentMap.parties.find(p => p.id === winnerPartyId);
        const cand = getCandidateForParty(winnerPartyId);

        let supportListHtml = "";
        if (stateSupport[stateId]) {
            // 支持率の高い順にソート
            const sorted = Object.entries(stateSupport[stateId]).sort((a, b) => b[1] - a[1]);
            sorted.forEach(([pid, val]) => {
                if (val === 0) return;
                const p = currentMap.parties.find(item => item.id === pid);
                supportListHtml += `
                    <div style="display:flex; justify-content:space-between; margin: 3px 0;">
                        <span style="color:${p ? p.color : '#fff'}; font-weight:bold;">${p ? p.name : pid}</span>
                        <span>${val.toFixed(1)}%</span>
                    </div>
                `;
            });
        }

        detailBox.innerHTML = `
            <div style="font-size: 1.2em; font-weight: bold; color: #fff; margin-bottom: 5px;">
                ${stateData.name || stateId} <small>(${stateData.votes || 3}票)</small>
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px; margin-bottom: 10px;">
                <span style="font-size: 0.85em; color: #aaa;">勝者:</span><br>
                <b style="color: ${winnerParty ? winnerParty.color : '#fff'}; font-size: 1.1em;">
                    ${cand.name} <small>(${winnerParty ? winnerParty.name : ''})</small>
                </b>
            </div>
            <div style="font-size: 0.85em; color: #aaa; margin-bottom: 4px;">支持率内訳:</div>
            ${supportListHtml}
        `;
    }

    // 最終当選アナウンスを表示
    function showFinalNotice() {
        const ann = document.getElementById("finalAnnouncement");
        const detailText = document.getElementById("winnerDetailText");
        const topCand = getCandidateForParty(topPartyId);

        detailText.innerText = `${topCand.name} (${topCand.partyName}) が ${maxVotes} 票を獲得して勝利！`;
        ann.style.opacity = "1";

        // 最終表示時に結果発表カードまでスムーズにスクロールさせる
        ann.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // 州で最も支持率が高い政党を算出するヘルパー
    function getWinnerPartyForState(stateId) {
        if (!stateSupport[stateId]) return null;
        let topP = null;
        let maxVal = -1;
        Object.entries(stateSupport[stateId]).forEach(([pid, val]) => {
            if (val > maxVal) {
                maxVal = val;
                topP = pid;
            }
        });
        return topP;
    }

    document.getElementById('replayBtn').addEventListener('click', () => {
        overlay.style.display = "none";
        document.getElementById('finalSummaryScreen').style.display = "block";
        openFinalSummary(null, topPartyId, maxVotes, winThreshold, isWinner);
    });
}
function getCandidateForParty(partyId) {
    const party = currentMap.parties.find(p => p.id === partyId) || { name: partyId };
    if (typeof presparty !== 'undefined' && partyId === presparty && typeof selectedPresident !== 'undefined' && selectedPresident && currentMap.candidates) {
        const pCand = currentMap.candidates[selectedPresident];
        return { name: pCand ? pCand.name : party.name, partyName: party.name };
    }
    if (currentMap.candidates) {
        const found = Object.values(currentMap.candidates).find(c => c.party === partyId && !c.isMate);
        return { name: found ? found.name : party.name, partyName: party.name };
    }
    return { name: party.name, partyName: party.name };
}

// 表示・非表示の切り替え
function toggleExtraCandidates() {
    const list = document.getElementById('extra-candidates-list');
    const btn = document.getElementById('toggle-candidates-btn');
    if (list.style.display === 'none') {
        list.style.display = 'flex';
        btn.innerText = '閉じる';
    } else {
        list.style.display = 'none';
        btn.innerText = '他の候補者を表示';
    }
}

// initGame の最後の方で呼び出す
// updateCandidateUI(config);
let current

function updateProgress(dateStr) {
    if (!currentMap.startDate || !currentMap.electionDate) return;

    // 全ての日付をミリ秒単位の数値にする
    const start = new Date(currentMap.startDate).getTime();
    const end = new Date(currentMap.electionDate).getTime();
    current = new Date(dateStr).getTime();

    // 全体の期間と、経過した期間を計算
    const totalDuration = end - start;
    const elapsed = current - start;

    // 進捗率（％）を出す（0%〜100%の間に収める）
    let percentage = (elapsed / totalDuration) * 100;
    percentage = Math.max(0, Math.min(100, percentage));

    // バーの長さを更新
    const bar = document.getElementById('progress-bar');
    if (bar) {
        bar.style.width = percentage + "%";

        // 終盤（80%以上）になったらバーの色を赤くして緊張感を出す
        if (percentage > 80) {
            bar.style.backgroundColor = "#ff5722";
        } else {
            bar.style.backgroundColor = "#4caf50";
        }
    }

    // 残り日数を表示する（おまけ）
    const remainingMs = end - current;
    const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
    const daysLabel = document.getElementById('days-left');
    if (daysLabel) {
        daysLabel.innerText = remainingDays > 0 ? `残り: ${remainingDays} 日` : "投票日当日！";
    }
}

let primaryState = {
    targetDelegates: 1000,
    candidates: {},
    turn: 1,
    maxTurns: 10,
    actionPoints: "READY" // "READY" (行動可能) または "EXHAUSTED" (疲労状態)
};

// UI更新処理
function updatePrimaryUI() {
    const container = document.getElementById('primary-candidates-status');
    const targetSelect = document.getElementById('primary-target-select');
    const apLabel = document.getElementById('primary-action-points');

    if (!container || !targetSelect) return;

    // 現在選択中のターゲットIDを保持
    const currentSelectedId = targetSelect.value;

    container.innerHTML = '';
    targetSelect.innerHTML = '';

    // 行動状態表示の更新
    if (apLabel) {
        if (primaryState.actionPoints === "READY") {
            apLabel.innerText = "行動可能";
            apLabel.style.color = "#4ade80";
        } else {
            apLabel.innerText = "疲労中（回復待ち）";
            apLabel.style.color = "#ef4444";
        }
    }

    Object.values(primaryState.candidates).forEach(c => {
        // プレイヤー以外の候補者をターゲット選択肢に追加
        if (c.id !== selectedPresident) {
            const opt = document.createElement('option');
            opt.value = c.id; // ★修正: 名前(c.name)ではなくID(c.id)を値にする！
            opt.textContent = `${c.name} (支持率: ${c.support}%)`;
            if (c.id === currentSelectedId) opt.selected = true;
            targetSelect.appendChild(opt);
        }

        // 候補者ごとの進捗バー描画
        const isPlayer = c.id === selectedPresident;
        const barColor = isPlayer ? '#3b82f6' : '#64748b';

        container.innerHTML += `
            <div style="background: #0f172a; padding: 10px 14px; border-radius: 8px; border: 1px solid ${isPlayer ? '#3b82f6' : '#334155'};">
                <div style="display: flex; justify-content: space-between; font-size: 0.9em; margin-bottom: 4px;">
                    <span><b>${c.name}</b> ${isPlayer ? '<small style="color:#60a5fa;">(あなた)</small>' : ''}</span>
                    <span>支持率: <b>${c.support}%</b> | 獲得代議員: <b style="color:#facc15;">${c.delegates}</b> 票</span>
                </div>
                <div style="width: 100%; background: #334155; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="width: ${Math.min(100, (c.delegates / primaryState.targetDelegates) * 100)}%; background: ${barColor}; height: 100%; transition: width 0.3s;"></div>
                </div>
            </div>
        `;
    });
}


// プレイヤーのアクション実行
// プレイヤーのアクション実行
function executePrimaryAction(actionType) {
    const playerCand = primaryState.candidates[selectedPresident];

    // ガード処理: プレイヤーのデータが存在しない場合
    if (!playerCand) {
        console.error("プレイヤー候補のデータが見つかりません:", selectedPresident);
        const logEl = document.getElementById('primary-log');
        if (logEl) logEl.innerText = "⚠️ プレイヤーデータエラーが発生しました";
        return;
    }

    const logEl = document.getElementById('primary-log');

    // 💡 疲労状態チェック
    if (primaryState.actionPoints === "EXHAUSTED") {
        if (logEl) logEl.innerText = "😓 疲れが溜まっています！次のターンまで休んでください。";
        return;
    }

    const targetSelect = document.getElementById('primary-target-select');
    const targetId = targetSelect ? targetSelect.value : null;
    const targetCand = targetId ? primaryState.candidates[targetId] : null;

    let logMsg = "";

    if (actionType === 'SPEECH') {
        const boost = Math.floor(Math.random() * 8) + 5;
        playerCand.support = Math.min(100, playerCand.support + boost);
        logMsg = `🎤 演説が成功！ 支持率が +${boost}% 上昇した！`;

    } else if (actionType === 'ATTACK') {
        if (targetCand) {
            const drop = Math.floor(Math.random() * 10) + 5;
            targetCand.support = Math.max(5, targetCand.support - drop);
            logMsg = `💥 ${targetCand.name}への批判展開！ 相手の支持率を -${drop}% 下げた！`;
        } else {
            logMsg = "⚠️ 批判ターゲットが存在しません";
        }

    } else if (actionType === 'FACTION') {
        const stolen = Math.floor(Math.random() * 6) + 3;
        if (targetCand && targetCand.support > stolen) {
            targetCand.support -= stolen;
            playerCand.support = Math.min(100, playerCand.support + stolen);
            logMsg = `🤝 ${targetCand.name}の支持派閥を切り崩し、支持率 ${stolen}% を強奪！`;
        } else {
            logMsg = "⚠️ 切り崩せる相手がいません";
        }
    }

    // 1. 行動完了で疲労状態にする
    primaryState.actionPoints = "EXHAUSTED";
    if (logEl) logEl.innerText = logMsg;

    // 2. 💡【重要】まず代議員票を配分（内部計算）
    resolvePrimaryTurnVotes();

    // 3. 💡【重要】計算が終わった『後』にUIを再描画！
    updatePrimaryUI();

    // 4. 勝利判定
    checkPrimaryWinner();
}

// ターン終了ごとの代議員票配分
function resolvePrimaryTurnVotes() {
    if (!primaryState) return;
    const candidatesList = Object.values(primaryState.candidates);
    if (candidatesList.length === 0) return;

    const totalSupport = candidatesList.reduce((sum, c) => sum + (c.support || 0), 0);
    if (totalSupport <= 0) return;

    const roundDelegates = 100;

    candidatesList.forEach(c => {
        let earned = Math.max(1, Math.round((c.support / totalSupport) * roundDelegates));

        // 現職ボーナス
        if (c.incumbent) {
            earned = Math.round(earned * 1.2); // +20%
        }

        c.delegates += earned;

        // NPCの支持率ランダム変動
        if (c.id !== selectedPresident) {
            c.support = Math.max(
                10,
                Math.min(90, c.support + (Math.floor(Math.random() * 7) - 3))
            );
        }
    });

    primaryState.turn++;
}
