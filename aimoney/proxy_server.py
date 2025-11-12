from flask import Flask, jsonify, request
import requests
from flask_cors import CORS # 需要安裝 pip install flask-cors

app = Flask(__name__)
# 啟用 CORS：允許所有來源的網域存取此代理服務
# 如果您想更安全，可以將 origins='*' 替換為 origins='https://yangkaichun.github.io'
CORS(app, resources={r"/api/*": {"origins": "*"}}) 

# 這是目標 API 的基礎 URL
TARGET_API_BASE = 'https://pcc-api.openfun.app/api/listbydate'

@app.route('/api/tenders', methods=['GET'])
def proxy_tenders():
    """從前端獲取日期參數，然後向目標 API 發出請求並返回結果"""
    
    # 從前端請求中獲取 'date' 參數 (例如: 20251112)
    date_param = request.args.get('date')
    
    if not date_param:
        return jsonify({"error": "Missing date parameter"}), 400

    # 構造完整的目標 API URL
    target_url = f"{TARGET_API_BASE}?date={date_param}"
    
    print(f"Proxying request to: {target_url}")

    try:
        # 向目標 API 發出請求
        response = requests.get(target_url)
        response.raise_for_status() # 如果狀態碼不是 200，則拋出例外

        # 將目標 API 返回的 JSON 資料直接回傳給前端
        return jsonify(response.json())

    except requests.exceptions.HTTPError as e:
        # 處理目標 API 的錯誤
        return jsonify({"error": f"Target API responded with error: {e}"}), e.response.status_code
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500

if __name__ == '__main__':
    # 在 5000 port 運行伺服器
    # 您需要將這個服務部署到您的公開網域上
    app.run(debug=True, port=5000)
