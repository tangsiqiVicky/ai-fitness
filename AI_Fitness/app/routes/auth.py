from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify, send_from_directory
from app.services.db_services import user_info, user_date, course, question, user_question_answer, sys_user
import os
import json
# 创建蓝图
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/')
def shouye2():
    courses = course.get_course_and_theam({"is_show_index": 1})
    doctors = sys_user.query_doctors({'su.del_flag': '0'}, 4)
    return render_template("shouye.html", active_page='home', courses=courses, doctors=doctors)

@auth_bp.route('/shouye', methods=['GET', 'POST'])
def shouye():
    courses = course.get_course_and_theam({"is_show_index": 1})
    doctors = sys_user.query_doctors({'su.del_flag': '0'}, 4)
    return render_template("shouye.html", active_page='home', courses=courses, doctors=doctors)

# 添加登录路由
# 在登录成功后保存更多用户信息到session
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # 验证用户
        user = {
            "user_name": username,
            "password": password,
        }
        res = user_info.get_user(user)
        if res.code == 404:
            user = {
                "email": username,
                "password": password,
            }
        res = user_info.get_user(user)
        
        # 处理常规表单提交
        if res.code == 200:
            # 登录成功，保存用户信息到session
            session['user_id'] = res.data[0]['id']
            session['username'] = res.data[0]['user_name']
            session['email'] = res.data[0].get('email', '')
            flash('登录成功！', 'success')
            return redirect(url_for('auth.shouye'))
        else:
            flash('用户名或密码错误', 'error')

    return render_template('auth/login.html', active_page='home')

# 添加注销路由
@auth_bp.route('/logout')
def logout():
    # 清除session
    session.clear()
    flash('您已成功退出登录', 'info')
    return redirect(url_for('auth.shouye'))

# 添加用户注册路由
@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    questions = []
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        questionId = request.form.get('questionId')
        answer = request.form.get('answer')
        gender = request.form.get('gender')
        age = request.form.get('age')
        height = request.form.get('height')
        weight = request.form.get('weight')

        # 验证密码
        if password != confirm_password:
            flash('两次输入的密码不一致', 'error')
            return render_template('auth/register.html', active_page='register')

        # 检查用户名是否已存在
        if user_info.get_count_username(username):
            flash('用户名已存在', 'error')
            return render_template('auth/register.html', active_page='register')

        # 创建新用户
        user = {
            'user_name':username,
            'email':email,
            'password':password,
            'gender':gender,
            'age':age,
            'height':height,
            'weight':weight
        }
        print(user)
        result = user_info.add_user(user)
        print(result)
        userquestionanswer = {
            'question_id': questionId,
            'user_id': result.data.get('id'),
            'question_answer': answer,
            'is_deleted': '0',
        }
        user_question_answer.add_question_answer(userquestionanswer)
        if result.code == 200:
            flash('注册成功，请登录', 'success')
            return redirect(url_for('auth.login'))
        else:
            flash(f'注册失败,{result.msg}', 'error')
    else:
        questions = question.get_question({'is_deleted':'0'}).data

    return render_template('auth/register.html', questions=questions, active_page='register')

# 忘记密码
@auth_bp.route('/forgetPwd', methods=['GET', 'POST'])
def forgetPwd():
    questions = []
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        questionId = request.form.get('questionId')
        answer = request.form.get('answer')
        gender = request.form.get('gender')
        age = request.form.get('age')
        height = request.form.get('height')
        weight = request.form.get('weight')

        # 验证密码
        if password != confirm_password:
            flash('两次输入的密码不一致', 'error')
            return render_template('auth/register.html', active_page='register')

        # 检查用户名是否已存在
        if user_info.get_count_username(username):
            flash('用户名已存在', 'error')
            return render_template('auth/register.html', active_page='register')

        # 创建新用户
        user = {
            'user_name':username,
            'email':email,
            'password':password,
            'gender':gender,
            'age':age,
            'height':height,
            'weight':weight
        }
        print(user)
        result = user_info.add_user(user)
        print(result)
        userquestionanswer = {
            'question_id': questionId,
            'user_id': result.data.get('id'),
            'question_answer': answer,
            'is_deleted': '0',
        }
        user_question_answer.add_question_answer(userquestionanswer)
        if result.code == 200:
            flash('注册成功，请登录', 'success')
            return redirect(url_for('auth.login'))
        else:
            flash(f'注册失败,{result.msg}', 'error')
    else:
        questions = question.get_question({'is_deleted':'0'}).data

    return render_template('auth/forgetPwd.html', questions=questions, active_page='register')

