#!/usr/bin/env python
# -*- coding: UTF-8 -*-
'''
@Project ：fitenss_items
@File    ：user_date.py
@IDE     ：PyCharm
@Author  ：写BUG的Botter
@Date    ：2025/4/12
'''
from datetime import datetime

from app.config import DB_CONFIG
from app.utils.libmysql import MYSQL
from app.utils.result_type import Response

conn = MYSQL(
    dbhost=DB_CONFIG['host'],
    dbuser=DB_CONFIG['user'],
    dbpwd=DB_CONFIG['password'],
    dbname=DB_CONFIG['database'],
    dbport=DB_CONFIG['port'],
    dbcharset='utf8'
)

TABLE_NAME = "user_date" # Renamed from data for clarity


def add_user_score_data(score_data: dict):
    """增加用户分数数据"""
    if not score_data or len(score_data) == 0:
        return Response.fail(code=500, msg="提交信息为空")

    # 必填字段校验
    required_fields = ['user_id', 'title']
    for field in required_fields:
        if field not in score_data or not score_data.get(field):
             # Check for 0 explicitly if needed
             if score_data.get(field) is None:
                 return Response.fail(code=500, msg=f"字段 {field} 不能为空")

    # 准备插入的数据
    insert_data = score_data.copy()
    now = datetime.now()
    insert_data['create_time'] = now
    insert_data['update_time'] = now
    # create_by and update_by should ideally be set based on logged-in user context
    # No is_deleted field in DDL

    try:
        result_id = conn.insert(TABLE_NAME, insert_data)
        return Response.success(data={"id": result_id})
    except Exception as e:
        return Response.fail(code=500, msg=f"创建用户分数数据失败: {str(e)}")


def update_user_score_data(data_id: int, update_data: dict):
    """根据ID修改用户分数数据"""
    if not data_id:
        return Response.fail(code=500, msg="数据ID不能为空")
    if not update_data or len(update_data) == 0:
        return Response.fail(code=500, msg="更新信息为空")

    # 不允许修改主键或用户ID
    for forbidden_key in ['id', 'user_id']:
         if forbidden_key in update_data:
             del update_data[forbidden_key]

    if not update_data:
        return Response.fail(code=400, msg="没有可更新的字段")

    # 补充更新时间
    update_data['update_time'] = datetime.now()
    # update_by should be set based on context

    condition = {"id": data_id} # No is_deleted check

    try:
        affected_rows = conn.update(TABLE_NAME, update_data, condition=condition)
        if affected_rows > 0:
            return Response.success(msg="用户分数数据更新成功")
        else:
            return Response.fail(code=404, msg="未找到用户分数数据或无需更新")
    except Exception as e:
        return Response.fail(code=500, msg=f"用户分数数据更新失败: {str(e)}")


def delete_user_score_data_by_id(data_id: int):
    """根据ID删除用户分数数据 (物理删除)"""
    if not data_id:
        return Response.fail(code=500, msg="数据ID不能为空")

    condition = {"id": data_id}

    try:
        # Note: Physical delete due to lack of is_deleted column
        affected_rows = conn.delete(TABLE_NAME, condition=condition)
        if affected_rows > 0:
            return Response.success(msg="用户分数数据删除成功")
        else:
            return Response.fail(code=404, msg="未找到要删除的用户分数数据")
    except Exception as e:
        return Response.fail(code=500, msg=f"用户分数数据删除失败: {str(e)}")


def get_user_score_data(condition: dict, limit: int = None):
    """获取用户分数数据，允许传入查询条件字典"""
    if not condition or len(condition) == 0:
        return Response.fail(code=500, msg="查询条件不能为空")
    # No is_deleted default
    try:
        result = conn.fetch_rows(TABLE_NAME, condition=condition, order="source DESC", limit = limit)
        if result is None or len(result) == 0:
            return Response.fail(code=404, msg="查无此用户分数数据")
        # 如果是根据唯一ID查询，通常只返回一条记录
        if "id" in condition and len(result) == 1:
             return Response.success(data=result[0]) # 返回单个对象而非列表
        return Response.success(data=result) # 返回列表
    except Exception as e:
        return Response.fail(code=500, msg=f"查询用户分数数据失败: {str(e)}")

def get_user_score_data_detail(condition: dict, create_date):
    sql = 'select * from user_date c where 1=1 and {where} '
    if (create_date):
        sql = sql + ' and DATE_FORMAT(c.create_time,\'%%Y-%%m-%%d\') = \'{}\''.format(create_date)

    if not condition or len(condition) == 0:
        return Response.fail(code=500, msg="查询条件不能为空")
    where = conn.join_field_value(condition, ' AND ')
    sql = sql.format(where=where)
    try:
        prepared = []
        prepared.extend(condition.values())
        result = conn.query(sql, prepared)
        if result is None or len(result) == 0:
            return Response.fail(code=404, msg="查无此数据")
        # 如果是根据唯一ID查询，通常只返回一条记录
        if "id" in condition and len(result) == 1:
             return Response.success(data=result[0]) # 返回单个对象而非列表
        return Response.success(data=result) # 返回列表
    except Exception as e:
        return Response.fail(code=500, msg=f"查询数据失败: {str(e)}")


