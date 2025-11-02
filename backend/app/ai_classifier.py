import numpy as np
from PIL import Image
import io
import random

class IssueClassifier:
    def __init__(self):
        self.classes = ['pothole', 'garbage', 'streetlight', 'other']
        
    def preprocess_image(self, image_data):
        """Preprocess image for model prediction"""
        try:
            image = Image.open(io.BytesIO(image_data))
            image = image.resize((224, 224))
            image_array = np.array(image) / 255.0
            return np.expand_dims(image_array, axis=0)
        except Exception as e:
            print(f"Image preprocessing error: {e}")
            return None
    
    def predict_issue_type(self, image_data):
        """Predict issue type from image - Mock implementation"""
        try:
            # Mock predictions - in real implementation, use actual ML model
            mock_predictions = {
                'pothole': random.uniform(0.1, 0.9),
                'garbage': random.uniform(0.1, 0.9),
                'streetlight': random.uniform(0.1, 0.9),
                'other': random.uniform(0.1, 0.9)
            }
            
            # Normalize to sum to 1
            total = sum(mock_predictions.values())
            for key in mock_predictions:
                mock_predictions[key] /= total
            
            predicted_class = max(mock_predictions, key=mock_predictions.get)
            confidence = mock_predictions[predicted_class]
            
            return {
                'issue_type': predicted_class,
                'confidence': confidence,
                'all_predictions': mock_predictions
            }
            
        except Exception as e:
            return {
                'issue_type': 'other',
                'confidence': 0.0,
                'error': str(e)
            }

classifier = IssueClassifier()