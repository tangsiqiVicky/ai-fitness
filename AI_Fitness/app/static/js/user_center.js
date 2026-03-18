
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有导航项和内容区域
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    // 为每个导航项添加点击事件
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // 获取目标标签
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有导航项的活动状态
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // 为当前点击的导航项添加活动状态
            this.classList.add('active');
            
            // 隐藏所有内容区域
            contentSections.forEach(section => section.classList.remove('active'));
            
            // 显示目标内容区域
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // 添加查看康训报告功能
    const viewReportButtons = document.querySelectorAll('.view-report-btn');
    
    viewReportButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 获取报告数据
            const reportData = {
                id: this.getAttribute('data-id'),
                title: this.getAttribute('data-title'),
                score: parseInt(this.getAttribute('data-score')),
                summary: this.getAttribute('data-analysis'),
                suggestions: this.getAttribute('data-advice').split('\n'),
                group: parseInt(this.getAttribute('data-group')),
                reps: parseInt(this.getAttribute('data-reps')),
                actionAnalysis: this.getAttribute('data-action-analyse') // 新增动作分析字段
            };
            
            // 创建报告UI
            createReportUI(reportData);
        });
    });
    
    // 创建报告UI函数
    function createReportUI(reportData) {
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
        exerciseName.textContent = `训练动作: ${reportData.title}`;
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
        
        // 创建训练信息区域
        const trainingInfoContainer = document.createElement('div');
        trainingInfoContainer.className = 'report-training-info';
        trainingInfoContainer.style.display = 'flex';
        trainingInfoContainer.style.justifyContent = 'space-around';
        trainingInfoContainer.style.marginBottom = '30px';
        trainingInfoContainer.style.backgroundColor = 'rgba(0, 200, 255, 0.1)';
        trainingInfoContainer.style.padding = '15px';
        trainingInfoContainer.style.borderRadius = '8px';
        
        // 组数信息
        const groupInfo = document.createElement('div');
        groupInfo.style.textAlign = 'center';
        
        const groupLabel = document.createElement('div');
        groupLabel.textContent = '训练组数';
        groupLabel.style.color = '#a0a0a0';
        groupLabel.style.fontSize = '14px';
        groupLabel.style.marginBottom = '5px';
        groupInfo.appendChild(groupLabel);
        
        const groupValue = document.createElement('div');
        groupValue.textContent = reportData.group || '0';
        groupValue.style.fontSize = '24px';
        groupValue.style.fontWeight = 'bold';
        groupValue.style.color = '#00c8ff';
        groupInfo.appendChild(groupValue);
        
        trainingInfoContainer.appendChild(groupInfo);
        
        // 每组次数信息
        const repsInfo = document.createElement('div');
        repsInfo.style.textAlign = 'center';
        
        const repsLabel = document.createElement('div');
        repsLabel.textContent = '每组次数';
        repsLabel.style.color = '#a0a0a0';
        repsLabel.style.fontSize = '14px';
        repsLabel.style.marginBottom = '5px';
        repsInfo.appendChild(repsLabel);
        
        const repsValue = document.createElement('div');
        repsValue.textContent = reportData.reps || '0';
        repsValue.style.fontSize = '24px';
        repsValue.style.fontWeight = 'bold';
        repsValue.style.color = '#00c8ff';
        repsInfo.appendChild(repsValue);
        
        trainingInfoContainer.appendChild(repsInfo);
        
        reportContainer.appendChild(trainingInfoContainer);
        
        // 创建动作分析区域 - 新增部分
        if (reportData.actionAnalysis) {
            const actionAnalysisContainer = document.createElement('div');
            actionAnalysisContainer.className = 'report-action-analysis-container';
            actionAnalysisContainer.style.marginBottom = '30px';
            
            const actionAnalysisTitle = document.createElement('h4');
            actionAnalysisTitle.textContent = '动作分析';
            actionAnalysisTitle.style.color = '#00c8ff';
            actionAnalysisTitle.style.marginBottom = '15px';
            actionAnalysisTitle.style.fontSize = '20px';
            actionAnalysisTitle.style.borderLeft = '4px solid #00c8ff';
            actionAnalysisTitle.style.paddingLeft = '10px';
            actionAnalysisContainer.appendChild(actionAnalysisTitle);
            
            const actionAnalysisText = document.createElement('p');
            actionAnalysisText.className = 'report-action-analysis-text';
            actionAnalysisText.textContent = reportData.actionAnalysis;
            actionAnalysisText.style.backgroundColor = 'rgba(0, 200, 255, 0.1)';
            actionAnalysisText.style.padding = '20px';
            actionAnalysisText.style.borderRadius = '8px';
            actionAnalysisText.style.margin = '0';
            actionAnalysisText.style.lineHeight = '1.6';
            actionAnalysisText.style.color = '#e0e0e0';
            actionAnalysisContainer.appendChild(actionAnalysisText);
            
            reportContainer.appendChild(actionAnalysisContainer);
        }
        
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
                if (suggestion.trim()) {
                    const suggestionItem = document.createElement('li');
                    suggestionItem.textContent = suggestion;
                    suggestionItem.style.marginBottom = '12px';
                    suggestionItem.style.color = '#e0e0e0';
                    suggestionItem.style.lineHeight = '1.5';
                    suggestionItem.style.position = 'relative';
                    suggestionItem.style.paddingLeft = '5px';
                    suggestionsList.appendChild(suggestionItem);
                }
            });
            
            suggestionsContainer.appendChild(suggestionsList);
            reportContainer.appendChild(suggestionsContainer);
        }
        
        // 创建按钮区域
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'report-button-container';
        buttonContainer.style.textAlign = 'center';
        buttonContainer.style.marginTop = '30px';
        
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
    
    // 根据分数获取颜色
    function getScoreColor(score) {
        if (score >= 90) return '#28a745'; // 优秀 - 绿色
        if (score >= 80) return '#17a2b8'; // 良好 - 蓝绿色
        if (score >= 70) return '#ffc107'; // 一般 - 黄色
        return '#dc3545'; // 需改进 - 红色
    }
});
$(document).ready(function() {
    const plans = []
    const userid = $('#userid').val();
    $('#nav_training-plan').click(function(){
        $.ajax({
          url: "/user-plan/get-user-plan-active",
          type: "get",
//          contentType: "application/x-www-form-urlencoded",
          data: 'userId=' + userid
        }).done(function(response) {
          renderPlan(response);
          $("#loading").hide();
        }).fail(function() {
          alert("网络错误，请稍后重试！");
          $("#loading").hide();
        });
    });


  $("#change-plan-btn").modalInput({
      title: "请选择您的计划",
      animation: "zoom", // fade / zoom / slide

      fields: [
        {
          type: "select",
          name: "plan_id",
          label: "计划",
          default: "sport",
          options: [{'value':'sport','label':'11'}],
          dataUrl: "/get-user-plan?id=" + userid,
          valueKey: "id",
          labelKey: "plan",
          validate: v => v ? {valid:true} : {valid:false, msg:"请选择类别"}
        }
      ],
      onOpen: function(){

      },
      onConfirm: function(values){
//        alert("提交的数据：" + JSON.stringify(values, null, 2));
        $.ajax({
          url: "/change-user-plan",
          type: "post",
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify({
            origin_id: $('#activePlan').val(),
            new_id: values.plan_id,
          })
        }).done(function(response) {
          renderPlan(response)
        }).fail(function(error) {
          console.error("Error sending message:", error);
          appendMessage('assistant', "抱歉，发生了错误，请稍后再试。");
          $('#loading').hide();
        });
      }
    });
    function renderPlan(response){

      if (!response.success) {
        alert(response.error);
      } else if (response.success) {
        percentage = Math.round(response.data.plan.percent * 100) + '%';
        $('#progress').css('width',percentage)
        $('#progress-text').html(percentage)
        $('#activePlan').val(response.data.plan.id);
        $('#plan-title').html(response.data.plan.plan)
        $.each(response.data.detailList, function(index, value) {
            plan = value.plan.length > 16 ? value.plan.substring(0,15) + "..." : value.plan
            plan = plan.length == 0 ? "暂无<br>" : plan
            css = null
            status = '休息'
            if ('0' == value.status) {
                status = '未开始';
            } else if ('1' == value.status) {
                status = '已完成';
                css = 'completed'
            }  else if ('-1' == value.status) {
                status = '未关联';
            }
            if ('周一'==value.plan_day) {
               $('#p-mon').html(plan)
               $('#id-mon').val(value.id)
               $('#status-mon').html(status)
               $('#status-mon').addClass(css)
            } else if ('周二'==value.plan_day) {
               $('#p-tues').html(plan)
               $('#id-tues').val(value.id)
               $('#status-tues').html(status)
               $('#status-tues').addClass(css)
            } else if ('周三'==value.plan_day) {
               $('#p-wed').html(plan)
               $('#id-wed').val(value.id)
               $('#status-wed').html(status)
               $('#status-wed').addClass(css)
            } else if ('周四'==value.plan_day) {
               $('#p-thur').html(plan)
               $('#id-thur').val(value.id)
               $('#status-thur').html(status)
               $('#status-thur').addClass(css)
            } else if ('周五'==value.plan_day) {
               $('#p-fri').html(plan)
               $('#id-fri').val(value.id)
               $('#status-fri').html(status)
               $('#status-fri').addClass(css)
            } else if ('周六'==value.plan_day) {
               $('#p-sat').html(plan)
               $('#id-sat').val(value.id)
               $('#status-sat').html(status)
               $('#status-sat').addClass(css)
            } else if ('周日'==value.plan_day) {
               $('#p-sun').html(plan)
               $('#id-sun').val(value.id)
               $('#status-sun').html(status)
               $('#status-sun').addClass(css)
            }
        });
      } else {
        alert("加载计划失败，请稍后重试！");
      }
    }
    $('.plan_item_btn .right').dropdownMenu({
      menus: [
        {
          text: '开始训练',
          value: 'connect',
          click: function (_, __, ___, innerValue) {
            $.ajax({
              url: "/get-user-plan-detail",
              type: "get",
              data: 'plan_dtl_id='+innerValue
            }).done(function(response) {
              detail_data = response.data.plan_detail
              course_data = response.data.course
              if (course_data) {
                window.open('/fitness/'+ course_data.theme_code + '/man/' + course_data.code, '_blank');
              } else {
                alert('尚未关联课程，请先关联课程！');
              }
            }).fail(function(error) {
              console.error("Error sending message:", error);
              appendMessage('assistant', "抱歉，发生了错误，请稍后再试。");
              $('#loading').hide();
            });
          }
        },
        {
          text: '查看详情',
          value: 'view-detail',
          click: function (_, __, ___, innerValue) {
            $.ajax({
              url: "/get-user-plan-detail",
              type: "get",
              data: 'plan_dtl_id='+innerValue
            }).done(function(response) {
              detail_data = response.data.plan_detail
              course_data = response.data.course
              course_name = '尚未关联课程'
              if (course_data) {
                course_name = course_data.name
              }
              openModalInput({
                  title: '计划详细',
                  fields: [
                    {
                      type: 'span',
                      name: 'name',
                      label: '名称',
                      default: detail_data.plan,
                    },
                    {
                      type: 'span',
                      name: 'context',
                      label: '描述',
                      default: detail_data.context
                    },
                    {
                      type: 'span',
                      name: 'context',
                      label: '关联课程',
                      default: course_name
                    }
                  ],

                  onConfirm: function (values) {
                    $.ajax({
                      url: "/change-user-plan",
                      type: "post",
                      contentType: "application/json",
                      dataType: 'json',
                      data: JSON.stringify({
                        origin_id: $('#activePlan').val(),
                        new_id: values.plan_id,
                      })
                    }).done(function(response) {
                      renderPlan(response)
                    }).fail(function(error) {
                      console.error("Error sending message:", error);
                      appendMessage('assistant', "抱歉，发生了错误，请稍后再试。");
                      $('#loading').hide();
                    });
                    console.log('提交数据', values)
                  }
                })
            }).fail(function(error) {
              console.error("Error sending message:", error);
              appendMessage('assistant', "抱歉，发生了错误，请稍后再试。");
              $('#loading').hide();
            });
          }
        },
        {
          text: '关联课程',
          value: 'connect',
          click: function (_, __, ___, innerValue) {
              $.ajax({
                  url: "/get-user-plan-detail",
                  type: "get",
                  data: 'plan_dtl_id='+innerValue
                }).done(function(response) {
                  detail_data = response.data.plan_detail
                  connection = response.data.connection
                  connection_id = null
                  course_id = null
                  if (connection) {
                    connection_id = connection.plan_dtl_course_id
                    course_id = connection.course_id
                  }
                openModalInput({
                  title: '计划关联课程',
                  fields: [
                    {
                      type: "select",
                      name: "course_id",
                      label: "课程",
                      default: course_id,
                      options: [{'value':'sport','label':'11'}],
                      dataUrl: "/course/get-courses",
                      valueKey: "course_id",
                      labelKey: "name",
                      validate: v => v ? {valid:true} : {valid:false, msg:"请选择关联课程"}
                    },
                    {
                      type: "text",
                      name: "plan_dtl_id",
                      show: 'hidden',
                      default: innerValue
                    },
                    {
                      type: "text",
                      name: "plan_dtl_course_id",
                      show: 'hidden',
                      default: connection_id
                    }
                  ],
                  onConfirm: function (values) {
                  console.info(values)
                    $.ajax({
                      url: "/save-plan-detail-course",
                      type: "post",
                      contentType: "application/json",
                      dataType: 'json',
                      data: JSON.stringify({
                        plan_dtl_id: values.plan_dtl_id,
                        course_id: values.course_id,
                        plan_dtl_course_id: values.plan_dtl_course_id,
                      })
                    }).done(function(response) {
                      if (response.success) {
                        alert('操作成功！');
                      }
                      renderPlan(response)
                    }).fail(function(error) {
                      console.error("Error sending message:", error);
                      appendMessage('assistant', "抱歉，发生了错误，请稍后再试。");
                      $('#loading').hide();
                    });
                    console.log('提交数据', values)
                  }
                })
              }).fail(function(error) {
                 console.error("Error sending message:", error);
                 appendMessage('assistant', "抱歉，发生了错误，请稍后再试。");
                $('#loading').hide();
            });
          }
        },
        {
          text: '编辑',
          value: 'edit',
          click: function (value, text, index, innerValue) {
            $.ajax({
              url: "/get-user-plan-detail",
              type: "get",
              data: 'plan_dtl_id='+innerValue
            }).done(function(response) {
              detail_data = response.data.plan_detail
              openModalInput({
                  title: '编辑计划详细',
                  fields: [
                    {
                      type: 'text',
                      name: 'plan',
                      label: '名称',
                      default: detail_data.plan,
                      validate: function (v) {
                        return { valid: !!v, msg: '不能为空' }
                      }
                    },
                    {
                      type: 'textarea',
                      name: 'context',
                      label: '描述',
                      default: detail_data.context
                    },
                    {
                      type: "text",
                      name: "id",
                      show: 'hidden',
                      default: detail_data.id
                    },
                    {
                      type: "text",
                      name: "plan_day",
                      show: 'hidden',
                      default: detail_data.plan_day
                    }
                  ],

                  onConfirm: function (values) {
                    console.info(values)
                    $.ajax({
                      url: "/save-plan-detail",
                      type: "post",
                      contentType: "application/json",
                      dataType: 'json',
                      data: JSON.stringify({
                        id: values.id,
                        plan_day: values.plan_day,
                        plan: values.plan,
                        context: values.context
                      })
                    }).done(function(response) {
                      if (response.success) {
                        alert('操作成功！');
                      }
                      renderPlan(response)
                    }).fail(function(error) {
                      console.error("Error sending message:", error);
                      appendMessage('assistant', "抱歉，发生了错误，请稍后再试。");
                      $('#loading').hide();
                    });
                    console.log('提交数据', values)
                  }
                })
            }).fail(function(error) {
                 console.error("Error sending message:", error);
                 appendMessage('assistant', "抱歉，发生了错误，请稍后再试。");
                $('#loading').hide();
            });
          }
        }
      ]
    })

    $("#open").click(()=>$.scheduleCalendar({
         data:{
          "2025-12-01":"会议",
          "2025-12-02":"培训"
         }
        }));


})