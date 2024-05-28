import numpy as np

class LogisticRegression:
    def __init__(self, feature_count, learning_rate=0.01):
        self.learning_rate = learning_rate
        self.weights = np.zeros(feature_count)
        self.bias = 0
    
    def sigmoid(self, z):
        return 1 / (1 + np.exp(-z))
    
    def train(self, x, y):
        if self.weights is None or self.bias is None:
            self._initialize_parameters(len(x))
        
        y_pred = self.sigmoid(np.dot(x, self.weights) + self.bias)
        
        self.weights -= self.learning_rate * (x * (y_pred - y))
        self.bias -= self.learning_rate * (y_pred - y)
    
    def predict(self, X, threshold=0.5):
        probabilities =  self.sigmoid(np.dot(X, self.weights) + self.bias)
        return (probabilities >= threshold).astype(int)
    
    def get_weights(self):
        return self.weights

    def save(self, file_name):
        np.save(file_name, np.array([self.bias] + list(self.weights)))
        
    def load(self, file_name):        
        file_contents = np.load(file_name)
        self.bias = file_contents[0]
        self.weights = file_contents[1:]
