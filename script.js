document.addEventListener('DOMContentLoaded', () => {
    // 初始化标签页
    initTabs();
    // 初始化字数统计
    initCharCounters();
    // 初始化表单验证
    initFormValidation();
    // 初始化头像预览
    initAvatarPreview();
    // 初始化表单提交
    initFormSubmit();
});

// 标签页切换
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有活动状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // 设置当前标签页为活动状态
            button.classList.add('active');
            const targetId = button.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// 字数统计
function initCharCounters() {
    const textareas = document.querySelectorAll('.form-textarea');
    
    textareas.forEach(textarea => {
        const counter = textarea.parentElement.querySelector('.char-count');
        if (!counter) return;

        const updateCount = () => {
            const maxLength = textarea.getAttribute('maxlength');
            const currentLength = textarea.value.length;
            counter.textContent = `${currentLength}/${maxLength}`;
            
            // 当接近字数限制时改变颜色
            if (currentLength > maxLength * 0.9) {
                counter.style.color = 'var(--pink-600)';
            } else {
                counter.style.color = 'var(--pink-400)';
            }
        };

        textarea.addEventListener('input', updateCount);
        updateCount(); // 初始化计数
    });
}

// 表单验证
function initFormValidation() {
    const form = document.querySelector('form');
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        field.addEventListener('input', () => {
            validateField(field);
        });

        field.addEventListener('blur', () => {
            validateField(field);
        });
    });
}

function validateField(field) {
    const errorMessage = field.parentElement.querySelector('.error-message');
    
    if (!field.value.trim()) {
        showError(field, '此字段为必填项');
    } else if (field.type === 'email' && !isValidEmail(field.value)) {
        showError(field, '请输入有效的邮箱地址');
    } else {
        clearError(field);
    }
}

function showError(field, message) {
    const errorMessage = field.parentElement.querySelector('.error-message') || 
        document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    errorMessage.style.color = 'var(--pink-600)';
    errorMessage.style.fontSize = '0.75rem';
    errorMessage.style.marginTop = '0.25rem';
    
    if (!field.parentElement.querySelector('.error-message')) {
        field.parentElement.appendChild(errorMessage);
    }
    
    field.style.borderColor = 'var(--pink-600)';
}

function clearError(field) {
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    field.style.borderColor = 'var(--pink-200)';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 头像预览
function initAvatarPreview() {
    const avatarInput = document.querySelector('input[type="file"]');
    const preview = document.querySelector('.avatar-preview img');

    if (avatarInput && preview) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// 表单提交
function initFormSubmit() {
    const form = document.querySelector('form');
    const saveButton = document.querySelector('.btn-primary');
    const exportButton = document.querySelector('.btn-secondary');
    const resetButton = document.querySelector('.btn-outline');

    if (saveButton) {
        saveButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (validateForm()) {
                saveFormData();
            }
        });
    }

    if (exportButton) {
        exportButton.addEventListener('click', (e) => {
            e.preventDefault();
            exportFormData();
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', (e) => {
            e.preventDefault();
            resetForm();
        });
    }
}

function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showError(field, '此字段为必填项');
            isValid = false;
        }
    });

    return isValid;
}

function saveFormData() {
    const formData = new FormData(document.querySelector('form'));
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    // 保存到本地存储
    localStorage.setItem('characterData', JSON.stringify(data));
    
    // 显示成功消息
    showMessage('保存成功！', 'success');
}

function exportFormData() {
    const data = localStorage.getItem('characterData');
    if (!data) {
        showMessage('没有可导出的数据', 'error');
        return;
    }

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'character-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function resetForm() {
    if (confirm('确定要重置表单吗？所有数据将被清除。')) {
        document.querySelector('form').reset();
        localStorage.removeItem('characterData');
        document.querySelectorAll('.char-count').forEach(counter => {
            counter.textContent = '0/1000';
        });
        document.querySelector('.avatar-preview img').src = 'default-avatar.png';
        showMessage('表单已重置', 'success');
    }
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '1rem';
    messageDiv.style.right = '1rem';
    messageDiv.style.padding = '0.75rem 1rem';
    messageDiv.style.borderRadius = '0.5rem';
    messageDiv.style.color = 'white';
    messageDiv.style.backgroundColor = type === 'success' ? 'var(--pink-400)' : 'var(--pink-600)';
    messageDiv.style.zIndex = '1000';
    messageDiv.style.animation = 'fadeIn 0.3s ease-out';

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 3000);
}

// 添加淡出动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style); 