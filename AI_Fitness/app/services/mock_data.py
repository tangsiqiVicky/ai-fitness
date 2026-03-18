#!/usr/bin/env python
# -*- coding: UTF-8 -*-
'''
@Project ：AI_Fitness
@File    ：mock_data.py
@IDE     ：PyCharm
@Author  ：AI智能康训平台
@Date    ：2026/02/03
@Desc    ：模拟数据模块，用于demo演示
'''
from datetime import datetime, timedelta
import random

# 模拟用户数据
MOCK_USERS = {
    1: {
        'id': 1,
        'user_id': 1,
        'user_name': 'demo_user',
        'username': 'demo_user',
        'email': 'demo@example.com',
        'password': '123456',
        'nick_name': '康复达人',
        'gender': 1,  # 1男 2女
        'age': 30,
        'height': 175,
        'weight': 70,
        'theme_id': 1,
        'avatar': '/static/images/default_avatar.png',
        'created_time': datetime.now() - timedelta(days=30),
        'is_deleted': 0
    },
    2: {
        'id': 2,
        'user_id': 2,
        'user_name': 'test_user',
        'username': 'test_user',
        'email': 'test@example.com',
        'password': '123456',
        'nick_name': '健康小助手',
        'gender': 2,
        'age': 25,
        'height': 165,
        'weight': 55,
        'theme_id': 2,
        'avatar': '/static/images/default_avatar.png',
        'created_time': datetime.now() - timedelta(days=15),
        'is_deleted': 0
    },
    3: {
        'id': 3,
        'user_id': 3,
        'user_name': 'kx01',
        'username': 'kx01',
        'email': 'kx01@example.com',
        'password': 'kx01',
        'nick_name': '康训用户01',
        'gender': 1,
        'age': 28,
        'height': 170,
        'weight': 65,
        'theme_id': 1,
        'avatar': '/static/images/default_avatar.png',
        'created_time': datetime.now() - timedelta(days=1),
        'is_deleted': 0
    }
}

# 模拟安全问题
MOCK_QUESTIONS = [
    {'id': 1, 'question': '您的出生地是？', 'is_deleted': 0},
    {'id': 2, 'question': '您母亲的姓名是？', 'is_deleted': 0},
    {'id': 3, 'question': '您的小学名称是？', 'is_deleted': 0},
    {'id': 4, 'question': '您最喜欢的电影是？', 'is_deleted': 0},
    {'id': 5, 'question': '您的宠物名字是？', 'is_deleted': 0},
]

# 模拟用户安全问题答案
MOCK_USER_QUESTION_ANSWERS = {
    1: {'user_id': 1, 'question_id': 1, 'answer': '北京'},
    2: {'user_id': 2, 'question_id': 2, 'answer': '李华'},
}

# 模拟课程主题
MOCK_COURSE_THEMES = [
    {'id': 1, 'theme_name': '颈椎康复', 'theme_description': '针对颈椎问题的康复训练', 'theme_icon': 'fa-head-side', 'is_deleted': 0},
    {'id': 2, 'theme_name': '腰椎康复', 'theme_description': '针对腰椎问题的康复训练', 'theme_icon': 'fa-bone', 'is_deleted': 0},
    {'id': 3, 'theme_name': '肩周康复', 'theme_description': '针对肩周炎的康复训练', 'theme_icon': 'fa-hand-rock', 'is_deleted': 0},
    {'id': 4, 'theme_name': '膝关节康复', 'theme_description': '针对膝关节问题的康复训练', 'theme_icon': 'fa-walking', 'is_deleted': 0},
    {'id': 5, 'theme_name': '产后康复', 'theme_description': '针对产后恢复的康复训练', 'theme_icon': 'fa-baby', 'is_deleted': 0},
]

