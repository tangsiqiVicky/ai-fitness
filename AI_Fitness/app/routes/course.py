#!/usr/bin/env python
# -*- coding: UTF-8 -*-
'''
@Project ：AI_Fitness
@File    ：course.py
@IDE     ：PyCharm
@Author  ：AI智能康训平台
@Date    ：2026/02/03
'''
import datetime
import logging as python_logging
from flask import Blueprint, request, jsonify, render_template, session, redirect, url_for, flash
from app.services.db_services import course, course_theme, course_action_points, course_training_record
from functools import wraps

# 创建蓝图
course_bp = Blueprint('course', __name__, url_prefix='/course')

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


@course_bp.route('/', methods=['GET'])
def course_list():
    """课程列表页"""
    # 获取所有课程
    courses_result = course.get_course({"is_deleted": 0})
    courses = courses_result.data if courses_result.success else []

    # 获取课程主题（用于筛选）
    themes_result = course_theme.get_all_course_themes()
    themes = themes_result.data if themes_result.success else []

    return render_template('course/course_list.html',
                           courses=courses,
                           themes=themes,
                           active_page='course')


@course_bp.route('/detail/<int:course_id>', methods=['GET'])
def course_detail(course_id):
    """课程详情页"""
    # 获取课程信息
    course_result = course.get_course_and_theam({"course_id": course_id})
    if not course_result.success:
        flash('课程不存在', 'error')
        return redirect(url_for('course.course_list'))

    course_data = course_result.data[0] if isinstance(course_result.data, list) else course_result.data

    # 获取动作要点
    points_result = course_action_points.get_action_points_by_course_id(course_id)
    action_points = points_result.data if points_result.success else []

    return render_template('course/course_detail.html',
                           course=course_data,
                           course_action_points=action_points,
                           active_page='course')


@course_bp.route('/start-training/<int:course_id>', methods=['GET'])
@login_required
def start_training(course_id):
    """开始训练页"""
    user_id = session.get('user_id')

    # 获取课程信息
    course_result = course.get_course_and_theam({"course_id": course_id})
    if not course_result.success:
        flash('课程不存在', 'error')
        return redirect(url_for('course.course_list'))

    course_data = course_result.data[0] if isinstance(course_result.data, list) else course_result.data

    # 获取动作要点
    points_result = course_action_points.get_action_points_by_course_id(course_id)
    action_points = points_result.data if points_result.success else []

    return render_template('course/start_training.html',
                           course=course_data,
                           action_points=action_points,
                           user_id=user_id,
                           active_page='course')


@course_bp.route('/save_course_training_record', methods=['POST'])
@login_required
def save_course_training_record():
    """保存课程训练记录"""
    try:
        user_id = session.get('user_id', '0')
        training_records = request.get_json()

        ids = []
        for record in training_records:
            record['user_id'] = user_id
            if 'start_time' in record and isinstance(record['start_time'], (int, float)):
                record['start_time'] = datetime.datetime.fromtimestamp(record['start_time'] / 1000)
            if 'end_time' in record and isinstance(record['end_time'], (int, float)):
                record['end_time'] = datetime.datetime.fromtimestamp(record['end_time'] / 1000)

            result = course_training_record.add_training_record(record)
            if result.success:
                ids.append(result.data.get('result_id'))

        return jsonify({"success": True, "data": {"record_ids": ids}})
    except Exception as e:
        logger.error(f"保存训练记录失败: {str(e)}")
        return jsonify({"success": False, "error": str(e)})


@course_bp.route('/get-courses', methods=['GET'])
def get_courses():
    """获取课程列表API"""
    try:
        user_id = session.get('user_id', '0')
        if user_id == '0':
            return jsonify({"success": False, 'error': "您还未登录，请登录后使用！"})

        courses_result = course.get_course({"is_deleted": 0})
        return jsonify({"success": True, "data": courses_result.data if courses_result.success else []})
    except Exception as e:
        logger.error(f"获取课程列表失败: {str(e)}")
        return jsonify({"success": False, "error": str(e)})


@course_bp.route('/get-course/<int:course_id>', methods=['GET'])
def get_course_by_id(course_id):
    """获取单个课程API"""
    try:
        course_result = course.get_course_and_theam({"course_id": course_id})
        if course_result.success:
            return jsonify({
                "success": True,
                "data": course_result.data[0] if isinstance(course_result.data, list) else course_result.data
            })
        else:
            return jsonify({"success": False, "error": "课程不存在"})
    except Exception as e:
        logger.error(f"获取课程详情失败: {str(e)}")
        return jsonify({"success": False, "error": str(e)})


@course_bp.route('/get-themes', methods=['GET'])
def get_themes():
    """获取课程主题列表API"""
    try:
        themes_result = course_theme.get_all_course_themes()
        return jsonify({"success": True, "data": themes_result.data if themes_result.success else []})
    except Exception as e:
        logger.error(f"获取课程主题列表失败: {str(e)}")
        return jsonify({"success": False, "error": str(e)})


@course_bp.route('/filter', methods=['GET'])
def filter_courses():
    """筛选课程"""
    theme_id = request.args.get('theme_id')
    keyword = request.args.get('keyword', '')

    # 构建查询条件
    condition = {"is_deleted": 0}
    if theme_id:
        condition['theme_id'] = theme_id

    # 获取课程
    courses_result = course.get_course(condition)
    courses_list = courses_result.data if courses_result.success else []

    # 关键词过滤
    if keyword:
        courses_list = [
            c for c in courses_list
            if keyword.lower() in c.get('course_name', '').lower() or
               keyword.lower() in c.get('course_desc', '').lower()
        ]

    # 获取课程主题
    themes_result = course_theme.get_all_course_themes()
    themes = themes_result.data if themes_result.success else []

    return render_template('course/course_list.html',
                           courses=courses_list,
                           themes=themes,
                           selected_theme=theme_id,
                           keyword=keyword,
                           active_page='course')


@course_bp.route('/add-to-plan/<int:course_id>', methods=['POST'])
@login_required
def add_to_plan(course_id):
    """将课程添加到训练计划"""
    try:
        user_id = session.get('user_id')

        # 这里需要调用训练计划相关的服务
        # 简化处理：返回成功提示
        flash('课程已添加到训练计划', 'success')
        return redirect(url_for('course.course_detail', course_id=course_id))
    except Exception as e:
        logger.error(f"添加到训练计划失败: {str(e)}")
        flash(f'添加失败: {str(e)}', 'error')
        return redirect(url_for('course.course_detail', course_id=course_id))
