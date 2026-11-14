window.loadedScenarioEvents = [
    {
        "id": "prohibition_debate",
        "title": "禁酒法の論争",
        "target": [
            "GOP",
            "smith"
        ],
        "date": "1927-10-01",
        "desc": "禁酒法（お酒の禁止）について、あなたのスタンスを明確にする時が来ました。都会の有権者は解禁を望み、農村の有権者は維持を求めています。",
        "conditions": [],
        "choices": [
            {
                "text": "「Dry（継続）」を維持する",
                "advisorText": {
                    "hoover": "これが準票的な立場だ。",
                    "smith": "都市部は激怒している、しかし保守派をなだめるのには役に立っている。"
                },
                "effects": [
                    {
                        "type": "support_state",
                        "party": "DEM",
                        "value": 20,
                        "state": "SC"
                    },
                    {
                        "type": "support_state",
                        "party": "DEM",
                        "value": 24,
                        "state": "GA"
                    },
                    {
                        "type": "support_state",
                        "party": "DEM",
                        "value": 38,
                        "state": "MS"
                    },
                    {
                        "type": "support_state",
                        "party": "DEM",
                        "value": 10,
                        "state": "NY"
                    },
                    {
                        "type": "support_state",
                        "party": "DEM",
                        "value": 4,
                        "state": "AL"
                    },
                    {
                        "type": "support_state",
                        "party": "DEM",
                        "value": 3,
                        "state": "AL"
                    },
                    {
                        "type": "support_state",
                        "party": "GOP",
                        "value": 20,
                        "state": "CA"
                    },
                    {
                        "type": "support_state",
                        "party": "GOP",
                        "value": 16,
                        "state": "IL"
                    },
                    {
                        "type": "support_all",
                        "party": "GOP",
                        "value": 8
                    }
                ]
            },
            {
                "text": "「Wet（解禁）」を約束する",
                "effects": [
                    {
                        "type": "support_state",
                        "party": "DEM",
                        "value": 20,
                        "state": "SC"
                    },
                    {
                        "type": "support_state",
                        "party": "DEM",
                        "value": 24,
                        "state": "GA"
                    },
                    {
                        "type": "support_state",
                        "party": "DEM",
                        "value": 38,
                        "state": "MS"
                    },
                    {
                        "type": "support_state",
                        "party": "DEM",
                        "value": 10,
                        "state": "NY"
                    },
                    {
                        "type": "support_state",
                        "party": "DEM",
                        "value": 4,
                        "state": "AL"
                    },
                    {
                        "type": "support_state",
                        "party": "DEM",
                        "value": 3,
                        "state": "AL"
                    },
                    {
                        "type": "support_state",
                        "party": "GOP",
                        "value": 20,
                        "state": "CA"
                    },
                    {
                        "type": "support_state",
                        "party": "GOP",
                        "value": 16,
                        "state": "IL"
                    },
                    {
                        "type": "support_all",
                        "party": "GOP",
                        "value": 8
                    }
                ]
            }
        ]
    },
    {
        "id": "coolidge",
        "title": "現職大統領の不出馬",
        "target": [
            "GOP",
            "smith"
        ],
        "date": "1927-08-02",
        "desc": "現職大統領クーリッジは不出馬を表明した。",
        "conditions": [],
        "choices": [
            {
                "text": "了解",
                "advisorText": {
                    "hoover": "出馬に向けて準備するときが来た。",
                    "smith": "これは嬉しいニュースだ、どんな相手が指名されるかはまだわからない。"
                },
                "effects": [
                    {
                        "type": "delete_candidate",
                        "target": "coolidge"
                    },
                    {
                        "type": "edit_candidate",
                        "target": "hoover",
                        "key": "primary",
                        "value": false
                    }
                ]
            }
        ]
    },
    {
        "id": "dawesmate",
        "title": "副大統領候補",
        "target": [
            "dawes"
        ],
        "date": "1928-02-16",
        "desc": "あなたの副大統領候補を選ぶ必要がある、大会までに決定を急ごう。",
        "conditions": [],
        "choices": [
            {
                "text": "農民層を味方につけるためにフランク・ローデンへ要請する",
                "advisorText": {
                    "dawes": "ローデンは要請を受諾した。"
                },
                "effects": [
                    {
                        "type": "change_candidate",
                        "selectedmate": "lowden"
                    },
                    {
                        "type": "edit_event",
                        "target": "republican_convention",
                        "key": "desc",
                        "value": "カンザスシティで開催された共和党全国大会は、フーバー撤退により本命不在の大混戦となった、一時はチャールズ・カーティス上院議員が本命だったが、共和党主流派との妥協案で[CANDI]が指名された、副大統領候補としては、あなたと主流派は[MATE]を推薦、投票では少数の反対に遭うも[MATE]は指名された。"
                    },
                    {
                        "type": "edit_event",
                        "target": "republican_convention",
                        "key": "choices[0].effects",
                        "value": [
                            {
                                "type": "support_state",
                                "party": "OWN",
                                "value": 5,
                                "state": "CA"
                            },
                            {
                                "type": "support_state",
                                "party": "OWN",
                                "value": 3,
                                "state": "IL"
                            },
                            {
                                "type": "support_state",
                                "party": "OWN",
                                "value": 3,
                                "state": "TX"
                            }
                        ]
                    }
                ]
            },
            {
                "text": "保守派を味方につけるためウィリアム・ボーラに要請する",
                "advisorText": {
                    "dawes": "ボーラは要請を受諾した。"
                },
                "effects": [
                    {
                        "type": "change_candidate",
                        "selectedmate": "borah"
                    }
                ]
            },
            {
                "text": "上院議員であるカーティスを副大統領候補に留めよう"
            }
        ]
    },
    {
        "id": "hooverrun",
        "title": "フーバーの出馬",
        "target": [
            "hoover"
        ],
        "date": "1928-02-12",
        "desc": "クーリッジも不出馬を表明したことで、あなたの出馬への期待が高まっている、そして今日、発表するときが来た。",
        "conditions": [],
        "choices": [
            {
                "text": "出馬を表明する。",
                "advisorText": {
                    "hoover": "これから、全国大会に向けて選挙活動を行います。"
                },
                "effects": [
                    {
                        "type": "support_state",
                        "party": "OWN",
                        "value": 5,
                        "state": "CA"
                    },
                    {
                        "type": "support_state",
                        "party": "OWN",
                        "value": 3,
                        "state": "IL"
                    },
                    {
                        "type": "support_state",
                        "party": "OWN",
                        "value": 3,
                        "state": "TX"
                    },
                    {
                        "type": "edit_candidate",
                        "target": "hoover",
                        "key": "image",
                        "value": "https://upload.wikimedia.org/wikipedia/commons/b/bb/Herbert_Hoover_-_NARA_-_532049_%28closein_crop_3x4%29.jpg"
                    }
                ]
            },
            {
                "text": "いや、ここはもっと大統領に適任した人がいる。",
                "advisorText": {
                    "dawes": "あなたは不出馬を表明した、この突然の発表に全国は驚いた。"
                },
                "effects": [
                    {
                        "type": "support_state",
                        "party": "OWN",
                        "value": 5,
                        "state": "CA"
                    },
                    {
                        "type": "support_state",
                        "party": "OWN",
                        "value": 3,
                        "state": "IL"
                    },
                    {
                        "type": "edit_candidate",
                        "target": "dawes",
                        "key": "isMate",
                        "value": false
                    },
                    {
                        "type": "change_candidate",
                        "selectedpresident": "dawes",
                        "selectedmate": "curtis"
                    },
                    {
                        "type": "edit_event",
                        "target": "republican_convention",
                        "key": "desc",
                        "value": "カンザスシティで開催された共和党全国大会は、フーバー撤退により本命不在の大混戦となった、一時はフランク・ローデン元イリノイ州知事が本命だったが、共和党主流派との妥協案で[CANDI]が指名された、副大統領候補としては、あなたと主流派は[MATE]を推薦、投票では少数の反対に遭うも[MATE]は指名された。"
                    },
                    {
                        "type": "edit_event",
                        "target": "republican_convention",
                        "key": "choices[0].text",
                        "value": "指名を受諾する。"
                    },
                    {
                        "type": "edit_event",
                        "target": "republican_convention",
                        "key": "choices[0].effects",
                        "value": [
                            {
                                "type": "support_state",
                                "party": "OWN",
                                "value": 2,
                                "state": "IL"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "id": "republican_convention",
        "title": "第1回投票で過半数を獲得",
        "target": [
            "GOP"
        ],
        "date": "1928-06-12",
        "desc": "カンザスシティで開催された共和党全国大会にて、[CANDI]は第1回投票で満場一致に近い票を得て、大統領候補に指名しました。副大統領候補には[MATE]が選ばれました。",
        "conditions": [],
        "choices": [
            {
                "text": "ありがたい。",
                "advisorText": {
                    "hoover": "本格的な選挙戦が始まる。"
                },
                "effects": [
                    {
                        "type": "support_all",
                        "party": "OWN",
                        "value": 0.1
                    }
                ]
            }
        ]
    }
]