# 模拟课程数据
MOCK_COURSES = [
    {
        'course_id': 1,
        'course_name': '颈椎放松操',
        'theme_id': 1,
        'theme_name': '颈椎康复',
        'course_description': '通过简单的颈部运动，缓解颈椎疲劳，改善颈部血液循环。适合长期伏案工作的人群。',
        'course_duration': 15,
        'course_difficulty': 1,
        'course_video': '/static/videos/neck_relax.mp4',
        'course_cover': '/static/images/courses/neck_relax.jpg',
        'course_calories': 50,
        'view_count': 1256,
        'is_deleted': 0
    },
    {
        'course_id': 2,
        'course_name': '腰椎强化训练',
        'theme_id': 2,
        'theme_name': '腰椎康复',
        'course_description': '加强腰部核心肌群，保护腰椎，预防腰椎间盘突出。',
        'course_duration': 20,
        'course_difficulty': 2,
        'course_video': '/static/videos/lumbar_strengthen.mp4',
        'course_cover': '/static/images/courses/lumbar_strengthen.jpg',
        'course_calories': 80,
        'view_count': 986,
        'is_deleted': 0
    },
    {
        'course_id': 3,
        'course_name': '肩周炎康复操',
        'theme_id': 3,
        'theme_name': '肩周康复',
        'course_description': '针对肩周炎患者设计的康复运动，帮助恢复肩关节活动度。',
        'course_duration': 18,
        'course_difficulty': 1,
        'course_video': '/static/videos/shoulder_rehab.mp4',
        'course_cover': '/static/images/courses/shoulder_rehab.jpg',
        'course_calories': 60,
        'view_count': 756,
        'is_deleted': 0
    },
    {
        'course_id': 4,
        'course_name': '膝关节保护训练',
        'theme_id': 4,
        'theme_name': '膝关节康复',
        'course_description': '增强膝关节周围肌肉力量，提高关节稳定性。',
        'course_duration': 25,
        'course_difficulty': 2,
        'course_video': '/static/videos/knee_protect.mp4',
        'course_cover': '/static/images/courses/knee_protect.jpg',
        'course_calories': 100,
        'view_count': 654,
        'is_deleted': 0
    },
    {
        'course_id': 5,
        'course_name': '产后盆底肌修复',
        'theme_id': 5,
        'theme_name': '产后康复',
        'course_description': '帮助产后妈妈恢复盆底肌功能，改善产后不适。',
        'course_duration': 15,
        'course_difficulty': 1,
        'course_video': '/static/videos/postpartum_pelvic.mp4',
        'course_cover': '/static/images/courses/postpartum_pelvic.jpg',
        'course_calories': 40,
        'view_count': 432,
        'is_deleted': 0
    },
    {
        'course_id': 6,
        'course_name': '办公室颈椎操',
        'theme_id': 1,
        'theme_name': '颈椎康复',
        'course_description': '适合在办公室进行的简单颈椎放松运动，随时随地缓解疲劳。',
        'course_duration': 10,
        'course_difficulty': 1,
        'course_video': '/static/videos/office_neck.mp4',
        'course_cover': '/static/images/courses/office_neck.jpg',
        'course_calories': 30,
        'view_count': 2103,
        'is_deleted': 0
    },
    {
        'course_id': 7,
        'course_name': '腰椎间盘康复',
        'theme_id': 2,
        'theme_name': '腰椎康复',
        'course_description': '针对腰椎间盘突出患者的专业康复训练课程。',
        'course_duration': 30,
        'course_difficulty': 3,
        'course_video': '/static/videos/disc_rehab.mp4',
        'course_cover': '/static/images/courses/disc_rehab.jpg',
        'course_calories': 120,
        'view_count': 567,
        'is_deleted': 0
    },
    {
        'course_id': 8,
        'course_name': '肩颈联合放松',
        'theme_id': 3,
        'theme_name': '肩周康复',
        'course_description': '同时放松肩部和颈部的综合训练，效果更佳。',
        'course_duration': 20,
        'course_difficulty': 2,
        'course_video': '/static/videos/shoulder_neck.mp4',
        'course_cover': '/static/images/courses/shoulder_neck.jpg',
        'course_calories': 70,
        'view_count': 876,
        'is_deleted': 0
    },
]

