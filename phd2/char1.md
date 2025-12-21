graph TD
    subgraph "10 使用者終端裝置 (User Terminal Device)"
        style 10 fill:#f9f9f9,stroke:#333,stroke-width:2px
        UI[11 生理數據輸入模組<br>(Data Input Interface)]
        Display[12 視覺化顯示模組<br>(Visualization Display)]
        Comms[13 第一通訊模組<br>(Communication Module)]
    end

    subgraph "20 雲端管理伺服器 (Cloud Management Server)"
        style 20 fill:#e1f5fe,stroke:#0288d1,stroke-width:2px
        API[21 數據處理模組<br>(Data Processing Module)]
        DB[(22 資料庫單元<br>Database Unit)]
        Prompt[23 提示詞生成模組<br>(Prompt Generation Module)]
        Comms2[24 第二通訊模組<br>(Server Communication Module)]
    end

    subgraph "30 AI 分析伺服器 (AI Analysis Server)"
        style 30 fill:#fff3e0,stroke:#ff9800,stroke-width:2px
        API_AI[32 第三通訊模組<br>(AI API Interface)]
        LLM[31 大型語言模型運算單元<br>(LLM Computing Unit)]
    end

    %% 連線關係
    Comms <==>|網際網路連接<br>(HTTPS Request/Response)| API
    API -->|解析與儲存數據| DB
    API -->|轉發分析請求| Prompt
    Prompt -->|讀取歷史數據| DB
    Prompt -->|傳送結構化提示詞| Comms2
    Comms2 <==>|應用程式介面連接<br>(API Call)| API_AI
    API_AI -->|輸入提示詞| LLM
    LLM -->|輸出自然語言建議| API_AI

    %% 樣式調整
    style Prompt fill:#ffecb3,stroke:#ff6f00,stroke-width:2px,stroke-dasharray: 5 5 