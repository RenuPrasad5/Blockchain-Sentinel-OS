from flask import Flask, request, jsonify
from sklearn.ensemble import IsolationForest
import numpy as np
import pandas as pd

app = Flask(__name__)

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "ML Anomaly Detection Service Running", "port": 5001})

@app.route('/ml/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        if not data or 'transactions' not in data:
            return jsonify({"error": "Invalid input, 'transactions' array expected"}), 400
        
        transactions = data['transactions']
        if len(transactions) < 2:
            return jsonify({
                "anomalyScore": 0.0,
                "riskLevel": "Low",
                "reason": "Insufficient data for anomaly detection"
            })

        # 1. Preprocessing
        df = pd.DataFrame(transactions)
        df['value'] = df['value'].astype(float)
        
        # Features for Isolation Forest: value and normalized timestamp
        # We normalize timestamp relative to the provided batch
        if 'timestamp' in df.columns:
            ts_min = df['timestamp'].min()
            ts_max = df['timestamp'].max()
            if ts_max != ts_min:
                df['timestamp_norm'] = (df['timestamp'] - ts_min) / (ts_max - ts_min)
            else:
                df['timestamp_norm'] = 0.0
            features = df[['value', 'timestamp_norm']].values
        else:
            features = df[['value']].values

        # 2. Isolation Forest
        # contamination = 0.1 as requested
        model = IsolationForest(contamination=0.1, random_state=42)
        model.fit(features)
        
        # 3. Calculate Anomaly Score (0-1)
        # decision_function returns the average anomaly score of a sample. 
        # The lower, the more abnormal. Negative values are outliers.
        # We want 0-1 where 1 is most anomalous.
        scores = model.decision_function(features)
        
        # Normalize scores to 0-1 range
        # decision_function values are typically between -0.5 and 0.5
        # We can use a sigmoid or a simple linear mapping for this demonstration
        # Here we'll use a mapping where negative scores (anomalies) result in higher 0-1 values
        
        # Calculate the anomaly score for the most recent transaction (last in list)
        latest_score = scores[-1]
        
        # Simple mapping: 
        # decision_function < 0 is anomaly. 
        # We'll map -0.5 -> 1.0 and 0.5 -> 0.0
        normalized_score = 0.5 - latest_score
        normalized_score = max(0.0, min(1.0, normalized_score))

        # 4. Risk Level
        risk_level = "Low"
        if normalized_score > 0.7:
            risk_level = "High"
        elif normalized_score > 0.4:
            risk_level = "Medium"

        return jsonify({
            "anomalyScore": round(float(normalized_score), 4),
            "riskLevel": risk_level,
            "reason": "Detected unusual transaction behavior" if risk_level != "Low" else "Transaction behavior appears normal"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run on port 5001 as requested
    app.run(host='0.0.0.0', port=5001, debug=True)