# 模拟课程动作要点
MOCK_COURSE_ACTION_POINTS = {
    1: [
        {'id': 1, 'course_id': 1, 'action_name': '颈部前屈', 'action_description': '缓慢低头，下巴尽量靠近胸口', 'action_duration': 10, 'action_order': 1},
        {'id': 2, 'course_id': 1, 'action_name': '颈部后仰', 'action_description': '缓慢抬头，眼睛看向天花板', 'action_duration': 10, 'action_order': 2},
        {'id': 3, 'course_id': 1, 'action_name': '左右侧屈', 'action_description': '头部向左右两侧倾斜', 'action_duration': 15, 'action_order': 3},
        {'id': 4, 'course_id': 1, 'action_name': '颈部旋转', 'action_description': '缓慢转动头部，左右各5次', 'action_duration': 20, 'action_order': 4},
    ],
    2: [
        {'id': 5, 'course_id': 2, 'action_name': '猫牛式', 'action_description': '四点跪姿，交替弓背和塌腰', 'action_duration': 30, 'action_order': 1},
        {'id': 6, 'course_id': 2, 'action_name': '鸟狗式', 'action_description': '对侧手脚交替伸展', 'action_duration': 40, 'action_order': 2},
        {'id': 7, 'course_id': 2, 'action_name': '平板支撑', 'action_description': '保持身体成一条直线', 'action_duration': 30, 'action_order': 3},
    ],
}

