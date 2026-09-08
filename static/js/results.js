function toggleDetails(camera) {
    const detailsElement = document.getElementById(`${camera}-details`);
    detailsElement.style.display = detailsElement.style.display === 'none' ? 'block' : 'none';
}

// 添加新的函数处理表单提交
function handleReviewSubmit(form) {
    const formData = new FormData(form);
    
    fetch('/review', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '提交失败');
            });
        }
        return response.text();
    })
    .then(html => {
        // 更新页面内容
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // 更新统计数据
        const newStatisticsElement = tempDiv.querySelector('#date-statistics-data');
        if (newStatisticsElement) {
            document.getElementById('date-statistics-data').textContent = newStatisticsElement.textContent;
        }
        
        // 更新表格内容
        const newTable = tempDiv.querySelector('.results-table');
        if (newTable) {
            document.querySelector('.results-table').outerHTML = newTable.outerHTML;
        }
        
        // 更新日期选择器
        const newDateSelector = tempDiv.querySelector('#dateSelector');
        if (newDateSelector) {
            document.getElementById('dateSelector').outerHTML = newDateSelector.outerHTML;
        }
        
        // 重新初始化图表
        initializeChart();
    })
    .catch(error => {
        console.error('错误:', error);
        alert(error.message || '处理请求时发生错误');
    });
}

function initializeChart() {
    const dateStatisticsElement = document.getElementById('date-statistics-data');
    const dateStatistics = JSON.parse(dateStatisticsElement.textContent);
    
    const chartDom = document.getElementById('gradeChart');
    const myChart = echarts.init(chartDom);
    
    function updateChart(date) {
        const data = dateStatistics[date];
        if (!data) {
            console.error('No data found for date:', date);
            return;
        }
        
        const option = {
            title: {
                text: `${date} 摄像头健康度分布`,
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'horizontal',
                bottom: 10
            },
            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    data: [
                        { 
                            value: data.A, 
                            name: 'A级',
                            itemStyle: { color: '#06C486' }
                        },
                        { 
                            value: data.B, 
                            name: 'B级',
                            itemStyle: { color: '#5C5FED' }
                        },
                        { 
                            value: data.C, 
                            name: 'C级',
                            itemStyle: { color: '#D9E022' }
                        },
                        { 
                            value: data.D, 
                            name: 'D级',
                            itemStyle: { color: '#D72029' }
                        }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    }

    // 监听日期选择器变化
    const dateSelector = document.getElementById('dateSelector');
    if (dateSelector) {
        dateSelector.addEventListener('change', function(e) {
            updateChart(e.target.value);
        });

        // 初始化图表
        const firstDate = dateSelector.value;
        if (firstDate) {
            updateChart(firstDate);
        }
    }

    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        if (myChart) {
            myChart.resize();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // 初始化图表
    initializeChart();
    
    // 为所有审核表单添加提交事件处理
    document.addEventListener('submit', function(e) {
        if (e.target.classList.contains('review-form')) {
            e.preventDefault();
            handleReviewSubmit(e.target);
        }
    });
}); 