import os
import json
import time
import secrets
import sqlite3
import threading
from pathlib import Path
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / "survey.db"
PORT = int(os.environ.get("PORT", "8000"))
PASSWORD = os.environ.get("SURVEY_ADMIN_PASSWORD", "")

if len(PASSWORD) < 12:
    raise SystemExit("请先设置至少12位管理员密码：SURVEY_ADMIN_PASSWORD")

TABLE = "responses_v3"


def O(code, zh, ko):
    return {"code": code, "zh": zh, "ko": ko}


def Q(qid, zh, ko, options, multi=False):
    return {
        "id": qid,
        "zh": zh,
        "ko": ko,
        "options": options,
        "multi": multi,
        "max": 2 if multi else 1,
    }


QUESTIONS = [
    Q(
        "age",
        "你的年龄是？",
        "현재 연령은 어떻게 되나요?",
        [
            O("under25", "25岁以下", "만 25세 미만"),
            O("25_29", "25—29岁", "만 25~29세"),
            O("30_35", "30—35岁", "만 30~35세"),
            O("over35", "35岁以上", "만 35세 초과"),
        ],
    ),
    Q(
        "work_duration",
        "你进入正式工作已经多久了？",
        "정식으로 직장 생활을 시작한 지 얼마나 되었나요?",
        [
            O("0_3", "3个月以内", "3개월 이하"),
            O("4_6", "4—6个月", "4~6개월"),
            O("7_12", "7—12个月", "7~12개월"),
            O("over12", "超过1年", "1년 초과"),
            O(
                "not_started",
                "尚未开始正式工作",
                "아직 정식 직장 생활을 시작하지 않음"
            ),
        ],
    ),
    Q(
        "region",
        "你目前主要在哪里生活？",
        "현재 주로 어디에서 생활하나요?",
        [
            O("china", "中国大陆", "중국 본토"),
            O("korea", "韩国", "한국"),
            O("other", "其他国家或地区", "그 외 국가 또는 지역"),
        ],
    ),
    Q(
        "gender",
        "你的性别是？",
        "성별은 어떻게 되나요?",
        [
            O("woman", "女性", "여성"),
            O("man", "男性", "남성"),
            O("other", "其他", "기타"),
            O("private", "不愿回答", "응답하고 싶지 않음"),
        ],
    ),
    Q(
        "change",
        "最近一年，你的生活有哪些明显变化？",
        "최근 1년 동안 생활에서 크게 달라진 점은 무엇인가요?",
        [
            O("busy", "更忙，自由时间减少", "바빠져서 자유 시간이 줄었다"),
            O(
                "money",
                "更多自己安排收入与支出",
                "수입과 지출을 스스로 관리하는 일이 늘었다"
            ),
            O(
                "appearance",
                "更在意见人时的外在状态",
                "사람을 만날 때 외적인 모습에 더 신경 쓰게 되었다"
            ),
            O(
                "care",
                "更想花时间或金钱照顾自己",
                "나를 돌보는 데 시간이나 돈을 더 쓰고 싶어졌다"
            ),
            O("none", "没有明显变化", "크게 달라진 점이 없다"),
        ],
        True,
    ),
    Q(
        "difficulty",
        "平时照顾自己，最难的是什么？",
        "평소 자신을 돌볼 때 가장 어려운 점은 무엇인가요?",
        [
            O("energy", "没有时间或精力", "시간이나 기력이 부족하다"),
            O("money", "预算有限", "예산이 부족하다"),
            O("choice", "不知道什么适合自己", "나에게 무엇이 맞는지 모르겠다"),
            O("habit", "难以坚持", "꾸준히 실천하기 어렵다"),
            O("none", "没有特别困难", "특별히 어려운 점이 없다"),
        ],
    ),
    Q(
        "purpose",
        "你护肤最主要是为了什么？",
        "피부 관리를 하는 가장 큰 이유는 무엇인가요?",
        [
            O("comfort", "保持清洁、舒适", "청결하고 편안한 피부 상태 유지"),
            O("concern", "改善在意的皮肤问题", "신경 쓰이는 피부 고민 관리"),
            O(
                "confidence",
                "让自己看起来更精神、更有自信",
                "더 생기 있어 보이고 자신감을 얻기 위해"
            ),
            O("rest", "享受照顾自己的时间", "나를 돌보는 시간을 즐기기 위해"),
            O("none", "平时基本不护肤", "평소 피부 관리를 거의 하지 않음"),
        ],
    ),
    Q(
        "skin",
        "你目前最在意哪些皮肤状态？",
        "현재 가장 신경 쓰이는 피부 상태는 무엇인가요?",
        [
            O("dry", "干燥、紧绷", "건조함과 당김"),
            O("trouble", "出油、痘痘", "유분과 여드름"),
            O("sensitive", "容易受到刺激", "쉽게 자극을 받음"),
            O("tired", "暗沉、疲惫感或细纹", "칙칙함, 피곤해 보임 또는 잔주름"),
            O("none", "没有特别关注", "특별히 신경 쓰이는 점 없음"),
        ],
        True,
    ),
    Q(
        "factor",
        "买护肤品时，你最看重什么？",
        "스킨케어 제품을 살 때 가장 중요하게 보는 것은 무엇인가요?",
        [
            O("fit", "适合自己的皮肤与需求", "내 피부와 필요에 맞는지"),
            O("price", "价格与性价比", "가격과 가격 대비 가치"),
            O("feeling", "质地、香味和使用感", "제형, 향, 사용감"),
            O(
                "trust",
                "品牌与功效信息是否可信",
                "브랜드와 효능 정보를 신뢰할 수 있는지"
            ),
            O(
                "none",
                "平时不买／没有特别看重的因素",
                "평소 구매하지 않음 / 특별히 중요하게 보는 요소 없음"
            ),
        ],
        True,
    ),
    Q(
        "source",
        "买护肤品前，你主要参考哪里的信息？",
        "스킨케어 제품을 사기 전에 주로 어디의 정보를 참고하나요?",
        [
            O("people", "朋友、家人或同事", "친구, 가족, 동료"),
            O("reviews", "购物平台的购买评价", "쇼핑 플랫폼의 구매 후기"),
            O("social", "社交平台上的分享或测评", "SNS의 후기나 리뷰"),
            O(
                "official",
                "品牌官方信息或门店说明",
                "브랜드 공식 정보나 매장 설명"
            ),
            O("none", "通常不特别查找信息", "별도로 정보를 찾아보지 않음"),
        ],
        True,
    ),
    Q(
        "choice",
        "面对不熟悉的护肤品牌，你最难判断什么？",
        "익숙하지 않은 스킨케어 브랜드를 볼 때 가장 판단하기 어려운 것은 무엇인가요?",
        [
            O("fit", "是否适合自己", "나에게 맞는지"),
            O(
                "proof",
                "宣传的效果是否可信",
                "광고에서 말하는 효과를 믿을 수 있는지"
            ),
            O(
                "value",
                "和其他品牌相比，是否值得这个价格",
                "다른 브랜드와 비교해 가격에 걸맞은 가치가 있는지"
            ),
            O("start", "应该从哪款产品开始", "어떤 제품부터 써야 하는지"),
            O(
                "none",
                "没有特别困难／不考虑购买",
                "특별히 어렵지 않음 / 구매를 고려하지 않음"
            ),
        ],
    ),
    Q(
        "awareness",
        "调查前，你对雪花秀了解多少？",
        "설문에 참여하기 전, 설화수에 대해 얼마나 알고 있었나요?",
        [
            O("never", "没听说过", "들어본 적 없음"),
            O("name", "只听过名字", "이름만 들어봄"),
            O("know", "了解一些，但没使用过", "어느 정도 알지만 사용한 적 없음"),
            O("used", "使用过，包括试用装", "사용해 봄 (샘플 포함)"),
        ],
    ),
    Q(
        "image",
        "你对雪花秀最主要的印象是？",
        "설화수에 대한 가장 주된 인상은 무엇인가요?",
        [
            O("premium", "高端、有品质感", "고급스럽고 품질이 좋을 것 같음"),
            O("traditional", "传统、具有韩国文化感", "전통적이고 한국 문화가 느껴짐"),
            O(
                "older",
                "更适合比我年长的人",
                "나보다 연령대가 높은 사람에게 더 어울림"
            ),
            O("forme", "适合自己日常使用", "내가 일상에서 쓰기에 어울림"),
            O("unknown", "不了解，没有明确印象", "잘 몰라서 뚜렷한 인상이 없음"),
        ],
    ),
    Q(
        "consider",
        "下次买护肤品时，你会考虑雪花秀吗？",
        "다음에 스킨케어 제품을 살 때 설화수를 고려하겠나요?",
        [
            O("yes", "会考虑", "고려하겠음"),
            O(
                "maybe",
                "可能会，想先了解",
                "고려할 수 있지만 먼저 알아보고 싶음"
            ),
            O("no", "暂时不会", "현재는 고려하지 않겠음"),
            O("unknown", "不了解，无法判断", "잘 몰라서 판단하기 어려움"),
        ],
    ),
    Q(
        "barrier",
        "目前，哪些原因会让你犹豫是否选择雪花秀？",
        "현재 설화수를 선택할지 망설이게 하는 이유는 무엇인가요?",
        [
            O("price", "价格超出预算", "가격이 예산을 넘음"),
            O(
                "fit",
                "不确定是否适合自己的皮肤",
                "내 피부에 맞는지 확신이 없음"
            ),
            O(
                "distance",
                "觉得与自己的年龄或生活有距离",
                "내 나이나 생활과 거리가 느껴짐"
            ),
            O(
                "info",
                "了解太少，不知道为什么选它",
                "정보가 부족해 선택할 이유를 모르겠음"
            ),
            O("none", "没有特别顾虑", "특별히 망설이는 이유 없음"),
        ],
        True,
    ),
    Q(
        "info",
        "关于雪花秀，你最想先知道什么？",
        "설화수에 대해 가장 먼저 알고 싶은 것은 무엇인가요?",
        [
            O("fit", "哪款产品适合自己", "나에게 맞는 제품"),
            O("proof", "功效依据与真实使用评价", "효능의 근거와 실제 사용 후기"),
            O("feeling", "实际质地、香味和使用感", "실제 제형, 향, 사용감"),
            O(
                "value",
                "与其他品牌的区别、为什么值得买",
                "다른 브랜드와의 차이와 구매할 만한 이유"
            ),
            O("none", "暂时没有想了解的", "현재 더 알고 싶은 내용 없음"),
        ],
    ),
    Q(
        "trigger",
        "什么最能让你愿意尝试雪花秀？",
        "어떤 조건이 있다면 설화수를 사용해 보고 싶나요?",
        [
            O(
                "sample",
                "先拿试用装，确认适不适合",
                "샘플을 먼저 써 보고 나에게 맞는지 확인"
            ),
            O(
                "budget",
                "有预算内的小规格或入门组合",
                "예산에 맞는 소용량 제품이나 입문 구성"
            ),
            O(
                "guide",
                "得到清楚、适合自己的产品建议",
                "나에게 맞는 명확한 제품 추천"
            ),
            O(
                "peer",
                "看到与我情况相似的人的可信体验",
                "나와 비슷한 사람의 믿을 만한 사용 경험"
            ),
            O("none", "暂时不想尝试", "현재 사용해 볼 생각 없음"),
        ],
    ),
    Q(
        "content",
        "哪种护肤广告内容最能让你继续看下去？",
        "어떤 스킨케어 광고 콘텐츠를 더 보고 싶나요?",
        [
            O(
                "daily",
                "贴近真实生活，让我有共鸣",
                "실제 일상과 가까워 공감할 수 있는 내용"
            ),
            O(
                "guide",
                "简单清楚地告诉我怎么选、怎么用",
                "선택법과 사용법을 쉽고 명확하게 알려 주는 내용"
            ),
            O(
                "proof",
                "展示真实使用感与可信的产品信息",
                "실제 사용감과 신뢰할 수 있는 제품 정보를 보여 주는 내용"
            ),
            O(
                "culture",
                "有美感、有品牌文化故事",
                "시각적으로 아름답고 브랜드 문화 이야기가 있는 내용"
            ),
            O("none", "通常不看护肤广告", "스킨케어 광고를 거의 보지 않음"),
        ],
    ),
]


