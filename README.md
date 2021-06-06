# 概要
Herokuの1Dynoですべてを乗っける大本のやつ。基本はWebサーバー。
## Controller
### responseController
モジュールの引数は3つ…(request, response, args)
戻り値はresponseFlag(Bool)で、処理がされればtrue.