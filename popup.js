// popup.js

// Tab switching logic with Tailwind classes
document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active classes
      document.querySelectorAll('.tab-btn').forEach(t => {
        t.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
        t.classList.add('text-gray-600');
      });
      
      // Add active classes to clicked tab
      tab.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'text-white');
      tab.classList.remove('text-gray-600');
  
      // Show correct content
      const contentId = tab.dataset.tab;
      document.querySelectorAll('.content').forEach(content => {
        content.classList.add('hidden');
      });
      document.getElementById(contentId).classList.remove('hidden');
    });
  });
  
  // Translation functionality
  async function translateText(text, targetLang) {
    try {
      // First check if the API is supported
      if (!('translation' in self && 'createTranslator' in self.translation)) {
        throw new Error('Translation API is not supported in this browser');
      }
  
      // Check if translation is possible
      const canTranslateResult = await translation.canTranslate({
        sourceLanguage: 'en',
        targetLanguage: targetLang
      });
  
      if (canTranslateResult === 'no') {
        throw new Error('Translation not possible for this language pair');
      }
  
      // Create translator
      const translator = await self.translation.createTranslator({
        sourceLanguage: 'en',
        targetLanguage: targetLang
      });
  
      // Perform translation
      const translatedText = await translator.translate(text);
      return translatedText;
    } catch (error) {
      throw error;
    }
  }
  
  // Core processing function
  async function processText(text, mode, options = {}) {
    const result = document.getElementById('result');
    result.classList.remove('hidden');
  
    // Show loading state
    result.innerHTML = `
      <div class="animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="space-y-3 mt-4">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    `;
  
    try {
      let processedContent;
      
      switch (mode) {
        case 'translate':
          processedContent = await translateText(text, options.targetLang);
          result.innerHTML = `
            <div class="space-y-4">
              <div class="p-4 bg-gray-50 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500">Original Text:</h3>
                <p class="mt-1 text-gray-900">${text}</p>
              </div>
              <div class="p-4 bg-blue-50 rounded-lg">
                <h3 class="text-sm font-medium text-blue-500">Translated Text:</h3>
                <p class="mt-1 text-gray-900">${processedContent}</p>
              </div>
            </div>
          `;
          break;
  
        case 'summarize':
          // Placeholder for now
          processedContent = 'Summary placeholder...';
          result.innerHTML = `
            <div class="p-4 bg-gray-50 rounded-lg">
              <h3 class="text-sm font-medium text-gray-500">Summary:</h3>
              <p class="mt-1 text-gray-900">${processedContent}</p>
            </div>
          `;
          break;
  
        // Other cases will be implemented later
      }
  
      // Save to storage
      saveToStorage(mode, {
        original: text,
        processed: processedContent,
        timestamp: new Date().toISOString()
      });
  
    } catch (error) {
      result.innerHTML = `
        <div class="p-4 bg-red-50 rounded-lg">
          <h3 class="text-sm font-medium text-red-800">Error:</h3>
          <p class="mt-1 text-red-700">${error.message}</p>
        </div>
      `;
    }
  }
  
  // Storage functionality
  async function saveToStorage(type, data) {
    try {
      const storage = await chrome.storage.local.get(type);
      const history = storage[type] || [];
      history.unshift(data);
      await chrome.storage.local.set({ [type]: history.slice(0, 10) }); // Keep last 10 items
    } catch (error) {
      console.error('Storage error:', error);
    }
  }
  
  // Event Listeners
  document.querySelector('#translateBtn')?.addEventListener('click', async () => {
    const text = document.querySelector('#translate textarea').value;
    const targetLang = document.querySelector('#translateLang').value;
    
    if (!text || !targetLang) {
      document.getElementById('result').innerHTML = `
        <div class="p-4 bg-yellow-50 rounded-lg">
          <p class="text-yellow-700">Please enter text and select a target language.</p>
        </div>
      `;
      return;
    }
  
    await processText(text, 'translate', { targetLang });
  });