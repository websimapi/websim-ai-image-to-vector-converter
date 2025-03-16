import POTRACE from 'potrace-js';

document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('prompt-input');
    const aspectRatioSelect = document.getElementById('aspect-ratio');
    const generateBtn = document.getElementById('generate-btn');
    const loadingIndicator = document.getElementById('loading');
    const resultContainer = document.getElementById('result-container');
    const generatedImage = document.getElementById('generated-image');
    const svgContainer = document.getElementById('svg-container');
    const downloadBtn = document.getElementById('download-btn');
    const detailSlider = document.getElementById('detail-slider');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    let currentImageUrl = null;
    let currentSvgString = null;

    // Event listeners
    generateBtn.addEventListener('click', generateImage);
    promptInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateImage();
    });
    downloadBtn.addEventListener('click', downloadSvg);
    detailSlider.addEventListener('input', updateVectorDetail);

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    async function generateImage() {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('Please enter a description for the image');
            return;
        }

        // Show loading indicator
        loadingIndicator.style.display = 'flex';
        resultContainer.style.display = 'none';
        downloadBtn.disabled = true;

        try {
            // Get aspect ratio values
            const aspectRatio = aspectRatioSelect.value;
            
            // Generate image using LLM API
            const result = await websim.imageGen({
                prompt: prompt,
                aspect_ratio: aspectRatio
            });
            
            currentImageUrl = result.url;
            
            // Display the generated image
            generatedImage.src = currentImageUrl;
            generatedImage.onload = () => {
                // Convert to vector after image loads
                convertToVector();
                
                // Show the result container
                loadingIndicator.style.display = 'none';
                resultContainer.style.display = 'block';
            };
        } catch (error) {
            loadingIndicator.style.display = 'none';
            alert('Error generating image: ' + error.message);
            console.error(error);
        }
    }

    async function convertToVector() {
        try {
            // Get the detail level from the slider
            const alphaMax = 1 + (5 - detailSlider.value) * 0.2; // 1.0 to 1.8
            const turdSize = Math.max(1, Math.floor(6 - detailSlider.value)); // 5 to 1
            
            // Trace options
            const options = {
                turdsize: turdSize,
                alphamax: alphaMax,
                optcurve: true,
                opttolerance: 0.2
            };

            // Trace the image using POTRACE
            const paths = await POTRACE.traceUrl(currentImageUrl, options);
            
            // Get SVG string
            currentSvgString = POTRACE.getSVG(paths);
            
            // Display the SVG
            svgContainer.innerHTML = currentSvgString;
            
            // Enable the download button
            downloadBtn.disabled = false;
        } catch (error) {
            console.error('Error converting to vector:', error);
            svgContainer.innerHTML = '<p>Error converting image to vector</p>';
        }
    }
    
    function updateVectorDetail() {
        if (currentImageUrl) {
            convertToVector();
        }
    }

    function downloadSvg() {
        if (!currentSvgString) return;
        
        // Create a blob with the SVG content
        const blob = new Blob([currentSvgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'vector-image.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
});