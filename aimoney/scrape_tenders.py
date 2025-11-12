import requests
import json
import pandas as pd
from datetime import datetime

print("爬蟲腳本開始執行...")

# 1. 鎖定 API 網址
api_url = "https://web.pcc.gov.tw/prkms/services/common/tenderDetailData"

# 2. 準備要傳送的 payload (查詢條件)
today_utc = datetime.utcnow()
today_str_tw = (today_utc + pd.Timedelta(hours=8)).strftime("%Y/%m/%d") # 轉換為台灣日期字串
today_filename = today_utc.strftime("%Y-%m-%d") # 用 UTC 日期當檔名

print(f"正在查詢台灣日期: {today_str_tw}")

# (Payload 內容不變，省略...)
payload = {
    "tenderDates": f"{today_str_tw} - {today_str_tw}",
    "dateType": "tenderDate",
    "tenderStatus": "true,1,2,3,4,20,21,23,24,27,5,6,28,7,8,9,10,11,12,13,14,15,16,17,18,19,22,25,26",
    "infoType": "common",
    "tenderView": "true",
    "dailyView": "true",
    "level": "0",
    "radWord": "true",
    "keyWord": "",
    "radMan": "true",
    "manName": "",
    "radAg": "true",
    "agencyName": "",
    "radAddr": "true",
    "address": "",
    "radIs": "true",
    "isOther": "",
    "isCombined": "",
    "tenderWay": "true,1,2,3,4,5,6,7,8,9,10,11,12",
    "sysType": "true,1,2,3,4",
    "category": "",
    "fromWeb": "true",
    "page": 1,
    "pageSize": 5000
}

# 3. (重要) 設定 Headers (不變，省略...)
headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
}

# 4. 發送 POST 請求
try:
    response = requests.post(api_url, data=json.dumps(payload), headers=headers, timeout=30)
    response.raise_for_status() 

    data = response.json()
    tender_list = data.get("data", [])
    
    if not tender_list:
        print("今天沒有抓到標案資料。")
    else:
        print(f"成功抓取 {len(tender_list)} 筆標案資料")
        
        df = pd.DataFrame(tender_list)
        
        # 篩選您要的欄位 (我們在 HTML 中會用到這幾個)
        columns_to_keep = ['serialNo', 'agencyName', 'tenderName', 'publishDate', 'tenderBudget', 'tenderStatus']
        existing_columns = [col for col in columns_to_keep if col in df.columns]
        df_filtered = df[existing_columns]

        # --- 以下是修改的重點 ---
        
        # 1. 儲存每日的 CSV 檔案 (供歷史存檔)
        output_filename = f"tenders_{today_filename}.csv"
        df_filtered.to_csv(output_filename, index=False, encoding='utf-8-sig')
        print(f"歷史資料已儲存至 {output_filename}")

        # 2. (新增) 儲存一個 'latest' 檔案 (供網頁讀取)
        latest_filename = "tenders_latest.csv"
        df_filtered.to_csv(latest_filename, index=False, encoding='utf-8-sig')
        print(f"最新資料已儲存至 {latest_filename} (供網頁使用)")
        
        # --- 修改結束 ---

except Exception as e:
    print(f"爬蟲執行時發生錯誤: {e}")

print("爬蟲腳本執行完畢。")
