#!/usr/bin/env python
# -*- coding: UTF-8 -*-
'''
@Project ：fitenss_items
@File    ：course_action_points.py
@IDE     ：PyCharm
@Author  ：SandyLee
@Date    ：2025/11/23 08:51
'''
import re
from datetime import datetime

from app.config import DB_CONFIG
from app.utils.libmysql import MYSQL
from app.utils.result_type import Response
from app.services.db_services import DEMO_MODE

if DEMO_MODE:
    from app.services.mock_data import MOCK_COURSE_ACTION_POINTS
else:
    from app.config import DB_CONFIG
    from app.utils.libmysql import MYSQL
    conn = MYSQL(
        dbhost=DB_CONFIG['host'],
        dbuser=DB_CONFIG['user'],
        dbpwd=DB_CONFIG['password'],
        dbname=DB_CONFIG['database'],
        dbport=DB_CONFIG['port'],
        dbcharset='utf8'
    )

TABLE_NAME = "course_action_points"


def get_course_action_points(condition: dict):
    """
    获取课程动作要点，允许传入查询条件字典
    例如: get_course_action_points({"id": 1}) 或 get_course_action_points({"theme_name": "Botter"})
    默认只查询未删除的课程动作要点
    """
    if not condition or len(condition) == 0:
        return Response.fail(code=500, msg="查询条件不能为空")

    try:
        result = conn.fetch_rows(TABLE_NAME, condition=condition)
        if result is None or len(result) == 0:
            return Response.fail(code=404, msg="查无此课程动作要点")
        # 如果是根据唯一ID查询，通常只返回一条记录
        if "id" in condition and len(result) == 1:
             return Response.success(data=result[0]) # 返回单个对象而非列表
        return Response.success(data=result) # 返回列表
    except Exception as e:
        return Response.fail(code=500, msg=f"查询课程动作要点失败: {str(e)}")


def get_course_action_points_by_id(id: int):
     """根据ID获取单个课程动作要点"""
     if not id:
         return Response.fail(code=500, msg="课程动作要点ID不能为空")
     return get_course_action_points({"id": id})

def get_action_points_by_course_id(course_id: int):
    """根据课程ID获取所有动作要点"""
    if not course_id:
        return Response.fail(code=500, msg="课程ID不能为空")

    if DEMO_MODE:
        if course_id in MOCK_COURSE_ACTION_POINTS:
            points = MOCK_COURSE_ACTION_POINTS[course_id]
            return Response.success(data=points)
        return Response.fail(code=404, msg="查无此课程动作要点")
    else:
        return get_course_action_points({"course_id": course_id})