def connect():
    con = sqlite3.connect(DB_PATH, timeout=20)
    con.row_factory = sqlite3.Row
    return con


with connect() as con:
    con.execute("PRAGMA journal_mode=WAL")
    con.execute("""
        CREATE TABLE IF NOT EXISTS responses_v3 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            request_id TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            language TEXT NOT NULL,
            answers TEXT NOT NULL
        )
    """)

SESSIONS = {}
LOCK = threading.Lock()


def validate(answers):
    if not isinstance(answers, dict):
        raise ValueError("invalid_answers")

    if set(answers) != {q["id"] for q in QUESTIONS}:
        raise ValueError("missing_or_unknown_question")

    clean = {}

    for q in QUESTIONS:
        value = answers[q["id"]]
        codes = {o["code"] for o in q["options"]}

        if q["multi"]:
            if (
                not isinstance(value, list)
                or not 1 <= len(value) <= q["max"]
                or any(not isinstance(v, str) for v in value)
            ):
                raise ValueError("invalid:" + q["id"])

            if (
                len(value) != len(set(value))
                or any(v not in codes for v in value)
                or ("none" in value and len(value) > 1)
            ):
                raise ValueError("invalid:" + q["id"])
        else:
            if not isinstance(value, str) or value not in codes:
                raise ValueError("invalid:" + q["id"])

        clean[q["id"]] = value

    return clean