# 个人中心路由
@auth_bp.route('/user_center')
def user_center():
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
    
    # 获取用户康训数据
    fitness_data_result = user_date.get_latest_fitness_reports(user_id, limit=10)
    fitness_data = fitness_data_result.data if fitness_data_result.success else []
    
    # 获取用户康训统计数据
    fitness_stats_result = user_date.get_user_fitness_stats(user_id)
    fitness_stats = fitness_stats_result.data if fitness_stats_result.success else {}
    
    return render_template('auth/user_center.html', 
                          user=user, 
                          fitness_data=fitness_data,
                          fitness_stats=fitness_stats)

# 更新用户信息路由
@auth_bp.route('/update-profile', methods=['POST'])
def update_profile():
    # 检查用户是否已登录
    if not session.get('user_id'):
        return jsonify({'success': False, 'message': '请先登录'})
    
    user_id = session.get('user_id')
    
    # 获取表单数据
    update_data = {
        'email': request.form.get('email'),
        'phone': request.form.get('phone'),
        'gender': request.form.get('gender'),
        'age': request.form.get('age'),
        'height': request.form.get('height'),
        'weight': request.form.get('weight'),
        'fitness_goal': request.form.get('fitness_goal')
    }
    
    # 过滤掉空值
    update_data = {k: v for k, v in update_data.items() if v}
    
    # 更新用户信息
    result = user_info.update_user(user_id, update_data)
    
    if result.code == 200:
        flash('个人信息更新成功', 'success')
        return redirect(url_for('auth.user_center'))
    else:
        flash(f'更新失败: {result.msg}', 'error')
        return redirect(url_for('auth.user_center'))

# 修改密码路由
@auth_bp.route('/change-password', methods=['POST'])
def change_password():
    # 检查用户是否已登录
    if not session.get('user_id'):
        return jsonify({'success': False, 'message': '请先登录'})
    
    user_id = session.get('user_id')
    
    # 获取表单数据
    current_password = request.form.get('current_password')
    new_password = request.form.get('new_password')
    confirm_password = request.form.get('confirm_password')
    
    # 验证当前密码
    user_result = user_info.get_user_by_id(user_id)
    if user_result.code != 200 or user_result.data.get('password') != current_password:
        flash('当前密码不正确', 'error')
        return redirect(url_for('auth.user_center'))
    
    # 验证新密码
    if new_password != confirm_password:
        flash('两次输入的新密码不一致', 'error')
        return redirect(url_for('auth.user_center'))
    
    # 更新密码
    result = user_info.update_user(user_id, {'password': new_password})
    
    if result.code == 200:
        flash('密码修改成功', 'success')
        return redirect(url_for('auth.user_center'))
    else:
        flash(f'密码修改失败: {result.msg}', 'error')
        return redirect(url_for('auth.user_center'))

    # 医师列表页面


@auth_bp.route('/doctors')
def doctors_list():
    doctors_result = sys_user.query_doctors({'su.del_flag': '0'}, None)
    doctors_list = doctors_result.data
    return render_template('doctors_list.html', active_page='doctors', doctors_list = doctors_list)

@auth_bp.route('/images/<type>', methods=['GET'])
def images(type):
    cfg_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config', 'syscfg', 'cfg.json')
    cfgJson = {};
    with open(cfg_path, 'r', encoding='utf-8') as f:
        cfgJson = json.load(f)
    path = request.args.get("path")
    return send_from_directory(cfgJson[type], path)
