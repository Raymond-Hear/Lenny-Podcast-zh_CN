"""Open the local Lenny knowledge library in the user's default browser."""
from __future__ import annotations

import argparse
import functools
import http.server
import sys
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        return


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=0, help="0 automatically selects an available port")
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()

    handler = functools.partial(QuietHandler, directory=str(ROOT))
    try:
        server = http.server.ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    except OSError as error:
        print(f"网站启动失败：{error}")
        input("按回车键关闭……")
        raise SystemExit(1)

    port = server.server_address[1]
    url = f"http://127.0.0.1:{port}/index.html"
    print()
    print("Lenny 播客知识库已经启动。")
    print(f"浏览器地址：{url}")
    print("使用结束后，关闭这个窗口即可停止网站。")
    print()
    if not args.no_browser:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
