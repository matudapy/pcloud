// DOM Elements
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const imagePreview = document.getElementById('image-preview');
const uploadBtn = document.getElementById('upload-btn');
const clearBtn = document.getElementById('clear-btn');
const progressContainer = document.getElementById('progress-container');

// Global variables
let selectedFiles = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', initApp);
dropArea.addEventListener('dragover', handleDragOver);
dropArea.addEventListener('dragleave', handleDragLeave);
dropArea.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
uploadBtn.addEventListener('click', handleUpload);
clearBtn.addEventListener('click', handleClear);

/**
 * Initialize the application
 */
function initApp() {
    console.log('pCloud Image Uploader initialized');
    
    // Check if pCloud API is available
    if (typeof pCloudSDK === 'undefined') {
        console.warn('pCloud SDK not loaded. Using mock implementation.');
    }
}

/**
 * Handle dragover event
 * @param {Event} e - The dragover event
 */
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.add('highlight');
}

/**
 * Handle dragleave event
 * @param {Event} e - The dragleave event
 */
function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.remove('highlight');
}

/**
 * Handle drop event
 * @param {Event} e - The drop event
 */
function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.remove('highlight');
    
    const dt = e.dataTransfer;
    const files = dt.files;
    
    handleFiles(files);
}

/**
 * Handle file selection from input
 * @param {Event} e - The change event
 */
function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

/**
 * Process the selected files
 * @param {FileList} files - The selected files
 */
function handleFiles(files) {
    if (!files || files.length === 0) return;
    
    // Filter for image files only
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
        alert('選択されたファイルに画像が含まれていません。');
        return;
    }
    
    // Add new files to the selectedFiles array
    imageFiles.forEach(file => {
        // Check if file is already selected (by name and size)
        const isDuplicate = selectedFiles.some(
            selectedFile => selectedFile.name === file.name && selectedFile.size === file.size
        );
        
        if (!isDuplicate) {
            selectedFiles.push(file);
        }
    });
    
    // Update UI
    updateImagePreview();
    updateButtonStates();
}

/**
 * Update the image preview area with selected files
 */
function updateImagePreview() {
    // Clear the preview
    imagePreview.innerHTML = '';
    
    // Add preview for each selected file
    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = file.name;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '×';
            removeBtn.addEventListener('click', () => removeFile(index));
            
            previewItem.appendChild(img);
            previewItem.appendChild(removeBtn);
            imagePreview.appendChild(previewItem);
        };
        
        reader.readAsDataURL(file);
    });
}

/**
 * Remove a file from the selected files
 * @param {number} index - The index of the file to remove
 */
function removeFile(index) {
    selectedFiles.splice(index, 1);
    updateImagePreview();
    updateButtonStates();
}

/**
 * Update the state of the buttons based on selected files
 */
function updateButtonStates() {
    if (selectedFiles.length > 0) {
        uploadBtn.disabled = false;
        clearBtn.disabled = false;
    } else {
        uploadBtn.disabled = true;
        clearBtn.disabled = true;
    }
}

/**
 * Handle the upload process
 */
function handleUpload() {
    if (selectedFiles.length === 0) return;
    
    // Disable buttons during upload
    uploadBtn.disabled = true;
    clearBtn.disabled = true;
    
    // Clear previous progress
    progressContainer.innerHTML = '';
    
    // Create progress items for each file
    selectedFiles.forEach((file, index) => {
        const progressItem = createProgressItem(file, index);
        progressContainer.appendChild(progressItem);
        
        // Start upload for this file
        uploadFile(file, index);
    });
}

/**
 * Create a progress item for a file
 * @param {File} file - The file to create a progress item for
 * @param {number} index - The index of the file
 * @returns {HTMLElement} The progress item element
 */
