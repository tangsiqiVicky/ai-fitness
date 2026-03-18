/*
 Navicat Premium Data Transfer

 Source Server         : AI-fitness
 Source Server Type    : MySQL
 Source Server Version : 50744 (5.7.44)
 Source Host           : 1.95.204.246:3306
 Source Schema         : work_out

 Target Server Type    : MySQL
 Target Server Version : 50744 (5.7.44)
 File Encoding         : 65001

 Date: 20/04/2025 14:52:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user_clock
-- ----------------------------
DROP TABLE IF EXISTS `user_clock`;
CREATE TABLE `user_clock`  (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `user_id` int(20) NULL DEFAULT NULL COMMENT '用户id',
  `data` datetime NULL DEFAULT NULL COMMENT '打卡时间',
  `create_by` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '更新人',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '用户打卡信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_clock
-- ----------------------------

-- ----------------------------
-- Table structure for user_date
-- ----------------------------
DROP TABLE IF EXISTS `user_date`;
CREATE TABLE `user_date`  (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `user_id` int(20) NULL DEFAULT NULL COMMENT '用户id',
  `course_id` int(20) NULL DEFAULT NULL COMMENT '课程id',
  `title` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '标题',
  `source` int(3) NULL DEFAULT NULL COMMENT '分数',
  `analysis` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '分析',
  `action_analyse` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '动作分析',
  `advice` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '建议',
  `group` int(3) NULL DEFAULT NULL COMMENT '组数',
  `number` int(5) NULL DEFAULT NULL COMMENT '个数',
  `create_by` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '更新人',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `batch_no` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '批次号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '用户分数信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_date
-- ----------------------------
INSERT INTO `user_date` VALUES (1, 1, '测试训练', 0, '测试分析', NULL, '测试建议', 0, 1, 'test', '2025-04-14 11:25:14', 'test', '2025-04-14 11:25:14');
INSERT INTO `user_date` VALUES (3, 1, '测试训练', 0, '测试分析', NULL, '测试建议', 0, 1, 'test', '2025-04-14 11:25:14', 'test', '2025-04-14 11:25:14');
INSERT INTO `user_date` VALUES (4, 888, '测试训练', 0, '测试分析', NULL, '测试建议', 0, 1, 'test', '2025-04-14 11:25:14', 'test', '2025-04-14 11:25:14');
INSERT INTO `user_date` VALUES (5, 999, '测试训练', 0, '测试分析', NULL, '测试建议', 0, 1, 'test', '2025-04-14 11:25:14', 'test', '2025-04-14 11:25:14');
INSERT INTO `user_date` VALUES (6, 1, '测试训练', 0, '测试分析', NULL, '测试建议', 0, 1, 'test', '2025-04-14 11:25:15', 'test', '2025-04-14 11:25:15');
INSERT INTO `user_date` VALUES (7, 1, '测试训练', 0, '测试分析', NULL, '测试建议', 0, 1, 'test', '2025-04-14 11:31:24', 'test', '2025-04-14 11:31:24');
INSERT INTO `user_date` VALUES (9, 1, '测试训练', 0, '测试分析', NULL, '测试建议', 0, 1, 'test', '2025-04-14 11:31:24', 'test', '2025-04-14 11:31:24');
INSERT INTO `user_date` VALUES (10, 888, '测试训练', 0, '测试分析', NULL, '测试建议', 0, 1, 'test', '2025-04-14 11:31:25', 'test', '2025-04-14 11:31:25');
INSERT INTO `user_date` VALUES (11, 999, '测试训练', 0, '测试分析', NULL, '测试建议', 0, 1, 'test', '2025-04-14 11:31:25', 'test', '2025-04-14 11:31:25');
INSERT INTO `user_date` VALUES (12, 1, '测试训练', 0, '测试分析', NULL, '测试建议', 0, 1, 'test', '2025-04-14 11:31:25', 'test', '2025-04-14 11:31:25');
INSERT INTO `user_date` VALUES (13, 1, '测试训练', 0, '测试分析', NULL, '测试建议', 0, 1, 'test', '2025-04-14 11:33:14', 'test', '2025-04-14 11:33:14');
INSERT INTO `user_date` VALUES (15, 1, '测试训练', 0, '测试分析', NULL, '测试建议', 0, 1, 'test', '2025-04-14 11:33:14', 'test', '2025-04-14 11:33:14');
INSERT INTO `user_date` VALUES (16, 888, '测试训练', 0, '测试分析', NULL, '测试建议', 0, 1, 'test', '2025-04-14 11:33:14', 'test', '2025-04-14 11:33:14');
INSERT INTO `user_date` VALUES (17, 999, '测试训练', 0, '测试分析', NULL, '测试建议', 0, 1, 'test', '2025-04-14 11:33:14', 'test', '2025-04-14 11:33:14');
INSERT INTO `user_date` VALUES (18, 1, '测试训练', 0, '测试分析', NULL, '测试建议', 0, 1, 'test', '2025-04-14 11:33:14', 'test', '2025-04-14 11:33:14');
INSERT INTO `user_date` VALUES (19, 0, '哑铃弯举', 89, '您的哑铃弯举动作整体表现良好，但在肘关节稳定性和动作幅度方面有小幅提升空间。', NULL, '尝试减少肘关节的初始弯曲角度，保持在10-15度之间\n可以在动作顶点位置稍作停顿，增强肱二头肌的峰值收缩\n注意控制下放哑铃的速度，延长离心阶段时间', 1, 1, '0', '2025-04-18 15:09:02', NULL, '2025-04-18 15:09:02');
INSERT INTO `user_date` VALUES (20, 6, '哑铃弯举', 85, '您的动作完成度良好，但在上臂稳定性和动作控制方面有待改进。', NULL, '建议减少肘关节的初始弯曲角度，保持在10-15度之间\n加强核心训练，提高整体稳定性\n可以考虑减少重量，先专注于完美的动作形式', 1, 1, '6', '2025-04-18 15:14:04', NULL, '2025-04-18 15:14:04');
INSERT INTO `user_date` VALUES (21, 6, '哑铃弯举', 89, '您的哑铃弯举动作整体表现良好，但在肘关节稳定性和动作幅度方面有小幅提升空间。', NULL, '尝试减少肘关节的初始弯曲角度，保持在10-15度之间\n可以在动作顶点位置稍作停顿，增强肱二头肌的峰值收缩\n注意控制下放哑铃的速度，延长离心阶段时间', 1, 2, '6', '2025-04-18 15:32:53', NULL, '2025-04-18 15:32:53');
INSERT INTO `user_date` VALUES (22, 6, '哑铃上斜卧推', 92, '您的动作整体完成度很高，姿势标准，但在部分细节方面仍有提升空间。', '肩关节外展角度适中: 您的肩关节外展角度保持在理想的85度左右，这有助于充分激活胸肌并减少肩部压力。\n肘关节弯曲角度合适: 在动作过程中，您的肘关节弯曲角度保持在标准的90度左右，有效地参与了胸肌的发力。\n核心稳定性良好: 您在整个动作过程中保持了良好的核心稳定性，这有助于提高动作的安全性和有效性。', '可以尝试控制更慢的离心阶段(下放哑铃的过程)，以增加肌肉的时间张力\n注意保持肩胛骨的稳定，避免在推举过程中肩膀耸起\n建议每组之间休息60-90秒，以确保充分恢复', 1, 1, '6', '2025-04-18 15:49:20', NULL, '2025-04-18 15:49:20');

-- ----------------------------
-- Table structure for user_discussion
-- ----------------------------
DROP TABLE IF EXISTS `user_discussion`;
CREATE TABLE `user_discussion`  (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `title` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '讨论标题',
  `content` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '讨论内容',
  `image_path` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '图标',
  `create_by` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '更新人',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NULL DEFAULT NULL COMMENT '是否逻辑删除 0否，1是',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '论坛信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_discussion
-- ----------------------------
INSERT INTO `user_discussion` VALUES (2, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/1老刘_2024-05-02_13-44-35背景.png', 'test_unit', '2025-04-13 14:01:42', NULL, '2025-04-13 14:01:42', 0);
INSERT INTO `user_discussion` VALUES (3, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/1老刘_2024-05-02_14-40-02背景.png', '1', '2025-04-13 13:37:31', NULL, '2025-04-13 13:37:31', 0);
INSERT INTO `user_discussion` VALUES (4, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/1老刘_2024-05-02_15-30-38登录背景.jpg', '1', '2025-04-13 13:50:57', NULL, '2025-04-13 13:50:57', 0);
INSERT INTO `user_discussion` VALUES (5, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/1李建立666_2024-05-02_16-33-08cc563448_E779265_2dcaf48f.jpg', '1', '2025-04-13 13:52:01', NULL, '2025-04-13 13:52:01', 0);
INSERT INTO `user_discussion` VALUES (6, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/1李建立666_2024-05-03_12-00-54下载2.png', '1', '2025-04-13 13:52:01', NULL, '2025-04-13 13:52:01', 0);
INSERT INTO `user_discussion` VALUES (7, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/1李建立666_2024-05-03_13-22-55书.jpg', '1', '2025-04-13 13:56:09', NULL, '2025-04-13 13:56:09', 0);
INSERT INTO `user_discussion` VALUES (8, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/1李建立666_2024-05-06_07-57-19cc563448_E779265_2dcaf48f.jpg', '1', '2025-04-13 13:56:34', NULL, '2025-04-13 13:56:34', 0);
INSERT INTO `user_discussion` VALUES (9, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/1李建立666_2024-05-06_07-57-47下载2.png', '1', '2025-04-13 13:58:18', NULL, '2025-04-13 13:58:18', 0);
INSERT INTO `user_discussion` VALUES (10, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/2老刘_2024-05-04_17-29-51下载2.png', '1', '2025-04-13 13:59:36', NULL, '2025-04-13 13:59:36', 0);
INSERT INTO `user_discussion` VALUES (11, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/', '1', '2025-04-13 14:00:21', NULL, '2025-04-13 14:00:21', 0);
INSERT INTO `user_discussion` VALUES (12, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/', '1', '2025-04-13 14:01:42', NULL, '2025-04-13 14:01:42', 0);
INSERT INTO `user_discussion` VALUES (13, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/', '1', '2025-04-13 14:06:34', NULL, '2025-04-13 14:06:34', 0);
INSERT INTO `user_discussion` VALUES (14, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/', '1', '2025-04-13 14:06:52', NULL, '2025-04-13 14:06:52', 0);
INSERT INTO `user_discussion` VALUES (15, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/', '1', '2025-04-13 14:12:38', NULL, '2025-04-13 14:12:38', 0);
INSERT INTO `user_discussion` VALUES (16, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/', '1', '2025-04-13 14:12:38', NULL, '2025-04-13 14:12:38', 0);
INSERT INTO `user_discussion` VALUES (17, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/', '1', '2025-04-13 14:13:13', NULL, '2025-04-13 14:13:13', 0);
INSERT INTO `user_discussion` VALUES (18, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/', '1', '2025-04-13 14:13:13', NULL, '2025-04-13 14:13:13', 0);
INSERT INTO `user_discussion` VALUES (19, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/', '1', '2025-04-14 11:25:13', NULL, '2025-04-14 11:25:13', 0);
INSERT INTO `user_discussion` VALUES (20, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/', '1', '2025-04-14 11:31:24', NULL, '2025-04-14 11:31:24', 0);
INSERT INTO `user_discussion` VALUES (21, '如何康训', '1.坚持打卡 ， 2.坚持锻炼', 'images/', '1', '2025-04-14 11:33:14', NULL, '2025-04-14 11:33:14', 0);
INSERT INTO `user_discussion` VALUES (22, '如何康训', '1.坚持打卡', 'images/', '1', '2025-04-14 19:57:25', NULL, '2025-04-14 19:57:25', 0);
INSERT INTO `user_discussion` VALUES (23, 'Test Title', 'Test content', 'images/1老刘_2024-05-02_13-44-35背景.png', '1', '2025-04-15 14:40:16', NULL, '2025-04-15 14:40:16', 0);
INSERT INTO `user_discussion` VALUES (24, 'title', 'hello world', 'images/', '3', '2025-04-16 18:57:28', '3', '2025-04-16 18:57:28', 0);

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info`  (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `weight` decimal(10, 5) NOT NULL COMMENT '体重，kg',
  `height` decimal(10, 5) NULL DEFAULT NULL COMMENT '身高，m',
  `user_name` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '用户名称/账号',
  `nick_name` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '昵称',
  `email` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '手机号',
  `password` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '密码',
  `sex` tinyint(1) NULL DEFAULT NULL COMMENT '性别 0女 1男',
  `avatar` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '头像',
  `status` tinyint(1) NULL DEFAULT NULL COMMENT '状态 0禁用 1启用',
  `introduce` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '个人介绍',
  `ext_json` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '特殊字段',
  `create_by` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `updat_by` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '更新人',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NULL DEFAULT NULL COMMENT '是否逻辑删除 0否 1是',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '用户信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_info
-- ----------------------------
INSERT INTO `user_info` VALUES (1, 0.00000, NULL, 'Botter', NULL, NULL, NULL, '123456', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0);
INSERT INTO `user_info` VALUES (2, 0.00000, NULL, 'Test', NULL, '3333@xxx.com', NULL, '123456', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0);
INSERT INTO `user_info` VALUES (3, 0.00000, NULL, 'bulusi', NULL, 'bulusi@li.com', NULL, '123456', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-17 13:35:18', 0);
INSERT INTO `user_info` VALUES (4, 0.00000, NULL, 'qqq', NULL, 'qqq@q.com', NULL, 'qqq123456', NULL, NULL, 1, NULL, NULL, NULL, '2025-04-17 15:25:47', NULL, '2025-04-17 15:25:47', 0);
INSERT INTO `user_info` VALUES (5, 0.00000, NULL, 'testuser', NULL, 'alsas@c.com', NULL, 'test1234', NULL, NULL, 1, NULL, NULL, NULL, '2025-04-17 15:33:34', NULL, '2025-04-17 15:33:34', 0);
INSERT INTO `user_info` VALUES (6, 0.00000, NULL, '212dd', NULL, 'dwqw@c.com', NULL, 'sacassac21', NULL, NULL, 1, NULL, NULL, NULL, '2025-04-17 16:36:59', NULL, '2025-04-17 16:36:59', 0);

-- ----------------------------
-- Table structure for user_mapping
-- ----------------------------
DROP TABLE IF EXISTS `user_mapping`;
CREATE TABLE `user_mapping`  (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `user_id` int(20) NULL DEFAULT NULL COMMENT '用户id',
  `discuss_id` int(20) NULL DEFAULT NULL COMMENT '论坛id',
  `create_by` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '更新人',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NULL DEFAULT NULL COMMENT '是否逻辑删除 0否，1是',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '用户关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_mapping
-- ----------------------------
INSERT INTO `user_mapping` VALUES (1, 3, 24, '3', '2025-04-16 18:57:29', '3', '2025-04-16 18:57:29', 0);

-- ----------------------------
-- Table structure for user_plan
-- ----------------------------
DROP TABLE IF EXISTS `user_plan`;
CREATE TABLE `user_plan`  (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `user_id` int(20) NULL DEFAULT NULL COMMENT '用户id',
  `plan` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '用户计划完成目标',
  `context` varchar(2000) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '实际完成的目标',
  `create_by` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '更新人',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(2) NULL DEFAULT NULL COMMENT '是否逻辑删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '用户计划表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_plan
-- ----------------------------
INSERT INTO `user_plan` VALUES (1, 1, 'test_plan', 'test_context', 'test', '2025-04-14 11:31:09', 'test', '2025-04-14 11:31:09', 0);
INSERT INTO `user_plan` VALUES (2, 1, 'test_plan', 'test_context', 'test', '2025-04-14 11:31:26', 'test', '2025-04-14 11:31:26', 0);
INSERT INTO `user_plan` VALUES (4, 888, 'test_plan', 'test_context', 'test', '2025-04-14 11:31:26', 'test', '2025-04-14 11:31:26', 0);
INSERT INTO `user_plan` VALUES (5, 1, 'test_plan', 'test_context', 'test', '2025-04-14 11:31:26', 'test', '2025-04-14 11:31:26', 0);
INSERT INTO `user_plan` VALUES (6, 999, 'test_plan', 'test_context', 'test', '2025-04-14 11:31:26', 'test', '2025-04-14 11:31:26', 0);
INSERT INTO `user_plan` VALUES (7, 1, 'test_plan', 'test_context', 'test', '2025-04-14 11:31:26', 'test', '2025-04-14 11:31:26', 0);
INSERT INTO `user_plan` VALUES (8, 1, 'test_plan', 'test_context', 'test', '2025-04-14 11:33:15', 'test', '2025-04-14 11:33:15', 0);
INSERT INTO `user_plan` VALUES (10, 888, 'test_plan', 'test_context', 'test', '2025-04-14 11:33:15', 'test', '2025-04-14 11:33:15', 0);
INSERT INTO `user_plan` VALUES (11, 1, 'test_plan', 'test_context', 'test', '2025-04-14 11:33:15', 'test', '2025-04-14 11:33:15', 0);
INSERT INTO `user_plan` VALUES (12, 999, 'test_plan', 'test_context', 'test', '2025-04-14 11:33:16', 'test', '2025-04-14 11:33:16', 0);
INSERT INTO `user_plan` VALUES (13, 1, 'test_plan', 'test_context', 'test', '2025-04-14 11:33:16', 'test', '2025-04-14 11:33:16', 0);

-- ----------------------------
-- Table structure for user_plan_date_mapping
-- ----------------------------
DROP TABLE IF EXISTS `user_plan_date_mapping`;
CREATE TABLE `user_plan_date_mapping`  (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `data_id` int(20) NULL DEFAULT NULL COMMENT '数据id',
  `plan_id` int(20) NULL DEFAULT NULL COMMENT '计划id',
  `create_by` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '更新人',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '用户计划数据关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_plan_date_mapping
-- ----------------------------

-- ----------------------------
-- Table structure for user_topic
-- ----------------------------
DROP TABLE IF EXISTS `user_topic`;
CREATE TABLE `user_topic`  (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `parent_id` int(20) NULL DEFAULT NULL COMMENT '回复的评论',
  `discussion_id` int(20) NULL DEFAULT NULL COMMENT '隶属于哪个论坛',
  `create_by` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '创建人',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '更新人',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci COMMENT = '用户论坛回复表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_topic
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
-- work_out.user_plan definition

DROP TABLE IF EXISTS `user_plan_detail`;
CREATE TABLE `user_plan_detail` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `parent_id` int(20) NOT NULL COMMENT '父级id',
  `user_id` int(20) DEFAULT NULL COMMENT '用户id',
  `plan` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '用户计划完成目标',
  `context` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '完成的目标明细',
  `create_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `plan_time` datetime DEFAULT NULL COMMENT '计划实施时间',
  `plan_day` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '计划实施时间周几',
  `update_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(2) DEFAULT NULL COMMENT '是否逻辑删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='用户计划表明细';


DROP TABLE IF EXISTS `course_theme`;
CREATE TABLE `course_theme` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `theme_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '名称',
  `theme_code` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '编码',
  `indications` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '适用病症',
  `rehabilitation_goal` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '康复目标',
  `training_frequency` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '训练运动频率',
  `training_action` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '训练运动',
  `create_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(2) DEFAULT NULL COMMENT '是否逻辑删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='课程主题表';


DROP TABLE IF EXISTS `course`;
CREATE TABLE `course` (
  `course_id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `theme_id` int(20)  COMMENT '主题id',
  `name` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '课程名称',
  `code` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '编码',
  `level` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '等级',
  `brife_introduction` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '课程简介',
  `video_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '视频地址',
  `img_url` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '图片地址',
  `course_desc` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '课程描述',
  `course_action` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '当前动作',
  `duration` int(4) DEFAULT NULL COMMENT '课程时长',
  `groups_count` int(4) DEFAULT NULL COMMENT '训练组数',
  `actions_count` int(4) DEFAULT NULL COMMENT '每组次数',
  `is_show_index` int(2) DEFAULT NULL COMMENT '是否首頁展示',
  `create_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(2) DEFAULT NULL COMMENT '是否逻辑删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='课程表';



DROP TABLE IF EXISTS `course_training_record`;
CREATE TABLE `course_training_record` (
  `record_id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `course_id` int(20)  COMMENT '课程Id',
  `user_id` int(20) DEFAULT NULL COMMENT '用户id',
  `action_points_code` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '动作指标编码',
  `action_points_value` double DEFAULT NULL COMMENT '动作值',
  `groups_num` int(4) DEFAULT NULL COMMENT '训练组数',
  `actions_num` int(4) DEFAULT NULL COMMENT '每组次数',
  `start_time` datetime DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `batch_no` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '批次号',
  PRIMARY KEY (`record_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='课程训练记录';

DROP TABLE IF EXISTS `course_action_points`;
CREATE TABLE `course_action_points` (
  `action_points_id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `course_id` int(20)  COMMENT '主题id',
  `action_points` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '动作要点',
  PRIMARY KEY (`action_points_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='课程动作要点';

DROP TABLE IF EXISTS `course_action_indicator`;
CREATE TABLE `course_action_indicator` (
  `action_indicator_id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `course_id` int(20)  COMMENT '主题id',
  `action_points` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '动作指标名称',
  `action_points_code` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '动作指标编码',
  `point1` int(20) DEFAULT NULL COMMENT '部位点-计算夹角1',
  `point2` int(20) DEFAULT NULL COMMENT '部位点-计算夹角顶点',
  `point3` int(20) DEFAULT NULL COMMENT '部位点-计算夹角2',
  `standard_value` double DEFAULT NULL COMMENT '标准值',
  `start_value` double DEFAULT NULL COMMENT '初始值',
  `end_value` double DEFAULT NULL COMMENT '结束值',
  PRIMARY KEY (`action_indicator_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='课程动作指标';

DROP TABLE IF EXISTS `course_action_comment`;
CREATE TABLE `course_action_comment` (
  `action_comment_id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `course_id` int(20)  COMMENT '课程id',
  `indicator_id` int(20)  COMMENT '指标id',
  `less_or_more` int(20)  COMMENT '大于或小于',
  `standard_value` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '标准值',
  `action_comment_title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '动作指标名称',
  `action_comment_desc` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '动作指标评价',
  `suggestions` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '动作指标建议',
  PRIMARY KEY (`action_points_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='课程动作评价';


DROP TABLE IF EXISTS `question`;
CREATE TABLE `question` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `question_desc` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '问题描述',
  `create_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(2) DEFAULT NULL COMMENT '是否逻辑删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='问题表';


DROP TABLE IF EXISTS `user_question_answer`;
CREATE TABLE `user_question_answer` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `question_id` int(20) NOT NULL COMMENT '主键id',
  `question_answer` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '问题回答',
  `user_id` int(20) DEFAULT NULL COMMENT '用户id',
  `create_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(2) DEFAULT NULL COMMENT '是否逻辑删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='问题回答表';


DROP TABLE IF EXISTS `plan_detail_course`;
CREATE TABLE `plan_detail_course` (
  `plan_dtl_course_id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `course_id` int(20)  COMMENT '课程Id',
  `plan_dtl_id` int(20) DEFAULT NULL COMMENT '计划详情id',
  `create_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`plan_dtl_course_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='计划课程关联表';

DROP TABLE IF EXISTS `nutrition_guidance_template`;
CREATE TABLE `nutrition_guidance_template` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `guidance_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '名称',
  `template_code` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '模板编码',
  `template_desc` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '模板描述',
  `theme_id` int(20) DEFAULT NULL COMMENT '康复主题',
  `create_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(2) DEFAULT NULL COMMENT '是否逻辑删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='营养指导模板表';

DROP TABLE IF EXISTS `nutrition_guidance_detail`;
CREATE TABLE `nutrition_guidance_detail` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `template_id` int(20)  COMMENT '模板Id',
  `type_code` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '类型编码：T01-营养摄入量建议；T02-饮食建议',
  `item_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '项目名称',
  `item_value` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '项目明细',
  `create_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(2) DEFAULT NULL COMMENT '是否逻辑删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='营养指导明细模板表';

DROP TABLE IF EXISTS `user_nutrition_guidance`;
CREATE TABLE `user_nutrition_guidance` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `guidance_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '名称',
  `template_code` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '模板编码',
  `guidance_desc` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '模板描述',
  `theme_id` int(20) DEFAULT NULL COMMENT '康复主题',
  `create_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(2) DEFAULT NULL COMMENT '是否逻辑删除',
  `user_id` int(20) DEFAULT NULL COMMENT '用户id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='用户营养指导表';

DROP TABLE IF EXISTS `user_nutrition_guidance_detail`;
CREATE TABLE `user_nutrition_guidance_detail` (
  `id` int(20) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `nutrition_guidance_id` int(20)  COMMENT '指导Id',
  `type_code` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '类型编码：T01-营养摄入量建议；T02-饮食建议',
  `item_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '项目名称',
  `item_value` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '项目明细',
  `create_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(2) DEFAULT NULL COMMENT '是否逻辑删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='用户营养指导明细表';
