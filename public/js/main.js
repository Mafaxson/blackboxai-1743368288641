// Public Waste Reporting Interface
function renderPublicWasteForm() {
    return `
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-4">Report Public Waste</h3>
            <form id="public-waste-form">
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Address</label>
                    <input type="text" id="waste-address" 
                           class="w-full px-3 py-2 border rounded-lg" required>
                </div>
                
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Waste Type</label>
                    <select id="waste-type" class="w-full px-3 py-2 border rounded-lg">
                        <option value="">Detecting from image...</option>
                        <option value="plastic">Plastic</option>
                        <option value="organic">Organic</option>
                        <option value="metal">Metal</option>
                        <option value="paper">Paper</option>
                        <option value="glass">Glass</option>
                        <option value="hazardous">Hazardous</option>
                    </select>
                </div>
                
                <div class="mb-4">
                    <label class="block text-gray-700 mb-2">Upload Image</label>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <i class="fas fa-camera text-4xl text-gray-400 mb-2"></i>
                        <p class="text-gray-500 mb-2">Take or upload photo of waste</p>
                        <input type="file" id="waste-image" accept="image/*" 
                               class="hidden" capture="environment">
                        <button type="button" onclick="document.getElementById('waste-image').click()"
                                class="bg-green-500 text-white px-4 py-2 rounded-lg">
                            Select Image
                        </button>
                    </div>
                </div>
                
                <div class="mb-4">
                    <p class="text-gray-600">Date/Time: <span id="detection-time">${new Date().toLocaleString()}</span></p>
                </div>
                
                <button type="submit" 
                        class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                    Submit Report
                </button>
            </form>
        </div>
    `;
}

// Handle image upload for waste detection
document.addEventListener('DOMContentLoaded', function() {
    const wasteImageInput = document.getElementById('waste-image');
    if (wasteImageInput) {
        wasteImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Simulate waste type detection (in a real app, this would call an AI API)
                setTimeout(() => {
                    const wasteTypes = ['plastic', 'organic', 'metal', 'paper', 'glass', 'hazardous'];
                    const randomType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
                    document.getElementById('waste-type').value = randomType;
                }, 1500);
            }
        });
    }

    // Handle form submission
    const publicWasteForm = document.getElementById('public-waste-form');
    if (publicWasteForm) {
        publicWasteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const address = document.getElementById('waste-address').value;
            const wasteType = document.getElementById('waste-type').value;
            
            // Get current location (simplified - in real app use Geolocation API)
            const location = {
                address: address,
                coordinates: [0, 0] // Would be populated with real geocoding
            };
            
            // Submit report data
            submitWasteReport({
                type: wasteType,
                quantity: 1, // Default quantity for public reports
                location: location,
                source: 'public'
            });
        });
    }
});

// Function to submit waste report
function submitWasteReport(reportData) {
    fetch('/api/waste', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Report submitted successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting report');
    });
}