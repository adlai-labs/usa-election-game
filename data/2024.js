mapData[
    "2024"
] = {
    "name": "2024",
    "mapName": "2024年アメリカ大統領選挙",
    "mapSource": "USMAP",
    "totalvotesToWin": 270,
    "startDate": "2021-01-20",
    "description": "2024年、アメリカは長引くインフレへの不満や移民問題、さらには緊迫する国際情勢に揺れていた。共和党は圧倒的な求心力を持つ<strong>ドナルド・トランプ</strong>を再び擁立。対する民主党は、現職のジョー・バイデンが7月に異例の撤退を表明し、副大統領の<strong>カマラ・ハリス</strong>へ後継をバトンタッチ。歴史的な短期決戦と激戦7州を巡る大激突が始まる。",
    "electionDate": "2024-11-05",
    "startprimary": true,
    "mate": true,
    "parties": [
        {
            "id": "GOP",
            "name": "共和党",
            "color": "rgb(231, 76, 60)"
        },
        {
            "id": "DEM",
            "name": "民主党",
            "color": "rgb(41, 128, 185)"
        },
        {
            "id": "IND",
            "name": "無所属",
            "color": "rgb(149, 165, 166)"
        },
        {
            "id": "GRN",
            "name": "緑の党",
            "color": "rgb(39, 174, 96)"
        },
        {
            "id": "LIB",
            "name": "リバタリアン党",
            "color": "rgb(241, 196, 15)"
        }
    ],
    "agents": [],
    "candidates": {
        "trump": {
            "name": "ドナルド・トランプ",
            "desc": "<strong>ドナルド・トランプ</strong>は、第45代アメリカ大統領であり、共和党の圧倒的なリーダーである。2020年の敗北からの『返り咲き』を目指し、強固な支持基盤である『MAGA』を率いて三度目の挑戦に臨む。長引くインフレへの不満や移民問題、現職バイデン政権への批判を追い風に、力強いアメリカの復活を公約に掲げて勝利を確実なものにしようとしている。",
            "image": "./img/cand/trump.png",
            "party": "GOP",
            "isMate": false,
            "primary": false,
            "npc": false,
            "isIncumbent": false,
            "state": "FL"
        },
        "harris": {
            "name": "カマラ・ハリス",
            "desc": "<strong>カマラ・ハリス</strong>は、現職の副大統領であり、7月に異例の撤退を表明したジョー・バイデンから後継指名を受けた民主党の新たな旗手である。トランプの返り咲き阻止と『民主主義の守護』を掲げ、リベラル層や女性、若者層の支持を急速に統合。歴史的な超短期決戦の中、アメリカ初の女性大統領誕生という偉業に挑む。",
            "image": "./img/cand/kamala.png",
            "party": "DEM",
            "isMate": false,
            "primary": false,
            "npc": false,
            "isIncumbent": false,
            "state": "CA"
        },
        "biden": {
            "name": "ジョー・バイデン",
            "desc": "<strong>ジョー・バイデン</strong>は、第46代現職アメリカ大統領である。当初は再選を目指して予備選を勝ち抜いたものの、健康不安や年齢問題への懸念が党内で噴出し、立候補撤退を迫られている。",
            "image": "./img/cand/biden2024.jpg",
            "party": "DEM",
            "isMate": false,
            "primary": true,
            "npc": false,
            "isIncumbent": true,
            "state": "DE"
        },
        "rfkennedy": {
            "name": "ロバート・ケネディ・ジュニア",
            "desc": "<strong>ロバート・ケネディ・ジュニア</strong>は、名門ケネディ家の血を引く環境弁護士であり、二大政党制を打破すべく無所属（独立系）として出馬した。反ワクチンや既得権益批判といった独自路線で若者や既成政治に不満を持つ層の支持を集め、一時は大旋風を巻き起こす。サードパーティとしてどこまで票を伸ばせるか、あるいはトランプ支持に回るかの鍵を握る存在。",
            "image": "./img/cand/robertfkennedyjr.png",
            "party": "IND",
            "isMate": false,
            "primary": false,
            "isIncumbent": false,
            "state": "NY"
        },
        "vance": {
            "name": "J・D・ヴァンス",
            "image": "./img/cand/vance.png",
            "party": "GOP",
            "isMate": true,
            "state": "OH"
        },
        "walz": {
            "name": "ティム・ウォルズ",
            "image": "./img/cand/walz.png",
            "party": "DEM",
            "isMate": true,
            "state": "MN"
        },
        "shanahan": {
            "name": "ニコール・シャナハン",
            "image": "./img/cand/shanahan.png",
            "party": "IND",
            "isMate": true,
            "state": "CA"
        }
    },
    "states": {
        "CA": {
            "votes": 54,
            "class": "state like-DEM",
            "baseSupport": {
                "GOP": 44.6,
                "DEM": 52.7
            }
        },
        "OR": {
            "votes": 8,
            "class": "state",
            "baseSupport": {
                "GOP": 42,
                "DEM": 52.7
            }
        },
        "WA": {
            "votes": 12,
            "class": "state",
            "baseSupport": {
                "GOP": 35.8,
                "DEM": 59.6
            }
        },
        "ID": {
            "votes": 4,
            "class": "state",
            "baseSupport": {
                "GOP": 52.1,
                "DEM": 30.7
            }
        },
        "NV": {
            "votes": 6,
            "class": "state",
            "baseSupport": {
                "GOP": 56.5,
                "DEM": 44.6
            }
        },
        "AZ": {
            "votes": 11,
            "class": "state",
            "baseSupport": {
                "GOP": 50.8,
                "DEM": 49.6
            }
        },
        "NM": {
            "votes": 5,
            "class": "state",
            "baseSupport": {
                "GOP": 48.3,
                "DEM": 58.4
            }
        },
        "UT": {
            "votes": 6,
            "class": "state",
            "baseSupport": {
                "GOP": 53.3,
                "DEM": 37.7
            }
        },
        "CO": {
            "votes": 10,
            "class": "state",
            "baseSupport": {
                "GOP": 47.1,
                "DEM": 49.6
            }
        },
        "WY": {
            "votes": 3,
            "class": "state",
            "baseSupport": {
                "GOP": 57.1,
                "DEM": 43.3
            }
        },
        "MT": {
            "votes": 4,
            "class": "state",
            "baseSupport": {
                "GOP": 62.1,
                "DEM": 33.9
            }
        },
        "ND": {
            "votes": 3,
            "class": "state",
            "baseSupport": {
                "GOP": 65.3,
                "DEM": 37.7
            }
        },
        "SD": {
            "votes": 3,
            "class": "state",
            "baseSupport": {
                "GOP": 59.6,
                "DEM": 38.3
            }
        },
        "IL": {
            "votes": 19,
            "class": "state",
            "baseSupport": {
                "GOP": 50.2,
                "DEM": 55.8
            }
        },
        "WI": {
            "votes": 10,
            "class": "state",
            "baseSupport": {
                "GOP": 58.4,
                "DEM": 43.9
            }
        },
        "MN": {
            "votes": 10,
            "class": "state",
            "baseSupport": {
                "GOP": 48.3,
                "DEM": 52.1
            }
        },
        "NE": {
            "votes": 5,
            "class": "state",
            "baseSupport": {
                "GOP": 54.6,
                "DEM": 45.8
            }
        },
        "IA": {
            "votes": 6,
            "class": "state",
            "baseSupport": {
                "GOP": 51.5,
                "DEM": 48.3
            }
        },
        "KS": {
            "votes": 6,
            "class": "state",
            "baseSupport": {
                "GOP": 52.7,
                "DEM": 48.3
            }
        },
        "TX": {
            "votes": 40,
            "class": "state",
            "baseSupport": {
                "GOP": 50.8,
                "DEM": 48.9
            }
        },
        "OK": {
            "votes": 7,
            "class": "state",
            "baseSupport": {
                "GOP": 57.7,
                "DEM": 45.8
            }
        },
        "MO": {
            "votes": 10,
            "class": "state",
            "baseSupport": {
                "GOP": 58.4,
                "DEM": 50.8
            }
        },
        "AR": {
            "votes": 6,
            "class": "state",
            "baseSupport": {
                "GOP": 57.7,
                "DEM": 45.8
            }
        },
        "LA": {
            "votes": 8,
            "class": "state",
            "baseSupport": {
                "GOP": 55.2,
                "DEM": 47.7
            }
        },
        "AL": {
            "votes": 9,
            "class": "state",
            "baseSupport": {
                "GOP": 54.6,
                "DEM": 50.2
            }
        },
        "MS": {
            "votes": 6,
            "class": "state",
            "baseSupport": {
                "GOP": 52.7,
                "DEM": 44.6
            }
        },
        "FL": {
            "votes": 30,
            "class": "state",
            "baseSupport": {
                "GOP": 57.7,
                "DEM": 42.7
            }
        },
        "GA": {
            "votes": 16,
            "class": "state",
            "baseSupport": {
                "GOP": 56.5,
                "DEM": 41.4
            }
        },
        "IN": {
            "votes": 11,
            "class": "state",
            "baseSupport": {
                "GOP": 55.1,
                "DEM": 41.2
            }
        },
        "OH": {
            "votes": 17,
            "class": "state",
            "baseSupport": {
                "GOP": 53.4,
                "DEM": 43.1
            }
        },
        "MI": {
            "votes": 15,
            "class": "state",
            "baseSupport": {
                "GOP": 48.2,
                "DEM": 49.5
            }
        },
        "PA": {
            "votes": 19,
            "class": "state",
            "baseSupport": {
                "GOP": 48.9,
                "DEM": 49.2
            }
        },
        "NY": {
            "votes": 28,
            "class": "state",
            "baseSupport": {
                "GOP": 44.1,
                "DEM": 53.8
            }
        },
        "VT": {
            "votes": 3,
            "class": "state",
            "baseSupport": {
                "GOP": 33.2,
                "DEM": 62.4
            }
        },
        "NH": {
            "votes": 4,
            "class": "state",
            "baseSupport": {
                "GOP": 46.5,
                "DEM": 51.2
            }
        },
        "ME": {
            "votes": 4,
            "class": "state",
            "baseSupport": {
                "GOP": 45.2,
                "DEM": 52.6
            }
        },
        "MA": {
            "votes": 11,
            "class": "state",
            "baseSupport": {
                "GOP": 36.1,
                "DEM": 60.2
            }
        },
        "RI": {
            "votes": 4,
            "class": "state",
            "baseSupport": {
                "GOP": 39.8,
                "DEM": 56.4
            }
        },
        "CT": {
            "votes": 7,
            "class": "state",
            "baseSupport": {
                "GOP": 43.5,
                "DEM": 54.2
            }
        },
        "NJ": {
            "votes": 14,
            "class": "state",
            "baseSupport": {
                "GOP": 46.2,
                "DEM": 51.8
            }
        },
        "DE": {
            "votes": 3,
            "class": "state",
            "baseSupport": {
                "GOP": 42.1,
                "DEM": 55.3
            }
        },
        "MD": {
            "votes": 10,
            "class": "state",
            "baseSupport": {
                "GOP": 34.5,
                "DEM": 62.1
            }
        },
        "VA": {
            "votes": 13,
            "class": "state",
            "baseSupport": {
                "GOP": 44.0,
                "DEM": 53.5
            }
        },
        "NC": {
            "votes": 16,
            "class": "state",
            "baseSupport": {
                "GOP": 50.1,
                "DEM": 48.2
            }
        },
        "SC": {
            "votes": 9,
            "class": "state",
            "baseSupport": {
                "GOP": 54.2,
                "DEM": 43.1
            }
        },
        "KY": {
            "votes": 8,
            "class": "state",
            "baseSupport": {
                "GOP": 62.1,
                "DEM": 36.2
            }
        },
        "TN": {
            "votes": 11,
            "class": "state",
            "baseSupport": {
                "GOP": 60.5,
                "DEM": 37.4
            }
        },
        "WV": {
            "votes": 4,
            "class": "state",
            "baseSupport": {
                "GOP": 68.2,
                "DEM": 29.5
            }
        },
        "HI": {
            "votes": 4,
            "class": "state",
            "baseSupport": {
                "GOP": 37.1,
                "DEM": 59.8
            }
        },
        "AK": {
            "votes": 3,
            "class": "state",
            "baseSupport": {
                "GOP": 52.3,
                "DEM": 41.1
            }
        },
        "DC": {
            "votes": 3,
            "class": "state",
            "baseSupport": {
                "GOP": 9.2,
                "DEM": 89.5
            }
        }
    }

}