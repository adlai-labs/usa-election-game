mapData["1980"] = {
    "name": "1980",
    "mapName": "1980年アメリカ大統領選挙",
    "mapSource": "USMAP",
    "totalvotesToWin": 270,
    "startDate": "1979-01-01",
    "description": "1980年、アメリカは深刻なスタグフレーション（経済不況）とイランアメリカ大使館人質事件に揺れ、現職カーター（民主党）への不満が最高潮に達していた。共和党は保守派の旗手レーガンを擁立。そこに共和党を離党した中道派の<strong>ジョン・B・アンダーソン</strong>が第三極として乱入し、三つ巴の選挙戦が始まる。",
    "electionDate": "1980-11-04",
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
            "id": "IND",
            "name": "無所属",
            "color": "rgb(170, 170, 170)"
        },
        {
            "id": "LIB",
            "name": "リバタリアン党",
            "color": "rgb(248, 203, 8)"
        }
    ],
    "agents": [],
    "candidates": {
        "reagan": {
            "name": "ロナルド・レーガン",
            "desc": "<strong>ジミー・カーター</strong>は、第39代アメリカ大統領であり、1980年選挙における民主党の現職候補である。高い倫理観を掲げて就任したものの、任期後半は「スタグフレーション」と呼ばれる深刻なインフレと不況、そして「イランアメリカ大使館人質事件」という外交危機が重なり、支持率が歴史的な低水準まで急落。党内でもエドワード・ケネディからの激しい挑戦を受けている。この絶体絶命の逆境を跳ね返し、ホワイトハウス死守の奇跡を目指す。",
            "image": "./img/cand/reagan.png",
            "party": "GOP",
            "isMate": false,
            "primary": false,
            "npc": false,
            "isIncumbent": false,
            "state": "CA"
        },
        "carter": {
            "name": "ジミー・カーター",
            "desc": "<strong>ジミー・カーター</strong>は、第39代アメリカ大統領であり、1980年選挙における民主党の現職候補である。高い倫理観を掲げて就任したものの、任期後半は「スタグフレーション」と呼ばれる深刻なインフレと不況、そして「イランアメリカ大使館人質事件」という外交危機が重なり、支持率が歴史的な低水準まで急落。党内でもエドワード・ケネディからの激しい挑戦を受けている。この絶体絶命の逆境を跳ね返し、ホワイトハウス死守の奇跡を目指す。",
            "image": "./img/cand/carter.png",
            "party": "DEM",
            "isMate": false,
            "primary": false,
            "npc": false,
            "isIncumbent": true,
            "state": "GA"
        },
        "clark": {
            "name": "エド・クラーク",
            "image": "./img/cand/edclark.png",
            "party": "LIB",
            "isMate": false,
            "primary": false,
            "npc": true,
            "isIncumbent": false,
            "state": "CA",
            "region": "NONE"
        },
        "anderson": {
            "name": "ジョン・B・アンダーソン",
            "image": "./img/cand/anderson.png",
            "party": "IND",
            "isMate": false,
            "primary": false,
            "desc": "<strong>ジョン・B・アンダーソン</strong>は、共和党のベテラン下院議員でありながら、党の保守化に反発して無所属（独立系）として出馬した。中道リベラル寄りの知識層や若者から絶大な支持を集め、レーガン（共和党）とカーター（民主党）の二大政党制に飽きた有権者の受け皿として『アンダーソン旋風』を巻き起こす。財政保守・社会リベラルという独自のスタンスを掲げ、歴史的なサードパーティ（第三党）としての勝利を目指す。",
            "advisorimage": "https://upload.wikimedia.org/wikipedia/commons/3/35/Ambassador_Patrick_Lucey_%28cropped%29.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
            "isIncumbent": false,
            "state": "IL"
        },
        "smith": {
            "name": "アル・スミス",
            "image": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Alfred_Smith_%283x4_cropped%29.jpg",
            "party": "IND",
            "desc": "<strong>アル・スミス</strong>は、ニューヨークの貧しい移民街から這い上がり、叩き上げの政治家として4期にわたりニューヨーク州知事を務めた。工場法改革や児童福祉の拡充、労働環境の改善といった先進的な社会改革を次々と推し進め、都市の労働者層や移民から熱狂的な支持を獲得。『人々のハッピー・ウォリアー（幸福な戦士）』と称された。革新的な行政手腕と高い大衆的人気を武器に、カトリック教徒として初の大統領を目指し1928年の選挙に挑む。",
            "isMate": true,
            "advisorimage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMnGps2Fkc3COBb8CCx7Ztbro4ar8zx1DYI65Y5WUuBQ&s=10",
            "isIncumbent": false,
            "state": "NY"
        },
        "hwbush": {
            "name": "ジョージ・H・W・ブッシュ",
            "image": "./img/cand/hwbush.png",
            "party": "GOP",
            "isMate": true,
            "state": "TX"
        },
        "dawes": {
            "name": "チャールズ・ドーズ",
            "image": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Chas_G_Dawes-H%26E_%283x4%29_%28cropped%29.jpg/250px-Chas_G_Dawes-H%26E_%283x4%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
            "party": "GOP",
            "isMate": true,
            "state": "IL"
        },
        "mondale": {
            "name": "ウォルター・モンデール",
            "image": "./img/cand/mondale.png",
            "party": "DEM",
            "isMate": true,
            "state": "MN",
            "desc": "ミネソタ州選出の上院議員を経て、カーター政権の現職副大統領を務める。リベラル派や労働組合からの信頼が厚く、政権と議会のパイプ役として重要な役割を担っている。"
        }
    },
    "states": {
        "AK": {
            "votes": 3,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 54.3,
                "DEM": 26.4
            }
        },
        "AL": {
            "votes": 9,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 48.8,
                "DEM": 47.4
            }
        },
        "AR": {
            "votes": 6,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 48.1,
                "DEM": 47.5
            }
        },
        "AZ": {
            "votes": 6,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 60.6,
                "DEM": 28.2
            }
        },
        "CA": {
            "votes": 45,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 52.7,
                "DEM": 35.9
            }
        },
        "CO": {
            "votes": 7,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 55.1,
                "DEM": 31.1
            }
        },
        "CT": {
            "votes": 8,
            "class": "state",
            "baseSupport": {
                "GOP": 47.5,
                "DEM": 38.5
            }
        },
        "DC": {
            "votes": 3,
            "class": "state like-DEM anti-GOP",
            "baseSupport": {
                "GOP": 13.4,
                "DEM": 74.9
            }
        },
        "DE": {
            "votes": 3,
            "class": "state",
            "baseSupport": {
                "GOP": 47.2,
                "DEM": 44.9
            }
        },
        "FL": {
            "votes": 17,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 55.5,
                "DEM": 38.5
            }
        },
        "GA": {
            "votes": 12,
            "class": "state like-DEM",
            "baseSupport": {
                "GOP": 41.0,
                "DEM": 55.8
            }
        },
        "HI": {
            "votes": 4,
            "class": "state like-DEM",
            "baseSupport": {
                "GOP": 42.9,
                "DEM": 44.8
            }
        },
        "IA": {
            "votes": 8,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 51.3,
                "DEM": 38.6
            }
        },
        "ID": {
            "votes": 4,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 66.5,
                "DEM": 25.2
            }
        },
        "IL": {
            "votes": 26,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 49.6,
                "DEM": 41.7
            }
        },
        "IN": {
            "votes": 13,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 56.0,
                "DEM": 37.6
            }
        },
        "KS": {
            "votes": 7,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 57.9,
                "DEM": 33.3
            }
        },
        "KY": {
            "votes": 9,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 49.1,
                "DEM": 47.6
            }
        },
        "LA": {
            "votes": 10,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 51.2,
                "DEM": 45.8
            }
        },
        "MA": {
            "votes": 14,
            "class": "state",
            "baseSupport": {
                "GOP": 41.9,
                "DEM": 41.7
            }
        },
        "MD": {
            "votes": 10,
            "class": "state like-DEM",
            "baseSupport": {
                "GOP": 44.2,
                "DEM": 47.1
            }
        },
        "ME": {
            "votes": 4,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 45.6,
                "DEM": 42.2
            }
        },
        "MI": {
            "votes": 21,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 49.0,
                "DEM": 42.5
            }
        },
        "MN": {
            "votes": 10,
            "class": "state like-DEM",
            "baseSupport": {
                "GOP": 42.6,
                "DEM": 46.5
            }
        },
        "MO": {
            "votes": 12,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 51.2,
                "DEM": 44.4
            }
        },
        "MS": {
            "votes": 7,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 49.4,
                "DEM": 48.1
            }
        },
        "MT": {
            "votes": 4,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 56.8,
                "DEM": 32.4
            }
        },
        "NC": {
            "votes": 12,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 49.3,
                "DEM": 47.2
            }
        },
        "ND": {
            "votes": 3,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 64.2,
                "DEM": 26.3
            }
        },
        "NE": {
            "votes": 5,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 65.5,
                "DEM": 26.0
            }
        },
        "NH": {
            "votes": 4,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 57.7,
                "DEM": 28.4
            }
        },
        "NJ": {
            "votes": 17,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 52.0,
                "DEM": 38.6
            }
        },
        "NM": {
            "votes": 4,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 55.0,
                "DEM": 36.8
            }
        },
        "NV": {
            "votes": 3,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 62.5,
                "DEM": 27.0
            }
        },
        "NY": {
            "votes": 41,
            "class": "state",
            "baseSupport": {
                "GOP": 46.7,
                "DEM": 44.0
            }
        },
        "OH": {
            "votes": 25,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 51.5,
                "DEM": 40.9
            }
        },
        "OK": {
            "votes": 8,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 60.5,
                "DEM": 34.0
            }
        },
        "OR": {
            "votes": 6,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 48.3,
                "DEM": 38.7
            }
        },
        "PA": {
            "votes": 27,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 49.6,
                "DEM": 42.5
            }
        },
        "RI": {
            "votes": 4,
            "class": "state like-DEM",
            "baseSupport": {
                "GOP": 37.2,
                "DEM": 47.7
            }
        },
        "SC": {
            "votes": 8,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 54.1,
                "DEM": 43.3
            }
        },
        "SD": {
            "votes": 4,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 60.5,
                "DEM": 31.7
            }
        },
        "TN": {
            "votes": 10,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 48.7,
                "DEM": 47.6
            }
        },
        "TX": {
            "votes": 26,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 55.3,
                "DEM": 41.4
            }
        },
        "VA": {
            "votes": 12,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 53.0,
                "DEM": 40.3
            }
        },
        "UT": {
            "votes": 5,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 72.8,
                "DEM": 20.6
            }
        },
        "VT": {
            "votes": 3,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 44.4,
                "DEM": 38.4
            }
        },
        "WA": {
            "votes": 9,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 49.7,
                "DEM": 37.3
            }
        },
        "WI": {
            "votes": 11,
            "class": "state like-GOP",
            "baseSupport": {
                "GOP": 47.9,
                "DEM": 43.2
            }
        },
        "WV": {
            "votes": 6,
            "class": "state like-DEM",
            "baseSupport": {
                "GOP": 45.3,
                "DEM": 49.8
            }
        },
        "WY": {
            "votes": 3,
            "class": "state like-GOP anti-DEM",
            "baseSupport": {
                "GOP": 62.6,
                "DEM": 28.0
            }
        }
    },

    custominit: function () {
        if (selectedPresident === "carter") {
            currentMap.startDate = "1977-01-20"
            currentMap.candidates["anderson"].primary = true;
            currentMap.candidates["anderson"].party = "GOP";
            currentMap.candidates["reagan"].primary = true;

            currentMap.candidates["reagan"].name = "共和党";
            currentMap.candidates["reagan"].image = "./img/cand/gop.png";

            updateMainCandidateDisplay(selectedPresident, selectedMate);



        }
    }
}