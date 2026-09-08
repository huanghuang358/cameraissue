# 摄像头健康度分析系统

该项目是一个基于Flask的Web应用程序，用于分析摄像头拍摄的图像并评估其健康度。

## 功能

- 上传压缩文件（ZIP格式），其中包含摄像头拍摄的图像。
- 自动解压缩并处理图像，进行分类和相似度检测。
- 计算每个摄像头在每个日期的健康度等级。
- 提供图像查看和审核功能。
- 支持导出健康度分析结果为Excel文件。

## 环境要求

- Python 3.10 – 3.12（由 `.python-version` 固定，`uv` 会自动使用或下载对应版本）
- [uv](https://docs.astral.sh/uv/) 包管理器
- PyTorch 使用 CUDA 11.8 版本（cu118，通过官方索引安装，见 `pyproject.toml` 中 `[tool.uv.sources]` 配置）。运行推理只需安装 NVIDIA 显卡驱动，无需单独安装 CUDA Toolkit；没有 NVIDIA 显卡时也可在 CPU 上运行（速度较慢）。

## 安装

1. 克隆此仓库到本地：

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. 安装 uv（已安装可跳过）：

   ```powershell
   powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```

3. 安装依赖（自动创建 `.venv` 虚拟环境，按 `uv.lock` 锁定的版本安装）：

   ```bash
   uv sync
   ```

4. 确保在项目根目录下有一个名为`models`的文件夹，并将YOLO模型文件`best.pt`放入其中。

## 使用

1. 启动应用：

   ```bash
   # 开发模式（Flask 内置服务器）
   uv run python app.py

   # 生产模式（waitress）
   uv run python run.py
   ```

2. 在浏览器中访问`http://localhost:5000`。

3. 上传包含图像的ZIP文件，查看和审核分析结果。

4. 导出分析结果为Excel文件。

## 依赖管理

依赖由 uv 管理（`pyproject.toml` 声明 + `uv.lock` 锁定）：

- 新增或升级依赖：修改 `pyproject.toml` 中的 `dependencies` 后执行 `uv lock`，再执行 `uv sync`。
- 切换 PyTorch 的 CUDA 版本：修改 `pyproject.toml` 中 `pytorch-cu118` 索引的 `url`（如换成 `.../whl/cu121`）后重新 `uv lock`。
- 如需生成兼容 pip 的 `requirements.txt`（例如目标环境只能用 pip）：

   ```bash
   uv export --format requirements-txt -o requirements.txt
   ```

## 文件结构

- `app.py`: 主应用程序文件，包含所有路由和功能。
- `run.py`: waitress 生产启动入口。
- `pyproject.toml` / `uv.lock`: uv 依赖声明与锁定文件。
- `templates/`: 存放HTML模板文件。
- `static/`: 存放静态文件（如CSS、JavaScript）。
- `models/`: 存放YOLO模型文件。
- `uploads/`: 用于存储上传的ZIP文件。
- `extracted/`: 用于存储解压后的图像文件。

## 直接依赖

- Flask + waitress（Web 框架与生产服务器）
- ultralytics（YOLO 分类模型推理）
- PyTorch / torchvision（CUDA 11.8）
- pytorch-msssim（图像相似度检测）
- Pillow、openpyxl（图像读取与 Excel 导出）

## 注意事项

- 上传的文件大小限制为500MB。
- 确保在运行应用程序之前，已执行 `uv sync` 安装依赖。
