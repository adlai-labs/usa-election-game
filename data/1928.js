mapData["1928"] = {
    "name": "1928",
    "mapName": "1928年アメリカ大統領選挙",
    "mapSource": "USMAP",
    "description": "1928年、アメリカは『クーリッジ繁栄期』の絶頂にあり、経済は空前の活況を呈していた。しかし、現職クーリッジの突然の不出馬宣言により、政界は混沌に陥る。共和党は実務派の天才 <strong>ハーバー・フーバー</strong> を擁立し、繁栄の継続を訴える。一方、民主党はニューヨークの庶民派知事 <strong>アル・スミス</strong> を指名。禁酒法の是非や宗教（カトリック）問題を巡り、国家の未来を揺るがす激しい論戦の火蓋が切って落とされた。<ul><li>フーバー：農村部で支持を集め、禁酒法を支持し、勝利しよう。</li><li>スミス：州知事として、ニューヨークはもちろん、イリノイ・テキサスなど、南部・都市部の州で支持を集めよう。</li></ul>",
    "totalvotesToWin": 266,
    "startDate": "1927-05-01",
    "electionDate": "1928-11-06",
    "startprimary": true,
    "mate": true,
    "parties": [
        {
            "id": "GOP",
            "name": "共和党",
            "color": "rgb(255, 0, 0)"
        },
        {
            "id": "DEM",
            "name": "民主党",
            "color": "rgb(0, 0, 255)"
        },
        {
            "id": "PHO",
            "name": "禁酒党",
            "color": "rgb(255, 0, 255)"
        },
        {
            "id": "FLP",
            "name": "農民労働党",
            "color": "rgb(46, 139, 87)"
        },
        {
            "id": "SOC",
            "name": "アメリカ社会党",
            "color": "rgb(178, 34, 34)"
        },
        {
            "id": "COM",
            "name": "アメリカ共産党",
            "color": "rgb(220, 20, 60)"
        }
    ],
    "agents": [
        {
            "id": "roosevelt",
            "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Roosevelt_in_1920.jpg/250px-Roosevelt_in_1920.jpg",
            "name": "F.ルーズベルト",
            "party": "DEM",
            "home": "NY",
            "power": 10,
            "desc": "ニューヨークの星。東海岸の支持を底上げする。",
            "onTurnEnd": (agent, ownerData) => {
                const eastCoastStates = ["NY"];
                eastCoastStates.forEach(stateId => {
                    updateStateSupport(stateId, ownerData.party, 0.05);
                });

                const statesaaa = ["CA", "NV", "OR", "WA", "IL", "WI", "MI", "IA", "TX"];
                statesaaa.forEach(stateId => {
                    updateStateSupport(stateId, ownerData.party, -0.05);
                });

                if (agent.currentState === agent.home) {
                    updateStateSupport("NY", ownerData.party, 0.1);
                    showSpeechBubble({ name: agent.name }, "NY", "地元ニューヨークは私にお任せください！");
                }
            }
        },
        {
            "id": "huey",
            "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Huey_Long_%28cropped%29.jpg/250px-Huey_Long_%28cropped%29.jpg",
            "name": "ヒューイ・ロング",
            "party": "DEM",
            "home": "LA",
            "power": 15,
            "desc": "南部のポピュリスト"
        },
        {
            "id": "coolidge",
            "image": "./img/cand/coolidge.png",
            "name": "カルビン・クーリッジ",
            "party": "GOP",
            "home": "MA",
            "power": 13,
            "desc": "現職大統領。「クーリッジの繁栄」の象徴としてニューイングランドとビジネス層を固めるが、農村部では反発もある。",
            "onTurnEnd": (agent, ownerData) => {
                // ニューイングランド地方の支持を底上げ
                const newEngland = ["MA", "VT", "NH", "ME", "CT", "RI"];
                newEngland.forEach(stateId => {
                    updateStateSupport(stateId, ownerData.party, 0.04);
                });

                // 農業不況に苦しむ中西部の一部ではわずかに反発を受ける
                const farmStates = ["IA", "ND", "SD", "NE", "KS"];
                farmStates.forEach(stateId => {
                    updateStateSupport(stateId, ownerData.party, -0.04);
                });

                if (agent.currentState === agent.home) {
                    updateStateSupport("MA", ownerData.party, 0.1);
                }
            }
        },
        {
            "id": "hughes",
            "name": "チャールズ・E・ヒューズ",
            "party": "GOP",
            "home": "NY",
            "power": 12,
            "desc": "元NY州知事・国務長官。スミスとルーズベルトの牙城であるニューヨークを正面から切り崩す。",
            "onTurnEnd": (agent, ownerData) => {
                // 東部の大票田（NY・PA・NJ）で安定した支持を獲得
                const easternBigStates = ["NY", "PA", "NJ"];
                easternBigStates.forEach(stateId => {
                    updateStateSupport(stateId, ownerData.party, 0.04);
                });

                if (agent.currentState === "NY") {
                    updateStateSupport("NY", ownerData.party, 0.08);
                }
            }
        },


        {
            "id": "bob",
            "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Portrait_of_Senator_Robert_Lafolette_Jr._Trim_Edit_3x4.jpg/250px-Portrait_of_Senator_Robert_Lafolette_Jr._Trim_Edit_3x4.jpg",
            "name": "ラフォレット・ジュニア",
            "party": "GOP",
            "home": "WI",
            "power": 20,
            "desc": "進歩主義者"
        }
    ],
    "candidates": {
        "hoover": {
            "name": "ハーバート・フーバー",
            "image": "./img/cand/hoover.png",
            "party": "GOP",
            "isMate": false,
            "primary": true,
            "advisorimage": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Louis_B_Mayer_cropped.jpg/250px-Louis_B_Mayer_cropped.jpg?utm_source=ja.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
            "desc": "<strong>ハーバート・フーバー</strong>は、スタンフォード大学卒の優秀な鉱山エンジニアとして世界的な富を築いた後、公職に就いた。第一次世界大戦中および戦後には、ヨーロッパの数百万人の飢餓を救う戦時救済活動を主導し、『偉大な人道主義者』として国際的な名声を獲得。ハーディング、クーリッジ両政権で7年以上にわたり商務長官を務め、1927年のミシシッピ川大洪水の救済活動でも卓越した組織力を発揮した。類まれな行政手腕と輝かしい実績を引っ提げ、1928年の大統領選へと臨む。",
            "isIncumbent": false,
            "state": "CA"
        },
        "smith": {
            "name": "アル・スミス",
            "image": "./img/cand/alsmith.png",
            "party": "DEM",
            "desc": "<strong>アル・スミス</strong>は、ニューヨークの貧しい移民街から這い上がり、叩き上げの政治家として4期にわたりニューヨーク州知事を務めた。工場法改革や児童福祉の拡充、労働環境の改善といった先進的な社会改革を次々と推し進め、都市の労働者層や移民から熱狂的な支持を獲得。『人々のハッピー・ウォリアー（幸福な戦士）』と称された。革新的な行政手腕と高い大衆的人気を武器に、カトリック教徒として初の大統領を目指し1928年の選挙に挑む。",
            "isMate": false,
            "advisorimage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMnGps2Fkc3COBb8CCx7Ztbro4ar8zx1DYI65Y5WUuBQ&s=10",
            "isIncumbent": false,
            "state": "NY"
        },
        "thomas": {
            "name": "ノーマン・トーマス",
            "image": "./img/cand/normanthomas.png",
            "party": "SOC",
            "state": "NY",
            "isMate": false,
            "npc": true,
            "region": "NONE"
        },
        "varny": {
            "name": "ウィリアム・F・ヴァーニー",
            "image": "./img/cand/varny.png",
            "party": "PHO",
            "isMate": false,
            "npc": true,
            "region": "NONE"
        },
        "webb": {
            "name": "フランク・エルブリッジ・ウェッブ",
            "image": "./img/cand/webb.jpg",
            "party": "FLP",
            "isMate": false,
            "npc": true,
            "region": "NONE"
        },
        "foster": {
            "name": "ウィリアム・Z・フォスター",
            "image": "./img/cand/foster.jpg",
            "party": "COM",
            "isMate": false,
            "npc": true,
            "region": "NONE"
        },
        "coolidge": {
            "name": "カルビン・クーリッジ",
            "desc": "カルビン・クーリッジは、第30代アメリカ大統領であり、前任のハーディング急逝に伴うスキャンダルまみれのホワイトハウスに『誠実さと信頼』を取り戻した。寡黙ながら乾いたユーモアを愛し、『寡黙なカル（Silent Cal）』の愛称で国民に親しまれた。自由放任主義（レッセフェール）経済を徹底し、減税と連邦予算の削減を断行することで、1920年代の『クーリッジ繁栄期』と呼ばれる空前の経済成長を牽引。1928年の再選出馬を突如辞退し、絶頂期の中で惜しまれつつ引退の道を選ぶ。",
            "image": "./img/cand/coolidge.png",
            "party": "GOP",
            "isMate": false,
            "primary": true,
            "npc": true,
            "isIncumbent": true,
            "state": "MA"
        },
        "hull": {
            "name": "コーデル・ハル",
            "desc": "コーデル・ハルは、テネシー州の貧しい小作農の家から裁判官へと上り詰め、長年にわたり下院議員として活躍した民主党の重鎮である。1913年の連邦所得税法や相続税法の草案を執筆し、党内随一の財政・税制のスペシャリストとしての地位を確立。1920年代には民主党全国委員長（DNC）を務め、党内の対立を収める調停役として1928年大統領選の指名候補に挑戦する。",
            "image": "https://upload.wikimedia.org/wikipedia/commons/4/49/Cordell_Hull_close-up_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
            "party": "DEM",
            "state": "TN"
        },
        "curtis": {
            "name": "チャールズ・カーティス",
            "image": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Charles_Curtis-portrait.jpg",
            "party": "GOP",
            "isMate": true,
            "state": "KS"
        },
        "dawes": {
            "name": "チャールズ・ドーズ",
            "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Chas_G_Dawes-H%26E_%283x4%29_%28cropped%29.jpg/250px-Chas_G_Dawes-H%26E_%283x4%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
            "party": "GOP",
            "isMate": true,
            "state": "IL"
        },
        "lowden": {
            "name": "フランク・ローデン",
            "image": "./img/cand/lowden.png",
            "party": "GOP",
            "state": "IL",
            "isMate": true
        },
        "robinson": {
            "name": "ジョセフ・T・ロビンソン",
            "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Joseph_T._Robinson_cropped.jpg/250px-Joseph_T._Robinson_cropped.jpg",
            "party": "DEM",
            "isMate": true,
            "state": "AR"
        }
    },
    "states": {
        "AL": {
            "votes": 12,
            "class": "state like-DEM",
            "baseSupport": {
                "GOP": 48.5,
                "DEM": 51.3
            }
        },
        "AR": {
            "votes": 9,
            "class": "state like-DEM anti-GOP",
            "baseSupport": {
                "GOP": 39.3,
                "DEM": 60.3
            }
        },
        "AZ": {
            "votes": 3,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 57.6,
                "DEM": 42.2
            }
        },
        "CA": {
            "votes": 13,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 64.7,
                "DEM": 34.2
            }
        },
        "CO": {
            "votes": 6,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 64.7,
                "DEM": 33.9
            }
        },
        "CT": {
            "votes": 7,
            "class": "state",
            "baseSupport": {
                "GOP": 53.6,
                "DEM": 45.6
            }
        },
        "DE": {
            "votes": 3,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 65.8,
                "DEM": 33.8
            }
        },
        "FL": {
            "votes": 6,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 56.8,
                "DEM": 40.1
            }
        },
        "GA": {
            "votes": 14,
            "class": "state like-DEM anti-GOP",
            "baseSupport": {
                "GOP": 44.0,
                "DEM": 56.0
            }
        },
        "IA": {
            "votes": 13,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 61.8,
                "DEM": 37.6
            }
        },
        "ID": {
            "votes": 4,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 64.7,
                "DEM": 34.4
            }
        },
        "IL": {
            "votes": 29,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 56.9,
                "DEM": 42.3
            }
        },
        "IN": {
            "votes": 15,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 59.7,
                "DEM": 39.6
            }
        },
        "KS": {
            "votes": 10,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 72.0,
                "DEM": 27.1
            }
        },
        "KY": {
            "votes": 13,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 59.3,
                "DEM": 40.5
            }
        },
        "LA": {
            "votes": 10,
            "class": "state like-DEM anti-GOP",
            "baseSupport": {
                "GOP": 23.7,
                "DEM": 76.3
            }
        },
        "MA": {
            "votes": 18,
            "class": "state",
            "baseSupport": {
                "GOP": 49.2,
                "DEM": 50.2
            }
        },
        "MD": {
            "votes": 8,
            "class": "state",
            "baseSupport": {
                "GOP": 57.1,
                "DEM": 42.3
            }
        },
        "ME": {
            "votes": 6,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 68.6,
                "DEM": 31.0
            }
        },
        "MI": {
            "votes": 15,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 70.4,
                "DEM": 28.9
            }
        },
        "MN": {
            "votes": 12,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 57.8,
                "DEM": 40.8
            }
        },
        "MO": {
            "votes": 18,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 55.6,
                "DEM": 44.2
            }
        },
        "MS": {
            "votes": 10,
            "class": "state like-DEM anti-GOP",
            "baseSupport": {
                "GOP": 17.8,
                "DEM": 82.2
            }
        },
        "MT": {
            "votes": 4,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 58.4,
                "DEM": 40.5
            }
        },
        "NC": {
            "votes": 12,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 54.9,
                "DEM": 44.9
            }
        },
        "ND": {
            "votes": 5,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 54.8,
                "DEM": 44.3
            }
        },
        "NE": {
            "votes": 8,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 63.2,
                "DEM": 36.2
            }
        },
        "NH": {
            "votes": 4,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 58.7,
                "DEM": 41.0
            }
        },
        "NJ": {
            "votes": 14,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 59.8,
                "DEM": 39.8
            }
        },
        "NM": {
            "votes": 3,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 59.0,
                "DEM": 40.8
            }
        },
        "NV": {
            "votes": 3,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 56.5,
                "DEM": 43.5
            }
        },
        "NY": {
            "votes": 45,
            "class": "state",
            "baseSupport": {
                "GOP": 49.8,
                "DEM": 47.4
            }
        },
        "OH": {
            "votes": 24,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 64.9,
                "DEM": 34.7
            }
        },
        "OK": {
            "votes": 10,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 63.7,
                "DEM": 35.4
            }
        },
        "OR": {
            "votes": 5,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 64.2,
                "DEM": 34.1
            }
        },
        "PA": {
            "votes": 38,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 65.2,
                "DEM": 33.9
            }
        },
        "RI": {
            "votes": 5,
            "class": "state",
            "baseSupport": {
                "GOP": 49.6,
                "DEM": 50.2
            }
        },
        "VA": {
            "votes": 12,
            "class": "state",
            "baseSupport": {
                "GOP": 53.9,
                "DEM": 45.7
            }
        },
        "SC": {
            "votes": 9,
            "class": "state like-DEM anti-GOP",
            "baseSupport": {
                "GOP": 8.5,
                "DEM": 91.4
            }
        },
        "SD": {
            "votes": 5,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 60.2,
                "DEM": 38.8
            }
        },
        "TN": {
            "votes": 12,
            "class": "state",
            "baseSupport": {
                "GOP": 53.8,
                "DEM": 45.9
            }
        },
        "TX": {
            "votes": 20,
            "class": "state",
            "baseSupport": {
                "GOP": 51.8,
                "DEM": 48.0
            }
        },
        "UT": {
            "votes": 4,
            "class": "state",
            "baseSupport": {
                "GOP": 53.6,
                "DEM": 45.8
            }
        },
        "VT": {
            "votes": 4,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 66.9,
                "DEM": 32.9
            }
        },
        "WA": {
            "votes": 7,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 67.4,
                "DEM": 31.3
            }
        },
        "WI": {
            "votes": 13,
            "class": "state",
            "baseSupport": {
                "GOP": 53.5,
                "DEM": 44.3
            }
        },
        "WV": {
            "votes": 8,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 58.4,
                "DEM": 41.0
            }
        },
        "WY": {
            "votes": 3,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 63.7,
                "DEM": 35.4
            }
        }
    }
};

(function () {
    console.log("【2024年専用パッチ】本流データの外側から画面や処理を激変させます。");

    // 例：2024年が選ばれた時だけ動くように、ゲーム本体の画面遷移関数（例: selectScenario）を乗っ取る
    const startScenario = window.startScenario;

    window.startScenario = function (id) {
        // 本体の元の遷移処理を動かす
        if (typeof startScenario === 'function') {
            startScenario(id);
        }

        stepTitles = [
            "1. 歴史背景",
            "2. ゲームルール設定",
            "3. 政党を選んでください",
            "4. 大統領候補を選んでください",
            "5. 副大統領候補を選んでください"
        ];

        // 2024年が選ばれた時だけ、本流の外から文字を強制的に書き換える！
        if (id.name === "1928") {
            const titleElement = document.getElementById('presidential-candidate-text');
            if (titleElement) {
                titleElement.innerText = "政党を選んでください";
            }
        }
    };
})();