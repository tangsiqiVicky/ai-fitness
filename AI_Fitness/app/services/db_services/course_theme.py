#!/usr/bin/env python
# -*- coding: UTF-8 -*-
'''
@Project ：fitenss_items
@File    ：course_theme.py
@IDE     ：PyCharm
@Author  ：SandyLee
@Date    ：2025/11/23 08:51
'''
import re
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

TABLE_NAME = "course_theme"


def get_course_theme(condition: dict):
    """
    获取课程主题，允许传入查询条件字典
    例如: get_course_theme({"id": 1}) 或 get_course_theme({"theme_name": "Botter"})
    默认只查询未删除的课程主题
    """
    if not condition or len(condition) == 0:
        return Response.fail(code=500, msg="查询条件不能为空")

    try:
        result = conn.fetch_rows(TABLE_NAME, condition=condition)
        if result is None or len(result) == 0:
            return Response.fail(code=404, msg="查无此课程主题")
        # 如果是根据唯一ID查询，通常只返回一条记录
        if "id" in condition and len(result) == 1:
             return Response.success(data=result[0]) # 返回单个对象而非列表
        return Response.success(data=result) # 返回列表
    except Exception as e:
        return Response.fail(code=500, msg=f"查询课程主题失败: {str(e)}")


def get_course_theme_by_id(id: int):
     """根据ID获取单个课程主题"""
     if not id:
         return Response.fail(code=500, msg="课程主题ID不能为空")
     return get_course_theme({"id": id})

def get_all_course_themes():
    """获取所有未删除的课程主题"""
    return get_course_theme({"is_deleted": 0})