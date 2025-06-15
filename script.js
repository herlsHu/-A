document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('roleForm');
    const exportBtn = document.getElementById('exportBtn');
    
    // 字数统计功能
    function setupCharCount(textarea, counter) {
        const maxLength = textarea.getAttribute('maxlength') || 500;
        textarea.addEventListener('input', function() {
            const remaining = maxLength - this.value.length;
            counter.textContent = `${this.value.length}/${maxLength}`;
            
            // 添加动画效果
            counter.classList.add('fade-in');
            setTimeout(() => counter.classList.remove('fade-in'), 300);
        });
    }
    
    // 为所有文本域设置字数统计
    document.querySelectorAll('textarea').forEach(textarea => {
        const counter = textarea.parentElement.querySelector('.char-count');
        if (counter) {
            setupCharCount(textarea, counter);
        }
    });
    
    // 表单验证
    function validateInput(input) {
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.classList.add('border-red-500');
            return false;
        } else {
            input.classList.remove('border-red-500');
            return true;
        }
    }
    
    // 实时验证
    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });
    });
    
    // 表单提交处理
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 验证所有必填字段
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!validateInput(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            alert('请填写所有必填字段！');
            return;
        }
        
        // 获取表单数据
        const formData = new FormData(form);
        const roleData = {};
        
        for (let [key, value] of formData.entries()) {
            roleData[key] = value;
        }
        
        // 保存到本地存储
        saveRoleData(roleData);
        
        // 显示成功消息
        alert('角色创建成功！');
        form.reset();
        
        // 重置字数统计
        document.querySelectorAll('.char-count').forEach(counter => {
            counter.textContent = '0/500';
        });
    });
    
    // 保存数据到本地存储
    function saveRoleData(data) {
        let savedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
        savedRoles.push({
            ...data,
            id: Date.now(),
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('roles', JSON.stringify(savedRoles));
    }
    
    // 导出功能
    exportBtn.addEventListener('click', function() {
        const savedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
        
        if (savedRoles.length === 0) {
            alert('没有可导出的数据！');
            return;
        }
        
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            roles: savedRoles
        };
        
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `role-data-${new Date().toISOString().split('T')[0]}.json`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // 重置按钮处理
    form.querySelector('button[type="reset"]').addEventListener('click', function() {
        // 重置字数统计
        document.querySelectorAll('.char-count').forEach(counter => {
            counter.textContent = '0/500';
        });
        
        // 移除验证样式
        form.querySelectorAll('input, textarea, select').forEach(input => {
            input.classList.remove('border-red-500');
        });
    });
}); 