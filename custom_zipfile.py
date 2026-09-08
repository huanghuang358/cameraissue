import zipfile as original_zipfile
import os
import shutil

class CustomZipFile(original_zipfile.ZipFile):
    def extractall(self, path=None, members=None, pwd=None):
        """
        扩展原始的 extractall 方法，添加文件名编码处理和路径安全校验

        Args:
            path: 解压目标路径
            members: 要解压的文件列表，默认为所有文件
            pwd: 解压密码
        """
        if path is None:
            path = os.getcwd()

        os.makedirs(path, exist_ok=True)

        if members is None:
            members = self.namelist()

        base = os.path.realpath(path)
        for member in members:
            decoded_name = self._decode_filename(member)
            target_path = os.path.realpath(os.path.join(path, decoded_name))

            # 防止 Zip Slip 路径遍历攻击：解压目标必须位于目标目录内
            if not (target_path == base or target_path.startswith(base + os.sep)):
                raise ValueError(f'压缩包内存在不安全的路径: {decoded_name}')

            target_dir = os.path.dirname(target_path)
            os.makedirs(target_dir, exist_ok=True)

            if not decoded_name.endswith('/'):
                with self.open(member, pwd=pwd) as source, \
                     open(target_path, 'wb') as target:
                    shutil.copyfileobj(source, target)

    def _decode_filename(self, member):
        """处理文件名编码"""
        try:
            if isinstance(member, bytes):
                return member.decode('cp437')
            return member.encode('cp437').decode('gbk')
        except UnicodeEncodeError:
            return member
        except UnicodeDecodeError:
            try:
                return member.decode('gbk')
            except UnicodeDecodeError:
                return member.decode('utf-8')

# 为了保持与原始 zipfile 模块的兼容性，保留所有重要的常量和类
ZIP_STORED = original_zipfile.ZIP_STORED
ZIP_DEFLATED = original_zipfile.ZIP_DEFLATED
ZIP_BZIP2 = original_zipfile.ZIP_BZIP2
ZIP_LZMA = original_zipfile.ZIP_LZMA

BadZipFile = original_zipfile.BadZipFile
LargeZipFile = original_zipfile.LargeZipFile

def is_zipfile(filename):
    """判断文件是否为 ZIP 文件"""
    return original_zipfile.is_zipfile(filename)

# 为了方便使用，将 CustomZipFile 作为默认的 ZipFile
ZipFile = CustomZipFile