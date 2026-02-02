import _thread as thread
import base64
import datetime
import hashlib
import hmac
import json
from urllib.parse import urlparse
import ssl
from datetime import datetime
from time import mktime
from urllib.parse import urlencode
from wsgiref.handlers import format_date_time
import threading

import websocket  # 使用dataplicity_websocket_client

# 使用字典存储每个会话的回答，而不是全局变量
session_answers = {}
session_lock = threading.Lock()


class Ws_Param(object):
    # 初始化
    def __init__(self, APPID, APIKey, APISecret, Spark_url):
        self.APPID = APPID
        self.APIKey = APIKey
        self.APISecret = APISecret
        self.host = urlparse(Spark_url).netloc
        self.path = urlparse(Spark_url).path
        self.Spark_url = Spark_url

    # 生成url
    def create_url(self):
        # 生成RFC1123格式的时间戳
        now = datetime.now()
        date = format_date_time(mktime(now.timetuple()))

        # 拼接字符串
        signature_origin = "host: " + self.host + "\n"
        signature_origin += "date: " + date + "\n"
        signature_origin += "GET " + self.path + " HTTP/1.1"

        # 进行hmac-sha256进行加密
        signature_sha = hmac.new(self.APISecret.encode('utf-8'), signature_origin.encode('utf-8'),
                                 digestmod=hashlib.sha256).digest()

        signature_sha_base64 = base64.b64encode(signature_sha).decode(encoding='utf-8')

        authorization_origin = f'api_key="{self.APIKey}", algorithm="hmac-sha256", headers="host date request-line", signature="{signature_sha_base64}"'

        authorization = base64.b64encode(authorization_origin.encode('utf-8')).decode(encoding='utf-8')

        # 将请求的鉴权参数组合为字典
        v = {
            "authorization": authorization,
            "date": date,
            "host": self.host
        }
        # 拼接鉴权参数，生成url
        url = self.Spark_url + '?' + urlencode(v)
        # 此处打印出建立连接时候的url,参考本demo的时候可取消上方打印的注释，比对相同参数时生成的url与自己代码生成的url是否一致
        return url


# 收到websocket错误的处理
def on_error(ws, error):
    print(f"### error (session_id: {ws.session_id}): {error}")


# 收到websocket关闭的处理
def on_close(ws, one, two):
    print(f" ")


# 收到websocket连接建立的处理
def on_open(ws):
    thread.start_new_thread(run, (ws,))


def run(ws, *args):
    data = json.dumps(gen_params(appid=ws.appid, domain=ws.domain, question=ws.question, history=ws.history))
    ws.send(data)


# 收到websocket消息的处理
def on_message(ws, message):
    print(f"收到WebSocket消息 (session_id: {ws.session_id}): {message}")
    data = json.loads(message)
    code = data['header']['code']
    if code != 0:
        print(f'请求错误 (session_id: {ws.session_id}): {code}, {data}')
        ws.close()
    else:
        choices = data["payload"]["choices"]
        status = choices["status"]
        content = choices["text"][0]["content"]
        print(f"AI回复内容 (session_id: {ws.session_id}): {content}")
        
        # 使用回调函数处理内容
        if hasattr(ws, 'callback') and callable(ws.callback):
            ws.callback(content)
        
        # 同时保存到会话字典
        with session_lock:
            if ws.session_id not in session_answers:
                session_answers[ws.session_id] = ""
            session_answers[ws.session_id] += content
            print(f"当前累积回答 (session_id: {ws.session_id}): {session_answers[ws.session_id]}")
        
        if status == 2:
            print("响应完成，关闭WebSocket连接 (session_id: {ws.session_id})")
            ws.close()


def gen_params(appid, domain, question, history=None):
    """
    通过appid和用户的提问来生成请参数，支持历史对话
    如果请求制定计划，生成个七日计划。
    要求：
    1. 计划包含周一至周日的内容。
    2. 每个计划项只能根据问题找到对应课程，全部课程包含（原地缓慢运动课程，骨科术后康复课程，心肺疾病康复课程）。
    3. 生成格式:##周*：标题## 
    """
    data = {
        "header": {
            "app_id": appid,
            "uid": "1234"
        },
        "parameter": {
            "chat": {
                "domain": domain,
                "temperature": 0.5,
                "max_tokens": 2048
            }
        },
        "payload": {
            "message": {
                "text": question
            }
        }
    }
    
    # 如果有历史对话，添加到请求中
    if history and len(history) > 0:
        # 转换历史对话格式
        formatted_history = []
        for msg in history:
            role = "assistant" if msg.get("role") == "assistant" else "user"
            content = msg.get("content", "")
            if content:
                formatted_history.append({"role": role, "content": content})
        
        # 只保留最近的10条对话
        if len(formatted_history) > 10:
            formatted_history = formatted_history[-10:]
        
        # 添加到请求中
        if formatted_history:
            data["payload"]["message"]["text"] = question + formatted_history
    
    return data


def main(appid, api_key, api_secret, Spark_url, domain, question, callback=None, session_id=None, history=None):
    # 如果没有提供session_id，生成一个
    if session_id is None:
        session_id = f"session_{datetime.now().timestamp()}_{hash(question) % 10000}"
    
    # 重置会话回答
    with session_lock:
        session_answers[session_id] = ""
    
    # 创建WebSocket参数
    wsParam = Ws_Param(appid, api_key, api_secret, Spark_url)
    websocket.enableTrace(False)
    wsUrl = wsParam.create_url()
    
    # 创建WebSocket连接
    ws = websocket.WebSocketApp(wsUrl, on_message=on_message, on_error=on_error, on_close=on_close, on_open=on_open)
    
    # 设置属性
    ws.appid = appid
    ws.question = question
    ws.domain = domain
    ws.callback = callback  # 设置回调函数
    ws.session_id = session_id  # 设置会话ID
    ws.history = history  # 设置历史对话
    
    # 运行WebSocket
    ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})
    
    # 返回结果
    with session_lock:
        result = session_answers.get(session_id, "")
        # 清理会话数据
        if session_id in session_answers:
            del session_answers[session_id]
    
    return result


def getText(role, content):
    text = []
    jsoncon = {}
    jsoncon["role"] = role
    jsoncon["content"] = content
    text.append(jsoncon)
    return text


def getlength(text):
    length = 0
    for content in text:
        temp = content["content"]
        leng = len(temp)
        length += leng
    return length


def checklen(text):
    while (getlength(text) > 8000):
        del text[0]
    return text


def config():
    config = {}
    # config["appid"] = "26f96b41"
    # config["api_secret"] = "NTFkMGM1ZGQ1YzliMzkxNzEwODBmZjRh"
    # config["api_key"] = "38d618a9cf023aa8a53ca442fc03cd78"
    # config["domain"] = "lite"
    # config["Spark_url"] = "wss://spark-api.xf-yun.com/v1.1/chat"

    config["appid"] = "e6b3eaaf"
    config["api_secret"] = "YmI4NmZmYmJhOWZjOTllMzVkZTExZjJj"
    config["api_key"] = "50c272d82b0ffe0f2b2e490c255055e0"
    config["domain"] = "lite"
    config["Spark_url"] = "wss://spark-api.xf-yun.com/v1.1/chat"
    return config