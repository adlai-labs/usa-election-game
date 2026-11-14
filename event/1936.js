window.loadedScenarioEvents = [
    {
        "id": "fdr_reation_poll",
        "title": "世論調査ではランドンが圧勝",
        "disabled": true,
        "target": [
            "roosevelt"
        ],
        "date": "1936-06-01",
        "desc": "『リテラリー・ダイジェスト』誌によると、対立候補であるアルフ・ランドンは圧勝するようです。",
        "conditions": [
        ],
        "choices": [
            {
                "text": "世論調査はただの調査だ",
                "effects": [
                    { "type": "support_all", "party": "DEM", "value": 3 },

                ]
            },
            {
                "text": "万が一のため南部へ演説に回る",
                "effects": [

                    {
                        "type": "custom",
                        "fn": () => {
                            const southStates = ["MS", "AL", "TX", "GA", "TN", "NC", "SC", "VA", "LA", "AR", "FL"];
                            Object.keys(currentMap.states).forEach(sId => {
                                if (southStates.includes(sId)) {
                                    updateStateSupport(sId, "GOP", -10);
                                    updateStateSupport(sId, "DEM", 13);
                                }
                            });

                        }
                    }

                ]
            }
        ]
    },

    {
        "id": "fdr_reation_poll_failed",
        "title": "世論調査が間違いだという事が判明しつつある",
        "disabled": true,
        "target": [
            "roosevelt"
        ],
        "date": "1936-01-01",
        "desc": "あなたは集会に参加しました、しかし会場で違和感を感じます。あなたの支持者はたくさんいますし、会場は熱気にあふれています。",
        "conditions": [
        ],
        "choices": [
            {
                "text": "世論調査はやっぱり嘘だった。",
                "advisorText": {
                    "roosevelt": "民衆の声は数字よりも雄弁です。勝利は我々の手の中にあります。"
                },
                "effects": []
            }
        ]
    },

    {
        "id": "landonpoll",
        "title": "世論調査ではランドンが圧勝",
        "target": [
            "landon"
        ],
        "date": "1936-06-01",
        "desc": "『リテラリー・ダイジェスト』誌によると、貴方は圧勝するようです。",
        "conditions": [
        ],
        "choices": [
            {
                "text": "世論調査を信じる",
                "advisorText": {
                    "landon": "あまりの圧勝ぶりに、あなたの陣営は活動休止に入った。"
                },
                "effects": [
                    {
                        "type": "support_all",
                        "party": "GOP",
                        "value": 50
                    },
                    { "type": "enable_event", "eventId": "landonpoll_fail" },
                    { "type": "enable_event", "eventId": "fdr_reation_poll" },
                ]
            }
        ]
    },
    {
        "id": "landonpoll_fail",
        "disabled": true,
        "title": "世論調査がまちがっていたことが判明",
        "target": ["landon"],
        "date": "1936-10-20",
        "desc": "『リテラリー・ダイジェスト』誌とは対照的に、新興のギャラップ調査が『ルーズベルト有利』と予測しました。陣営内に動揺が走っています。",
        "conditions": [],
        "choices": [
            {
                "text": "了解",
                "advisorText": {
                    "landon": "貴方にできることはもう何もない。"
                },
                "effects": [
                    { "type": "enable_event", "eventId": "fdr_reation_poll_failed" },

                    {
                        "type": "custom",
                        "fn": () => {
                            // メイン州(ME)とバーモント州(VT)以外の全州をループして支持率を操作
                            Object.keys(currentMap.states).forEach(sId => {
                                if (sId !== "ME" && sId !== "VT") {
                                    updateStateSupport(sId, "GOP", -40);
                                    updateStateSupport(sId, "UNI", -20);
                                }
                            });
                        }
                    }
                ]
            }
        ]
    }


]