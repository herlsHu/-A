document.addEventListener('DOMContentLoaded', () => {
    const characterForm = document.getElementById('characterForm');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const charCountElements = document.querySelectorAll('.char-count');
    const avatarInput = document.getElementById('avatar');
    const avatarPreview = document.getElementById('avatar-preview').querySelector('img');
    const exportBtn = document.getElementById('exportBtn');
    const addExampleBtn = document.getElementById('add-example-btn');
    const examplesContainer = document.getElementById('examples-container');

    // New modal elements
    const exportModal = document.getElementById('exportModal');
    const exportedDataTextarea = document.getElementById('exportedDataTextarea');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // Function to collect all form data
    const collectFormData = () => {
        const characterData = {};

        // Basic Settings
        characterData.avatar = avatarPreview.src || ""; // Base64 or empty string if no image
        characterData.language = document.getElementById('language').value || "";
        characterData.voice = document.getElementById('voice').value || ""; // Filename or empty string

        characterData.name = document.getElementById('name').value || "";
        // Handle radio buttons: if nothing is checked, value will be empty string
        characterData.gender = document.querySelector('input[name="gender"]:checked')?.value || "";
        characterData.age = document.getElementById('age').value || "";
        characterData.dob = document.getElementById('dob').value || "";
        characterData.mbti = document.getElementById('mbti').value || "";
        characterData.stance = document.getElementById('stance').value || "";
        characterData.personality = document.getElementById('personality').value || "";
        characterData.appearance = document.getElementById('appearance').value || "";

        // Supplemental Settings
        characterData.world = document.getElementById('world').value || "";
        characterData.identity = document.getElementById('identity').value || "";
        characterData.supplemental = document.getElementById('supplemental').value || "";
        characterData.userRelation = document.getElementById('userRelation').value || "";

        // Language Habits
        characterData.addressUser = document.getElementById('addressUser').value || "";
        characterData.greeting = document.getElementById('greeting').value || "";
        characterData.catchphrase = document.getElementById('catchphrase').value || "";

        // Collect all example dialogues, even if empty
        characterData.examples = [];
        document.querySelectorAll('#examples-container textarea').forEach(textarea => {
            characterData.examples.push(textarea.value || "");
        });

        return characterData;
    };

    // 1. Tab Switching Logic
    const initTabs = () => {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTabId = button.dataset.tab;

                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                tabPanes.forEach(pane => {
                    if (pane.id === targetTabId) {
                        pane.classList.add('active');
                    } else {
                        pane.classList.remove('active');
                    }
                });
            });
        });
    };

    // 2. Character Counter for Textareas
    const setupCharCounters = () => {
        charCountElements.forEach(span => {
            const textarea = span.previousElementSibling;
            const maxLength = parseInt(textarea.getAttribute('maxlength'));

            const updateCount = () => {
                const currentLength = textarea.value.length;
                span.textContent = `${currentLength}/${maxLength}`;
                if (currentLength > maxLength) {
                    span.style.color = 'var(--error-color)';
                } else {
                    span.style.color = 'var(--text-light-color)';
                }
            };

            textarea.addEventListener('input', updateCount);
            // Initial update in case of pre-filled content
            updateCount();
        });
    };

    // 3. Avatar Preview
    const setupAvatarPreview = () => {
        avatarInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    avatarPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    };

    // 4. Add Example Textarea for Language Habits
    let exampleCount = 1;
    addExampleBtn.addEventListener('click', () => {
        exampleCount++;
        const newExampleHtml = `
            <div class="example-item mt-2">
                <textarea id="example${exampleCount}" class="form-textarea" maxlength="500"
                    placeholder="示例对话${exampleCount}：角色：&quot;你好，我是[角色名]。&quot;用户：&quot;你好！&quot;"></textarea>
                <span class="char-count">0/500</span>
            </div>
        `;
        examplesContainer.insertAdjacentHTML('beforeend', newExampleHtml);
        // Re-setup character counters for the new textarea
        setupCharCounters();
    });

    // 5. Form Validation and Data Saving
    characterForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        const characterData = collectFormData(); // Use the new function to collect data

        // Basic Validation
        let isValid = true;
        // Note: I'm keeping the original required fields for now. If you want to change them,
        // please provide the updated list.
        const requiredFields = ['name', 'personality', 'appearance']; // Updated based on latest HTML requirements

        requiredFields.forEach(id => {
            const input = document.getElementById(id);
            if (input && !input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'var(--error)'; // Use CSS variable
                input.placeholder = '此项为必填！'; // Provide feedback
            } else if (input) {
                input.style.borderColor = ''; // Reset border, remove inline style
            }
        });

        // Special validation for gender if needed
        const genderChecked = document.querySelector('input[name="gender"]:checked');
        if (!genderChecked) {
            isValid = false;
            // You might want to add visual feedback here for radio buttons
            console.log('性别为必填项！'); // Log to console for now
        }

        if (isValid) {
            console.log('Form Data:', characterData);
            localStorage.setItem('characterData', JSON.stringify(characterData));
            alert('角色数据已保存到本地存储！');
        } else {
            alert('请填写所有必填项！');
        }
    });

    // 6. Export Data to JSON
    exportBtn.addEventListener('click', () => {
        const currentCharacterData = collectFormData(); // Collect data directly from form
        const formattedData = JSON.stringify(currentCharacterData, null, 2); // Pretty print JSON
        
        exportedDataTextarea.value = formattedData; // Set textarea value
        exportModal.classList.add('active'); // Show the modal
    });

    // Close Modal Logic
    closeModalBtn.addEventListener('click', () => {
        exportModal.classList.remove('active');
    });

    // Optionally close modal by clicking outside content
    exportModal.addEventListener('click', (event) => {
        if (event.target === exportModal) {
            exportModal.classList.remove('active');
        }
    });

    // 7. Form Reset
    characterForm.addEventListener('reset', () => {
        // Reset avatar preview to empty
        avatarPreview.src = '';
        // Clear local storage on reset (optional, but good for a full reset)
        localStorage.removeItem('characterData');
        // Reset character counters
        setupCharCounters();
        // Remove dynamically added examples
        while (examplesContainer.children.length > 1) {
            examplesContainer.removeChild(examplesContainer.lastChild);
        }
        // Re-initialize char counters for the remaining example
        setupCharCounters();
        exampleCount = 1;
    });

    // Initialize all functionalities
    initTabs();
    setupCharCounters();
    setupAvatarPreview();
}); 