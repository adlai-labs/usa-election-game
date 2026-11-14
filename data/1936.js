mapData["1936"] = {
    "name": "1936",
    "mapName": "1936年アメリカ大統領選挙",
    "mapSource": "USMAP",
    "description": "1936年、アメリカは大恐慌からの回復途上にあり、現職フランクリン・ルーズベルトの『ニューディール政策』を巡って国論は真っ二つに割れていた。民主党は絶大な人気を誇る現職 <strong>フランクリン・ルーズベルト</strong> を再選候補に擁立し、政府による積極的な経済介入と社会保障の拡充を訴える。一方、共和党は中道派のカンザス州知事 <strong>アルフレッド・ランドン</strong> を指名。ニューディール政策の行き過ぎや財政赤字を厳しく批判し、伝統的な自由経済への回帰を掲げて現職の牙城に挑む。<ul><li>ルーズベルト：労働者層や都市部、伝統的な地盤である南部を固め、圧倒的な地滑り的勝利を目指そう。</li><li>ランドン：中西部やニューイングランドの保守層をまとめ上げ、反ニューディール感情を追い風に番狂わせを起こそう。</li></ul>",
    "totalvotesToWin": 266,
    "startDate": "1935-12-01",
    "electionDate": "1936-11-06",
    "startprimary": true,
    "mate": true,
    "parties": [
        {
            "id": "DEM",
            "name": "民主党",
            "color": "rgb(0, 0, 255)"
        },
        {
            "id": "GOP",
            "name": "共和党",
            "color": "rgb(255, 0, 0)"
        },
        {
            "id": "UNI",
            "name": "連合党",
            "color": "rgb(128, 71, 24)"
        }
    ],
    "agents": [
    ],
    "candidates": {
        "roosevelt": {
            "name": "フランクリン・D・ルーズベルト",
            "image": "./img/cand/fdr.png",
            "party": "DEM",
            "desc": "<strong>フランクリン・D・ルーズベルト</strong>は、ニューヨークの名門家に生まれ、海軍次官やニューヨーク州知事を経て1932年の大統領選で地滑り的勝利を収めた現職大統領である。ポリオによる下半身不随を不屈の精神で克服し、就任後は『ニューディール政策』を掲げて大恐慌からの脱却を主導。社会保障法の制定や公共事業、労働者の権利擁護を次々と実現し、ラジオの『炉辺談話』を通じて国民に希望と安心感を与え続けた。労働者、農民、都市住民、そして伝統的な南部を結びつけた強固な支持基盤を武器に、1936年の再選へと挑む。",
            "isMate": false,
            "advisorimage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMnGps2Fkc3COBb8CCx7Ztbro4ar8zx1DYI65Y5WUuBQ&s=10",
            "isIncumbent": true,
            "state": "NY"
        },

        "landon": {
            "name": "アルフ・ランドン",
            "image": "./img/cand/landon.png",
            "party": "GOP",
            "isMate": false,
            "advisorimage": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Louis_B_Mayer_cropped.jpg/250px-Louis_B_Mayer_cropped.jpg?utm_source=ja.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
            "desc": "<strong>アルフ・ランドン</strong>は、カンザス州の独立系石油業者として財を成した後、政界に進出した進歩的な共和党員である。1932年の民主党大勝の逆風の中でカンザス州知事に当選すると、大恐慌下でも州の財政均衡を見事に維持しつつ、連邦政府のニューディール政策の一部にも協力する現実的な手腕を発揮した。穏健で親しみやすい人柄から『カンザスのリンカーン』とも呼ばれ、行き過ぎた政府介入と財政赤字を正す中道保守の切り札として、1936年の大統領選へと挑む。",
            "isIncumbent": false,
            "state": "KS"
        },
        "lemke": {
            "name": "ウィリアム・レムケ",
            "image": "./img/cand/lemke.jpg",
            "party": "UNI",
            "state": "ND",
            "isMate": false,
            "npc": true,
            "region": "NONE"
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
        "AL": { "votes": 11, "class": "state anti-GOP", "baseSupport": { "GOP": 13.0, "DEM": 86.5 } },
        "AZ": { "votes": 3, "class": "state anti-GOP", "baseSupport": { "GOP": 27.0, "DEM": 70.0 } },
        "AR": { "votes": 9, "class": "state anti-GOP", "baseSupport": { "GOP": 18.0, "DEM": 81.5 } },
        "CA": { "votes": 22, "class": "state anti-GOP", "baseSupport": { "GOP": 31.5, "DEM": 67.0 } },
        "CO": { "votes": 6, "class": "state anti-GOP", "baseSupport": { "GOP": 37.0, "DEM": 60.5 } },
        "CT": { "votes": 8, "class": "state like-DEM", "baseSupport": { "GOP": 40.5, "DEM": 55.5 } },
        "DE": { "votes": 3, "class": "state like-DEM", "baseSupport": { "GOP": 44.5, "DEM": 54.5 } },
        "FL": { "votes": 7, "class": "state anti-GOP", "baseSupport": { "GOP": 24.0, "DEM": 76.0 } },
        "GA": { "votes": 12, "class": "state anti-GOP", "baseSupport": { "GOP": 13.0, "DEM": 87.0 } },
        "ID": { "votes": 4, "class": "state anti-GOP", "baseSupport": { "GOP": 33.0, "DEM": 63.0 } },
        "IL": { "votes": 29, "class": "state anti-GOP", "baseSupport": { "GOP": 39.5, "DEM": 57.5 } },
        "IN": { "votes": 14, "class": "state like-DEM", "baseSupport": { "GOP": 42.0, "DEM": 56.5 } },
        "IA": { "votes": 11, "class": "state like-DEM", "baseSupport": { "GOP": 42.5, "DEM": 54.5 } },
        "KS": { "votes": 9, "class": "state like-DEM", "baseSupport": { "GOP": 46.0, "DEM": 53.5 } },
        "KY": { "votes": 11, "class": "state anti-GOP", "baseSupport": { "GOP": 40.0, "DEM": 58.5 } },
        "LA": { "votes": 10, "class": "state anti-GOP", "baseSupport": { "GOP": 11.0, "DEM": 89.0 } },
        "ME": { "votes": 5, "class": "state like-GOP", "baseSupport": { "GOP": 55.5, "DEM": 41.5 } },
        "MD": { "votes": 8, "class": "state anti-GOP", "baseSupport": { "GOP": 37.0, "DEM": 62.0 } },
        "MA": { "votes": 17, "class": "state like-DEM", "baseSupport": { "GOP": 41.0, "DEM": 51.0 } },
        "MI": { "votes": 19, "class": "state like-DEM", "baseSupport": { "GOP": 38.5, "DEM": 56.0 } },
        "MN": { "votes": 11, "class": "state anti-GOP", "baseSupport": { "GOP": 31.0, "DEM": 61.5 } },
        "MS": { "votes": 9, "class": "state anti-GOP", "baseSupport": { "GOP": 3.0, "DEM": 97.0 } },
        "MO": { "votes": 15, "class": "state anti-GOP", "baseSupport": { "GOP": 38.0, "DEM": 60.5 } },
        "MT": { "votes": 4, "class": "state anti-GOP", "baseSupport": { "GOP": 27.5, "DEM": 69.0 } },
        "NE": { "votes": 7, "class": "state anti-GOP", "baseSupport": { "GOP": 40.5, "DEM": 57.0 } },
        "NV": { "votes": 3, "class": "state anti-GOP", "baseSupport": { "GOP": 27.0, "DEM": 73.0 } },
        "NH": { "votes": 4, "class": "state like-DEM", "baseSupport": { "GOP": 48.0, "DEM": 50.0 } },
        "NJ": { "votes": 16, "class": "state anti-GOP", "baseSupport": { "GOP": 39.5, "DEM": 59.5 } },
        "NM": { "votes": 3, "class": "state anti-GOP", "baseSupport": { "GOP": 36.5, "DEM": 62.5 } },
        "NY": { "votes": 47, "class": "state anti-GOP", "baseSupport": { "GOP": 39.0, "DEM": 58.5 } },
        "NC": { "votes": 13, "class": "state anti-GOP", "baseSupport": { "GOP": 26.5, "DEM": 73.5 } },
        "ND": { "votes": 4, "class": "state anti-GOP", "baseSupport": { "GOP": 26.5, "DEM": 59.5 } },
        "OH": { "votes": 26, "class": "state anti-GOP", "baseSupport": { "GOP": 37.5, "DEM": 58.0 } },
        "OK": { "votes": 11, "class": "state anti-GOP", "baseSupport": { "GOP": 32.5, "DEM": 66.5 } },
        "OR": { "votes": 5, "class": "state anti-GOP", "baseSupport": { "GOP": 30.0, "DEM": 64.5 } },
        "PA": { "votes": 36, "class": "state like-DEM", "baseSupport": { "GOP": 41.0, "DEM": 56.5 } },
        "RI": { "votes": 4, "class": "state anti-GOP", "baseSupport": { "GOP": 40.0, "DEM": 53.0 } },
        "SC": { "votes": 8, "class": "state anti-GOP", "baseSupport": { "GOP": 1.5, "DEM": 98.5 } },
        "SD": { "votes": 4, "class": "state like-DEM", "baseSupport": { "GOP": 42.5, "DEM": 54.0 } },
        "TN": { "votes": 11, "class": "state anti-GOP", "baseSupport": { "GOP": 31.0, "DEM": 68.5 } },
        "TX": { "votes": 23, "class": "state anti-GOP", "baseSupport": { "GOP": 12.5, "DEM": 87.0 } },
        "UT": { "votes": 4, "class": "state anti-GOP", "baseSupport": { "GOP": 30.0, "DEM": 69.0 } },
        "VT": { "votes": 3, "class": "state like-GOP", "baseSupport": { "GOP": 56.5, "DEM": 43.0 } },
        "VA": { "votes": 11, "class": "state anti-GOP", "baseSupport": { "GOP": 29.5, "DEM": 70.0 } },
        "WA": { "votes": 8, "class": "state anti-GOP", "baseSupport": { "GOP": 30.0, "DEM": 66.5 } },
        "WV": { "votes": 8, "class": "state anti-GOP", "baseSupport": { "GOP": 39.0, "DEM": 60.5 } },
        "WI": { "votes": 12, "class": "state anti-GOP", "baseSupport": { "GOP": 30.5, "DEM": 64.0 } },
        "WY": { "votes": 3, "class": "state anti-GOP", "baseSupport": { "GOP": 37.5, "DEM": 60.5 } }
    }


};