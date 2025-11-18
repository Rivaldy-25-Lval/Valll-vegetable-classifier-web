/**
 * ========================================
 * VEGETABLE AI CLASSIFIER - JAVASCRIPT
 * TensorFlow.js-based Image Classification
 * ========================================
 */

// ==================== CONFIGURATION ====================
const CONFIG = {
    MODEL_PATH: 'tfjs_models/model.json',
    IMAGE_SIZE: 128,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    CLASS_LABELS: [
        'Bean',
        'Bitter_Gourd',
        'Bottle_Gourd',
        'Brinjal',
        'Broccoli',
        'Cabbage',
        'Capsicum',
        'Carrot',
        'Cauliflower',
        'Cucumber',
        'Papaya',
        'Potato',
        'Pumpkin',
        'Radish',
        'Tomato'
    ],
    VEGETABLE_EMOJIS: {
        'Bean': '🫘',
        'Bitter_Gourd': '🥒',
        'Bottle_Gourd': '🍈',
        'Brinjal': '🍆',
        'Broccoli': '🥦',
        'Cabbage': '🥬',
        'Capsicum': '🫑',
        'Carrot': '🥕',
        'Cauliflower': '🥦',
        'Cucumber': '🥒',
        'Papaya': '🍈',
        'Potato': '🥔',
        'Pumpkin': '🎃',
        'Radish': '🌰',
        'Tomato': '🍅'
    }
};

// ==================== GLOBAL STATE ====================
let model = null;
let isModelLoaded = false;

// ==================== DOM ELEMENTS ====================
const DOM = {
    // Upload Section
    uploadArea: document.getElementById('uploadArea'),
    uploadContent: document.getElementById('uploadContent'),
    fileInput: document.getElementById('fileInput'),
    selectFileBtn: document.getElementById('selectFileBtn'),
    previewContainer: document.getElementById('previewContainer'),
    imagePreview: document.getElementById('imagePreview'),
    analyzeBtn: document.getElementById('analyzeBtn'),
    resetBtn: document.getElementById('resetBtn'),
    analyzeAnotherBtn: document.getElementById('analyzeAnotherBtn'),
    
    // Loading & Status
    loadingIndicator: document.getElementById('loadingIndicator'),
    loadingText: document.getElementById('loadingText'),
    modelStatus: document.getElementById('modelStatus'),
    
    // Results Section
    resultsSection: document.getElementById('resultsSection'),
    resultIcon: document.getElementById('resultIcon'),
    resultClass: document.getElementById('resultClass'),
    resultConfidence: document.getElementById('resultConfidence'),
    confidenceFill: document.getElementById('confidenceFill'),
    predictionsList: document.getElementById('predictionsList')
};

// ==================== INITIALIZATION ====================
/**
 * Initialize the application
 */
async function initApp() {
    console.log('🚀 Initializing Vegetable AI Classifier...');
    
    // Setup event listeners
    setupEventListeners();
    
    // Load TensorFlow.js model
    await loadModel();
    
    console.log('✅ Application initialized successfully');
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // File input change
    DOM.fileInput.addEventListener('change', handleFileSelect);
    
    // Click to select file
    DOM.selectFileBtn.addEventListener('click', () => DOM.fileInput.click());
    DOM.uploadContent.addEventListener('click', () => DOM.fileInput.click());
    
    // Drag and drop
    DOM.uploadArea.addEventListener('dragover', handleDragOver);
    DOM.uploadArea.addEventListener('dragleave', handleDragLeave);
    DOM.uploadArea.addEventListener('drop', handleDrop);
    
    // Analyze button
    DOM.analyzeBtn.addEventListener('click', handleAnalyze);
    
    // Reset buttons
    DOM.resetBtn.addEventListener('click', resetUpload);
    DOM.analyzeAnotherBtn.addEventListener('click', resetUpload);
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, preventDefaults, false);
    });
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// ==================== MODEL LOADING ====================
/**
 * Load TensorFlow.js model
 */
async function loadModel() {
    try {
        showLoading('Memuat model AI...');
        updateModelStatus('loading', 'Memuat model...');
        
        console.log('📦 Loading model from:', CONFIG.MODEL_PATH);
        
        // Load the model
        model = await tf.loadLayersModel(CONFIG.MODEL_PATH);
        
        console.log('✅ Model loaded successfully');
        console.log('📊 Model input shape:', model.inputs[0].shape);
        console.log('📊 Model output shape:', model.outputs[0].shape);
        
        // Warm up the model
        console.log('🔥 Warming up model...');
        const dummyInput = tf.zeros([1, CONFIG.IMAGE_SIZE, CONFIG.IMAGE_SIZE, 3]);
        const warmupPrediction = model.predict(dummyInput);
        warmupPrediction.dispose();
        dummyInput.dispose();
        
        console.log('✅ Model warmed up');
        
        isModelLoaded = true;
        hideLoading();
        updateModelStatus('ready', 'Model siap digunakan ✓');
        
    } catch (error) {
        console.error('❌ Error loading model:', error);
        hideLoading();
        updateModelStatus('error', 'Gagal memuat model');
        showError('Gagal memuat model AI. Pastikan file model tersedia di folder tfjs_models/');
    }
}