class Handler(BaseHTTPRequestHandler):
    def send_json(self, status, data):
        raw = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(raw)

    def read_body(self):
        length = int(self.headers.get("Content-Length", "0"))

        if not 0 < length <= 20000:
            raise ValueError("invalid_size")

        body = json.loads(self.rfile.read(length).decode("utf-8"))

        if not isinstance(body, dict):
            raise ValueError("invalid_body")

        return body

    def admin(self):
        auth = self.headers.get("Authorization", "")

        if not auth.startswith("Bearer "):
            return False

        token = auth[7:]
        current = time.time()

        with LOCK:
            expired = [k for k, v in SESSIONS.items() if v <= current]
            for k in expired:
                del SESSIONS[k]
            return SESSIONS.get(token, 0) > current

    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/api/questions":
            return self.send_json(200, {
                "version": 3,
                "questions": QUESTIONS
            })

        if path == "/api/responses":
            if not self.admin():
                return self.send_json(401, {"error": "unauthorized"})

            with connect() as con:
                rows = con.execute(
                    "SELECT * FROM responses_v3 ORDER BY id DESC"
                ).fetchall()

            return self.send_json(200, {
                "responses": [
                    {
                        "id": r["id"],
                        "createdAt": r["created_at"],
                        "language": r["language"],
                        "answers": json.loads(r["answers"]),
                    }
                    for r in rows
                ]
            })

        if path in ("/", "/index.html"):
            try:
                raw = (ROOT / "index.html").read_bytes()
            except OSError:
                return self.send_json(500, {
                    "error": "index.html not found beside server.py"
                })

            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(raw)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("X-Frame-Options", "DENY")
            self.end_headers()
            self.wfile.write(raw)
            return

        self.send_json(404, {"error": "not_found"})

    def do_POST(self):
        path = urlparse(self.path).path

        try:
            body = self.read_body()

            if path == "/api/login":
                supplied = body.get("password", "")

                if not isinstance(supplied, str):
                    supplied = ""

                if not secrets.compare_digest(
                    supplied.encode("utf-8"),
                    PASSWORD.encode("utf-8")
                ):
                    return self.send_json(401, {
                        "error": "wrong_password"
                    })

                token = secrets.token_urlsafe(32)

                with LOCK:
                    SESSIONS[token] = time.time() + 8 * 3600

                return self.send_json(200, {"token": token})

            if path == "/api/logout":
                auth = self.headers.get("Authorization", "")

                if auth.startswith("Bearer "):
                    with LOCK:
                        SESSIONS.pop(auth[7:], None)

                return self.send_json(200, {"ok": True})

            if path == "/api/submit":
                if body.get("consent") is not True:
                    raise ValueError("consent_required")

                language = body.get("language")

                if language not in ("zh", "ko"):
                    raise ValueError("invalid_language")

                rid = body.get("requestId", "")

                if (
                    not isinstance(rid, str)
                    or not 16 <= len(rid) <= 100
                    or any(
                        c not in
                        "abcdefghijklmnopqrstuvwxyz"
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
                        for c in rid
                    )
                ):
                    raise ValueError("invalid_request_id")

                answers = validate(body.get("answers"))
                created = datetime.now(timezone.utc).isoformat()

                with connect() as con:
                    existing = con.execute(
                        "SELECT id, language, answers FROM responses_v3 "
                        "WHERE request_id=?",
                        (rid,)
                    ).fetchone()

                    encoded = json.dumps(answers, ensure_ascii=False)

                    if existing:
                        if (
                            json.loads(existing["answers"]) != answers
                            or existing["language"] != language
                        ):
                            return self.send_json(409, {
                                "error": "request_id_conflict"
                            })
                        saved_id = existing["id"]
                    else:
                        con.execute("""
                            INSERT OR IGNORE INTO responses_v3
                            (request_id, created_at, language, answers)
                            VALUES (?, ?, ?, ?)
                        """, (rid, created, language, encoded))

                        saved = con.execute(
                            "SELECT id, language, answers FROM responses_v3 "
                            "WHERE request_id=?",
                            (rid,)
                        ).fetchone()

                        if (
                            json.loads(saved["answers"]) != answers
                            or saved["language"] != language
                        ):
                            return self.send_json(409, {
                                "error": "request_id_conflict"
                            })

                        saved_id = saved["id"]

                return self.send_json(200, {
                    "ok": True,
                    "id": saved_id
                })

            return self.send_json(404, {"error": "not_found"})

        except (ValueError, TypeError, UnicodeDecodeError) as error:
            return self.send_json(400, {"error": str(error)})
        except Exception:
            return self.send_json(500, {"error": "server_error"})

    def log_message(self, format, *args):
        pass


if __name__ == "__main__":
    print(f"新版18题问卷（工作时长版）：http://127.0.0.1:{PORT}")
    print(f"研究者统计：http://127.0.0.1:{PORT}/#results")
    print("运行期间不要修改文件夹名称。按 Control+C 停止。")

    ThreadingHTTPServer(
        ("0.0.0.0", PORT),
        Handler
    ).serve_forever()