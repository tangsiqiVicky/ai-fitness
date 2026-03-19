$(document).ready(function() {
  //  $("#addPlanModal").hide();
  // 获取用户ID
  const userid = $('#userid').val();
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // 会话ID - 用于区分不同用户的请求
  const sessionId = generateSessionId();
  
  // 康训助手头像URL
  const botAvatarUrl = "/static/img/fitness_assistant.png"; // 康训助手头像路径
  
  // 自动调整文本区域高度
  function autoResizeTextarea() {
    const textarea = document.getElementById('input_text');
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
  }

  // 生成唯一的会话ID
  function generateSessionId() {
    return 'session_' + userid + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // 获取用户信息
  function getUserInfo() {
    let username = "游客";
    let avatarUrl = "/static/img/visitor.jpg"; // 修正路径
    
    if (userid && userid !== "0") {
      // 如果用户已登录，使用用户ID作为用户名
      username = "用户" + userid;
      // 可以根据用户ID设置不同的头像
      avatarUrl = "/static/img/user.png"; // 修正路径
    }
    
    return { username, avatarUrl };
  }

  // 历史对话数据
  let chatHistory = [];
  
  // 当前对话ID
  let currentChatId = Date.now();
  
  // 加载历史对话
  function loadChatHistory() {
    // 从localStorage获取历史记录，使用用户ID作为key的一部分以区分不同用户
    const storageKey = userid !== '0' ? `chatHistory_${userid}` : 'chatHistory_guest';
    chatHistory = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    // 如果没有历史记录，创建一个新的
    if (chatHistory.length === 0) {
      const newChat = {
        id: currentChatId,
        title: "新对话",
        timestamp: new Date().toISOString(),
        messages: []
      };
      chatHistory.push(newChat);
      saveChatHistory();
    } else {
      currentChatId = chatHistory[0].id;
    }
    
    renderChatHistory();
  }
  
  // 渲染历史对话列表
  function renderChatHistory() {
    const historyList = $('#historyList');
    historyList.empty();
    
    // 添加新建对话按钮
    const newChatButton = $(`
      <div class="history-item new-chat" id="newChatButton">
        <p><i class="fas fa-plus"></i> 新建对话</p>
      </div>
    `);
    
    historyList.append(newChatButton);
    
    // 添加历史对话
    chatHistory.forEach(chat => {
      const date = new Date(chat.timestamp);
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      
      const historyItem = $(`
        <div class="history-item ${chat.id === currentChatId ? 'active' : ''}" data-id="${chat.id}">
          <p>${chat.title}</p>
          <div class="timestamp">${formattedDate}</div>
          <div class="delete-chat-btn" data-id="${chat.id}" title="删除此对话"><i class="fas fa-times"></i></div>
        </div>
      `);
      
      historyList.append(historyItem);
    });
    
    // 绑定点击事件
    $('.history-item:not(.new-chat)').click(function(e) {
      // 如果点击的是删除按钮，不执行加载对话操作
      if (!$(e.target).hasClass('delete-chat-btn') && !$(e.target).closest('.delete-chat-btn').length) {
        const chatId = parseInt($(this).data('id'));
        loadChat(chatId);
      }
    });
    
    // 绑定删除按钮点击事件
    $('.delete-chat-btn').click(function(e) {
      e.stopPropagation(); // 阻止事件冒泡
      const chatId = parseInt($(this).data('id'));
      deleteChat(chatId);
    });
    
    // 绑定新建对话按钮点击事件
    $('#newChatButton').click(createNewChat);
  }
  
  // 删除对话功能
  function deleteChat(chatId) {
    // 确认是否删除
    if (!confirm('确定要删除这个对话吗？')) {
      return;
    }
    
    // 查找要删除的对话索引
    const chatIndex = chatHistory.findIndex(c => c.id === chatId);
    if (chatIndex === -1) return;
    
    // 删除对话
    chatHistory.splice(chatIndex, 1);
    
    // 如果删除的是当前对话，加载第一个对话或创建新对话
    if (chatId === currentChatId) {
      if (chatHistory.length > 0) {
        loadChat(chatHistory[0].id);
      } else {
        createNewChat();
      }
    }
    
    // 保存并重新渲染
    saveChatHistory();
    renderChatHistory();
  }

  // 加载特定对话
  function loadChat(chatId) {
    currentChatId = chatId;
    
    // 更新活动状态
    $('.history-item').removeClass('active');
    $(`.history-item[data-id="${chatId}"]`).addClass('active');
    
    // 清空当前对话
    $('#conversation').empty();
    
    // 添加欢迎消息
    $('#conversation').append(`
      <div class="message-container">
        <div class="bot-avatar-container">
          <div class="avatar">
            <img src="${botAvatarUrl}" alt="康训助手" onerror="this.src='https://cdn-icons-png.flaticon.com/512/2936/2936886.png'">
          </div>
          <div class="username">康训助手</div>
        </div>
        <div class="bot-message">
          <div class="message-content">
            你好！我是你的康训智能助手。我可以帮你制定训练计划、解答康训疑问、提供饮食建议等。请告诉我你需要什么帮助？
          </div>
        </div>
      </div>
    `);
    
    // 加载对话消息
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat && chat.messages.length > 0) {
      chat.messages.forEach(msg => {
        appendMessage(msg.role, msg.content);
      });
    }
    
    // 滚动到底部
    scrollToBottom();
  }
  
  // 保存历史对话
  function saveChatHistory() {
    const storageKey = userid !== '0' ? `chatHistory_${userid}` : 'chatHistory_guest';
    localStorage.setItem(storageKey, JSON.stringify(chatHistory));
  }
  
  // 创建新对话
  function createNewChat() {
    currentChatId = Date.now();
    const newChat = {
      id: currentChatId,
      title: "新对话",
      timestamp: new Date().toISOString(),
      messages: []
    };
    
    // 添加到历史记录的开头
    chatHistory.unshift(newChat);
    
    // 如果历史记录超过10条，删除最旧的
    if (chatHistory.length > 10) {
      chatHistory.pop();
    }
    
    saveChatHistory();
    loadChat(currentChatId);
    renderChatHistory();
  }
  
  // 更新对话标题
  function updateChatTitle(chatId, firstMessage) {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      // 使用用户的第一条消息作为标题，截取前20个字符
      chat.title = firstMessage.substring(0, 20) + (firstMessage.length > 20 ? '...' : '');
      saveChatHistory();
      renderChatHistory();
    }
  }
  
  // 添加消息到当前对话
  function addMessageToCurrentChat(role, content) {
    const chat = chatHistory.find(c => c.id === currentChatId);
    if (chat) {
      chat.messages.push({ role, content });
      
      // 如果是用户的第一条消息，更新对话标题
      if (role === 'user' && chat.messages.filter(m => m.role === 'user').length === 1) {
        updateChatTitle(currentChatId, content);
      }
      
      saveChatHistory();
    }
  }
  
  // 添加消息到对话框 - 修改这个函数
  function appendMessage(role, content) {
    const isUser = role === 'user';
    const formattedContent = content.replace(/\n/g, "<br>");
    
    if (isUser) {
      const userInfo = getUserInfo();
      const messageHtml = `
        <div class="message-container">
          <div class="user-message-header">
            <div class="username">${userInfo.username}</div>
            <div class="avatar">
              <img src="${userInfo.avatarUrl}" alt="用户头像" onerror="this.src='https://cdn-icons-png.flaticon.com/512/1077/1077114.png'">
            </div>
          </div>
          <div class="user-message">
            <div class="message-content">
              ${formattedContent}
            </div>
          </div>
        </div>
      `;
      
      $('#conversation').append(messageHtml);
    } else {
      const messageHtml = `
        <div class="message-container">
          <div class="bot-avatar-container">
            <div class="avatar">
              <img src="${botAvatarUrl}" alt="康训助手" onerror="this.src='https://cdn-icons-png.flaticon.com/512/2936/2936886.png'">
            </div>
            <div class="username">康训助手</div>
          </div>
          <div class="bot-message">
            <div class="message-content">
              ${formattedContent}
            </div>
          </div>
        </div>
      `;
      
      $('#conversation').append(messageHtml);
    }
    
    scrollToBottom();
  }
  
  // 滚动到对话底部
  function scrollToBottom() {
    const conversation = document.getElementById('conversation');
    conversation.scrollTop = conversation.scrollHeight;
  }
  
  // 发送消息到服务器
  function sendMessage(message) {
    $('#loading').show();
    console.log("发送消息到服务器:", message);
    console.log("使用会话ID:", sessionId);
    
    // 获取当前对话的历史记录
    const chat = chatHistory.find(c => c.id === currentChatId);
    let history = [];
    
    if (chat && chat.messages.length > 0) {
      // 只取最近的10条消息
      const recentMessages = chat.messages.slice(-10);
      history = recentMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      console.log("发送历史对话:", history);
    }
    
    // 添加会话ID、用户ID和历史对话到请求中
    $.ajax({
      url: "/upload",
      type: "post",
      contentType: "application/json",
      dataType: 'json',
      data: JSON.stringify({ 
        input: message,
        session_id: sessionId,
        user_id: userid,
        history: history
      })
    }).done(function(response) {
      console.log("收到服务器响应:", response);
      const botResponse = response.msg;
      
      if (!botResponse) {
        console.error("服务器返回空响应");
        appendMessage('assistant', "抱歉，我暂时无法回答您的问题。请稍后再试。");
      } else {
        // 添加机器人回复到对话
        appendMessage('assistant', botResponse);
        addMessageToCurrentChat('assistant', botResponse);
      }
      
      $('#loading').hide();
    }).fail(function(error) {
      console.error("Error sending message:", error);
      appendMessage('assistant', "抱歉，发生了错误，请稍后再试。");
      $('#loading').hide();
    });
  }

  // 处理发送按钮点击
  $('#send_button').click(function() {
    const message = $('#input_text').val().trim();
    if (message) {
      // 添加用户消息到对话
      appendMessage('user', message);
      addMessageToCurrentChat('user', message);
      
      // 发送到服务器
      sendMessage(message);
      
      // 清空输入框
      $('#input_text').val('');
      $('#input_text').css('height', 'auto');
    }
  });
  
  // 处理回车键发送
  $('#input_text').keypress(function(e) {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();
      $('#send_button').click();
    }
  });
  
  // 自动调整文本区域高度
  $('#input_text').on('input', autoResizeTextarea);
  
  // 处理快捷提示点击
  $('.prompt-chip').click(function() {
    const promptText = $(this).data('prompt');
    $('#input_text').val(promptText);
    autoResizeTextarea();
  });
  // $("#cancelAddPlan").click(function() {
  //   $("#addPlanModal").hide();
  // });
  let lastAssistantMessage = null;
  // 添加到我的计划功能
  $('#add_to_plan_button').click(function() {
    // 获取当前对话中最后一条助手消息
    const chat = chatHistory.find(c => c.id === currentChatId);
    if (!chat || !chat.messages.length) {
      alert("当前没有可添加到计划的内容");
      return;
    }
    
    const assistantMessages = chat.messages.filter(m => m.role === 'assistant');
    if (!assistantMessages.length) {
      alert("当前没有可添加到计划的内容");
      return;
    }

     lastAssistantMessage = assistantMessages[assistantMessages.length - 1].content;

  //   // 使用新的解析方法替代原有逻辑
  //   const planData = parseWorkoutPlan(lastAssistantMessage);

  //   // 将计划数据复制到剪贴板
  //   function copyToClipboard(text) {
  //       if (!navigator.clipboard) {
  //           // 传统方法备用
  //           const textarea = document.createElement('textarea');
  //           textarea.value = text;
  //           document.body.appendChild(textarea);
  //           textarea.select();
  //           document.execCommand('copy');
  //           document.body.removeChild(textarea);
  //           return true;
  //       }
  //       return navigator.clipboard.writeText(text);
  //   }

  //   // 复制原始消息或解析后的JSON数据
  //   const copyText = lastAssistantMessage;
  //   copyToClipboard(copyText)
  //       .then(() => {
  //           console.log('计划数据已复制到剪贴板');
  //           alert("当无法解析计划内容时，计划已经复制到剪切板请手动添加到计划中");
  //       })
  //       .catch(err => {
  //           console.error('复制失败:', err);
  //           alert('复制失败，请手动复制内容');
  //       });

  //   if (!planData) {
  //       alert("当无法解析计划内容时，计划已经复制到剪切板请手动添加到计划中");
  //       return;
  //   }

  //   // 填充表单数据
  //   weekdays.forEach(day => {
  //       const dayData = planData.days[day];
  //       if (dayData && dayData.title) {
  //           const titleElement = document.getElementById(`${day}-title`);
  //           const contentElement = document.getElementById(`${day}-content`);
  //           if (titleElement) titleElement.value = dayData.title;
  //           if (contentElement) {
  //             // 清空现有内容
  //             contentElement.innerHTML = '';
  //             // 循环生成input元素
  //             const textarea = document.createElement('textarea');
  //             textarea.name = 'item';
  //             textarea.value = dayData.content.join('\n');
  //             contentElement.appendChild(textarea);

  //             // dayData.content.forEach((item, index) => {
  //             //     const input = document.createElement('input');
  //             //     input.type = 'text';
  //             //     input.name = 'item';
  //             //     input.value = item;
  //             //     input.className = 'plan-item-input';
  //             //     input.placeholder = `项目 ${index + 1}`;
  //             //     // 添加到容器
  //             //     contentElement.appendChild(input);
  //             //     // 添加换行符
  //             //     contentElement.appendChild(document.createElement('br'));
  //             // });
  //           }
  //       }
  //   });
  //  $("#addPlanModal").show();

  //   $("#loading").show();
   



  // const startDate = formatDate(new Date()); 
  //   $.ajax({
  //     url: "/add-to-plan?id=" + userid +'&startDate='+startDate,
  //     type: "post",
  //     contentType: "application/x-www-form-urlencoded",
  //     data: 'message=' + encodeURIComponent(lastAssistantMessage)
  //   }).done(function(response) {
  //     if (!response.success) {
  //       alert(response.error);
  //     } else if (response.success) {
  //       alert("已成功加入您的计划！");
  //     } else {
  //       alert("加入计划失败，请稍后重试！");
  //     }
  //     $("#loading").hide();
  //   }).fail(function() {
  //     alert("网络错误，请稍后重试！");
  //     $("#loading").hide();
  //   });
  });
   function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  function getWeekDates(selectedDate) {
    // 创建副本避免修改原日期
    const d = new Date(selectedDate);
    // 获取当前是星期几（0=周日, 1=周一, ..., 6=周六）
    const dayOfWeek = d.getDay();
    
    // 计算周一：如果今天是周日（0），则周一在 6 天前；否则减 (dayOfWeek - 1)
    const monday = new Date(d);
    monday.setDate(d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(formatDate(day));
    }
    return week; // [mon, tue, wed, thu, fri, sat, sun]
  }
  const input = document.getElementById('startDate');
  input.addEventListener('change', function () {
    const selected = new Date(this.value);
    const weekDates = getWeekDates(selected);

    weekdays.forEach((id, index) => {
      document.getElementById(id+'-time').value = weekDates[index];
    });
  });
  // $("#confirmAddPlan").click(function() {
  //   if (!$("#planTitle").val()) {
  //       alert("请输入计划名称");
  //       return;
  //   }
  //   if (!$("#startDate").val()) {
  //       alert("请输入计划开始日期");
  //       return;
  //   }
  //   // 收集计划内容
  //   const planContent = weekdays.map(day => {
  //       const contentElement = document.getElementById(`${day}-title`);
  //       return contentElement ? contentElement.value.trim() : '';
  //   });
  //   console.log(planContent.length);
  //   if (planContent.length === 0) {
  //       alert("请输入至少一天的计划内容");
  //       return;
  //   }

  //   $.ajax({
  //     url: "/add-to-plan-weekly?id=" + userid,
  //     type: "post",
  //     contentType: "application/json",
  //     data: JSON.stringify({
  //       title: $("#planTitle").val(),
  //       message: lastAssistantMessage,
  //       monday:{data:[
  //           {type: "title", "text": $("#monday-title").val()},
  //           {type: "time", "text": $("#monday-time").val()},
  //           {type: "item", "text": $("#monday-content textarea[name='item']").val()},
  //       ]},
  //       tuesday: {data:[
  //           {type: "title", "text": $("#tuesday-title").val()},
  //           {type: "time", "text": $("#tuesday-time").val()},
  //           {type: "item", "text": $("#tuesday-content textarea[name='item']").val()},
  //       ]},
  //       wednesday: {data:[
  //           {type: "title", "text": $("#wednesday-title").val()},
  //           {type: "time", "text": $("#wednesday-time").val()},
  //           {type: "item", "text": $("#wednesday-content textarea[name='item']").val()},
  //       ]},
  //       thursday: {data:[     
  //           {type: "title", "text": $("#thursday-title").val()},
  //           {type: "time", "text": $("#thursday-time").val()},
  //           {type: "item", "text": $("#thursday-content textarea[name='item']").val()},
  //       ]},
  //       friday: {data:[
  //           {type: "title", "text": $("#friday-title").val()},
  //           {type: "time", "text": $("#friday-time").val()},
  //           {type: "item", "text": $("#friday-content textarea[name='item']").val()},
  //       ]},
  //       saturday: {data:[
  //           {type: "title", "text": $("#saturday-title").val()},
  //           {type: "time", "text": $("#saturday-time").val()},
  //           {type: "item", "text": $("#saturday-content textarea[name='item']").val()},
  //       ]},
  //       sunday: {data:[
  //           {type: "title", "text": $("#sunday-title").val()},
  //           {type: "time", "text": $("#sunday-time").val()},
  //           {type: "item", "text": $("#sunday-content textarea[name='item']").val()},
  //       ]},  
  //     })
  //   }).done(function(response) {
  //     if (!response.success) {
  //       alert(response.error);
  //     } else if (response.success) {
  //       alert("已成功加入您的计划！");
  //       $("#addPlanModal").hide();
  //     } else {
  //       alert("加入计划失败，请稍后重试！");
  //     }
  //     $("#loading").hide();
  //     // 清空表单数据
  //     // weekdays.forEach(day => {
  //     //   const titleElement = document.getElementById(`${day}-title`);
  //     //   const contentElement = document.getElementById(`${day}-content`);
  //     //   if (titleElement) titleElement.value = "";
  //     //   if (contentElement) contentElement.value = "";
  //     // });
  //   }).fail(function() {
  //     alert("网络错误，请稍后重试！");
  //     $("#loading").hide();
  //   });
  // });
  $("#add_to_plan_button").modalInput({
      title: "请给计划起个名吧",
      animation: "zoom", // fade / zoom / slide

      fields: [
        {
          type: "text",
          name: "title",
          label: "计划名称",
          placeholder: "请输入计划名称",
          validate: v => v ? {valid:true} : {valid:false, msg:"计划名称不能为空"}
        },
        /*{
          type: "textarea",
          name: "desc",
          label: "描述",
          placeholder: "请输入描述内容",
          default: "",
          validate: v => ({valid:true})
        },
        {
          type: "select",
          name: "category",
          label: "类别",
          default: "sport",
          options: [
            {value:"sport", label:"运动"},
            {value:"diet",  label:"饮食"},
            {value:"rest",  label:"休息"}
          ]
        },
        {
          type: "radio",
          name: "level",
          label: "强度等级",
          default: "middle",
          options: [
            {value:"low", label:"低"},
            {value:"middle", label:"中"},
            {value:"high", label:"高"},
          ]
        }*/
      ],

      onConfirm: function(values){
//        alert("提交的数据：" + JSON.stringify(values, null, 2));
        submitPlan(values.title);
      }
    });

  function submitPlan(title) {
      // 获取当前对话中最后一条助手消息
        const chat = chatHistory.find(c => c.id === currentChatId);
        if (!chat || !chat.messages.length) {
          alert("当前没有可添加到计划的内容");
          return;
        }

        const assistantMessages = chat.messages.filter(m => m.role === 'assistant');
        if (!assistantMessages.length) {
          alert("当前没有可添加到计划的内容");
          return;
        }

        const lastAssistantMessage = assistantMessages[assistantMessages.length - 1].content;

        $("#loading").show();
        // 发送数据到服务器
        $.ajax({
          url: "/add-to-plan?id=" + userid+'&startDate='+formatDate(new Date()),
          type: "post",
          contentType: "application/x-www-form-urlencoded",
          data: 'message=' + encodeURIComponent(lastAssistantMessage) + '&title=' + title
        }).done(function(response) {
          if (!response.success) {
            alert(response.error);
          } else if (response.success) {
            alert("已成功加入您的计划！");
          } else {
            alert("加入计划失败，请稍后重试！");
          }
          $("#loading").hide();
        }).fail(function() {
          alert("网络错误，请稍后重试！");
          $("#loading").hide();
        });
    }
  // 初始化
  loadChatHistory();
});

