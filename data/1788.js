mapData["1788"] = {
    "name": "1788",
    "mapName": "1788年アメリカ大統領選挙",
    "mapSource": "USMAP1788",
    "description": "1788年、独立を果たしたばかりの新生アメリカ合衆国。新たに批准された合衆国憲法に基づき、歴史上初となる<strong>【初代大統領選挙】</strong>の幕が上がる。独立戦争の英雄 <strong>ジョージ・ワシントン</strong> が圧倒的な名声を誇る中、マサチューセッツの雄 <strong>ジョン・アダムズ</strong> ら建国の父たちが初代の座を巡って名乗りを上げる。選挙人が2名に投票し、『最も票を集めた者が大統領』『2番手が副大統領』となる特殊なルール。誰も正解を知らない、国家の最初の一歩を決める激しい主導権争いが始まる。<ul><li>ワシントン：圧倒的な知名度とカリスマ性を武器に、全州から広く票を集め、誰もが認める初代大統領の座を勝ち取ろう。</li><li>アダムズ：新憲法を強力に推進する立場として、地盤であるマサチューセッツなどニューイングランド（北部）の州を固め、1位の座を狙おう。</li></ul>",
    "totalvotesToWin": 35,
    "startDate": "1788-09-01",
    "electionDate": "1789-01-07",
    "startprimary": true,
    "mate": false,
    "parties": [
        {
            "id": "WAS",
            "name": "無所属",
            "color": "rgb(255, 204, 145)"
        },
        {
            "id": "FED",
            "name": "連邦党",
            "color": "rgb(42, 185, 6)"
        }
    ],
    "agents": [
    ],
    "candidates": {
        "washington": {
            "name": "ジョージ・ワシントン",
            "image": "./img/cand/georgewashington.png",
            "party": "WAS",
            "isMate": false,
            "primary": false,
            "advisorimage": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Louis_B_Mayer_cropped.jpg/250px-Louis_B_Mayer_cropped.jpg?utm_source=ja.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
            "desc": "<strong>ジョージ・ワシントン</strong>は、独立戦争において大陸軍総司令官として軍を率い、圧倒的な劣勢からアメリカを勝利へと導いた建国の絶対的英雄である。国家の危機を救った功績から『建国の父』として全土から神格化に近い名声を獲得。憲法制定会議では議長を務め、混迷する諸州をまとめ上げて新たな合衆国憲法の誕生に決定的な役割を果たした。誰もが認める比類なきカリスマ性と、高潔な人格への絶対的な信頼を引っ提げ、1788年の初代大統領選へと臨む。",
            "isIncumbent": false,
            "state": "VA"
        },
        "adams": {
            "name": "ジョン・アダムズ",
            "image": "./img/cand/johnadams.png",
            "party": "FED",
            "isMate": false,
            "primary": false,
            "advisorimage": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Louis_B_Mayer_cropped.jpg/250px-Louis_B_Mayer_cropped.jpg?utm_source=ja.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
            "desc": "<strong>ジョン・アダムズ</strong>は、ハーバード大学卒の優秀な弁護士として頭角を現した後、大陸会議代表としてアメリカの独立宣言を強力に推進した。独立戦争中には外交官としてヨーロッパに渡り、オランダからの資金援助や物資調達を取り付ける重要な救済活動を主導し、『独立の巨頭』として国際的な名声を獲得。建国の重要局面で長年にわたり論客として熱弁を振るい、新たな合衆国憲法の誕生と連邦政府の確立に卓越した組織力を発揮した。類まれな雄弁術と輝かしい実績を引っ提げ、1788年の大統領選へと臨む。",
            "isIncumbent": false,
            "state": "MA"
        },

    },
    "states": {
        "VA": {
            "votes": 10,
            "class": "state like-WAS",
            "baseSupport": {
                "WAS": 85.0,
                "FED": 15.0
            }
        },
        "MA": {
            "votes": 10,
            "class": "state like-FED like-WAS",
            "baseSupport": {
                "WAS": 60.0,
                "FED": 40.0
            }
        },
        "PA": {
            "votes": 10,
            "class": "state like-WAS",
            "baseSupport": {
                "WAS": 70.0,
                "FED": 30.0
            }
        },
        "NY": {
            "votes": 0,
            "class": "state anti-FED appoint",
            "baseSupport": {
                "WAS": 65.0,
                "FED": 25.0
            }
        },
        "NC": {
            "votes": 0,
            "class": "state like-WAS anti-FED",
            "baseSupport": {
                "WAS": 75.0,
                "FED": 15.0
            }
        },
        "MD": {
            "votes": 6,
            "class": "state like-WAS",
            "baseSupport": {
                "WAS": 80.0,
                "FED": 20.0
            }
        },
        "CT": {
            "votes": 7,
            "class": "state like-FED appoint",
            "baseSupport": {
                "WAS": 55.0,
                "FED": 45.0
            }
        },
        "SC": {
            "votes": 7,
            "class": "state like-WAS anti-FED appoint",
            "baseSupport": {
                "WAS": 100,
                "FED": 0
            }
        },
        "NJ": {
            "votes": 6,
            "class": "state like-FED like-WAS appoint",
            "baseSupport": {
                "WAS": 65.0,
                "FED": 35.0
            }
        },
        "NH": {
            "votes": 5,
            "class": "state like-FED",
            "baseSupport": {
                "WAS": 55.0,
                "FED": 45.0
            }
        },
        "GA": {
            "votes": 5,
            "class": "state like-WAS appoint",
            "baseSupport": {
                "WAS": 90.0,
                "FED": 10.0
            }
        },
        "DE": {
            "votes": 3,
            "class": "state like-FED like-WAS",
            "baseSupport": {
                "WAS": 70.0,
                "FED": 30.0
            }
        },
        "RI": {
            "votes": 0,
            "class": "state anti-FED",
            "baseSupport": {
                "WAS": 60.0,
                "FED": 20.0
            }
        }
    },

    custominit: function () {
        getResultText = (stateName, candiData, finalAmount) => [
            `${stateName}での結果`,
            `<p>${stateName}の選挙人に手紙を送り、${candiData.name}の支持率が <span style="color: #27ae60; font-size: 1.5em;">+${finalAmount}%</span> アップしました！</p>`
        ];
        console.log("ジョージ・ワシントン");
    },
    custommenu: function () {
        stepTitles = [
            "1. 歴史背景",
            "2. ゲームルール設定",
            "3. 政党を選んでください",
            "4. 大統領候補を選んでください"
        ];

        PLAYLIST = [
            { title: "Follow Washington", src: "audio/follow_washington.mp3" },
        ];
        setPlayerSkin("anno_domini")
        document.getElementById('chk-wta').checked = false;
        isWinnerTakeAll = false;
    }

};