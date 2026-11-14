// 進行中のイベントをチェック
function showEventModal(event) {
    const modal = document.getElementById("eventModal");
    const title = document.getElementById("eventTitle");
    const desc = document.getElementById("eventDesc");
    const date = document.getElementById("eventDate");
    const container = document.getElementById("eventChoices");

    // 現在プレイ中の候補者データと副大統領データを安全に取得
    const candi = currentMap.candidates[selectedPresident] || { name: "大統領候補" };
    const mateObj = currentMap.candidates[selectedMate];
    const mateName = mateObj ? mateObj.name : "副大統領候補";

    // JSONの文字を実際の候補者名に置換
    let eventDescription = event.desc || "";
    eventDescription = eventDescription.replaceAll("[MATE]", mateName);
    eventDescription = eventDescription.replaceAll("[CANDI]", candi.name);

    // テキストのセット
    title.innerText = event.title;
    desc.innerText = eventDescription;
    date.innerText = event.date || currentDate;

    // 選択肢ボタンを一旦クリア
    container.innerHTML = "";

    // 🌟【新機能】元のデータを壊さないように、選択肢のコピーを作ってシャッフルする
    const shuffledChoices = [...event.choices];
    for (let i = shuffledChoices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledChoices[i], shuffledChoices[j]] = [shuffledChoices[j], shuffledChoices[i]];
    }

    // シャッフルされた配列を元にボタンを生成
    shuffledChoices.forEach((choice) => {
        const btn = document.createElement("button");
        btn.className = "event-choice-btn";

        // 選択肢テキスト内の置換
        let buttonText = choice.text || "";
        buttonText = buttonText.replaceAll("[MATE]", mateName);
        buttonText = buttonText.replaceAll("[CANDI]", candi.name);
        btn.innerText = buttonText;

        btn.onclick = () => {
            let currentCandi = currentMap.candidates[selectedPresident];

            // 1. まず効果を適用する（シャッフルされていても正しい choice オブジェクトが渡ります）
            applyEventChoice(choice);

            // 2. アドバイザーモーダルを開く
            showAdvisorModal(currentCandi, choice, () => {
                modal.style.display = "none";
                // if (typeof nextEvent === "function") nextEvent();
            });
        };
        container.appendChild(btn);
    });

    // モーダルを表示
    modal.style.display = "flex";
}

let eventQueue = []; // 発生待ちイベントのリスト

// イベントデータ（JSファイル）を非同期でロードする関数
async function ensureEventsLoaded() {
    const scenario = currentMap;
    if (!scenario) return false;

    // すでにロード済みならスキップ
    if (scenario.scenarioEvents) return true;

    const scenarioId = scenario.id || scenario.name;
    if (!scenarioId) return false;

    return new Promise((resolve) => {
        // 前回の読み込みデータをリセット
        window.loadedScenarioEvents = null;

        // <script src="./event/1980.js"> を動的に生成して読み込む
        const script = document.createElement("script");
        script.src = `./event/${scenarioId}.js`;

        script.onload = () => {
            if (Array.isArray(window.loadedScenarioEvents)) {
                scenario.scenarioEvents = window.loadedScenarioEvents;
                console.log(`✅ event/${scenarioId}.js から ${scenario.scenarioEvents.length} 件のイベントをロードしました！`);
                resolve(true);
            } else {
                console.warn(`⚠️ event/${scenarioId}.js に window.loadedScenarioEvents が定義されていません。`);
                scenario.scenarioEvents = [];
                resolve(false);
            }
            script.remove(); // 読み込み終わったscriptタグは掃除
        };

        script.onerror = () => {
            console.warn(`イベントファイル (./event/${scenarioId}.js) が見つかりませんでした。`);
            scenario.scenarioEvents = [];
            script.remove();
            resolve(false);
        };

        document.head.appendChild(script);
    });
}

