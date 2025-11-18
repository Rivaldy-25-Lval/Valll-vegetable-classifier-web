/**
 * ========================================
 * VEGETABLE AI CLASSIFIER - JAVASCRIPT
 * API-based Image Classification
 * ========================================
 */

// ==================== CONFIGURATION ====================
const CONFIG = {
    // API Configuration - UPDATE THIS AFTER DEPLOYING BACKEND
    API_URL: 'https://vegetable-classifier-api.onrender.com',
    
    // Local development fallback
    API_FALLBACK: 'http://localhost:5000',
    
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    
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
let currentImageFile = null;
let isApiReady = false;

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
    console.log('🚀 Initializing Vegetable AI Classifier (API Mode)...');
    
    // Setup event listeners
    setupEventListeners();
    
    // Check API health
    await checkApiHealth();
    
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

// ==================== API FUNCTIONS ====================
/**
 * Check if API is healthy
 */
async function checkApiHealth() {
    try {
        showLoading('Memeriksa koneksi API...');
        updateModelStatus('loading', 'Menghubungi server...');
        
        console.log('📡 Checking API health at:', CONFIG.API_URL);
        
        const response = await fetch(`${CONFIG.API_URL}/health`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API is healthy:', data);
            
            isApiReady = data.model_loaded;
            hideLoading();
            
            if (isApiReady) {
                updateModelStatus('ready', 'API siap digunakan ✓');
            } else {
                updateModelStatus('loading', 'Server sedang memuat model...');
                // Retry after 3 seconds
                setTimeout(checkApiHealth, 3000);
            }
        } else {
            throw new Error(`API returned status ${response.status}`);
        }
        
    } catch (error) {
        console.error('❌ API health check failed:', error);
        hideLoading();
        updateModelStatus('error', 'Server tidak tersedia');
        
        showError(
            'Tidak dapat terhubung ke server API.\n\n' +
            'Kemungkinan penyebab:\n' +
            '1. Server masih dalam proses startup (tunggu 1-2 menit)\n' +
            '2. Server sedang sleep (klik refresh setelah beberapa saat)\n' +
            '3. Koneksi internet bermasalah\n\n' +
            'Silakan refresh halaman (Ctrl+F5) setelah beberapa saat.'
        );
    }
}

/**
 * Send image to API for prediction
 */
async function predictWithApi(imageFile) {
    try {
        console.log('📤 Sending image to API for prediction...');
        
        // Create FormData
        const formData = new FormData();
        formData.append('image', imageFile);
        
        // Send request
        const response = await fetch(`${CONFIG.API_URL}/predict`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error('Prediction failed');
        }
        
        console.log('✅ Prediction successful:', data);
        
        return data.predictions;
        
    } catch (error) {
        console.error('❌ API prediction error:', error);
        throw error;
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
 * Handle drop
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
 * Process selected file
 */
function processFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('File yang dipilih bukan gambar. Silakan pilih file gambar (JPG, PNG, dll)');
        return;
    }
    
    // Validate file size
    if (file.size > CONFIG.MAX_FILE_SIZE) {
        showError(`Ukuran file terlalu besar. Maksimal ${CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`);
        return;
    }
    
    // Store file
    currentImageFile = file;
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        DOM.imagePreview.src = e.target.result;
        DOM.previewContainer.style.display = 'block';
        DOM.uploadContent.style.display = 'none';
        
        // Hide results if any
        DOM.resultsSection.style.display = 'none';
    };
    reader.readAsDataURL(file);
    
    console.log('📷 Image loaded:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`);
}

/**
 * Reset upload
 */
function resetUpload() {
    currentImageFile = null;
    DOM.fileInput.value = '';
    DOM.previewContainer.style.display = 'none';
    DOM.uploadContent.style.display = 'flex';
    DOM.resultsSection.style.display = 'none';
    console.log('🔄 Upload reset');
}

// ==================== PREDICTION ====================
/**
 * Handle analyze button click
 */
async function handleAnalyze() {
    if (!currentImageFile) {
        showError('Silakan pilih gambar terlebih dahulu');
        return;
    }
    
    if (!isApiReady) {
        showError('Server belum siap. Mohon tunggu sebentar atau refresh halaman.');
        return;
    }
    
    try {
        // Disable button
        DOM.analyzeBtn.disabled = true;
        DOM.analyzeBtn.style.opacity = '0.6';
        
        // Show loading
        showLoading('Menganalisis gambar...');
        
        // Call API
        const predictions = await predictWithApi(currentImageFile);
        
        // Hide loading
        hideLoading();
        
        // Display results
        displayResults(predictions);
        
        // Re-enable button
        DOM.analyzeBtn.disabled = false;
        DOM.analyzeBtn.style.opacity = '1';
        
    } catch (error) {
        hideLoading();
        DOM.analyzeBtn.disabled = false;
        DOM.analyzeBtn.style.opacity = '1';
        
        showError(`Gagal menganalisis gambar: ${error.message}`);
    }
}

// ==================== RESULTS DISPLAY ====================
/**
 * Display prediction results
 */
function displayResults(predictions) {
    if (!predictions || predictions.length === 0) {
        showError('Tidak ada hasil prediksi');
        return;
    }
    
    // Get top prediction
    const topPrediction = predictions[0];
    
    // Update main result
    DOM.resultIcon.textContent = CONFIG.VEGETABLE_EMOJIS[topPrediction.class] || '🥬';
    DOM.resultClass.textContent = topPrediction.class.replace(/_/g, ' ');
    DOM.resultConfidence.textContent = topPrediction.percentage + '%';
    
    // Animate confidence bar
    setTimeout(() => {
        DOM.confidenceFill.style.width = topPrediction.percentage + '%';
    }, 100);
    
    // Display top 5 predictions
    displayTop5Predictions(predictions);
    
    // Show results section
    DOM.resultsSection.style.display = 'block';
    
    // Scroll to results
    DOM.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    console.log('✅ Results displayed');
}

/**
 * Display top 5 predictions list
 */
function displayTop5Predictions(predictions) {
    DOM.predictionsList.innerHTML = '';
    
    predictions.forEach((pred, index) => {
        const item = document.createElement('div');
        item.className = 'prediction-item';
        item.style.animationDelay = `${index * 0.1}s`;
        
        item.innerHTML = `
            <div class="prediction-info">
                <span class="prediction-emoji">${CONFIG.VEGETABLE_EMOJIS[pred.class] || '🥬'}</span>
                <span class="prediction-name">${pred.class.replace(/_/g, ' ')}</span>
            </div>
            <div class="prediction-probability">
                <span class="prediction-percentage">${pred.percentage}%</span>
                <div class="prediction-bar">
                    <div class="prediction-fill" style="width: ${pred.percentage}%"></div>
                </div>
            </div>
        `;
        
        DOM.predictionsList.appendChild(item);
    });
}

// ==================== UI HELPERS ====================
/**
 * Show loading indicator
 */
function showLoading(message = 'Memproses...') {
    DOM.loadingIndicator.style.display = 'flex';
    DOM.loadingText.textContent = message;
}

/**
 * Hide loading indicator
 */
function hideLoading() {
    DOM.loadingIndicator.style.display = 'none';
}

/**
 * Update model status
 */
function updateModelStatus(status, message) {
    DOM.modelStatus.className = `model-status ${status}`;
    DOM.modelStatus.textContent = message;
}

/**
 * Show error message
 */
function showError(message) {
    alert('⚠️ ' + message);
    console.error('Error:', message);
}

// ==================== EXPORT FOR DEBUGGING ====================
window.VegetableClassifier = {
    config: CONFIG,
    dom: DOM,
    state: {
        get isApiReady() { return isApiReady; },
        get currentImageFile() { return currentImageFile; }
    },
    functions: {
        checkApiHealth,
        resetUpload
    }
};

// ==================== START APPLICATION ====================
document.addEventListener('DOMContentLoaded', initApp);

console.log('🥬 Vegetable Classifier loaded (API Mode)');
