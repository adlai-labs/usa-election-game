window.loadedScenarioEvents = [
    {
        "id": "inaugurate",
        "title": "大統領就任式",
        "target": [
            "carter"
        ],
        "date": "1977-01-20",
        "desc": "あなたは就任式に参加し、正式に大統領に就任しました。",
        "conditions": [
            () => {
                const agent = currentMap.agents.find(a => a.id === "mondale");
                return agent;
            }
        ],
        "choices": [
            {
                "text": "了解",
                "advisorText": {
                    "carter": "新しい時代の幕開けに国民全員が喜んでいる。"
                },
                "effects": [
                    {
                        "type": "support_all",
                        "party": "DEM",
                        "value": 20
                    }
                ]
            }
        ]
    },
    {
        "id": "oil_shock_1979",
        "title": "第二次オイルショックと「危機」演説",
        "target": [
            "carter"
        ],
        "date": "1979-07-15",
        "desc": "イラン革命による原油高騰で全米のガソリンスタンドに長蛇の列ができ、深刻なインフレが国民を襲っています。テレビ演説で国民に協力を呼びかけましたが……。",
        "conditions": [],
        "choices": [
            {
                "text": "国民の「自信喪失の危機」を率直に訴える",
                "advisorText": {
                    "carter": "マスメディアは「大統領が自分の失敗を国民のせいにした」と大バッシングしています！支持率が急落しました。"
                },
                "effects": [
                    {
                        "type": "support_all",
                        "party": "DEM",
                        "value": -10
                    }
                ]
            },
            {
                "text": "石油価格の統制と省エネ政策を強調する",
                "advisorText": {
                    "carter": "政策が弱腰すぎると批判され、経済の混乱は収まりません。支持率を大きく失いました。"
                },
                "effects": [
                    {
                        "type": "support_all",
                        "party": "DEM",
                        "value": -8
                    }
                ]
            }
        ]
    },
    {
        "id": "iran_hostage_crisis",
        "title": "イランアメリカ大使館人質事件",
        "target": [
            "carter"
        ],
        "date": "1979-11-04",
        "desc": "テヘランのアメリカ大使館が過激派学生に占拠され、52人のアメリカ人が人質に取られました。さらに3日後、党内の重鎮テッド・ケネディ上院議員が予備選への出馬を表明しました！",
        "conditions": [],
        "choices": [
            {
                "text": "外交交渉による平和的解決を最優先する",
                "advisorText": {
                    "carter": "事態は膠着し、毎晩ニュースで人質の映像が流れています。政権の無力さが露呈し、支持率が暴落しました。"
                },
                "effects": [
                    {
                        "type": "support_all",
                        "party": "DEM",
                        "value": -12
                    }
                ]
            },
            {
                "text": "イランへの経済制裁と資産凍結を断行する",
                "advisorText": {
                    "carter": "強硬姿勢を見せましたが人質は解放されず、ケネディ陣営からも攻撃を受けて党内が分裂しています。"
                },
                "effects": [
                    {
                        "type": "support_all",
                        "party": "DEM",
                        "value": -10
                    }
                ]
            }
        ]
    },
    {
        "id": "eagle_claw_failure",
        "title": "人質救出作戦「イーグルクロー」の失敗",
        "target": [
            "carter"
        ],
        "date": "1980-04-25",
        "desc": "極秘裏に決行した軍の特殊部隊による人質救出作戦が、砂嵐による機体トラブルと衝突事故で悲劇的な大失敗に終わりました。",
        "conditions": [],
        "choices": [
            {
                "text": "テレビ演説ですべての責任を負うと表明する",
                "advisorText": {
                    "carter": "誠実さは伝わりましたが、アメリカの威信は完全に失墜しました。もはや再選は絶望的な状況です……。"
                },
                "effects": [
                    {
                        "type": "support_all",
                        "party": "DEM",
                        "value": -15
                    }
                ]
            },
            {
                "text": "軍の計画不備を強調し、再度の作戦準備を命じる",
                "advisorText": {
                    "carter": "「部下に責任を押し付けた」と猛批判を浴び、共和党のレーガン陣営に決定的なリードを許しました！"
                },
                "effects": [
                    {
                        "type": "support_all",
                        "party": "DEM",
                        "value": -18
                    }
                ]
            }
        ]
    }
]