// processEvents を async 関数にして、最初に自動ロードを行う
async function processEvents() {
    // 1. イベント未読み込みなら自動で fetch して currentMap.scenarioEvents に格納
    await ensureEventsLoaded();

    const scenario = currentMap;
    if (!scenario || !scenario.scenarioEvents || scenario.scenarioEvents.length === 0) return;

    // 全候補者（自分もNPCも含む）のリスト
    const allCandidateIds = Object.keys(scenario.candidates).sort((a, b) => {
        if (a === selectedPresident) return -1;
        if (b === selectedPresident) return 1;
        return 0;
    });

    allCandidateIds.forEach(candId => {
        scenario.scenarioEvents.forEach(event => {
            // 1. 二重発動防止：すでに誰かが発動させていたらスキップ
            if (event.fired) return;
            if (event.disabled) return;
            // 2. ターゲット判定
            if (event.target) {
                // ターゲットが配列でも単体でも、必ず配列として扱う
                const targets = Array.isArray(event.target) ? event.target : [event.target];

                // 今チェックしている候補者のデータと政党情報を取得
                const candData = currentMap.candidates[candId];
                const candParty = candData ? candData.party : null;

                // 「候補者ID（hoover等）」または「その候補者の政党（GOP等）」のどちらも配列に含まれていないならスルー
                const hasCandidateId = targets.includes(candId);
                const hasPartyId = candParty && targets.includes(candParty);

                if (!hasCandidateId && !hasPartyId) {
                    return;
                }
            }

            // 3. 日付判定
            if (new Date(currentDate) < new Date(event.date)) return;

            // 4. 条件判定（候補者IDを渡して、その人の条件としてチェック）
            if (checkEventConditions(event.conditions, candId)) {
                // ★ここで即座に fired を true にする！(二重発動防止のキモ)
                event.fired = true;

                if (candId === selectedPresident) {
                    // プレイヤーならキューに入れてモーダル表示
                    eventQueue.push(event);
                } else {
                    // NPCなら、その場でAIに選択させる
                    // 【拡張】isHistoricalMode を引数として渡し、NPCの選択アルゴリズムを切り替える
                    console.log(`🤖 AIイベント発生: ${event.title} (対象: ${candId}) [歴史モード: ${isHistoricalMode}]`);
                    npcChooseChoice(event, candId, isHistoricalMode);
                }
            }
        });
    });


    // プレイヤー用の表示処理
    if (eventQueue.length > 0) {
        const modal = document.getElementById("eventModal");
        if (modal && modal.style.display !== "flex") showNextEvent();
    }
}
function npcChooseChoice(event, npcId) {
    if (!event.choices || event.choices.length === 0) return;

    let choice;
    // isHistoricalMode（グローバル変数）が ON の場合
    if (typeof isHistoricalMode !== 'undefined' && isHistoricalMode) {
        // choices の中から historical プロパティが true のものを探す
        const historicalChoice = event.choices.find(c => c.historical);

        if (historicalChoice) {
            choice = historicalChoice;
        } else {
            // 万が一、データに historical が設定されていない場合の安全策（フォールバック）
            choice = event.choices[0];
        }
    } else {
        // 歴史モードが OFF の場合は、ランダムに選択
        const randomIndex = Math.floor(Math.random() * event.choices.length);
        choice = event.choices[randomIndex];
    }

    // 誰が選んだかをしっかり渡す
    applyEventChoice(choice, npcId);
}

function showNextEvent() {
    if (eventQueue.length === 0) return;

    const event = eventQueue.shift(); // 先頭のイベントを取り出す
    showEventModal(event);
}