function createProgressItem(file, index) {
    const progressItem = document.createElement('div');
    progressItem.className = 'progress-item';
    progressItem.id = `progress-item-${index}`;
    
    // Create thumbnail
    const reader = new FileReader();
    reader.onload = function(e) {
        const thumbnail = progressItem.querySelector('.thumbnail');
        if (thumbnail) {
            thumbnail.src = e.target.result;
        }
    };
    reader.readAsDataURL(file);
    
    // Create progress item structure
    progressItem.innerHTML = `
        <img class="thumbnail" src="" alt="${file.name}">
        <div class="progress-info">
            <div class="filename">${file.name}</div>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: 0%"></div>
            </div>
            <div class="progress-status">準備中...</div>
        </div>
    `;
    
    return progressItem;
}

/**
 * Upload a file to pCloud
 * @param {File} file - The file to upload
 * @param {number} index - The index of the file
 */
function uploadFile(file, index) {
    // Get the progress elements
    const progressItem = document.getElementById(`progress-item-${index}`);
    const progressBar = progressItem.querySelector('.progress-bar');
    const progressStatus = progressItem.querySelector('.progress-status');
    
    // Set initial status
    progressStatus.textContent = 'アップロード中...';
    
    // Mock upload with progress simulation
    // In a real implementation, this would use the pCloud API
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Simulate a small delay for completion
            setTimeout(() => {
                progressBar.style.width = `${progress}%`;
                progressStatus.textContent = 'アップロード完了';
                progressStatus.className = 'progress-status success';
                
                // Check if all uploads are complete
                checkAllUploadsComplete();
            }, 500);
        }
        progressBar.style.width = `${progress}%`;
    }, 300);
    
    // In a real implementation, you would use the pCloud API like this:
    /*
    pCloudSDK.uploadFile({
        fileInput: file,
        onProgress: function(progress) {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            progressBar.style.width = `${percent}%`;
        },
        onSuccess: function(fileMetadata) {
            progressStatus.textContent = 'アップロード完了';
            progressStatus.className = 'progress-status success';
            checkAllUploadsComplete();
        },
        onError: function(error) {
            progressStatus.textContent = `エラー: ${error.message}`;
            progressStatus.className = 'progress-status error';
            checkAllUploadsComplete();
        }
    });
    */
}

/**
 * Check if all uploads are complete
 */
function checkAllUploadsComplete() {
    const allComplete = Array.from(progressContainer.querySelectorAll('.progress-status'))
        .every(status => 
            status.textContent === 'アップロード完了' || 
            status.textContent.startsWith('エラー')
        );
    
    if (allComplete) {
        // Re-enable buttons
        uploadBtn.disabled = false;
        clearBtn.disabled = false;
    }
}

/**
 * Handle clearing all selected files
 */
function handleClear() {
    selectedFiles = [];
    updateImagePreview();
    updateButtonStates();
}

/**
 * pCloud API Integration
 * 
 * Note: This is a placeholder for the actual pCloud API integration.
 * You would need to include the pCloud JavaScript SDK and configure it
 * with your API credentials.
 * 
 * Documentation: https://docs.pcloud.com/
 * 
 * Example implementation:
 * 
 * // Initialize pCloud SDK
 * const pCloudSDK = window.pCloudSDK;
 * 
 * // Configure with your client ID
 * pCloudSDK.init({
 *     clientId: 'YOUR_CLIENT_ID',
 *     redirectUri: 'YOUR_REDIRECT_URI'
 * });
 * 
 * // Check if user is authenticated
 * function checkAuth() {
 *     if (!pCloudSDK.isAuthorized()) {
 *         // Redirect to pCloud authorization page
 *         pCloudSDK.authorize();
 *     }
 * }
 * 
 * // Upload file to pCloud
 * function uploadToPCloud(file, onProgress, onSuccess, onError) {
 *     pCloudSDK.uploadFile({
 *         fileInput: file,
 *         folderId: 0, // Root folder
 *         onProgress: onProgress,
 *         onSuccess: onSuccess,
 *         onError: onError
 *     });
 * }
 */
