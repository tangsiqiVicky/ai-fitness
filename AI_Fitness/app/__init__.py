from flask import Flask
import logging
import os

# 配置日志系统
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),  # 输出到控制台
        # 如果需要，可以添加文件处理器
        # logging.FileHandler('app.log')
    ]
)
logger = logging.getLogger(__name__)

# 创建Flask应用
app = Flask(__name__)

def create_app():
    """创建并配置Flask应用"""
    # 导入配置
    from app.config import SECRET_KEY
    app.secret_key = SECRET_KEY
    
    logger.info("初始化应用程序...")
    
    # 确保配置目录存在
    os.makedirs('app/config/fitness', exist_ok=True)
    
    # 注册蓝图
    from app.routes.auth import auth_bp
    from app.routes.ai_assistant import ai_assistant_bp
    from app.routes.community import community_bp
    from app.routes.fitness import fitness_bp
    from app.routes.clock import clock_bp
    from app.routes.nutrition import nutrition_bp
    from app.routes.user_plan import user_plan_bp
    from app.routes.course import course_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(ai_assistant_bp)
    app.register_blueprint(community_bp)
    app.register_blueprint(fitness_bp)
    app.register_blueprint(clock_bp)
    app.register_blueprint(user_plan_bp)
    app.register_blueprint(course_bp)
    app.register_blueprint(nutrition_bp)
    
    logger.info("应用程序初始化完成")
    return app