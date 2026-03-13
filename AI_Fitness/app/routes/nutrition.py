from datetime import datetime
import logging as python_logging
from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
from app.services.db_services import user_info, user_nutrition_guidance, user_nutrition_guidance_detail
from app.services import db_service
from app.services.basefunc import get_current_data
from functools import wraps
from app.utils.login_required import login_required
import json
import os
import random
import time
# from app.utils import login_required

# 创建蓝图
nutrition_bp = Blueprint('nutrition', __name__, url_prefix='/nutrition')

# 配置日志
python_logging.basicConfig(
    level=python_logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = python_logging.getLogger(__name__)

def login_required(f):
    """登录验证装饰器"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('user_id'):
            flash('请先登录', 'error')
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function


@nutrition_bp.route('/', methods=['GET'])
@login_required
def user_nutrition():
    """营养指导主页"""
    user_id = session.get('user_id')

    # 获取用户信息
    user_result = user_info.get_user_by_id(user_id)
    if not user_result.success:
        flash('获取用户信息失败', 'error')
        return redirect(url_for('auth.login'))

    user = user_result.data

    # 根据用户信息计算营养建议
    nutrition_data = calculate_nutrition(user)

    # 获取用户的营养指导记录
    guidance_result = user_nutrition_guidance.get_active_guidance_for_user(user_id)
    guidance = guidance_result.data[0] if guidance_result.success and guidance_result.data else None

    # 获取详细数据
    nutrition_details = []
    food_suggestions = []
    if guidance:
        nutrition_details = user_nutrition_guidance_detail.get_guidance_detail_by_guidance_id(guidance['id'], 'T01')
        food_suggestions = user_nutrition_guidance_detail.get_guidance_detail_by_guidance_id(guidance['id'], 'T02')

    return render_template('nutrition/user_nutrition.html',
                           user=user,
                           nutrition=nutrition_data,
                           guidance=guidance,
                           nutrition_details=nutrition_details,
                           food_suggestions=food_suggestions,
                           active_page='nutrition')


@nutrition_bp.route('/detail', methods=['GET'])
@login_required
def nutrition_detail():
    """详细营养数据页"""
    user_id = session.get('user_id')

    # 获取用户信息
    user_result = user_info.get_user_by_id(user_id)
    if not user_result.success:
        flash('获取用户信息失败', 'error')
        return redirect(url_for('auth.login'))

    user = user_result.data

    # 获取历史营养数据（模拟数据）
    history_data = get_nutrition_guidance(user_id)

    # 计算当前营养建议
    nutrition_data = calculate_nutrition(user)

    return render_template('nutrition/nutrition_detail.html',
                           user=user,
                           nutrition=nutrition_data,
                           history=history_data,
                           active_page='nutrition')


@nutrition_bp.route('/suggestion', methods=['GET'])
@login_required
def nutrition_suggestion():
    """每日营养建议页"""
    user_id = session.get('user_id')

    # 获取用户信息
    user_result = user_info.get_user_by_id(user_id)
    if not user_result.success:
        flash('获取用户信息失败', 'error')
        return redirect(url_for('auth.login'))

    user = user_result.data

    # 计算营养建议
    nutrition_data = calculate_nutrition(user)

    # 获取食物建议
    food_suggestions = get_food_suggestions(user)

    return render_template('nutrition/nutrition_suggestion.html',
                           user=user,
                           nutrition=nutrition_data,
                           food_suggestions=food_suggestions,
                           active_page='nutrition')


def calculate_nutrition(user):
    """
    根据用户信息计算每日营养需求
    基于Harris-Benedict公式计算基础代谢率
    """
    try:
        gender = user.get('gender', 'male')
        age = int(user.get('age', 30))
        height = float(user.get('height', 170))
        weight = float(user.get('weight', 70))

        # 计算基础代谢率 (BMR)
        if gender == 'male' or gender == '男':
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
        else:
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)

        # 活动系数 (假设中等活动水平)
        activity_factor = 1.55

        # 每日总能量消耗 (TDEE)
        tdee = bmr * activity_factor

        # 根据康复训练需求调整
        # 蛋白质: 1.5-2g/kg体重 (康复训练需要更多蛋白质)
        protein = round(weight * 1.8, 1)
        protein_calories = protein * 4

        # 脂肪: 约25%的总热量
        fat_calories = tdee * 0.25
        fat = round(fat_calories / 9, 1)

        # 碳水化合物: 剩余热量
        carb_calories = tdee - protein_calories - fat_calories
        carbs = round(carb_calories / 4, 1)

        return {
            'protein': protein,
            'carbs': carbs,
            'fat': fat,
            'calories': round(tdee, 0),
            'protein_percent': round(protein_calories / tdee * 100, 1),
            'carbs_percent': round(carb_calories / tdee * 100, 1),
            'fat_percent': round(fat_calories / tdee * 100, 1)
        }
    except Exception as e:
        logger.error(f"计算营养数据出错: {str(e)}")
        # 返回默认值
        return {
            'protein': 100,
            'carbs': 250,
            'fat': 60,
            'calories': 2000,
            'protein_percent': 20,
            'carbs_percent': 50,
            'fat_percent': 30
        }


def get_nutrition_history(user_id, days=7):
    """获取用户营养历史数据（模拟）"""
    import random
    from datetime import timedelta

    history = []
    today = datetime.now()

    for i in range(days):
        date = today - timedelta(days=i)
        history.append({
            'date': date.strftime('%Y-%m-%d'),
            'protein': round(random.uniform(80, 120), 1),
            'carbs': round(random.uniform(200, 300), 1),
            'fat': round(random.uniform(50, 80), 1),
            'calories': round(random.uniform(1800, 2200), 0)
        })

    return history

def get_nutrition_guidance(user_id):
    guidanceList = user_nutrition_guidance.get_guidances_for_user(user_id)
    result_list = []

    if guidanceList.success and guidanceList.data:
        for guidance in guidanceList.data:
            guidance_item = {
                'guidance': guidance,
                'nutrition_details': user_nutrition_guidance_detail.get_guidance_detail_by_guidance_id(guidance['id'],
                                                                                                       'T01'),
                'food_suggestions': user_nutrition_guidance_detail.get_guidance_detail_by_guidance_id(guidance['id'],
                                                                                                      'T02')
            }
            result_list.append(guidance_item)

    return result_list

def get_food_suggestions(user):

    guidance = user_nutrition_guidance.get_active_guidance_for_user(user['id'])
    dtls = user_nutrition_guidance_detail.get_guidance_detail_by_guidance_id(guidance.data[0]['id'], 'T02')
    dtlInfo = {}
    for dtl in dtls:
        arrval = dtl['item_value'].split('+')
        tempdtlArr = []
        for i in range(len(arrval)):
            tempValue = {}
            if arrval[i]:
                arrval[i] = arrval[i].strip()
                if '(' in arrval[i]:
                    tempValue['name'] = arrval[i].split('(')[0]
                if '（' in arrval[i]:
                    tempValue['name'] = arrval[i].split('(')[0]
                if ',' in arrval[i]:
                    tempValue['amount'] = arrval[i].split('(')[1].split(',')[0]
                if '，' in arrval[i]:
                    tempValue['amount'] = arrval[i].split('(')[1].split('，')[0]
                if ',' in arrval[i]:
                    tempValue['nutrition'] = arrval[i].split('(')[1].split(',')[1][:-1]
                if '，' in arrval[i]:
                    tempValue['nutrition'] = arrval[i].split('(')[1].split('，')[1][:-1]
            tempdtlArr.append(tempValue)
        if '早餐' in dtl['item_name']:
            dtlInfo['breakfast'] = tempdtlArr
        if '午餐' in dtl['item_name']:
            dtlInfo['lunch'] = tempdtlArr
        if '晚餐' in dtl['item_name']:
            dtlInfo['dinner'] = tempdtlArr
        if '加餐' in dtl['item_name']:
            dtlInfo['snacks'] = tempdtlArr
        if '睡前' in dtl['item_name']:
            dtlInfo['sleep'] = tempdtlArr


    #
    # """根据用户康复课程获取食物建议"""
    # theme_id = user.get('theme_id')
    #
    # # 通用建议
    # suggestions = {
    #     'breakfast': [
    #         {'name': '全麦面包', 'amount': '2片', 'nutrition': '碳水化合物'},
    #         {'name': '鸡蛋', 'amount': '2个', 'nutrition': '蛋白质'},
    #         {'name': '牛奶', 'amount': '250ml', 'nutrition': '蛋白质、钙'},
    #         {'name': '水果', 'amount': '1份', 'nutrition': '维生素'}
    #     ],
    #     'lunch': [
    #         {'name': '糙米饭', 'amount': '1碗', 'nutrition': '碳水化合物'},
    #         {'name': '鸡胸肉', 'amount': '150g', 'nutrition': '蛋白质'},
    #         {'name': '蔬菜沙拉', 'amount': '1份', 'nutrition': '纤维素、维生素'},
    #         {'name': '豆腐', 'amount': '100g', 'nutrition': '植物蛋白'}
    #     ],
    #     'dinner': [
    #         {'name': '杂粮粥', 'amount': '1碗', 'nutrition': '碳水化合物'},
    #         {'name': '清蒸鱼', 'amount': '150g', 'nutrition': '优质蛋白'},
    #         {'name': '时令蔬菜', 'amount': '2份', 'nutrition': '纤维素'},
    #         {'name': '坚果', 'amount': '30g', 'nutrition': '健康脂肪'}
    #     ],
    #     'snacks': [
    #         {'name': '酸奶', 'amount': '200ml', 'nutrition': '蛋白质、益生菌'},
    #         {'name': '香蕉', 'amount': '1根', 'nutrition': '碳水、钾'},
    #         {'name': '蛋白粉', 'amount': '1勺', 'nutrition': '蛋白质补充'}
    #     ]
    # }

    return dtlInfo


@nutrition_bp.route('/api/nutrition-data', methods=['GET'])
@login_required
def get_nutrition_api():
    """获取营养数据API"""
    user_id = session.get('user_id')

    user_result = user_info.get_user_by_id(user_id)
    if not user_result.success:
        return jsonify({'success': False, 'error': '获取用户信息失败'})

    nutrition_data = calculate_nutrition(user_result.data)
    return jsonify({'success': True, 'data': nutrition_data})

@nutrition_bp.route('/user_nutrition', methods=['GET', 'POST'])
def user_nutrition1():
    # 获取用户ID
    user_id = session.get('user_id')
    if not user_id:
        flash('请先登录', 'error')
        return redirect(url_for('auth.login'))

    # 获取用户信息
    user_result = user_info.get_user_by_id(user_id)
    if not user_result.success:
        flash('获取用户信息失败', 'error')
        return redirect(url_for('auth.login'))

    user = user_result.data

    parent = user_nutrition_guidance.get_active_guidance_for_user(user_id)
    parent_data = {}
    details_nutrition = []
    details_food = []

    if (parent.data):
        parent_data = parent.data[0]
        details_nutrition = user_nutrition_guidance_detail.get_guidance_detail_by_guidance_id(parent_data['id'], 'T01')
        details_food = user_nutrition_guidance_detail.get_guidance_detail_by_guidance_id(parent_data['id'], 'T02')

    if request.method == 'GET':
        # 从session获取用户ID
        return render_template('nutrition/user_nutrition.html', user = user, guidance=parent_data, nutrition=details_nutrition, food = details_food)