// 统一的计划解析方法
function parseWorkoutPlan(text) {
    const planData = {
        title: '',
        days: {
            monday: { title: '', content: [] },
            tuesday: { title: '', content: [] },
            wednesday: { title: '', content: [] },
            thursday: { title: '', content: [] },
            friday: { title: '', content: [] },
            saturday: { title: '', content: [] },
            sunday: { title: '', content: [] }
        }
    };

    // 定义所有支持的标题格式正则表达式
    const headingPatterns = [
        /^\*\*\s*([^：:]+)[:：](.*?)\*\*$/, // 原始格式：** 周X: 标题 **
        /^####\s*([^：:]+)[:：]\s*(.*?)(\s*$|\s+#)/, // #### 周X: 标题
        /^####\s*第[一二三四五六七]天\s*[:：]\s*(.*?)$/, // 新增：#### 第X天: 标题
        /^##\s*([^：:]+)[:：]\s*(.*?)$/, // ## 周X: 标题
        /^###\s*([^：:]+)[:：]\s*(.*?)$/, // ### 周X: 标题
        /^周[一二三四五六日1-7]\s*[:：]\s*(.*?)$/ // 周X: 标题（无标记）
    ];

    // 星期名称映射
    const dayNameMap = {
        '周一': 'monday', '周二': 'tuesday', '周三': 'wednesday',
        '周四': 'thursday', '周五': 'friday', '周六': 'saturday', '周日': 'sunday',
        '周1': 'monday', '周2': 'tuesday', '周3': 'wednesday',
        '周4': 'thursday', '周5': 'friday', '周6': 'saturday', '周7': 'sunday'
    };

    let currentDay = null;
    const lines = text.split('\n');

    lines.forEach((line, index) => {
        line = line.trim();
        if (!line) return;

        // 尝试匹配标题行
        let matched = false;
        for (const pattern of headingPatterns) {
            const match = line.match(pattern);
            if (match) {
                // 提取星期名称和标题
                let dayName = match[1] ? match[1].trim() : '';
                const title = match[2] ? match[2].trim() : '';

                // 如果未提取到星期名称，尝试从行首提取
                if (!dayName && match[0]) {
                    const dayMatch = match[0].match(/周[一二三四五六日1-7]/);
                    if (dayMatch) dayName = dayMatch[0];
                }

                // 查找对应的星期键
                currentDay = dayNameMap[dayName] || null;
                if (currentDay && planData.days[currentDay]) {
                    planData.days[currentDay].title = title;
                }
                matched = true;
                break;
            }
        }

        // 如果不是标题行且当前有活跃的星期，则添加内容
        if (!matched && currentDay && planData.days[currentDay]) {
            // 处理列表项
            if (line.startsWith('- ')) {
                planData.days[currentDay].content.push(line.substring(2).trim());
            } else {
                // 普通文本行
                planData.days[currentDay].content.push(line);
            }
        }
    });

    return planData;
}