// 汎用条件チェック
function checkEventConditions(conditions) {
    if (!conditions) return true; // 条件なしは即発動
    if (typeof conditions === "function") {
        return conditions();
    }
    return conditions.every(cond => {
        if (typeof cond === "function") {
            return Boolean(cond());
        }
        switch (cond.type) {
            case "has_agent": {
                const agent = currentMap.agents.find(a => a.id === cond.agentId);
                // 持ち主が「PLAYER」なら選択中の大統領、それ以外はIDで判定
                const requiredOwner = (cond.owner === "PLAYER") ? selectedPresident : cond.owner;
                return agent && agent.owner === requiredOwner;
            }
            case "date_after":
                return new Date(currentDate) >= new Date(cond.value);
            case "support_over": {
                // 特定の州の特定党派の支持率
                const support = stateSupport[cond.stateId][cond.party];
                return support >= cond.value;
            }

            // ==========================================
            // 2. 必須の基本条件（マルチシナリオ共通）
            // ==========================================
            case "check_president":
                // 現在プレイ中の大統領ID（"hoover" や "trump" など）が一致するか
                return selectedPresident === cond.value;

            case "check_mate":
                // 現在選択されている副大統領ID（"lowden" や "pence" など）が一致するか
                return selectedMate === cond.value;

            // ==========================================
            // 3. 【天才的】完全動的なカスタム変数条件
            // ==========================================
            case "check_custom_flag":
                // JSON側が決めた自由なキー（key）の値が一致するか判定
                // （例：1928_lowden_persuaded が true かどうかなど）
                return currentScenarioVariables[cond.key] === cond.value;

            case "check_custom_value_over":
                // JSON側が決めた数値が、指定値「以上」か
                return (currentScenarioVariables[cond.key] || 0) >= cond.value;

            case "check_custom_value_less":
                // JSON側が決めた数値が、指定値「未満」か
                return (currentScenarioVariables[cond.key] || 0) < cond.value;

            // ==========================================
            // 4. おまけ：汎用性の高い追加必須条件
            // ==========================================
            case "total_support_over": {
                // 【全州の合計支持率（世論調査）】など、特定党派の全国平均
                // ※stateSupportから全州の平均を計算するロジックを挟むと便利です
                let total = 0;
                let count = 0;
                for (let state in stateSupport) {
                    if (stateSupport[state][cond.party] !== undefined) {
                        total += stateSupport[state][cond.party];
                        count++;
                    }
                }
                const nationalAvg = count > 0 ? total / count : 0;
                return nationalAvg >= cond.value;
            }

            default:
                // 想定外のタイプは安全のため false（発動しない）にする
                console.warn(`未定義の条件タイプです: ${cond.type}`);
                return false;
        }
    });
}

