function toggleStructure() {
    const content = document.getElementById('fileStructure');
    const icon = document.getElementById('collapse-icon');
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.classList.remove('bi-chevron-right');
        icon.classList.add('bi-chevron-down');
    } else {
        content.style.display = 'none';
        icon.classList.remove('bi-chevron-down');
        icon.classList.add('bi-chevron-right');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('file').addEventListener('change', function(e) {
        const fileName = e.target.files[0]?.name || '未选择文件';
        document.getElementById('file-name').textContent = fileName;
    });

    document.getElementById('uploadForm').onsubmit = function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const loading = document.getElementById('loading');
        const progressBar = document.getElementById('uploadProgress');
        const progressText = document.getElementById('progressText');
        
        // 收起压缩包结构要求
        const content = document.getElementById('fileStructure');
        const icon = document.getElementById('collapse-icon');
        content.style.display = 'none';
        icon.classList.remove('bi-chevron-down');
        icon.classList.add('bi-chevron-right');
        
        // 显示加载区域和进度条
        loading.style.display = 'block';
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                const percentage = percentComplete.toFixed(1);
                progressBar.style.width = percentage + '%';
                progressText.textContent = percentage + '%';
            }
        });

        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                document.open();
                document.write(xhr.responseText);
                document.close();
            } else {
                try {
                    const response = JSON.parse(xhr.responseText);
                    alert(response.error || '上传失败');
                } catch (e) {
                    alert('处理请求时发生错误');
                }
                loading.style.display = 'none';
            }
        });

        xhr.addEventListener('error', function() {
            alert('上传失败，请检查网络连接');
            loading.style.display = 'none';
        });

        xhr.open('POST', '/upload', true);
        xhr.send(formData);
    };
}); 