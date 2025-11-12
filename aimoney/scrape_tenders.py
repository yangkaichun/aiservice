import requests
import json
import pandas as pd
from datetime import datetime

print("爬蟲腳本開始執行...")

# 1. 鎖定 API 網址
api_url = "https://web.pcc.gov.tw/prkms/services/common/tenderDetailData"

# 2. 準備要傳送的 payload (查詢條件)
# 這裡我們模擬查詢今天的日期
# (注意：GitHub Actions 預設使用 UTC 時間，比台灣時間晚 8 小時)
# 我們將日期定為當前 UTC 日期
today_utc = datetime.utcnow()
today_str_tw = (today_utc + pd.Timedelta(hours=8)).strftime("%Y/%m/%d") # 轉換為台灣日期字串
today_filename = today_utc.strftime("%Y-%m-%d") # 用 UTC 日期當檔名

print(f"正在查詢台灣日期: {today_str_tw}")

# 這個 payload 結構是從瀏覽器 F12 中 "Payload" 標籤複製來的
payload = {
    "tenderDates": f"{today_str_tw} - {today_str_tw}", # 查詢今天的日期區間
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
    "pageSize": 500  # 增加筆數，確保一次抓完
}

# 3. (重要) 設定 Headers，模擬瀏覽器
headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
}

# 4. 發送 POST 請求
try:
    response = requests.post(api_url, data=json.dumps(payload), headers=headers, timeout=30)
    response.raise_for_status() 

    # 5. 解析回傳的 JSON 資料
    data = response.json()

    # 6. 提取標案資料
    tender_list = data.get("data", [])
    
    if not tender_list:
        print("今天沒有抓到標案資料。")
    else:
        print(f"成功抓取 {len(tender_list)} 筆標案資料")
        
        # 7. 使用 Pandas 轉換為 DataFrame
        df = pd.DataFrame(tender_list)
        
        # 8. (可選) 篩選您要的欄位
        # 您可以從 F12 的 Response 中看到所有欄位，例如：
        # 'serialNo', 'tenderName', 'agencyName', 'tenderBudget', 'publishDate'
        columns_to_keep = ['serialNo', 'agencyName', 'tenderName', 'publishDate', 'tenderBudget', 'tenderStatus']
        # 過濾掉不存在的欄位，避免錯誤
        existing_columns = [col for col in columns_to_keep if col in df.columns]
        df_filtered = df[existing_columns]

        # 9. 儲存為 CSV 檔案
        # 檔名範例: tenders_2025-11-12.csv
        output_filename = f"tenders_{today_filename}.csv"
        
        # 使用 utf-8-sig 編碼，確保 Excel 打開中文時不會亂碼
        df_filtered.to_csv(output_filename, index=False, encoding='utf-8-sig')
        
        print(f"資料已成功儲存至 {output_filename}")

except requests.exceptions.RequestException as e:
    print(f"請求失敗: {e}")
except json.JSONDecodeError:
    print("解析 JSON 回應失敗，可能網頁結構有變或請求被阻擋。")
except Exception as e:
    print(f"發生未預期錯誤: {e}")

print("爬蟲腳本執行完畢。")