function applyEventChoice(choice, actorId = selectedPresident) {
    console.log("選択肢がクリックされました:", choice.text);
    const scenario = currentMap;
    const playerParty = currentMap.candidates[actorId].party;    // シナリオに定義されている全政党IDを取得
    const allParties = scenario.parties.map(p => p.id);
    const opponentParty = allParties.find(id => id !== playerParty);
    choice.effects.forEach(eff => {
        // --- 1. パーティIDの解決 ---
        let targetId = eff.party;
        if (eff.party === "OWN") targetId = playerParty;
        if (eff.party === "OPP") targetId = opponentParty;

        console.log(`event: type=${eff.type}, targetId=${targetId}, value=${eff.value}`);
        if (eff.type === "custom" && typeof eff.fn === "function") {
            eff.fn(scenario, actorId);
            console.log("カスタムJSを実行しました。");
        }

        // --- 【新規追加】特定イベントの有効化（ロック解除） ---
        if (eff.type === "enable_event") {
            const targetEv = window.loadedScenarioEvents.find(e => e.id === eff.eventId);
            if (targetEv) {
                targetEv.disabled = false;
                console.log(`イベント [${eff.eventId}] が有効化されました！`);
            }
        }

        // --- 2. 支持率の書き換え ---
        if (eff.type === "support_all") {
            // シナリオデータの州リストを回す
            // mapData[currentScenarioId].states のキー（AK, NYなど）を使ってループ
            Object.keys(currentMap.states).forEach(sId => {
                // 君が持っている最強の updateStateSupport を呼び出す！
                updateStateSupport(sId, targetId, Number(eff.value));
            });
            console.log(`${targetId} に対して効果を適用しました。`);
        }
        // 【追加】特定の州だけ狙い撃ちしたい場合（効果の汎用化）
        if (eff.type === "support_state") {
            updateStateSupport(eff.state, targetId, Number(eff.value));
            console.log(`${targetId} に対して効果を適用しました。`);
        }

        if (eff.type === "edit_candidate") {
            const target = scenario.candidates[eff.target];

            if (target) {
                // データの書き換え（例：image を新しいURLに変える）
                target[eff.key] = eff.value;

                console.log(`${eff.target} の ${eff.key} を ${eff.value} に変更しました`);

                // UI（候補者の顔写真や名前表示）を更新する
                if (typeof updateCandidateUI === "function") {
                    updateCandidateUI();
                }
            }
        }

        if (eff.type === "edit_event") {
            // シナリオやゲームエンジンが保持している「全イベントのリスト」から対象を探す
            const targetEvent = currentMap.scenarioEvents ? currentMap.scenarioEvents.find(ev => ev.id === eff.target) : null;

            if (targetEvent) {
                // --- ここから階層キー（choices[0].textなど）に対応する処理 ---

                // 文字列のキー（例: "choices[0].text"）を、アクセス可能なパスの配列（例: ["choices", "0", "text"]）に分解する
                const path = eff.key
                    .replace(/\[(\d+)\]/g, '.\$1') // "choices[0]" を "choices.0" に変換
                    .split('.');                  // ドットで分割して配列にする

                let current = targetEvent;

                // 最後のプロパティの「手前」までオブジェクトを掘り進む
                for (let i = 0; i < path.length - 1; i++) {
                    const part = path[i];

                    // 次の階層が存在しない場合は、自動でオブジェクト（または配列）を作る
                    if (!(part in current)) {
                        // 次のキーが数字なら配列、文字列ならオブジェクトとして初期化
                        current[part] = isNaN(path[i + 1]) ? {} : [];
                    }
                    current = current[part];
                }

                // 最後のキーに対して値を代入（書き換え）
                const lastKey = path[path.length - 1];
                current[lastKey] = eff.value;

                // --- ここまで ---

                console.log(`イベント「${eff.target}」の ${eff.key} を書き換えました。`, targetEvent);
            }
        }

        if (eff.type === "change_candidate") {
            // 1. 大統領候補（メインプレイヤー）を変更する場合
            // 💡 eff.selectedpresident (小文字) でチェック
            if (eff.selectedpresident !== undefined) {
                // 💡 eff.selectedpresident (小文字) から値を正しく取得
                const nextPresId = eff.selectedpresident;

                // ① 表示用のグローバル変数を書き換え (大文字のP)
                selectedPresident = nextPresId;

                // ② エンジンが裏で保持している可能性が高い候補者変数をまとめて上書き
                if (typeof playerCandidate !== 'undefined') playerCandidate = nextPresId;
                if (typeof activeCandidate !== 'undefined') activeCandidate = nextPresId;

                console.log(`大統領候補を裏のデータも含めて ${nextPresId} に変更しました`);
            }

            // 2. 副大統領候補（ランニングメイト）を変更する場合
            // 💡 eff.selectedmate (小文字) でチェック
            if (eff.selectedmate !== undefined) {
                // 💡 eff.selectedmate (小文字) から値を正しく取得
                const nextMateId = eff.selectedmate;

                // 表示用のグローバル変数を書き換え (大文字のM)
                selectedMate = nextMateId;

                if (typeof playerMate !== 'undefined') playerMate = nextMateId;
                if (typeof activeMate !== 'undefined') activeMate = nextMateId;
                console.log(`副大統領候補を裏のデータも含めて ${nextMateId} に変更しました`);
            }

            // 3. UIの強制リフレッシュと対戦相手の再セット
            if (typeof updateMainCandidateDisplay === "function") {
                updateMainCandidateDisplay(selectedPresident, selectedMate);
                // 💡 正しく取得できた selectedPresident を使って対戦相手を再構築！
                setupOpponent(selectedPresident);
            }
            if (typeof updateCandidateUI === "function") {
                updateCandidateUI();
            }
            if (typeof updateElectionDisplay === "function") {
                updateElectionDisplay();
            }
        }




        if (eff.type === "delete_candidate") {
            // 候補者が存在するかチェック
            if (scenario.candidates[eff.target]) {

                // 候補者そのものを丸ごと削除
                delete scenario.candidates[eff.target];

                console.log(`候補者 ${eff.target} を削除しました`);

                if (typeof updateCandidateUI === "function") {
                    updateCandidateUI();
                }
            }
        }

        if (eff.type === "set_custom_flag") {
            // currentScenarioVariables["1928_lowden_persuaded"] = true; のように動的に生える
            currentScenarioVariables[eff.key] = eff.value;
        }

        // カスタム数値の加算（信頼度やスキャンダル度など）
        if (eff.type === "add_custom_value") {
            currentScenarioVariables[eff.key] = (currentScenarioVariables[eff.key] || 0) + eff.value;
        }

    });

    // イベント専用のモーダルを閉じる
    document.getElementById("eventModal").style.display = "none";

    // 地図と票数を最新状態にする
    updateScore();
}

