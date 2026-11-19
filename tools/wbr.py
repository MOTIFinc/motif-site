"""日本語の文章に、改行してよい位置(<wbr>)を入れる。
Safari は word-break: auto-phrase(文節で改行)に対応していないため、
CSS の word-break: keep-all と組み合わせて、文節の切れ目でだけ改行させる。

ルール(簡易な文節の区切り):
  ・ひらがな の次に 漢字/カタカナ/英数字/「 が来るところ(例:「拠点に|日本と」)
  ・、。 の直後
何度実行しても同じ結果になる(先に既存の <wbr> を消してから入れ直す)。
使い方: python3 tools/wbr.py  (公開前、stamp.py の前に実行)
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HIRA = 'ぁ-ゟ'
OTHER = '一-鿿゠-ヿA-Za-z0-9「『（'
END = 'はがをにでとのもへやかてばるたすいくずらよねうだ'
TAGS = ('p', 'h1', 'h2', 'h3', 'dd', 'figcaption', 'li', 'span', 'a', 'label')

def mark(text):
    text = text.replace('<wbr>', '')
    # 助詞・活用語尾で終わるひらがなの後だけ区切る(「積み|重ねる」「行き|来る」のような複合語は切らない)
    text = re.sub(f'(?<![そこあど])([{END}])(?=[{OTHER}])', r'\1<wbr>', text)
    text = re.sub(r'([、。])(?=[^\s<])', r'\1<wbr>', text)
    return text

def process(html):
    head_end = html.index('</head>')
    head, body = html[:head_end], html[head_end:].replace('<wbr>', '')
    out, pos = [], 0
    # <script>/<style>/<svg> の中は触らない
    for m in re.finditer(r'<(script|style|svg)\b.*?</\1>', body, flags=re.S):
        out.append(_text_only(body[pos:m.start()])); out.append(m.group(0)); pos = m.end()
    out.append(_text_only(body[pos:]))
    return head + ''.join(out)

def _text_only(chunk):
    # タグの外側(文字の部分)だけに入れる
    parts = re.split(r'(<[^>]+>)', chunk)
    return ''.join(p if p.startswith('<') else mark(p) for p in parts)

for name in ('index.html', 'contact.html'):
    f = ROOT / name
    f.write_text(process(f.read_text(encoding='utf-8')), encoding='utf-8')
    print('wbr', name)