// ==================== FILE HANDLING ====================
/**
 * Handle file selection
 */
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    }
}

/**
 * Handle drag over
 */
function handleDragOver(event) {
    event.preventDefault();
    DOM.uploadContent.classList.add('dragover');
}

/**
 * Handle drag leave
 */
function handleDragLeave(event) {
    event.preventDefault();
    DOM.uploadContent.classList.remove('dragover');
}

/**
 * Handle file drop
 */
function handleDrop(event) {
    event.preventDefault();
    DOM.uploadContent.classList.remove('dragover');
    
    const file = event.dataTransfer.files[0];
    if (file) {
        processFile(file);
    }
}

/**
 * Process uploaded file
 */
function processFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('File harus berupa gambar (JPG, PNG, WebP)');
        return;
    }
    
    // Validate file size
    if (file.size > CONFIG.MAX_FILE_SIZE) {
        showError('Ukuran file terlalu besar. Maksimal 10MB');
        return;
    }
    
    // Read and display image
    const reader = new FileReader();
    
    reader.onload = function(e) {
        DOM.imagePreview.src = e.target.result;
        DOM.uploadContent.classList.add('hidden');
        DOM.previewContainer.classList.remove('hidden');
        DOM.resultsSection.classList.add('hidden');
    };
    
    reader.onerror = function() {
        showError('Gagal membaca file. Silakan coba lagi.');
    };
    
    reader.readAsDataURL(file);
}

/**
 * Reset upload state
 */
function resetUpload() {
    DOM.fileInput.value = '';
    DOM.imagePreview.src = '';
    DOM.uploadContent.classList.remove('hidden');
    DOM.previewContainer.classList.add('hidden');
    DOM.resultsSection.classList.add('hidden');
}

// ==================== IMAGE PREPROCESSING ====================
/**
 * Preprocess image for model input
 */
async function preprocessImage(imageElement) {
    return tf.tidy(() => {
        // Convert image to tensor
        let tensor = tf.browser.fromPixels(imageElement);
        
        // Resize to model input size
        tensor = tf.image.resizeBilinear(tensor, [CONFIG.IMAGE_SIZE, CONFIG.IMAGE_SIZE]);
        
        // Normalize pixel values to [0, 1]
        tensor = tensor.toFloat().div(255.0);
        
        // Add batch dimension
        tensor = tensor.expandDims(0);
        
        console.log('📐 Preprocessed tensor shape:', tensor.shape);
        
        return tensor;
    });
}

// ==================== PREDICTION ====================
/**
 * Handle image analysis
 */
async function handleAnalyze() {
    if (!isModelLoaded) {
        showError('Model belum siap. Mohon tunggu sebentar...');
        return;
    }
    
    if (!DOM.imagePreview.src) {
        showError('Tidak ada gambar untuk dianalisis');
        return;
    }
    
    try {
        // Disable analyze button
        DOM.analyzeBtn.disabled = true;
        DOM.analyzeBtn.innerHTML = '<span>⏳ Menganalisis...</span>';
        
        showLoading('Menganalisis gambar...');
        
        // Wait for image to load
        if (!DOM.imagePreview.complete) {
            await new Promise((resolve) => {
                DOM.imagePreview.onload = resolve;
            });
        }
        
        console.log('🔍 Starting image analysis...');
        
        // Preprocess image
        const inputTensor = await preprocessImage(DOM.imagePreview);
        
        // Run prediction
        console.log('🧠 Running model prediction...');
        const predictions = model.predict(inputTensor);
        
        // Get prediction data
        const predictionData = await predictions.data();
        console.log('📈 Raw predictions:', predictionData);
        
        // Clean up tensors
        inputTensor.dispose();
        predictions.dispose();
        
        // Process results
        const results = processResults(predictionData);
        console.log('✅ Processed results:', results);
        
        // Display results
        displayResults(results);
        
        hideLoading();
        
    } catch (error) {
        console.error('❌ Error during analysis:', error);
        showError('Terjadi kesalahan saat menganalisis gambar. Silakan coba lagi.');
        hideLoading();
        
    } finally {
        // Re-enable analyze button
        DOM.analyzeBtn.disabled = false;
        DOM.analyzeBtn.innerHTML = '<span>🔍 Analisis Gambar</span>';
    }
}

