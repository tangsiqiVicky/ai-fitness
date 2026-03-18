// 姿态识别训练侧边栏功能
document.addEventListener('DOMContentLoaded', function() {
    const demoVideo = document.getElementById('demoVideo');
    const cameraFeed = document.getElementById('cameraFeed');
    const stopBtn = document.getElementById('stopBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    const statusText = document.getElementById('statusText');
    const trainingTimeEl = document.getElementById('trainingTime');
    const setsCounter = document.getElementById('remainingSets');
    const repsCounter = document.getElementById('remainingReps');
    const poseTimer = document.getElementById('pose-timer');
    const poseTimerText = document.getElementById('pose-timer-text');
    const course_id = document.getElementById('course_id');

    // 训练变量
    let totalSets = 0;
    let totalReps = 0;
    let currentSets = 0;
    let currentReps = 0;
    let isTraining = false;
    let isResting = false;
    let restTimer = null;
    let restSeconds = 0;
    let records = [];

    // MediaPipe 相关变量
    let webcamElement;
    let canvasElement;
    let pose;
    let camera;
    let exerciseType = '';

    let startTime = Date.now();
    let timerInterval;

    // 优化算法相关变量
    let lastFrameTime = 0;
    let frameCount = 0;
    let fps = 0;
    let samplingRate = 1;
    let landmarkHistory = [];
    let imuData = null; // 模拟IMU数据
    let lightingCondition = 1.0; // 默认光照条件良好
    let motionSpeed = 0.5; // 默认中等速度

    let start_time = null;
    let end_time = null;
    let batch_no = null;
    // 关节三元组定义 - 用于角度计算
    const JOINT_TRIPLETS = {
        'right_elbow': [12, 14, 16], // 右肩-右肘-右腕
        'left_elbow': [11, 13, 15],  // 左肩-左肘-左腕
        'right_shoulder': [24, 12, 14], // 右髋-右肩-右肘
        'left_shoulder': [23, 11, 13],  // 左髋-左肩-左肘
        'right_knee': [24, 26, 28],  // 右髋-右膝-右踝
        'left_knee': [23, 25, 27]    // 左髋-左膝-左踝
    };
    // 平滑度阈值常量
    const SMOOTHNESS_THRESHOLD = 0.1;
    // 开始摄像头
    async function startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            cameraFeed.srcObject = stream;
        } catch (err) {
            console.error('无法访问摄像头:', err);
        }
    }

    // 更新计时器
    function updateTimer() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        trainingTimeEl.textContent = minutes + ':' + seconds;
    }

    // 开始训练
    function startTraining() {
        // 获取用户设置的组数和每组次数
        totalSets = parseInt(document.getElementById('remainingSets').textContent) || 3;
        totalReps = parseInt(document.getElementById('remainingReps').textContent) || 12;

        // 获取当前动作名称
        exerciseType = document.getElementById('currentExercise').textContent;

        batch_no = generateSimpleUUID();

        // 初始化当前训练状态
        currentSets = totalSets;
        currentReps = totalReps;

        // 更新UI
        setsCounter.textContent = currentSets;
        repsCounter.textContent = currentReps;
        statusText.textContent = "准备开始...";
        
        // 初始化姿态识别
        initPoseDetection();

        isTraining = true;
        camera.start();
        demoVideo.play();
        timerInterval = setInterval(updateTimer, 1000);
//        startCamera();
    }
