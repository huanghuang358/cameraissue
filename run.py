from waitress import serve
from app import app

if __name__ == '__main__':
    serve(app, 
        host='0.0.0.0', 
        port=5000,
        threads=4,
        channel_timeout=300,
        connection_limit=1000
    ) 