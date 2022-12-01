import requests, json

headers = {'Content-Type': 'application/json'}
base_url = "http://127.0.0.1:65530/api"

# for i in range(10, 20):
#     requests.post(base_url + "/user/signup",headers=headers,data=json.dumps({
#         "username": "回答者" + str(i) + "号",
#         "email": "respondent" + str(i) + "@r.com",
#         "password": "123456aaa"
#     }))

# for i in range(10, 20):
#     response = requests.post(base_url+"/user/login", headers=headers, data=json.dumps({
#                 "username": "回答者" + str(i) + "号",
#                 "password": "123456aaa"
#             }))
#     token = json.loads(response.text).get("data").get("token")
#     authorized_headers = {'Content-Type': 'application/json', 'Authorization': token}
#     requests.post(base_url + "/user/settings/basic",headers=authorized_headers,data=json.dumps({
#         "wechat": "respondent_wechat" + str(i),
#         "weibo": "respondent_weibo" + str(i),
#         "avatar": "respondent_avatar" + str(i),
#         "location": "respondent_location" + str(i)
#     }))
#     requests.post(base_url + "/user/apply",headers=authorized_headers,data=json.dumps({
#         "specialities": ["编程","绘画","弹琴"],
#         "fee": i,
#         "description": "我是回答者" + str(i) + "号",
#         "detail": "我是回答者" + str(i) + "号，欢迎有疑问的小伙伴们来提问呀~"
#     }))






# response = requests.post(base_url + "/admin/login", headers=headers, data=json.dumps({
#         "username": "root",
#         "password": "123456aaa"
#     }))
# token = json.loads(response.text).get("data").get("token")
# authorized_headers = {'Content-Type': 'application/json', 'Authorization': token}
# response = requests.get(base_url + "/admin/questions", headers=authorized_headers, params={
#         "page": 0,
#         "size": 10,
#         "status": "CENSORING"
#     })
# questions = json.loads(response.text).get("data").get("content")
# for question in questions:
#     requests.put(base_url + "/admin/questions/" + question.get("id") + "/status",headers=authorized_headers,data=json.dumps({
#         "status": "ACCEPTING"
#     }))




# for i in range(10):
#     response = requests.post(base_url+"/user/login",headers=headers,data=json.dumps({
#         "username": "提问者" + str(i) + "号",
#         "password": "123456aaa"
#     }))
#     token = json.loads(response.text).get("data").get("token")
#     authorized_headers = {'Content-Type': 'application/json', 'Authorization': token}

#     for j in range(10):
#         response = requests.post(base_url + "/qa/new-question",headers=authorized_headers,data=json.dumps({
#             "title": "这题该怎么做呀" + str(i) + "to" + str(j),
#             "respondent": "回答者" + str(j) + "号",
#             "isPublic": True,
#             "description": "我看了这题的答案，还是不太明白，能仔细给我讲一下吗？"
#         }))


# for i in range(10, 20):
#     response = requests.post(base_url+"/user/login",headers=headers,data=json.dumps({
#         "username": "respondent" + str(i),
#         "password": "123456aaa"
#     }))
#     token = json.loads(response.text).get("data").get("token")
#     authorized_headers = {'Content-Type': 'application/json', 'Authorization': token}
#     requests.post(base_url + "/user/apply",headers=authorized_headers,data=json.dumps({
#         "specialities": ["唱","跳","rap","篮球"],
#         "fee": i,
#         "description": "我是第二批申请成为回答者的回答者" + str(i) + "号",
#         "detail": "浔阳江头夜送客，枫叶荻花秋瑟瑟。主人下马客在船，举酒欲饮无管弦。"
#     }))

# # 回答者问题列表
# response = requests.post(base_url+"/user/login",headers=headers,data=json.dumps({
#     "username": "respondent0",
#     "password": "123456aaa"
# }))
# token = json.loads(response.text).get("data").get("token")
# authorized_headers = {'Content-Type': 'application/json', 'Authorization': token}
# response = requests.get(base_url + "/user/questions", headers=authorized_headers, params={
#     "page": 1,
#     "perpage": 5
# })
# print(json.loads(response.text))

# #管理员回答者审核列表
# response = requests.post(base_url + "/admin/login",headers=headers, data=json.dumps({
#     "username": "root",
#     "password": "123456aaa"
# }))
# token = json.loads(response.text).get("data").get("token")
# authorized_headers = {'Content-Type': 'application/json', 'Authorization': token}

# response = requests.get(base_url + "/admin/respondents", headers=authorized_headers, params={
#     "page": 0,
#     "size": 20,
#     "status": "CENSORING"
# })

# print(json.loads(response.text))

# questions = json.loads(response.text).get("data").get("content")
# for question in questions:
#     response = requests.put(base_url + "/admin/questions/" + question.get("id") + "/status", headers=authorized_headers, data=json.dumps({
#         "status": "ACCEPTING"
#     }))

#接单、首次回答
response = requests.post(base_url+"/user/login",headers=headers,data=json.dumps({
    "username": "回答者0号",
    "password": "123456aaa"
}))
token = json.loads(response.text).get("data").get("token")
authorized_headers = {'Content-Type': 'application/json', 'Authorization': token}
response = requests.get(base_url + "/user/questions", headers=authorized_headers, params={
    "page": 0,
    "perpage": 10
})

questions = json.loads(response.text).get("data").get("questions")

for question in questions[0:5]:
    requests.post(base_url+"/qa/"+question.get("id")+"/accept",headers=authorized_headers)
    # requests.post(base_url+"/qa/"+question.get("id")+"/response",headers=authorized_headers,data=json.dumps({
    #     "content": "- 首先应该这样。\n- 然后应该这样"
    # }))

# response = requests.post(base_url+"/user/login",headers=headers,data=json.dumps({
#     "username": "questioner1",
#     "password": "123456aaa"
# }))
# token = json.loads(response.text).get("data").get("token")
# authorized_headers = {'Content-Type': 'application/json', 'Authorization': token}

# response = requests.get(base_url + "/user/orders", headers=authorized_headers, params={
#     "page": 0,
#     "perpage": 10
# })
# orders = json.loads(response.text).get("data").get("questions")

# response = requests.get(base_url + "/user/dashboard/banking/expense",headers=authorized_headers)
# print(json.loads(response.text))
# response = requests.get(base_url + "/user/username",headers=headers,params={
#     "email": "asker0@test.com"
# })
# print(response)