# 模拟用户训练计划
MOCK_USER_PLANS = {
    1: [
        {
            'id': 1,
            'user_id': 1,
            'plan': '颈椎康复第一周',
            'context': '每天进行15分钟颈椎放松训练',
            'start_date': datetime.now().strftime('%Y-%m-%d'),
            'is_deleted': 2,  # 2表示激活
            'created_time': datetime.now() - timedelta(days=3)
        },
        {
            'id': 2,
            'user_id': 1,
            'plan': '综合康复计划',
            'context': '结合颈椎和腰椎的综合训练',
            'start_date': (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d'),
            'is_deleted': 0,
            'created_time': datetime.now() - timedelta(days=1)
        }
    ]
}

# 模拟训练计划详情
MOCK_PLAN_DETAILS = {
    1: [
        {'id': 1, 'plan_id': 1, 'day_number': 1, 'day_date': datetime.now().strftime('%Y-%m-%d')},
        {'id': 2, 'plan_id': 1, 'day_number': 2, 'day_date': (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')},
        {'id': 3, 'plan_id': 1, 'day_number': 3, 'day_date': (datetime.now() + timedelta(days=2)).strftime('%Y-%m-%d')},
        {'id': 4, 'plan_id': 1, 'day_number': 4, 'day_date': (datetime.now() + timedelta(days=3)).strftime('%Y-%m-%d')},
        {'id': 5, 'plan_id': 1, 'day_number': 5, 'day_date': (datetime.now() + timedelta(days=4)).strftime('%Y-%m-%d')},
        {'id': 6, 'plan_id': 1, 'day_number': 6, 'day_date': (datetime.now() + timedelta(days=5)).strftime('%Y-%m-%d')},
        {'id': 7, 'plan_id': 1, 'day_number': 7, 'day_date': (datetime.now() + timedelta(days=6)).strftime('%Y-%m-%d')},
    ]
}

# 模拟计划详情课程
MOCK_PLAN_DETAIL_COURSES = {
    1: [{'detail_id': 1, 'course_id': 1}, {'detail_id': 1, 'course_id': 6}],
    2: [{'detail_id': 2, 'course_id': 1}],
    3: [{'detail_id': 3, 'course_id': 6}, {'detail_id': 3, 'course_id': 8}],
    4: [{'detail_id': 4, 'course_id': 1}],
    5: [{'detail_id': 5, 'course_id': 6}],
    6: [{'detail_id': 6, 'course_id': 1}, {'detail_id': 6, 'course_id': 8}],
    7: [{'detail_id': 7, 'course_id': 6}],
}

# 模拟训练记录
MOCK_TRAINING_RECORDS = [
    {
        'id': 1,
        'user_id': 1,
        'course_id': 1,
        'training_date': (datetime.now() - timedelta(days=2)).strftime('%Y-%m-%d'),
        'training_duration': 15,
        'calories_burned': 50,
        'completion_rate': 100,
        'created_time': datetime.now() - timedelta(days=2)
    },
    {
        'id': 2,
        'user_id': 1,
        'course_id': 6,
        'training_date': (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'training_duration': 10,
        'calories_burned': 30,
        'completion_rate': 100,
        'created_time': datetime.now() - timedelta(days=1)
    },
    {
        'id': 3,
        'user_id': 1,
        'course_id': 2,
        'training_date': datetime.now().strftime('%Y-%m-%d'),
        'training_duration': 15,
        'calories_burned': 60,
        'completion_rate': 75,
        'created_time': datetime.now()
    },
]

# 模拟营养指导数据
MOCK_NUTRITION_GUIDANCE = {
    1: {
        'id': 1,
        'user_id': 1,
        'bmr': 1680,  # 基础代谢率
        'tdee': 2352,  # 每日总消耗
        'protein': 105,  # 蛋白质(克)
        'carbs': 294,  # 碳水化合物(克)
        'fat': 78,  # 脂肪(克)
        'target_calories': 2100,  # 目标热量
        'created_time': datetime.now() - timedelta(days=7)
    }
}

# 模拟营养指导详情(食谱建议)
MOCK_NUTRITION_DETAILS = {
    1: [
        {
            'id': 1,
            'guidance_id': 1,
            'meal_type': '早餐',
            'food_name': '全麦面包 + 鸡蛋 + 牛奶',
            'calories': 450,
            'protein': 25,
            'carbs': 50,
            'fat': 15
        },
        {
            'id': 2,
            'guidance_id': 1,
            'meal_type': '午餐',
            'food_name': '糙米饭 + 鸡胸肉 + 西兰花',
            'calories': 650,
            'protein': 45,
            'carbs': 70,
            'fat': 18
        },
        {
            'id': 3,
            'guidance_id': 1,
            'meal_type': '晚餐',
            'food_name': '清蒸鱼 + 蔬菜沙拉 + 杂粮粥',
            'calories': 500,
            'protein': 35,
            'carbs': 55,
            'fat': 12
        },
        {
            'id': 4,
            'guidance_id': 1,
            'meal_type': '加餐',
            'food_name': '坚果 + 水果',
            'calories': 250,
            'protein': 8,
            'carbs': 30,
            'fat': 12
        }
    ]
}

# 模拟动作评价
MOCK_ACTION_COMMENTS = [
    {
        'action_comment_id': 1,
        'course_id': 1,
        'action_name': '颈部前屈',
        'comment': '动作标准，保持时间充足',
        'score': 95,
        'create_time': datetime.now() - timedelta(days=1)
    },
    {
        'action_comment_id': 2,
        'course_id': 1,
        'action_name': '颈部后仰',
        'comment': '幅度稍小，建议加大',
        'score': 80,
        'create_time': datetime.now() - timedelta(days=1)
    },
    {
        'action_comment_id': 3,
        'course_id': 2,
        'action_name': '猫牛式',
        'comment': '动作流畅，呼吸配合良好',
        'score': 90,
        'create_time': datetime.now()
    },
]

# 模拟动作指标
MOCK_ACTION_INDICATORS = [
    {
        'action_indicator_id': 1,
        'course_id': 1,
        'indicator_name': '颈部活动度',
        'indicator_value': 85,
        'indicator_unit': '度',
        'normal_range': '60-90度',
        'create_time': datetime.now() - timedelta(days=1)
    },
    {
        'action_indicator_id': 2,
        'course_id': 1,
        'indicator_name': '动作持续时间',
        'indicator_value': 15,
        'indicator_unit': '秒',
        'normal_range': '10-20秒',
        'create_time': datetime.now() - timedelta(days=1)
    },
    {
        'action_indicator_id': 3,
        'course_id': 2,
        'indicator_name': '核心稳定性',
        'indicator_value': 78,
        'indicator_unit': '分',
        'normal_range': '70-100分',
        'create_time': datetime.now()
    },
]

# 自增ID计数器
_id_counters = {
    'user': 3,
    'plan': 3,
    'plan_detail': 8,
    'training_record': 4,
    'nutrition_guidance': 2,
    'action_comment': 4,
    'action_indicator': 4,
}

def get_next_id(entity_type):
    """获取下一个自增ID"""
    global _id_counters
    current_id = _id_counters.get(entity_type, 1)
    _id_counters[entity_type] = current_id + 1
    return current_id
