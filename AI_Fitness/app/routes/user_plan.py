#!/usr/bin/env python
# -*- coding: UTF-8 -*-
'''
@Project ：AI_Fitness
@File    ：user_plan.py
@IDE     ：PyCharm
@Author  ：AI智能康训平台
@Date    ：2026/02/03
'''
from datetime import datetime, timedelta
import logging as python_logging
from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
from app.services.db_services import user_plan, user_plan_detail, plan_detail_course, course
from functools import wraps

# 创建蓝图
user_plan_bp = Blueprint('user-plan', __name__, url_prefix='/user-plan')

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


@user_plan_bp.route('/', methods=['GET'])
@login_required
def plan_index():
    """训练计划主页"""
    user_id = session.get('user_id')

    # 获取当前有效的训练计划
    active_plan = get_active_plan(user_id)

    # 获取本周计划详情
    week_details = get_week_plan_details(active_plan) if active_plan else []

    # 获取其他计划列表
    other_plans = get_other_plans(user_id)

    return render_template('user_plan/plan_index.html',
                           active_plan=active_plan,
                           week_details=week_details,
                           other_plans=other_plans,
                           active_page='user_plan')


@user_plan_bp.route('/get-user-plan-active', methods=['GET'])
@login_required
def get_user_plan_active():
    """获取当前激活的训练计划API"""
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"success": False, 'error': "您还未登录，请登录后使用！"})

        parent = user_plan.get_active_plan_for_user(user_id)
        if not parent.success or not parent.data:
            return jsonify({"success": True, "data": {"plan": None, "detailList": []}})

        parent_data = parent.data[0] if isinstance(parent.data, list) else parent.data
        details = user_plan_detail.get_plan_detail_by_plan_id(parent_data['id'])

        parent_data['percent'] = details[2] if len(details) > 2 else 0

        return jsonify({
            "success": True,
            "data": {
                "plan": parent_data,
                "detailList": details[0] if details else []
            }
        })
    except Exception as e:
        logger.error(f"获取训练计划失败: {str(e)}")
        return jsonify({"success": False, "error": str(e)})


@user_plan_bp.route('/get-user-plan', methods=['GET'])
@login_required
def get_user_plan():
    """获取用户所有非激活的训练计划"""
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"success": False, 'error': "您还未登录，请登录后使用！"})

        plans = user_plan.get_no_active_plan_for_user(user_id)
        return jsonify({"success": True, "data": plans.data if plans.success else []})
    except Exception as e:
        logger.error(f"获取训练计划列表失败: {str(e)}")
        return jsonify({"success": False, "error": str(e)})


@user_plan_bp.route('/change-user-plan', methods=['POST'])
@login_required
def change_user_plan():
    """切换训练计划"""
    try:
        user_id = session.get('user_id')
        params = request.get_json()
        origin_id = params.get('origin_id')
        new_id = params.get('new_id')

        # 将原计划设为非激活
        if origin_id:
            user_plan.update_plan(origin_id, {'is_deleted': '0'})

        # 将新计划设为激活
        user_plan.update_plan(new_id, {'is_deleted': '2'})

        return get_user_plan_active()
    except Exception as e:
        logger.error(f"切换训练计划失败: {str(e)}")
        return jsonify({"success": False, "error": str(e)})


@user_plan_bp.route('/save-plan-detail-course', methods=['POST'])
@login_required
def save_plan_detail_course():
    """保存计划详情与课程的关联"""
    try:
        user_id = session.get('user_id')
        params = request.get_json()
        plan_dtl_id = params.get('plan_dtl_id')
        course_id = params.get('course_id')
        plan_dtl_course_id = params.get('plan_dtl_course_id')

        plan_detail_course_data = {
            'plan_dtl_course_id': plan_dtl_course_id,
            'course_id': course_id,
            'plan_dtl_id': plan_dtl_id
        }

        if plan_dtl_course_id:
            result = plan_detail_course.update_plan_detail_course(plan_dtl_course_id, plan_detail_course_data)
        else:
            result = plan_detail_course.add_plan_detail_course(plan_detail_course_data)

        return get_user_plan_active()
    except Exception as e:
        logger.error(f"保存计划课程关联失败: {str(e)}")
        return jsonify({"success": False, "error": str(e)})