/**
 * アドバイザー（助言）モーダルを表示する関数
 * @param {Object} candi - 現在の候補者データ
 * @param {Object} choice - プレイヤーが選んだ（またはホバーした）選択肢
 */
// プレイヤーが選択肢をクリックした時に呼び出す関数
function showAdvisorModal(candi, choice) {
    console.log("candi:", candi);
    if (!choice.advisorText) return;
    console.log("advisorTextデータ:", choice.advisorText);

    const imgUrl = candi.advisorimage;
    const candidateId = selectedPresident; // 現在プレイ中の候補者ID（"hoover" や "smith"）

    // 🌟【修正1】まずJSONオブジェクトから、現在の候補者用テキストを引っ張ってくる
    let description = "";
    if (typeof choice.advisorText === "object" && choice.advisorText !== null) {
        description = choice.advisorText[candidateId] || "";
    } else {
        description = choice.advisorText;
    }

    // 表示するテキストが空ならモーダルは開かない
    if (!description) return;

    // 🌟【修正2】副大統領オブジェクトを安全に取得する
    const mateObj = currentMap.candidates[selectedMate];
    // オブジェクトが存在すればその名前、なければフォールバック文字列を使う
    const mateName = mateObj ? mateObj.name : "副大統領候補";

    // 🌟【修正3】テキスト内の [MATE] と [CANDI] を実際の名前へ置き換え
    description = description.replaceAll("[MATE]", mateName);
    description = description.replaceAll("[CANDI]", candi.name); // 文字列ではなくcandi.nameを使う

    // モーダルコンテンツの組み立て
    const modalContent = `
        <div class="result-modal-wrap" style="max-height: 450px; overflow-y: auto; padding: 15px; box-sizing: border-box;">
            <small style="color: #666; font-weight: bold; display: block; margin-bottom: 5px;">フィードバック:</small>
            
            <!-- アドバイザー画像エリア -->
            <div class="advisor-img-box" style="width: 100%; max-width: 200px; margin: 0 auto 15px auto;">
                ${imgUrl ? `<img src="\${imgUrl}" alt="Advisor" style="width: 100%; aspect-ratio: 1 / 1; object-fit: cover; display: block; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">` : ""}
            </div>

            <!-- 候補者ごとに変化した結果テキスト -->
            <div class="result-desc-box" style="font-size: 16px; line-height: 1.6; white-space: pre-wrap; color: #222;">
                ${description}
            </div>
        </div>
    `;

    // 候補者名の陣営としてモーダルを表示
    openModal(`${candi.name}`, modalContent);
}

