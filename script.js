document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('roleForm');
    const exportBtn = document.getElementById('exportBtn');
    
    // 导出功能
    exportBtn.addEventListener('click', function() {
        const savedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
        
        if (savedRoles.length === 0) {
            alert('没有可导出的数据！');
            return;
        }
        
        // 创建导出数据
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            roles: savedRoles
        };
        
        // 转换为 JSON 字符串
        const jsonString = JSON.stringify(exportData, null, 2);
        
        // 创建 Blob 对象
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `role-data-${new Date().toISOString().split('T')[0]}.json`;
        
        // 触发下载
        document.body.appendChild(a);
        a.click();
        
        // 清理
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // 表单提交处理
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const formData = new FormData(form);
        const roleData = {};
        
        for (let [key, value] of formData.entries()) {
            roleData[key] = value;
        }
        
        // 验证必填字段
        const requiredFields = ['name', 'gender', 'appearance', 'personality', 'background'];
        const missingFields = requiredFields.filter(field => !roleData[field]);
        
        if (missingFields.length > 0) {
            alert('请填写所有必填字段！');
            return;
        }
        
        // 保存到本地存储
        saveRoleData(roleData);
        
        // 显示成功消息
        alert('角色创建成功！');
        form.reset();
    });
    
    // 保存数据到本地存储
    function saveRoleData(data) {
        // 获取现有数据
        let savedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
        
        // 添加新角色
        savedRoles.push({
            ...data,
            id: Date.now(), // 使用时间戳作为唯一ID
            createdAt: new Date().toISOString()
        });
        
        // 保存回本地存储
        localStorage.setItem('roles', JSON.stringify(savedRoles));
    }
    
    // 添加输入验证
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });
    });
    
    // 输入验证函数
    function validateInput(input) {
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.classList.add('border-red-500');
        } else {
            input.classList.remove('border-red-500');
        }
    }
    
    // 添加字数限制提示
    const textareas = form.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        const maxLength = textarea.getAttribute('maxlength') || 500;
        const wrapper = document.createElement('div');
        wrapper.className = 'relative';
        textarea.parentNode.insertBefore(wrapper, textarea);
        wrapper.appendChild(textarea);
        
        const counter = document.createElement('div');
        counter.className = 'text-xs text-gray-500 mt-1 text-right';
        wrapper.appendChild(counter);
        
        textarea.addEventListener('input', function() {
            const remaining = maxLength - this.value.length;
            counter.textContent = `还可以输入 ${remaining} 个字符`;
        });
    });
}); 