/**
 * Process prediction results
 */
function processResults(predictionData) {
    // Convert to array and map to labels
    const predictions = Array.from(predictionData);
    
    // Create array of {label, probability} objects
    const results = predictions.map((probability, index) => ({
        label: CONFIG.CLASS_LABELS[index],
        probability: probability,
        percentage: (probability * 100).toFixed(2)
    }));
    
    // Sort by probability (descending)
    results.sort((a, b) => b.probability - a.probability);
    
    return results;
}

// ==================== RESULTS DISPLAY ====================
/**
 * Display classification results
 */
function displayResults(results) {
    // Get top prediction
    const topResult = results[0];
    
    // Display main result
    const emoji = CONFIG.VEGETABLE_EMOJIS[topResult.label] || '🥬';
    const displayLabel = topResult.label.replace(/_/g, ' ');
    
    DOM.resultIcon.textContent = emoji;
    DOM.resultClass.textContent = displayLabel;
    DOM.resultConfidence.textContent = topResult.percentage + '%';
    
    // Animate confidence bar
    setTimeout(() => {
        DOM.confidenceFill.style.width = topResult.percentage + '%';
    }, 100);
    
    // Display top 5 predictions
    displayTop5Predictions(results.slice(0, 5));
    
    // Show results section with animation
    DOM.resultsSection.classList.remove('hidden');
    
    // Smooth scroll to results
    setTimeout(() => {
        DOM.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
}

/**
 * Display top 5 predictions
 */
function displayTop5Predictions(topPredictions) {
    DOM.predictionsList.innerHTML = '';
    
    topPredictions.forEach((prediction, index) => {
        const item = createPredictionItem(prediction, index);
        DOM.predictionsList.appendChild(item);
    });
}

/**
 * Create a prediction item element
 */
function createPredictionItem(prediction, index) {
    const emoji = CONFIG.VEGETABLE_EMOJIS[prediction.label] || '🥬';
    const displayLabel = prediction.label.replace(/_/g, ' ');
    
    const item = document.createElement('div');
    item.className = 'prediction-item';
    item.style.animationDelay = `${index * 0.1}s`;
    
    item.innerHTML = `
        <div class="prediction-header">
            <span class="prediction-label">${emoji} ${displayLabel}</span>
            <span class="prediction-percentage">${prediction.percentage}%</span>
        </div>
        <div class="prediction-bar">
            <div class="prediction-bar-fill" data-width="${prediction.percentage}"></div>
        </div>
    `;
    
    // Animate progress bar
    setTimeout(() => {
        const bar = item.querySelector('.prediction-bar-fill');
        bar.style.width = prediction.percentage + '%';
    }, (index + 1) * 100);
    
    return item;
}

// ==================== UI HELPERS ====================
/**
 * Show loading indicator
 */
function showLoading(message = 'Memuat...') {
    DOM.loadingText.textContent = message;
    DOM.loadingIndicator.classList.remove('hidden');
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    DOM.loadingIndicator.classList.add('hidden');
}

/**
 * Update model status
 */
function updateModelStatus(status, message) {
    const statusDot = DOM.modelStatus.querySelector('.status-dot');
    const statusText = DOM.modelStatus.querySelector('.status-text');
    
    // Remove all status classes
    statusDot.classList.remove('status-loading', 'status-ready', 'status-error');
    
    // Add appropriate status class
    statusDot.classList.add(`status-${status}`);
    
    // Update text
    statusText.textContent = message;
}

/**
 * Show error message
 */
function showError(message) {
    alert('⚠️ ' + message);
    console.error('Error:', message);
}

// ==================== TENSOR MEMORY MANAGEMENT ====================
/**
 * Log TensorFlow.js memory usage (for debugging)
 */
function logMemoryUsage() {
    if (tf && tf.memory) {
        const memInfo = tf.memory();
        console.log('🧮 TensorFlow.js Memory:', {
            numTensors: memInfo.numTensors,
            numBytes: memInfo.numBytes,
            numDataBuffers: memInfo.numDataBuffers
        });
    }
}

// ==================== APP STARTUP ====================
// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Log memory usage periodically in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setInterval(logMemoryUsage, 30000); // Every 30 seconds
}

// ==================== EXPORT FOR DEBUGGING ====================
window.VegetableClassifier = {
    model,
    isModelLoaded,
    CONFIG,
    resetUpload,
    logMemoryUsage
};

console.log('📦 Vegetable AI Classifier loaded');
console.log('🔧 Debug utilities available at: window.VegetableClassifier');