def get_user_score_data_by_id(data_id: int):
     """根据ID获取单个用户分数数据"""
     if not data_id:
         return Response.fail(code=500, msg="数据ID不能为空")
     return get_user_score_data({"id": data_id})


def get_score_data_for_user(user_id: int):
    """获取指定用户的所有分数数据"""
    if not user_id:
        return Response.fail(code=500, msg="用户ID不能为空")
    condition = {"user_id": user_id}
    return get_user_score_data(condition)


def save_fitness_report(user_id: int, report_data: dict, exercise_type: str, action_analyse: str = ''):
    """
    保存康训报告数据到用户数据表
    
    Args:
        user_id: 用户ID
        report_data: 康训报告数据，包含score, analysis, advice等字段
        exercise_type: 训练动作类型
        action_analyse: 动作分析内容，默认为空字符串
        
    Returns:
        Response对象，包含操作结果
    """
    if not user_id:
        return Response.fail(code=500, msg="用户ID不能为空")
    
    if not report_data:
        return Response.fail(code=500, msg="报告数据不能为空")
    
    # 准备要保存的数据
    save_data = {
        'user_id': user_id,
        'title': exercise_type,  # 使用训练动作作为标题
        'source': report_data.get('score', 0),  # 分数
        'analysis': report_data.get('summary', ''),  # 分析摘要
        'action_analyse': action_analyse,  # 动作分析
        'course_id': report_data.get('course_id', 0),
        'batch_no': report_data.get('batch_no', None)
    }
    
    # 处理建议数据 - 将列表转换为字符串
    suggestions = report_data.get('suggestions', [])
    if suggestions and isinstance(suggestions, list):
        save_data['advice'] = '\n'.join(suggestions)
    else:
        save_data['advice'] = str(suggestions)
    
    # 处理组数和个数
    save_data['group'] = report_data.get('group', 1)  # 默认1组
    save_data['number'] = report_data.get('reps', 10)  # 默认10次
    
    # 添加创建者信息
    save_data['create_by'] = str(user_id)  # 使用用户ID作为创建者
    
    # 调用添加数据的函数
    return add_user_score_data(save_data)

def get_latest_fitness_reports(user_id: int, limit: int = 5):
    """
    获取用户最近的康训报告数据
    
    Args:
        user_id: 用户ID
        limit: 限制返回的记录数量，默认5条
        
    Returns:
        Response对象，包含最近的康训报告数据
    """
    if not user_id:
        return Response.fail(code=500, msg="用户ID不能为空")
    
    try:
        # 构建查询条件
        condition = {"user_id": user_id}
        
        # 查询数据并按创建时间降序排序，限制返回数量
        result = conn.fetch_rows(
            TABLE_NAME, 
            condition=condition,
            order="create_time DESC",
            limit=limit
        )
        
        if result is None or len(result) == 0:
            return Response.fail(code=404, msg="未找到用户康训报告数据")
        
        return Response.success(data=result)
    except Exception as e:
        return Response.fail(code=500, msg=f"查询用户康训报告数据失败: {str(e)}")

def get_user_fitness_stats(user_id: int):
    """
    获取用户康训统计数据，包括总训练次数、平均分数等
    
    Args:
        user_id: 用户ID
        
    Returns:
        Response对象，包含用户康训统计数据
    """
    if not user_id:
        return Response.fail(code=500, msg="用户ID不能为空")
    
    try:
        # 构建SQL查询
        sql = f"""
        SELECT 
            COUNT(*) as total_workouts,
            AVG(source) as avg_score,
            SUM(group * number) as total_reps,
            COUNT(DISTINCT DATE(create_time)) as workout_days
        FROM {TABLE_NAME}
        WHERE user_id = %s
        """
        
        # 执行查询
        result = conn.query(sql, [user_id])
        
        if not result:
            return Response.fail(code=404, msg="未找到用户康训统计数据")
        
        # 处理结果
        stats = {
            'total_workouts': int(result[0]['total_workouts']),
            'avg_score': round(float(result[0]['avg_score'] or 0), 1),
            'total_reps': int(result[0]['total_reps'] or 0),
            'workout_days': int(result[0]['workout_days'])
        }
        
        return Response.success(data=stats)
    except Exception as e:
        return Response.fail(code=500, msg=f"查询用户康训统计数据失败: {str(e)}")