@user_plan_bp.route('/get-user-plan-detail', methods=['GET'])
@login_required
def get_user_plan_detail():
    """获取计划详情"""
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"success": False, 'error': "您还未登录，请登录后使用！"})

        plan_dtl_id = request.args.get('plan_dtl_id', '0')
        plan_detail = user_plan_detail.get_plan_detail_by_id(int(plan_dtl_id))

        conn_param = {'plan_dtl_id': plan_dtl_id}
        connection = plan_detail_course.get_user_plan_detail_course(conn_param)

        course_data = None
        connection_data = None

        if connection.success and connection.data:
            connection_data = connection.data[0] if isinstance(connection.data, list) else connection.data
            course_param = {"course_id": connection_data['course_id']}
            course_response = course.get_course_and_theam(course_param)
            if course_response.success and course_response.data:
                course_data = course_response.data[0] if isinstance(course_response.data, list) else course_response.data

        return jsonify({
            "success": True,
            "data": {
                'plan_detail': plan_detail.data if plan_detail.success else None,
                'connection': connection_data,
                'course': course_data
            }
        })
    except Exception as e:
        logger.error(f"获取计划详情失败: {str(e)}")
        return jsonify({"success": False, "error": str(e)})


@user_plan_bp.route('/save-plan-detail', methods=['POST'])
@login_required
def save_plan_detail():
    """保存计划详情"""
    try:
        user_id = session.get('user_id')
        params = request.get_json()

        detail_id = params.get('id')
        plan = params.get('plan')
        context = params.get('context')
        plan_day = params.get('plan_day')

        plan_detail_data = {
            'id': detail_id,
            'plan': plan,
            'context': context,
            'plan_day': plan_day
        }

        if detail_id:
            result = user_plan_detail.update_plan_detail(detail_id, plan_detail_data)
        else:
            result = user_plan_detail.add_plan_detail(plan_detail_data)

        return get_user_plan_active()
    except Exception as e:
        logger.error(f"保存计划详情失败: {str(e)}")
        return jsonify({"success": False, "error": str(e)})


@user_plan_bp.route('/create', methods=['GET', 'POST'])
@login_required
def create_plan():
    """创建新训练计划"""
    user_id = session.get('user_id')

    if request.method == 'POST':
        plan_name = request.form.get('plan_name')
        start_date = request.form.get('start_date')

        # 创建新计划
        plan_data = {
            'user_id': user_id,
            'plan_name': plan_name,
            'start_date': start_date,
            'is_deleted': 0
        }
        result = user_plan.add_plan(plan_data)

        if result.success:
            plan_id = result.data.get('id')

            # 创建7天的计划详情
            start = datetime.strptime(start_date, '%Y-%m-%d')
            for i in range(7):
                day_date = start + timedelta(days=i)
                detail_data = {
                    'plan_id': plan_id,
                    'plan_day': day_date.strftime('%Y-%m-%d'),
                    'plan': '',
                    'context': '',
                    'status': 'pending'
                }
                user_plan_detail.add_plan_detail(detail_data)

            flash('训练计划创建成功', 'success')
            return redirect(url_for('user-plan.plan_index'))
        else:
            flash(f'创建失败: {result.msg}', 'error')

    # 获取可用课程列表
    courses_result = course.get_course({"is_deleted": 0})
    courses = courses_result.data if courses_result.success else []

    return render_template('user_plan/create_plan.html',
                           courses=courses,
                           active_page='user_plan')


def get_active_plan(user_id):
    """获取用户当前激活的计划"""
    result = user_plan.get_active_plan_for_user(user_id)
    if result.success and result.data:
        return result.data[0] if isinstance(result.data, list) else result.data
    return None


def get_week_plan_details(plan):
    """获取一周的计划详情"""
    if not plan:
        return []

    details, total, percent = user_plan_detail.get_plan_detail_by_plan_id(plan['id'])

    # 为每个详情添加状态标签
    week_details = []
    today = datetime.now().date()

    for detail in details:
        plan_day = detail.get('plan_day')
        if isinstance(plan_day, str):
            plan_day = datetime.strptime(plan_day, '%Y-%m-%d').date()
        elif hasattr(plan_day, 'date'):
            plan_day = plan_day.date()

        status = detail.get('status', 'pending')
        if status == 'completed':
            status_label = '已完成'
            status_class = 'success'
        elif plan_day < today and status != 'completed':
            status_label = '未完成'
            status_class = 'danger'
        elif plan_day == today:
            status_label = '今日'
            status_class = 'primary'
        else:
            status_label = '未开始'
            status_class = 'secondary'

        detail['status_label'] = status_label
        detail['status_class'] = status_class
        detail['weekday'] = get_weekday_name(plan_day)
        week_details.append(detail)

    return week_details


def get_other_plans(user_id):
    """获取用户的其他计划"""
    result = user_plan.get_no_active_plan_for_user(user_id)
    if result.success and result.data:
        return result.data
    return []


def get_weekday_name(date):
    """获取星期名称"""
    weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    return weekdays[date.weekday()]