// 初始化姿态识别
    function initPoseDetection() {
        webcamElement = document.getElementById('cameraFeed');
        canvasElement = document.getElementById('pose-output-canvas');

        // 初始化 MediaPipe Pose 并应用优化配置
        pose = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
        });

        // 应用优化的姿态检测配置
        pose.setOptions({
            modelComplexity: 1,  // 使用中等复杂度模型平衡性能与精度
            smoothLandmarks: true,  // 启用平滑处理减少抖动
            enableSegmentation: false,  // 关闭分割功能节省计算资源
            smoothSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        pose.onResults(onPoseResults);

        // 设置相机
        camera = new Camera(webcamElement, {
            onFrame: async () => {
                if (isTraining && !isResting) {
                    // 计算当前FPS
                    const now = performance.now();
                    if (lastFrameTime) {
                        const delta = now - lastFrameTime;
                        frameCount++;

                        if (frameCount >= 10) {
                            fps = 1000 / (delta / frameCount);
                            frameCount = 0;

                            // 更新自适应采样率
                            samplingRate = adaptiveSamplingRate(fps);
                        }
                    }
                    lastFrameTime = now;

                    // 根据采样率决定是否处理当前帧
                    if (frameCount % Math.round(samplingRate) === 0) {
                        await pose.send({image: webcamElement});
                    }
                }
            },
            width: 640,
            height: 480
        });
    }

    // 自适应采样率控制
    function adaptiveSamplingRate(fps) {
        if (fps < 15) {
            return 2; // 低帧率环境下降低采样频率
        } else if (fps > 30) {
            return 1; // 高帧率环境下提高采样精度
        }
        return 1.5; // 默认采样率
    }

    // 处理姿态检测结果
    function onPoseResults(results) {
        // 调整画布大小
        canvasElement.width = webcamElement.videoWidth;
        canvasElement.height = webcamElement.videoHeight;

        const canvasCtx = canvasElement.getContext('2d');

        // 清除画布
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        // 绘制摄像头画面
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

        // 如果检测到姿态，绘制骨架并分析动作
        if (results.poseLandmarks) {
            // 绘制骨架
            drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {color: '#00FF00', lineWidth: 4});
            drawLandmarks(canvasCtx, results.poseLandmarks, {color: '#FF0000', lineWidth: 2, radius: 6});

            // 保存关键点历史数据用于轨迹分析
            landmarkHistory.push(results.poseLandmarks);
            if (landmarkHistory.length > 30) { // 保留最近30帧
                landmarkHistory.shift();
            }

            // 估计当前光照条件和动作速度
            estimateEnvironmentConditions(results.poseLandmarks);

            // 生成模拟IMU数据
            simulateIMUData(results.poseLandmarks);

            // 应用双通道数据融合
            const fusedData = adaptiveSensorFusion(
                convertToVisualData(results.poseLandmarks),
                imuData,
                lightingCondition,
                motionSpeed
            );

            // 提取关键点并分析动作
            const keypoints = extractKeypoints(results.poseLandmarks, canvasElement);

            // 计算关节角度
            const jointAngles = calculateJointAngles(results.poseLandmarks);

            // 分析轨迹平滑度
            const smoothnessScores = analyzeTrajectorySmoothnessJS(landmarkHistory, [0, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]);

            // 增强版动作分析
            const result = analyzeExerciseEnhanced(keypoints, exerciseType, jointAngles, smoothnessScores, fusedData);

            // 如果完成一次动作
            if (result.counter > 0) {
                result.actions_data.forEach(action => {
                    records[records.length] = {
                        'action_points_code': action.code,
                        'action_points_value': action.value,
                        'actions_num': totalReps - currentReps +1,
                        'groups_num': totalSets - currentSets +1,
                        'course_id': course_id.value,
                        'start_time': start_time,
                        'end_time': end_time,
                        'batch_no': batch_no
                    };
                });

                currentReps--;
                repsCounter.textContent = currentReps;
            }

            // 更新指导文本
            if (result.guideText) {
                statusText.textContent = result.guideText;
            }
            // 检查是否完成当前组
            if (currentReps <= 0) {
                completeSet();
            }
        }
    }
    // 估计环境条件
    function estimateEnvironmentConditions(landmarks) {
        // 估计光照条件 - 基于关键点检测的置信度
        let avgConfidence = 0;
        for (let i = 0; i < landmarks.length; i++) {
            avgConfidence += landmarks[i].visibility || 0;
        }
        avgConfidence /= landmarks.length;
        lightingCondition = Math.max(0.3, Math.min(1.0, avgConfidence * 1.2)); // 映射到0.3-1.0范围

        // 估计动作速度 - 基于关键点位置变化
        if (landmarkHistory.length > 1) {
            const prevFrame = landmarkHistory[landmarkHistory.length - 2];
            let totalMovement = 0;
            for (let i = 0; i < landmarks.length; i++) {
                if (prevFrame[i]) {
                    const dx = landmarks[i].x - prevFrame[i].x;
                    const dy = landmarks[i].y - prevFrame[i].y;
                    const dz = (landmarks[i].z || 0) - (prevFrame[i].z || 0);
                    totalMovement += Math.sqrt(dx*dx + dy*dy + dz*dz);
                }
            }
            motionSpeed = Math.min(1.0, totalMovement * 50); // 映射到0-1范围
        }
    }
    // 模拟IMU数据
    function simulateIMUData(landmarks) {
        // 在实际应用中，这里会从真实IMU传感器获取数据
        // 这里我们基于视觉数据模拟IMU数据
        imuData = {};
        const keyJoints = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]; // 关键关节索引

        for (let i = 0; i < keyJoints.length; i++) {
            const idx = keyJoints[i];
            if (landmarks[idx]) {
                // 添加一些随机噪声模拟IMU数据
                const noiseLevel = 0.01 * (1 - lightingCondition); // 光线越差，噪声越大
                imuData[idx] = {
                    position: {
                        x: landmarks[idx].x + (Math.random() * 2 - 1) * noiseLevel,
                        y: landmarks[idx].y + (Math.random() * 2 - 1) * noiseLevel,
                        z: (landmarks[idx].z || 0) + (Math.random() * 2 - 1) * noiseLevel
                    },
                    rotation: {
                        x: Math.random() * 360,
                        y: Math.random() * 360,
                        z: Math.random() * 360
                    }
                };
            }
        }
    }

    // 将MediaPipe关键点转换为视觉数据格式
    function convertToVisualData(landmarks) {
        const visualData = {};
        for (let i = 0; i < landmarks.length; i++) {
            visualData[i] = {
                position: {
                    x: landmarks[i].x,
                    y: landmarks[i].y,
                    z: landmarks[i].z || 0
                },
                rotation: {
                    x: 0, // MediaPipe不直接提供旋转数据
                    y: 0,
                    z: 0
                }
            };
        }
        return visualData;
    }

    // 自适应传感器融合算法
    function adaptiveSensorFusion(visualData, imuData, lightingCondition, motionSpeed) {
        // 基础权重设置
        let baseVisualWeight = 0.7;
        let baseImuWeight = 0.3;

        // 根据光照条件调整权重
        // 光线不足时降低视觉权重，增加IMU权重
        let visualWeight = baseVisualWeight * lightingCondition;
        let imuWeight = baseImuWeight + (baseVisualWeight - visualWeight);

        // 根据动作速度进一步调整
        // 快速动作中IMU响应更快，增加其权重
        if (motionSpeed > 0.7) { // 快速动作
            visualWeight *= 0.8;
            imuWeight = 1 - visualWeight;
        }

        // 确保权重总和为1
        const totalWeight = visualWeight + imuWeight;
        visualWeight /= totalWeight;
        imuWeight /= totalWeight;

        // 加权融合数据
        const fusedData = {};
        for (const joint in visualData) {
            if (imuData && imuData[joint]) {
                fusedData[joint] = {
                    position: {
                        x: visualData[joint].position.x * visualWeight + imuData[joint].position.x * imuWeight,
                        y: visualData[joint].position.y * visualWeight + imuData[joint].position.y * imuWeight,
                        z: visualData[joint].position.z * visualWeight + imuData[joint].position.z * imuWeight
                    },
                    rotation: {
                        x: visualData[joint].rotation.x * visualWeight + imuData[joint].rotation.x * imuWeight,
                        y: visualData[joint].rotation.y * visualWeight + imuData[joint].rotation.y * imuWeight,
                        z: visualData[joint].rotation.z * visualWeight + imuData[joint].rotation.z * imuWeight
                    }
                };
            } else {
                fusedData[joint] = visualData[joint];
            }
        }

        return fusedData;
    }

    // 计算关节角度 - 使用四元数方法
    function calculateJointAngles(landmarks) {
        const angles = {};

        for (const [joint, [p1, p2, p3]] of Object.entries(JOINT_TRIPLETS)) {
            if (landmarks[p1] && landmarks[p2] && landmarks[p3]) {
                // 计算向量
                const v1 = [
                    landmarks[p1].x - landmarks[p2].x,
                    landmarks[p1].y - landmarks[p2].y,
                    (landmarks[p1].z || 0) - (landmarks[p2].z || 0)
                ];

                const v2 = [
                    landmarks[p3].x - landmarks[p2].x,
                    landmarks[p3].y - landmarks[p2].y,
                    (landmarks[p3].z || 0) - (landmarks[p2].z || 0)
                ];

                // 归一化向量
                const v1Mag = Math.sqrt(v1[0]*v1[0] + v1[1]*v1[1] + v1[2]*v1[2]);
                const v2Mag = Math.sqrt(v2[0]*v2[0] + v2[1]*v2[1] + v2[2]*v2[2]);

                if (v1Mag > 0 && v2Mag > 0) {
                    const v1Norm = [v1[0]/v1Mag, v1[1]/v1Mag, v1[2]/v1Mag];
                    const v2Norm = [v2[0]/v2Mag, v2[1]/v2Mag, v2[2]/v2Mag];

                    // 计算点积
                    const dotProduct = v1Norm[0]*v2Norm[0] + v1Norm[1]*v2Norm[1] + v1Norm[2]*v2Norm[2];

                    // 计算角度（弧度）并转换为度数
                    const angle = Math.acos(Math.max(-1, Math.min(1, dotProduct)));
                    angles[joint] = angle * 180 / Math.PI;
                }
            }
        }

        return angles;
    }

    // 分析轨迹平滑度
    function analyzeTrajectorySmoothnessJS(landmarkHistory, keyPoints) {
        const smoothnessScores = {};

        for (const point of keyPoints) {
            // 提取特定关键点的历史轨迹
            const trajectory = [];
            for (const frame of landmarkHistory) {
                if (frame[point]) {
                    trajectory.push([
                        frame[point].x,
                        frame[point].y,
                        frame[point].z || 0
                    ]);
                }
            }

            // 计算轨迹曲率变化
            if (trajectory.length > 3) {
                // 计算一阶导数(速度)
                const velocity = [];
                for (let i = 1; i < trajectory.length; i++) {
                    velocity.push([
                        trajectory[i][0] - trajectory[i-1][0],
                        trajectory[i][1] - trajectory[i-1][1],
                        trajectory[i][2] - trajectory[i-1][2]
                    ]);
                }

                // 计算二阶导数(加速度)
                const acceleration = [];
                for (let i = 1; i < velocity.length; i++) {
                    acceleration.push([
                        velocity[i][0] - velocity[i-1][0],
                        velocity[i][1] - velocity[i-1][1],
                        velocity[i][2] - velocity[i-1][2]
                    ]);
                }

                // 计算加速度变化率作为平滑度指标
                const jerk = [];
                for (const acc of acceleration) {
                    jerk.push(Math.sqrt(acc[0]*acc[0] + acc[1]*acc[1] + acc[2]*acc[2]));
                }

                // 平滑度得分计算 (归一化到0-100)
                const jerkMean = jerk.reduce((sum, val) => sum + val, 0) / jerk.length;
                const smoothness = 100 * (1 - Math.min(1.0, jerkMean / SMOOTHNESS_THRESHOLD));
                smoothnessScores[point] = smoothness;
            }
        }

        return smoothnessScores;
    }

    // 提取关键点
    function extractKeypoints(landmarks, canvas) {
        const keypoints = [];
        const indices = [0, 1, 4, 7, 8, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];

        for (let i = 0; i < indices.length; i++) {
            const idx = indices[i];
            const x = landmarks[idx].x * canvas.width;
            const y = landmarks[idx].y * canvas.height;
            keypoints.push([x, y]);
        }

        return keypoints;
    }

    // 计算两个向量之间的角度
    function getAngle(v1, v2) {
        // 计算点积
        const dotProduct = v1[0] * v2[0] + v1[1] * v2[1];
        // 计算向量长度
        const v1Mag = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
        const v2Mag = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
        // 计算角度（弧度）
        const angle = Math.acos(dotProduct / (v1Mag * v2Mag));
        // 转换为角度
        let angleDeg = angle * 180 / Math.PI;

        // 确定角度方向
        const cross = v2[0] * v1[1] - v2[1] * v1[0];
        if (cross < 0) {
            angleDeg = -angleDeg;
        }

        return angleDeg;
    }

    // 增强版动作分析
    function analyzeExerciseEnhanced(keypoints, type, jointAngles, smoothnessScores, fusedData) {
        // 调用原始分析函数获取基础结果
        const baseResult = analyzeExercise(keypoints, type);
        let counter = baseResult.counter;
        let guideText = baseResult.guideText;
        let actions_data = baseResult.actions_data;

        // 使用关节角度和平滑度数据增强分析
        if (Object.keys(jointAngles).length > 0 && Object.keys(smoothnessScores).length > 0) {
            // 根据动作类型应用特定的增强分析
            switch (type) {
                case "哑铃推肩":
                    // 检查肩关节角度
                    if (jointAngles.right_shoulder && jointAngles.left_shoulder) {
                        const avgShoulderAngle = (jointAngles.right_shoulder + jointAngles.left_shoulder) / 2;
                        if (avgShoulderAngle < 60 && baseResult.counter === 0) {
                            guideText = "肩部角度不足，请抬高手臂";
                        }
                    }

                    // 检查动作平滑度
                    if (smoothnessScores[12] && smoothnessScores[12] < 70) {
                        guideText = "动作不够平稳，请放慢速度";
                    }
                    break;

                case "哑铃飞鸟":
                    // 检查肘部是否保持伸直
                    if (jointAngles.right_elbow && jointAngles.left_elbow) {
                        const avgElbowAngle = (jointAngles.right_elbow + jointAngles.left_elbow) / 2;
                        if (avgElbowAngle < 150 && baseResult.counter === 0) {
                            guideText = "手臂应保持伸直，肘部不要弯曲";
                        }
                    }
                    break;

                case "深蹲":
                case "高脚杯深蹲":
                    // 检查膝盖角度
                    if (jointAngles.right_knee && jointAngles.left_knee) {
                        const avgKneeAngle = (jointAngles.right_knee + jointAngles.left_knee) / 2;
                        if (avgKneeAngle < 90 && baseResult.counter === 0) {
                            guideText = "下蹲深度不足，请继续下蹲";
                        } else if (avgKneeAngle < 45) {
                            guideText = "下蹲过深，注意保护膝盖";
                        }
                    }
                    break;

                case "哑铃弯举":
                case "哑铃二头弯举":
                    // 检查肘部角度变化
                    if (jointAngles.right_elbow && jointAngles.left_elbow) {
                        const avgElbowAngle = (jointAngles.right_elbow + jointAngles.left_elbow) / 2;
                        if (avgElbowAngle > 100 && baseResult.counter === 0) {
                            guideText = "手臂弯曲不足，请继续收紧";
                        }
                    }

                    // 检查上臂是否固定
                    if (smoothnessScores[11] && smoothnessScores[12]) {
                        const upperArmStability = (smoothnessScores[11] + smoothnessScores[12]) / 2;
                        if (upperArmStability < 80) {
                            guideText = "上臂不稳定，请固定肩部位置";
                        }
                    }
                    break;

                // 可以为其他动作类型添加更多增强分析
            }
        }

        return { counter, guideText, actions_data };
    }

    // 分析运动
    function analyzeExercise(keypoints, type) {
        let counter = 0;
        let guideText = "开始！";
        let flag = 0; // 用于跟踪动作状态
        let actions_data = [];

        // 计算各种角度
        // 右臂与水平方向的夹角
        const v1_right_arm = [keypoints[5][0] - keypoints[6][0], keypoints[5][1] - keypoints[6][1]];
        const v2_right_arm = [keypoints[8][0] - keypoints[6][0], keypoints[8][1] - keypoints[6][1]];
        const angle_right_arm = Math.abs(getAngle(v1_right_arm, v2_right_arm));

        // 左臂与水平方向的夹角
        const v1_left_arm = [keypoints[7][0] - keypoints[5][0], keypoints[7][1] - keypoints[5][1]];
        const v2_left_arm = [keypoints[6][0] - keypoints[5][0], keypoints[6][1] - keypoints[5][1]];
        const angle_left_arm = Math.abs(getAngle(v1_left_arm, v2_left_arm));

        // 右肘的夹角
        const v1_right_elbow = [keypoints[6][0] - keypoints[8][0], keypoints[6][1] - keypoints[8][1]];
        const v2_right_elbow = [keypoints[10][0] - keypoints[8][0], keypoints[10][1] - keypoints[8][1]];
        const angle_right_elbow = Math.abs(getAngle(v1_right_elbow, v2_right_elbow));

        // 左肘的夹角
        const v1_left_elbow = [keypoints[5][0] - keypoints[7][0], keypoints[5][1] - keypoints[7][1]];
        const v2_left_elbow = [keypoints[9][0] - keypoints[7][0], keypoints[9][1] - keypoints[7][1]];
        const angle_left_elbow = Math.abs(getAngle(v1_left_elbow, v2_left_elbow));

        // 左大腿和左臂夹角
        const v1_left_leg = [keypoints[13][0] - keypoints[11][0], keypoints[13][1] - keypoints[11][1]];
        const v2_left_leg = [keypoints[7][0] - keypoints[5][0], keypoints[7][1] - keypoints[5][1]];
        const angle_left_leg = getAngle(v1_left_leg, v2_left_leg);

        // 右大腿和右臂夹角
        const v1_right_leg = [keypoints[14][0] - keypoints[12][0], keypoints[14][1] - keypoints[12][1]];
        const v2_right_leg = [keypoints[8][0] - keypoints[6][0], keypoints[8][1] - keypoints[6][1]];
        const angle_right_leg = getAngle(v1_right_leg, v2_right_leg);

        // 左大腿和左小腿夹角
        const v1_left_knee = [keypoints[11][0] - keypoints[13][0], keypoints[11][1] - keypoints[13][1]];
        const v2_left_knee = [keypoints[15][0] - keypoints[13][0], keypoints[15][1] - keypoints[13][1]];
        const angle_left_knee = getAngle(v1_left_knee, v2_left_knee);

        // 右大腿和右小腿夹角
        const v1_right_knee = [keypoints[12][0] - keypoints[14][0], keypoints[12][1] - keypoints[14][1]];
        const v2_right_knee = [keypoints[16][0] - keypoints[14][0], keypoints[16][1] - keypoints[14][1]];
        const angle_right_knee = getAngle(v1_right_knee, v2_right_knee);

        // v8-v6-v12
        const v1_v8_v6_v12 = [keypoints[8][0] - keypoints[6][0], keypoints[8][1] - keypoints[6][1]];
        const v2_v8_v6_v12 = [keypoints[12][0] - keypoints[6][0], keypoints[12][1] - keypoints[6][1]];
        const angle_v8_v6_v12 = Math.abs(getAngle(v1_v8_v6_v12, v2_v8_v6_v12));

        // v6_v12_v14
        const v1_v6_v12_v14 = [keypoints[6][0] - keypoints[12][0], keypoints[6][1] - keypoints[12][1]];
        const v2_v6_v12_v14 = [keypoints[14][0] - keypoints[12][0], keypoints[14][1] - keypoints[12][1]];
        const angle_v6_v12_v14 = Math.abs(getAngle(v1_v6_v12_v14, v2_v6_v12_v14));

        // v6_V8_v10
        const v1_v6_V8_v10 = [keypoints[6][0] - keypoints[8][0], keypoints[6][1] - keypoints[8][1]];
        const v2_v6_V8_v10 = [keypoints[10][0] - keypoints[8][0], keypoints[10][1] - keypoints[8][1]];
        const angle_v6_V8_v10 = Math.abs(getAngle(v1_v6_V8_v10, v2_v6_V8_v10));

        // v5_v7_v9
        const v1_v5_v7_v9 = [keypoints[5][0] - keypoints[7][0], keypoints[5][1] - keypoints[7][1]];
        const v2_v5_v7_v9 = [keypoints[9][0] - keypoints[7][0], keypoints[9][1] - keypoints[7][1]];
        const angle_v5_v7_v9 = Math.abs(getAngle(v1_v5_v7_v9, v2_v5_v7_v9));

        // v12_v14_v16
        const v1_v12_v14_v16 = [keypoints[12][0] - keypoints[14][0], keypoints[12][1] - keypoints[14][1]];
        const v2_v12_v14_v16 = [keypoints[16][0] - keypoints[14][0], keypoints[16][1] - keypoints[14][1]];
        const angle_v12_v14_v16 = Math.abs(getAngle(v1_v12_v14_v16, v2_v12_v14_v16));

        // v11_v13_v15
        const v1_v11_v13_v15 = [keypoints[11][0] - keypoints[13][0], keypoints[11][1] - keypoints[13][1]];
        const v2_v11_v13_v15 = [keypoints[15][0] - keypoints[13][0], keypoints[15][1] - keypoints[13][1]];
        const angle_v11_v13_v15 = Math.abs(getAngle(v1_v11_v13_v15, v2_v11_v13_v15));

        // 定义各种动作的条件
        // 定义各种动作的条件

        //Sandylee
        const out_abdominal_begin = angle_left_arm < 110 && angle_right_arm < 110
        const out_abdominal_finish = angle_left_arm > 120 && angle_right_arm > 120
        console.log("angle_left_arm： "+angle_left_arm + ", " + out_abdominal_begin);
        console.log("angle_right_arm： "+angle_right_arm + ", " + out_abdominal_finish );


        // 哑铃推肩条件
        const shoulder_push_begin = (angle_right_leg > -90 && angle_left_leg < 90);
        const shoulder_push_finish = (angle_right_leg < -150 && angle_left_leg > 150);

        // 哑铃飞鸟条件
        const flying_bird_begin = (angle_right_leg > -30 && angle_left_leg < 30);
        const flying_bird_finish = (angle_right_leg < -60 && angle_left_leg > 60);

        // 哑铃深蹲条件
        const squat_begin = (angle_left_knee < -120 || angle_left_knee > 0);
        const squat_finish = (angle_left_knee > -70 && angle_left_knee < 0);

        // 哑铃二头弯举条件
        const bend_begin = (angle_left_elbow < 180 && angle_left_elbow > 150 && angle_right_elbow < 180 && angle_right_elbow > 150);
        const bend_finish = (angle_left_elbow < 20 && angle_left_elbow > 0 && angle_right_elbow < 20 && angle_right_elbow > 0);
        const bend_in = (angle_left_elbow > 20 && angle_left_elbow < 150 && angle_right_elbow > 20 && angle_right_elbow < 150);
        const bend_a = (angle_left_elbow > 150 && angle_left_elbow < 180 && angle_right_elbow > 150 && angle_right_elbow < 180);
        const bend_b = (angle_left_elbow > 0 && angle_left_elbow < 20 && angle_right_elbow > 0 && angle_right_elbow < 20);

        // 哑铃上斜卧推条件
        const Incline_bench_press_begin = (angle_v8_v6_v12 < 90 && angle_v8_v6_v12 > 50);
        const Incline_bench_press_finish = (angle_v8_v6_v12 > 165 && angle_v8_v6_v12 < 180);

        // 哑铃练侧腹
        const Fellers_begin = (angle_v8_v6_v12 > 0 && angle_v8_v6_v12 < 10);
        const Fellers_finish = (angle_v8_v6_v12 > 110 && angle_v8_v6_v12 < 150);

        // 哑铃仰卧起坐
        const yaling_yangwqz_begin = (angle_v6_v12_v14 > 170 && angle_v6_v12_v14 < 180);
        const yaling_yangwqz_finish = (angle_v6_v12_v14 > 90 && angle_v6_v12_v14 < 140);

        // 哑铃划船
        const yaling_rhuachuan_begin = (angle_v6_V8_v10 > 150 && angle_v6_V8_v10 < 180);
        const yaling_rhuachuan_finish = (angle_v6_V8_v10 < 95 && angle_v6_V8_v10 > 10);
        const yaling_lhuachuan_begin = (angle_v5_v7_v9 > 150 && angle_v5_v7_v9 < 180);
        const yaling_lhuachuan_finish = (angle_v5_v7_v9 < 95 && angle_v5_v7_v9 > 10);

        // 躺姿哑铃臂屈伸
        const yaling_qubishen_begin = (angle_left_elbow < 180 && angle_left_elbow > 150 && angle_right_elbow < 180 && angle_right_elbow > 150);
        const yaling_qubishen_finish = (angle_left_elbow < 60 && angle_left_elbow > 0 && angle_right_elbow < 60 && angle_right_elbow > 0);

        // 哑铃早安鞠躬挺
        const yaling_gongting_begin = (angle_v6_v12_v14 > 90 && angle_v6_v12_v14 < 140);
        const yaling_gongting_finish = (angle_v6_v12_v14 > 170 && angle_v6_v12_v14 < 180);

        // 哑铃保加利亚单腿深蹲左
        const squatl_begin = (angle_v12_v14_v16 > 160 && angle_v12_v14_v16 < 180);
        const squatl_finish = (angle_v12_v14_v16 > 0 && angle_v12_v14_v16 < 160);

        // 哑铃保加利亚单腿深蹲右
        const squatr_begin = (angle_v11_v13_v15 > 160 && angle_v11_v13_v15 < 180);
        const squatr_finish = (angle_v11_v13_v15 > 0 && angle_v11_v13_v15 < 160);

        // 静态变量，用于跟踪动作状态
        if (!this.poseFlag) {
            this.poseFlag = {};
        }

        if (!this.poseFlag[type]) {
            this.poseFlag[type] = 0;
        }

        // 根据不同动作类型判断
        switch (type) {
            case "外科腹腔镜术后康复操":
                console.log('，' + this.poseFlag[type])
                if (out_abdominal_begin) {
                    this.poseFlag[type] = 1;
                    guideText = "请张开双臂";
                    start_time = Date.now();
                } else if (out_abdominal_finish && this.poseFlag[type]) {
                    actions_data[actions_data.length] = {'code': 'angle_left_arm', 'value': angle_left_arm}
                    actions_data[actions_data.length] = {'code': 'angle_right_arm', 'value': angle_right_arm}
                    end_time = Date.now();
                    counter = 1;
                    this.poseFlag[type] = 0;
                    guideText = "动作完成，请放下双臂";
                }
                break;
            case "哑铃推肩":
                if (shoulder_push_begin) {
                    this.poseFlag[type] = 1;
                    guideText = "请向上推起哑铃";
                } else if (shoulder_push_finish && this.poseFlag[type]) {
                    counter = 1;
                    this.poseFlag[type] = 0;
                    guideText = "动作完成，请放下哑铃";
                }
                break;
            case "哑铃飞鸟":
                if (flying_bird_begin) {
                    this.poseFlag[type] = 1;
                    guideText = "请向两侧抬起手臂";
                } else if (flying_bird_finish && this.poseFlag[type]) {
                    counter = 1;
                    this.poseFlag[type] = 0;
                    guideText = "动作完成，请放下手臂";
                }
                break;
            case "高脚杯深蹲":
            case "深蹲":
                if (squat_begin) {
                    this.poseFlag[type] = 1;
                    guideText = "请缓慢下蹲";
                } else if (squat_finish && this.poseFlag[type]) {
                    counter = 1;
                    this.poseFlag[type] = 0;
                    guideText = "动作完成，请站起";
                }
                break;
            case "哑铃弯举":
                if (bend_begin) {
                    this.poseFlag[type] = 1;
                    guideText = "请缓慢抬起双手手臂";
                } else if (bend_finish && this.poseFlag[type]) {
                    counter = 1;
                    this.poseFlag[type] = 0;
                    guideText = "完成了，非常棒！";
                } else if (bend_in && this.poseFlag[type]) {
                    guideText = "再抬高一点！";
                }
                break;
            case "哑铃上斜卧推":
                if (Incline_bench_press_begin) {
                    this.poseFlag[type] = 1;
                    guideText = "请向上推起哑铃";
                } else if (Incline_bench_press_finish && this.poseFlag[type]) {
                    counter = 1;
                    this.poseFlag[type] = 0;
                    guideText = "动作完成，请放下哑铃";
                }
                break;
            case "哑铃砍伐者":
                if (Fellers_begin) {
                    this.poseFlag[type] = 1;
                    guideText = "请向侧面抬起哑铃";
                } else if (Fellers_finish && this.poseFlag[type]) {
                    counter = 1;
                    this.poseFlag[type] = 0;
                    guideText = "动作完成，请放下哑铃";
                }
                break;
            case "哑铃仰卧起坐":
                if (yaling_yangwqz_begin) {
                    this.poseFlag[type] = 1;
                    guideText = "请做起坐动作";
                } else if (yaling_yangwqz_finish && this.poseFlag[type]) {
                    counter = 1;
                    this.poseFlag[type] = 0;
                    guideText = "动作完成，请躺下";
                }
                break;
            case "右手哑铃划船":
                if (yaling_rhuachuan_begin) {
                    this.poseFlag[type] = 1;
                    guideText = "请向上拉起哑铃";
                } else if (yaling_rhuachuan_finish && this.poseFlag[type]) {
                    counter = 1;
                    this.poseFlag[type] = 0;
                    guideText = "动作完成，请放下哑铃";
                }
                break;
            case "左手哑铃划船":
                if (yaling_lhuachuan_begin) {
                    this.poseFlag[type] = 1;
                    guideText = "请向上拉起哑铃";
                } else if (yaling_lhuachuan_finish && this.poseFlag[type]) {
                    counter = 1;
                    this.poseFlag[type] = 0;
                    guideText = "动作完成，请放下哑铃";
                }
                break;
            case "躺姿哑铃臂屈伸":
                if (yaling_qubishen_begin) {
                    this.poseFlag[type] = 1;
                    guideText = "请弯曲手臂";
                } else if (yaling_qubishen_finish && this.poseFlag[type]) {
                    counter = 1;
                    this.poseFlag[type] = 0;
                    guideText = "动作完成，请伸直手臂";
                }
                break;
            case "哑铃早安鞠躬挺":
                if (yaling_gongting_begin) {
                    this.poseFlag[type] = 1;
                    guideText = "请向上挺起身体";
                } else if (yaling_gongting_finish && this.poseFlag[type]) {
                    counter = 1;
                    this.poseFlag[type] = 0;
                    guideText = "动作完成，请弯腰";
                }
                break;
            case "哑铃保加利亚单腿深蹲左":
                if (squatl_begin) {
                    this.poseFlag[type] = 1;
                    guideText = "请下蹲";
                } else if (squatl_finish && this.poseFlag[type]) {
                    counter = 1;
                    this.poseFlag[type] = 0;
                    guideText = "动作完成，请站起";
                }
                break;
            case "哑铃保加利亚单腿深蹲右":
                if (squatr_begin) {
                    this.poseFlag[type] = 1;
                    guideText = "请下蹲";
                } else if (squatr_finish && this.poseFlag[type]) {
                    counter = 1;
                    this.poseFlag[type] = 0;
                    guideText = "动作完成，请站起";
                }
                break;
            default:
                guideText = "请按照视频示范做动作";
        }

        return { counter, guideText, actions_data };
    }

    // 完成一组训练
    function completeSet() {
        currentSets--;
        setsCounter.textContent = currentSets;

        saveCourseRecord();
        if (currentSets <= 0) {
            // 所有组数完成
            completeTraining();
        } else {
            // 开始休息
            startRest();
        }
    }

    // 添加训练记录的函数
    async function saveCourseRecord() {
        try {
            // 获取当前用户ID
            const userId = getCurrentUserId();
            if (!userId) {
                showToast('请先登录后再保存训练记录', 'error');
                return;
            }
            // 准备要发送的数据
            const saveData = records;

            // 显示保存中提示
            showToast('正在保存训练记录...', 'info');

            // 发送请求保存训练记录
            const response = await fetch('/course/save_course_training_record', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveData)
            });

            const result = await response.json();

            if (result.success) {
                showToast('训练记录保存成功！', 'success');
                records = [];
            } else {
                showToast(`保存失败: ${result.msg}`, 'error');
            }
        } catch (error) {
            console.error('保存训练记录失败:', error);
            showToast('保存训练记录时发生错误', 'error');
        }
    }
    // 开始休息
    function startRest() {
        isResting = true;
        restSeconds = 10; // 休息10秒
        statusText.textContent = "休息时间";
        poseTimer.classList.add('active');
        poseTimerText.textContent = restSeconds;

        restTimer = setInterval(() => {
            restSeconds--;
            poseTimerText.textContent = restSeconds;

            if (restSeconds <= 0) {
                clearInterval(restTimer);
                endRest();
            }
        }, 1000);
    }

    // 结束休息
    function endRest() {
        isResting = false;
        poseTimer.classList.remove('active');
        statusText.textContent = "继续训练";

        // 重置当前组的重复次数
        currentReps = totalReps;
        repsCounter.textContent = currentReps;
    }

    // 停止训练
    function stopTraining() {
        isTraining = false;
        isResting = false;

        if (restTimer) {
            clearInterval(restTimer);
            restTimer = null;
        }

        if (camera) {
            camera.stop();
        }

        poseTimer.classList.remove('active');
    }

    // 完成所有训练
    function completeTraining() {
        stopTraining();
        statusText.textContent = "训练完成！";

        // 关闭侧边栏并显示报告
        setTimeout(() => {
//            sidebarPoseFitness.classList.remove('active');
            demoVideo.pause();
            clearInterval(timerInterval);
            // 显示加载动效
            showReportLoading();
            // 延迟2-3秒后显示报告
            setTimeout(() => {
                showFitnessReport(); // 这里调用内部定义的函数
            }, 4000); // 2.5秒后显示报告
        }, 1000);
    }
    
    // 停止/暂停
    stopBtn.addEventListener('click', function() {
        if (isTraining) {
            demoVideo.pause();
            clearInterval(timerInterval);
            statusText.textContent = '已暂停';
            statusText.className = 'value paused';
            stopBtn.style.display = 'none';
            resumeBtn.style.display = 'flex';
            isTraining = false;
        }
    });

    // 恢复
    resumeBtn.addEventListener('click', function() {
        demoVideo.play();
        timerInterval = setInterval(updateTimer, 1000);
        statusText.textContent = '训练中';
        statusText.className = 'value active';
        resumeBtn.style.display = 'none';
        stopBtn.style.display = 'flex';
        isTraining = true;
    });

    // 显示报告 - 移到内部
    // 显示报告加载动效 - 移到内部
    function showReportLoading() {
        console.log("显示报告加载动效");
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'report-loading-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.flexDirection = 'column';

        // 创建加载动画
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.style.width = '50px';
        spinner.style.height = '50px';
        spinner.style.border = '5px solid #f3f3f3';
        spinner.style.borderTop = '5px solid #3498db';
        spinner.style.borderRadius = '50%';
        spinner.style.animation = 'spin 1s linear infinite';

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // 创建文本
        const text = document.createElement('div');
        text.textContent = '报告生成中...';
        text.style.color = 'white';
        text.style.marginTop = '20px';
        text.style.fontSize = '18px';

        // 添加到遮罩层
        overlay.appendChild(spinner);
        overlay.appendChild(text);

        // 添加到页面
        document.body.appendChild(overlay);
    }

    //生成uuid
    function generateSimpleUUID() {
      let dt = new Date().getTime();
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c === 'x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    }

    // 显示康训报告 - 移到内部
    function showFitnessReport() {
        console.log("显示康训报告", exerciseType); // 添加日志

        // 移除加载动效
        const overlay = document.getElementById('report-loading-overlay');
        if (overlay) {
            document.body.removeChild(overlay);
        }

        // 停止相机
        if (camera) {
            camera.stop();
        }

        // 获取与当前训练相关的报告数据
        fetchFitnessReport(batch_no)
            .then(reportData => {
                console.log("获取到报告数据", reportData); // 添加日志

                // 检查报告数据是否有效
                if (!reportData || reportData.error) {
                    throw new Error(reportData?.error || '报告数据无效');
                }

                // 创建报告HTML
                createReportUI(reportData);
            })
            .catch(error => {
                console.error('获取康训报告失败:', error);

                // 创建错误报告
                const contentContainer = document.querySelector('.container') || document.body;
                const errorDiv = document.createElement('div');
                errorDiv.className = 'fitness-report-container';
                errorDiv.style.position = 'fixed';
                errorDiv.style.top = '50%';
                errorDiv.style.left = '50%';
                errorDiv.style.transform = 'translate(-50%, -50%)';
                errorDiv.style.zIndex = '1000';
                errorDiv.style.width = '80%';
                errorDiv.style.maxWidth = '600px';
                errorDiv.style.backgroundColor = 'white';
                errorDiv.style.padding = '20px';
                errorDiv.style.borderRadius = '10px';
                errorDiv.style.boxShadow = '0 0 20px rgba(0,0,0,0.3)';

                errorDiv.innerHTML = `
                    <h2 style="color: #dc3545; text-align: center;">报告生成失败</h2>
                    <p style="text-align: center;">很抱歉，无法获取训练报告数据。</p>
                    <p style="color: #6c757d; font-size: 0.9rem;">错误信息: ${error.message}</p>
                    <div class="report-button-container" style="text-align: center; margin-top: 20px;">
                        <button class="report-close-button" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">关闭</button>
                    </div>
                `;

                contentContainer.appendChild(errorDiv);

                // 添加关闭按钮事件
                const closeButton = errorDiv.querySelector('.report-close-button');
                closeButton.addEventListener('click', function() {
                    contentContainer.removeChild(errorDiv);
                });
            });
    }

    // 获取康训报告数据 - 移到内部
    async function fetchFitnessReport(batch_no) {
        console.log("请求报告数据", batch_no); // 添加日志


        // 构建API请求URL
        const url = `/fitness/get_fitness_report?batch_no=${batch_no}`;

        console.log("请求URL:", url); // 添加日志

        // 发送请求获取报告数据
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应不正常');
                }
                return response.json();
            });
    }

    // 创建报告UI - 移到内部
    // 创建报告UI - 修改函数
    function createReportUI(reportData) {
        console.log("创建报告UI", reportData); // 添加日志

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'report-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.zIndex = '999';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';

        // 创建报告容器
        const reportContainer = document.createElement('div');
        reportContainer.className = 'fitness-report-container';
        reportContainer.style.position = 'relative';
        reportContainer.style.zIndex = '1000';
        reportContainer.style.width = '80%';
        reportContainer.style.maxWidth = '700px';
        reportContainer.style.maxHeight = '85vh';
        reportContainer.style.overflowY = 'auto';
        reportContainer.style.backgroundColor = '#0c1a2a';
        reportContainer.style.padding = '30px';
        reportContainer.style.borderRadius = '15px';
        reportContainer.style.boxShadow = '0 0 30px rgba(0, 200, 255, 0.3)';
        reportContainer.style.color = '#ffffff';
        reportContainer.style.border = '1px solid rgba(0, 200, 255, 0.5)';
        reportContainer.style.marginTop = '100px';

        // 创建报告标题
        const reportTitle = document.createElement('h2');
        reportTitle.textContent = '康训训练报告';
        reportTitle.style.textAlign = 'center';
        reportTitle.style.color = '#00c8ff';
        reportTitle.style.borderBottom = '2px solid #00c8ff';
        reportTitle.style.paddingBottom = '15px';
        reportTitle.style.marginBottom = '25px';
        reportTitle.style.fontSize = '32px';
        reportTitle.style.fontStyle = 'italic';
        reportTitle.style.textTransform = 'uppercase';
        reportTitle.style.letterSpacing = '1px';
        reportContainer.appendChild(reportTitle);

        // 创建动作名称
        const exerciseName = document.createElement('h3');
        exerciseName.className = 'report-exercise-name';
        exerciseName.textContent = `训练动作: ${exerciseType}`;
        exerciseName.style.fontSize = '22px';
        exerciseName.style.color = '#a0a0a0';
        exerciseName.style.marginBottom = '20px';
        exerciseName.style.textAlign = 'center';
        reportContainer.appendChild(exerciseName);

        // 创建评分区域
        const scoreContainer = document.createElement('div');
        scoreContainer.className = 'report-score-container';
        scoreContainer.style.backgroundColor = 'rgba(12, 26, 42, 0.7)';
        scoreContainer.style.padding = '25px';
        scoreContainer.style.borderRadius = '12px';
        scoreContainer.style.marginBottom = '30px';
        scoreContainer.style.textAlign = 'center';
        scoreContainer.style.border = '1px solid rgba(0, 200, 255, 0.3)';

        const scoreLabel = document.createElement('span');
        scoreLabel.textContent = '动作评分';
        scoreLabel.style.fontSize = '18px';
        scoreLabel.style.display = 'block';
        scoreLabel.style.marginBottom = '10px';
        scoreLabel.style.color = '#a0a0a0';
        scoreContainer.appendChild(scoreLabel);

        const scoreValue = document.createElement('span');
        scoreValue.className = 'report-score-value';
        scoreValue.textContent = reportData.score || '0';
        scoreValue.style.fontSize = '60px';
        scoreValue.style.fontWeight = 'bold';
        scoreValue.style.color = getScoreColor(reportData.score || 0);
        scoreValue.style.display = 'block';
        scoreValue.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.3)';
        scoreContainer.appendChild(scoreValue);

        // 添加评分等级
        const scoreRating = document.createElement('span');
        scoreRating.className = 'report-score-rating';
        const score = reportData.score || 0;
        if (score >= 90) {
            scoreRating.textContent = '优秀';
        } else if (score >= 80) {
            scoreRating.textContent = '良好';
        } else if (score >= 70) {
            scoreRating.textContent = '一般';
        } else {
            scoreRating.textContent = '需改进';
        }
        scoreRating.style.fontSize = '18px';
        scoreRating.style.color = getScoreColor(score);
        scoreRating.style.display = 'block';
        scoreRating.style.marginTop = '10px';
        scoreContainer.appendChild(scoreRating);

        reportContainer.appendChild(scoreContainer);

        // 创建总结区域
        if (reportData.summary) {
            const summaryContainer = document.createElement('div');
            summaryContainer.className = 'report-summary-container';
            summaryContainer.style.marginBottom = '30px';

            const summaryTitle = document.createElement('h4');
            summaryTitle.textContent = '总体评价';
            summaryTitle.style.color = '#00c8ff';
            summaryTitle.style.marginBottom = '15px';
            summaryTitle.style.fontSize = '20px';
            summaryTitle.style.borderLeft = '4px solid #00c8ff';
            summaryTitle.style.paddingLeft = '10px';
            summaryContainer.appendChild(summaryTitle);

            const summaryText = document.createElement('p');
            summaryText.className = 'report-summary-text';
            summaryText.textContent = reportData.summary;
            summaryText.style.backgroundColor = 'rgba(0, 200, 255, 0.1)';
            summaryText.style.padding = '20px';
            summaryText.style.borderRadius = '8px';
            summaryText.style.margin = '0';
            summaryText.style.lineHeight = '1.6';
            summaryText.style.color = '#e0e0e0';
            summaryContainer.appendChild(summaryText);

            reportContainer.appendChild(summaryContainer);
        }

        // 创建问题分析区域
        if (reportData.issues && reportData.issues.length > 0) {
            const issuesContainer = document.createElement('div');
            issuesContainer.className = 'report-issues-container';
            issuesContainer.style.marginBottom = '30px';

            const issuesTitle = document.createElement('h4');
            issuesTitle.textContent = '动作分析';
            issuesTitle.style.color = '#00c8ff';
            issuesTitle.style.marginBottom = '15px';
            issuesTitle.style.fontSize = '20px';
            issuesTitle.style.borderLeft = '4px solid #00c8ff';
            issuesTitle.style.paddingLeft = '10px';
            issuesContainer.appendChild(issuesTitle);

            const issuesList = document.createElement('div');
            issuesList.className = 'report-issues-list';
            issuesList.style.margin = '0';

            reportData.issues.forEach((issue, index) => {
                const issueItem = document.createElement('div');
                issueItem.style.marginBottom = '20px';
                issueItem.style.backgroundColor = 'rgba(12, 26, 42, 0.7)';
                issueItem.style.padding = '15px';
                issueItem.style.borderRadius = '8px';
                issueItem.style.border = '1px solid rgba(0, 200, 255, 0.2)';

                const issueTitle = document.createElement('div');
                issueTitle.textContent = `${index + 1}. ${issue.title}`;
                issueTitle.style.display = 'block';
                issueTitle.style.marginBottom = '10px';
                issueTitle.style.color = '#00c8ff';
                issueTitle.style.fontWeight = 'bold';
                issueTitle.style.fontSize = '18px';
                issueItem.appendChild(issueTitle);

                const issueDesc = document.createElement('p');
                issueDesc.textContent = issue.description;
                issueDesc.style.margin = '0';
                issueDesc.style.color = '#e0e0e0';
                issueDesc.style.lineHeight = '1.5';
                issueItem.appendChild(issueDesc);

                issuesList.appendChild(issueItem);
            });

            issuesContainer.appendChild(issuesList);
            reportContainer.appendChild(issuesContainer);
        }

        // 创建建议区域
        if (reportData.suggestions && reportData.suggestions.length > 0) {
            const suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'report-suggestions-container';
            suggestionsContainer.style.marginBottom = '30px';

            const suggestionsTitle = document.createElement('h4');
            suggestionsTitle.textContent = '改进建议';
            suggestionsTitle.style.color = '#00c8ff';
            suggestionsTitle.style.marginBottom = '15px';
            suggestionsTitle.style.fontSize = '20px';
            suggestionsTitle.style.borderLeft = '4px solid #00c8ff';
            suggestionsTitle.style.paddingLeft = '10px';
            suggestionsContainer.appendChild(suggestionsTitle);

            const suggestionsList = document.createElement('ul');
            suggestionsList.className = 'report-suggestions-list';
            suggestionsList.style.paddingLeft = '20px';
            suggestionsList.style.margin = '0';
            suggestionsList.style.backgroundColor = 'rgba(0, 200, 255, 0.1)';
            suggestionsList.style.padding = '20px';
            suggestionsList.style.borderRadius = '8px';

            reportData.suggestions.forEach(suggestion => {
                const suggestionItem = document.createElement('li');
                suggestionItem.textContent = suggestion;
                suggestionItem.style.marginBottom = '12px';
                suggestionItem.style.color = '#e0e0e0';
                suggestionItem.style.lineHeight = '1.5';
                suggestionItem.style.position = 'relative';
                suggestionItem.style.paddingLeft = '5px';
                suggestionsList.appendChild(suggestionItem);
            });

            suggestionsContainer.appendChild(suggestionsList);
            reportContainer.appendChild(suggestionsContainer);
        }

        // 创建按钮区域
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'report-button-container';
        buttonContainer.style.textAlign = 'center';
        buttonContainer.style.marginTop = '30px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '20px';

        // 添加保存报告按钮
        const saveButton = document.createElement('button');
        saveButton.className = 'report-save-button';
        saveButton.textContent = '保存报告';
        saveButton.style.padding = '12px 30px';
        saveButton.style.backgroundColor = '#28a745';
        saveButton.style.color = '#ffffff';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '5px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.fontSize = '18px';
        saveButton.style.fontWeight = 'bold';
        saveButton.style.transition = 'background-color 0.3s';

        saveButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#218838';
        });

        saveButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#28a745';
        });

        saveButton.addEventListener('click', function() {
            // 保存报告到数据库
            saveFitnessReport(reportData);
        });

        // 添加关闭按钮
        const closeButton = document.createElement('button');
        closeButton.className = 'report-close-button';
        closeButton.textContent = '关闭报告';
        closeButton.style.padding = '12px 30px';
        closeButton.style.backgroundColor = '#00c8ff';
        closeButton.style.color = '#0c1a2a';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '18px';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.transition = 'background-color 0.3s';

        closeButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#00a8df';
        });

        closeButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#00c8ff';
        });

        closeButton.addEventListener('click', function() {
            document.body.removeChild(overlay); // 移除整个遮罩层
        });

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(closeButton);
        reportContainer.appendChild(buttonContainer);

        // 将报告添加到遮罩层
        overlay.appendChild(reportContainer);

        // 将遮罩层添加到页面
        document.body.appendChild(overlay);

        // 添加点击遮罩层关闭报告的功能（仅当点击遮罩而非报告内容时）
        overlay.addEventListener('click', function(event) {
            if (event.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }

    // 添加保存康训报告的函数
    async function saveFitnessReport(reportData) {
        try {
            // 获取当前用户ID
            const userId = getCurrentUserId();

            if (!userId) {
                showToast('请先登录后再保存报告', 'error');
                return;
            }

            // 准备要发送的数据
            const saveData = {
                user_id: userId,
                exercise_type: exerciseType,
                report_data: reportData,
                group: totalSets,
                reps: totalReps,
                action_analyse: reportData.issues ? reportData.issues.map(issue =>
                    `${issue.title}: ${issue.description}`).join('\n') : '' // 添加动作分析字段
            };

            // 显示保存中提示
            showToast('正在保存报告...', 'info');

            // 发送请求保存报告
            const response = await fetch('/fitness/save_report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveData)
            });

            const result = await response.json();

            if (result.success) {
                showToast('报告保存成功！', 'success');
            } else {
                showToast(`保存失败: ${result.msg}`, 'error');
            }
        } catch (error) {
            console.error('保存报告失败:', error);
            showToast('保存报告时发生错误', 'error');
        }
    }

    // 获取当前用户ID的辅助函数
    function getCurrentUserId() {
        // 从页面元素获取用户ID
        // 1. 尝试从隐藏字段获取
        const userIdElement = document.getElementById('current-user-id');
        if (userIdElement && userIdElement.value) {
            return userIdElement.value;
        }

        // 2. 尝试从data属性获取
        const userIdData = document.querySelector('[data-user-id]');
        if (userIdData && userIdData.dataset.userId) {
            return userIdData.dataset.userId;
        }

        // 3. 尝试从URL参数获取
        const urlParams = new URLSearchParams(window.location.search);
        const userIdParam = urlParams.get('user_id');
        if (userIdParam) {
            return userIdParam;
        }

        // 4. 尝试从页面上其他可能包含用户ID的元素获取
        // 例如，在pose_detection.html页面中可能有包含用户ID的元素
        const userInfoElement = document.querySelector('.user-info');
        if (userInfoElement && userInfoElement.dataset.id) {
            return userInfoElement.dataset.id;
        }

        // 5. 如果都没有找到，则发送AJAX请求获取当前用户ID
        // 注意：这是一个同步请求，可能会阻塞UI
        let userId = null;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/get_current_user_id', false); // 同步请求
        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.user_id) {
                    userId = response.user_id;
                }
            }
        };
        try {
            xhr.send();
        } catch (e) {
            console.error('获取用户ID失败:', e);
        }

        if (userId) {
            return userId;
        }

        // 如果所有方法都失败，则返回session中的默认值'0'
        return '0';
    }

    // 显示提示消息的辅助函数
    function showToast(message, type = 'info') {
        // 创建toast元素
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.color = '#fff';
        toast.style.zIndex = '10000';
        toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        toast.style.transition = 'opacity 0.5s';

        // 根据类型设置背景色
        switch (type) {
            case 'success':
                toast.style.backgroundColor = '#28a745';
                break;
            case 'error':
                toast.style.backgroundColor = '#dc3545';
                break;
            case 'warning':
                toast.style.backgroundColor = '#ffc107';
                toast.style.color = '#212529';
                break;
            default:
                toast.style.backgroundColor = '#17a2b8';
        }

        // 添加到页面
        document.body.appendChild(toast);

        // 3秒后自动消失
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 3000);
    }

    // 根据分数获取颜色 - 添加此函数
    function getScoreColor(score) {
        if (score >= 90) return '#28a745'; // 优秀 - 绿色
        if (score >= 80) return '#17a2b8'; // 良好 - 蓝绿色
        if (score >= 70) return '#ffc107'; // 一般 - 黄色
        return '#dc3545'; // 需改进 - 红色
    }
    // 初始化
    startTraining();
});